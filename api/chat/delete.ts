import { FieldValue } from "firebase-admin/firestore";
import { verifierJetonEtCompte } from "../_lib/verifierCompte.js";
import { obtenirFirestoreAdmin } from "../_lib/firebaseAdmin.js";
import { validerTeamId } from "../_lib/chatValidation.js";

/**
 * POST /api/chat/delete
 * Corps : { teamId: string, messageId: string }
 *
 * Autorité de suppression vérifiée SERVEUR, jamais côté affichage
 * (masquer un bouton n'est pas une protection) :
 *   - l'auteur du message ;
 *   - un entraîneur avec un rattachement actif sur cette équipe ;
 *   - un admin actif.
 * Supprime le CONTENU (text vidé, deleted=true) — jamais de ligne
 * « Message supprimé » qui contiendrait encore l'ancien texte.
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

type CodeErreurSuppression =
  | "methode_non_autorisee"
  | "corps_invalide"
  | "message_introuvable"
  | "suppression_non_autorisee"
  | "jeton_manquant"
  | "jeton_invalide"
  | "jeton_revoque"
  | "courriel_non_verifie"
  | "compte_non_autorise"
  | "service_non_configure"
  | "erreur_inattendue";

function envoyerErreur(res: ReponseMinimale, statut: number, code: CodeErreurSuppression): void {
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
  const { uid, compte, rattachementsActifs } = resultat.valeur;

  const corps = req.body as { teamId?: unknown; messageId?: unknown } | null;
  if (!corps || typeof corps !== "object" || !validerTeamId(corps.teamId) || typeof corps.messageId !== "string" || !corps.messageId) {
    envoyerErreur(res, 400, "corps_invalide");
    return;
  }
  const teamId = corps.teamId;
  const messageId = corps.messageId;

  const db = obtenirFirestoreAdmin();
  const ref = db.collection("teamChats").doc(teamId).collection("messages").doc(messageId);

  let snapshot: FirebaseFirestore.DocumentSnapshot;
  try {
    snapshot = await ref.get();
  } catch (erreur) {
    console.error("[api/chat/delete] erreur_inattendue (lecture) :", erreur);
    envoyerErreur(res, 500, "erreur_inattendue");
    return;
  }

  if (!snapshot.exists) {
    envoyerErreur(res, 404, "message_introuvable");
    return;
  }

  const message = snapshot.data() as { authorUid?: string; teamId?: string; deleted?: boolean };

  const estAuteur = message.authorUid === uid;
  const estEntraineurEquipe = rattachementsActifs.some((r) => r.teamId === teamId && r.role === "entraineur");
  const estAutorise = estAuteur || estEntraineurEquipe || compte.isAdmin;

  if (!estAutorise) {
    envoyerErreur(res, 403, "suppression_non_autorisee");
    return;
  }

  if (message.deleted === true) {
    // Déjà supprimé — idempotent, pas une erreur.
    res.status(200).json({ ok: true });
    return;
  }

  try {
    await ref.update({
      text: "",
      deleted: true,
      deletedAt: FieldValue.serverTimestamp(),
    });
    res.status(200).json({ ok: true });
  } catch (erreur) {
    console.error("[api/chat/delete] erreur_inattendue (écriture) :", erreur);
    envoyerErreur(res, 500, "erreur_inattendue");
  }
}
