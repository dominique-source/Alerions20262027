import { FieldValue } from "firebase-admin/firestore";
import { verifierJetonEtCompte } from "../_lib/verifierCompte.js";
import { synchroniserAccesChat } from "../_lib/chatAccess.js";
import { obtenirFirestoreAdmin } from "../_lib/firebaseAdmin.js";
import { validerIdTentative, validerTeamId, validerTexteMessage } from "../_lib/chatValidation.js";
import { limiteEnvoiAtteinte } from "../_lib/chatRateLimit.js";

/**
 * POST /api/chat/send
 * Corps : { teamId: string, text: string, clientMessageId: string }
 *
 * Seul chemin d'écriture pour un message — firestore.rules refuse toute
 * écriture directe sur teamChats/*\/messages depuis le navigateur. Tout
 * ce qui identifie l'auteur vient du jeton vérifié (uid, displayName),
 * jamais d'un champ du corps de la requête : le navigateur ne peut pas
 * usurper un autre auteur.
 *
 * Idempotence : clientMessageId devient l'ID du document Firestore
 * (teamChats/{teamId}/messages/{clientMessageId}). Une reprise réseau
 * qui renvoie le même clientMessageId retombe sur `.create()` qui
 * échoue proprement (ALREADY_EXISTS) sans jamais écraser le message
 * existant — reprise après erreur sans doublon ni changement de contenu.
 */

interface RequeteMinimale {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
  body: unknown;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

type CodeErreurEnvoi =
  | "methode_non_autorisee"
  | "corps_invalide"
  | "texte_vide"
  | "texte_trop_long"
  | "equipe_non_autorisee"
  | "trop_de_messages"
  | "jeton_manquant"
  | "jeton_invalide"
  | "jeton_revoque"
  | "courriel_non_verifie"
  | "compte_non_autorise"
  | "service_non_configure"
  | "erreur_inattendue";

function envoyerErreur(res: ReponseMinimale, statut: number, code: CodeErreurEnvoi): void {
  res.status(statut).json({ ok: false, code });
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    envoyerErreur(res, 405, "methode_non_autorisee");
    return;
  }

  res.setHeader("Cache-Control", "private, no-store");

  const resultat = await verifierJetonEtCompte(req.headers.authorization);
  if (!resultat.ok) {
    envoyerErreur(res, resultat.statut, resultat.code);
    return;
  }
  const { uid, compte, tousRattachements, rattachementsActifs } = resultat.valeur;

  const corps = req.body as { teamId?: unknown; text?: unknown; clientMessageId?: unknown } | null;
  if (!corps || typeof corps !== "object") {
    envoyerErreur(res, 400, "corps_invalide");
    return;
  }

  if (!validerTeamId(corps.teamId)) {
    envoyerErreur(res, 400, "corps_invalide");
    return;
  }
  const teamId = corps.teamId;

  if (!validerIdTentative(corps.clientMessageId)) {
    envoyerErreur(res, 400, "corps_invalide");
    return;
  }
  const clientMessageId = corps.clientMessageId;

  const texteValide = validerTexteMessage(corps.text);
  if (!texteValide.ok) {
    envoyerErreur(res, 400, texteValide.code);
    return;
  }

  // Un joueur/entraîneur n'envoie que dans les équipes de ses
  // rattachements ACTIFS réels — jamais un teamId du navigateur sans
  // confrontation à ces rattachements. Les admins sans rattachement ne
  // postent pas via cet endpoint (leur rôle est la modération, pas l'envoi).
  const estMembreEquipe = rattachementsActifs.some((r) => r.teamId === teamId);
  if (!estMembreEquipe) {
    envoyerErreur(res, 403, "equipe_non_autorisee");
    return;
  }

  if (limiteEnvoiAtteinte(uid)) {
    envoyerErreur(res, 429, "trop_de_messages");
    return;
  }

  try {
    await synchroniserAccesChat(uid, tousRattachements);
  } catch (erreur) {
    console.error("[api/chat/send] échec synchroniserAccesChat (non bloquant) :", erreur);
  }

  const db = obtenirFirestoreAdmin();
  const ref = db.collection("teamChats").doc(teamId).collection("messages").doc(clientMessageId);

  try {
    await ref.create({
      teamId,
      authorUid: uid,
      authorName: compte.displayName || "Membre Alérions",
      text: texteValide.texte,
      createdAt: FieldValue.serverTimestamp(),
      clientMessageId,
      deleted: false,
    });
    res.status(200).json({ ok: true, id: clientMessageId });
  } catch (erreur) {
    const code = (erreur as { code?: number | string } | undefined)?.code;
    const dejaExistant = code === 6 || code === "already-exists";
    if (dejaExistant) {
      // Reprise idempotente : le message existe déjà (première tentative
      // réussie dont la réponse réseau s'est perdue) — succès, sans
      // jamais réécrire son contenu ni son auteur.
      res.status(200).json({ ok: true, id: clientMessageId });
      return;
    }
    console.error("[api/chat/send] erreur_inattendue :", erreur);
    envoyerErreur(res, 500, "erreur_inattendue");
  }
}
