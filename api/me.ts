import { verifierJetonEtCompte } from "./_lib/verifierCompte.js";
import { synchroniserAccesChat } from "./_lib/chatAccess.js";
import type { CompteReponse, MeCodeErreur } from "./_lib/authTypes.js";

/**
 * GET /api/me
 *
 * Seul point d'entrée qui dit à un navigateur « voici ton compte et tes
 * rattachements actifs ». Toute la vérification (jeton, révocation,
 * courriel confirmé, accounts/{uid}.enabled) vit dans
 * api/_lib/verifierCompte.ts, partagée avec les endpoints de chat — rien
 * ici ne fait confiance à un courriel, rôle, uid ou teamId fourni par le
 * navigateur.
 *
 * Effet de bord assumé : à chaque appel réussi, synchronise
 * `chatAccess` (api/_lib/chatAccess.ts) à partir des memberships réels
 * de ce compte, pour que l'accès aux conversations d'équipe (règles
 * Firestore du chat) reste à jour sans action du navigateur.
 */

interface RequeteMinimale {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

function envoyerErreur(res: ReponseMinimale, statut: number, code: MeCodeErreur): void {
  res.status(statut).json({ ok: false, code });
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
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

  try {
    await synchroniserAccesChat(uid, tousRattachements);
  } catch (erreur) {
    // Ne bloque jamais /api/me pour un problème de synchronisation du
    // chat — journalisé, mais le compte/les rattachements restent
    // renvoyés normalement.
    console.error("[api/me] échec synchroniserAccesChat (non bloquant) :", erreur);
  }

  const reponse: CompteReponse = {
    uid,
    displayName: compte.displayName,
    personId: compte.personId,
    isAdmin: compte.isAdmin,
    rattachements: rattachementsActifs.map((r) => ({ teamId: r.teamId, role: r.role })),
  };

  res.status(200).json(reponse);
}
