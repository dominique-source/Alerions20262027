import { FieldValue } from "firebase-admin/firestore";
import { obtenirFirestoreAdmin } from "./firebaseAdmin.js";
import type { RattachementDocument, RoleMembre } from "./authTypes.js";

/**
 * Miroir `chatAccess/{teamId}__{uid}`, écrit UNIQUEMENT par le serveur
 * (SDK Admin) — jamais par le navigateur. Les règles Firestore du chat
 * (firestore.rules) vérifient l'accès à une conversation d'équipe via un
 * simple `get()` sur ce document, plutôt que de parcourir arbitrairement
 * toute la collection `memberships` (ce que les règles ne peuvent pas
 * faire). Voir docs/chat-google-sheets... — ce fichier EST la source de
 * cet index, reconstruit à partir des memberships réels à chaque appel
 * vérifié (api/me.ts, chaque endpoint de chat) : un rattachement
 * désactivé entraîne `enabled: false` ici dès la prochaine vérification,
 * jamais un accès maintenu indéfiniment après désactivation.
 *
 * `syncedAt` est un Firestore Timestamp (pas une chaîne) : firestore.rules
 * borne la fraîcheur de ce miroir à partir de ce champ (voir la fonction
 * `aAccesChatEquipe`), pour qu'un accès désactivé directement dans
 * Firestore (hors de cette synchronisation) finisse par expirer même si
 * ce compte ne déclenche plus aucun appel vérifié.
 */

export function construireIdAccesChat(teamId: string, uid: string): string {
  return `${teamId}__${uid}`;
}

interface EtatAccesEquipe {
  role: RoleMembre;
  enabled: boolean;
}

/**
 * Réduit TOUS les memberships (actifs et inactifs) d'un compte à un seul
 * état par équipe. Audité : trouvé par test (émulateur, scénario à
 * rattachements multiples) — l'ancienne version écrivait un `set()` par
 * membership, dans l'ordre de retour de la requête Firestore (non
 * garanti) ; quand un compte a DEUX memberships pour la MÊME équipe (ex.
 * un rattachement joueur désactivé conservé comme historique + un
 * rattachement entraîneur actif), le dernier traité écrasait le premier
 * — un rattachement inactif pouvait donc annuler un accès actif selon
 * l'ordre, au lieu de ne jamais pouvoir le faire régresser.
 *
 * Règle : un rattachement ACTIF pour une équipe donnée gagne toujours,
 * quel que soit l'ordre de traitement ; entre deux rattachements actifs
 * de rôles différents pour la même équipe, le rôle "entraineur" est
 * retenu (permissions de modération). Pure, sans effet de bord Firestore
 * — testable directement (api/_lib/chatAccess.test.ts).
 */
export function reduireAccesParEquipe(
  tousRattachements: Array<Pick<RattachementDocument, "teamId" | "role" | "enabled">>,
): Map<string, EtatAccesEquipe> {
  const parEquipe = new Map<string, EtatAccesEquipe>();

  for (const r of tousRattachements) {
    const estActif = r.enabled === true;
    const existant = parEquipe.get(r.teamId);

    if (!existant) {
      parEquipe.set(r.teamId, { role: r.role, enabled: estActif });
      continue;
    }

    if (existant.enabled && !estActif) {
      // Un rattachement inactif ne régresse jamais un accès déjà actif
      // pour cette équipe — on ignore ce membership-ci.
      continue;
    }

    if (estActif && r.role === "entraineur") {
      // Actif + actif (rôles différents) ou inactif + actif : le rôle le
      // plus permissif (entraineur) est retenu, l'accès devient actif.
      parEquipe.set(r.teamId, { role: "entraineur", enabled: true });
      continue;
    }

    if (estActif && !existant.enabled) {
      parEquipe.set(r.teamId, { role: r.role, enabled: true });
    }
    // Sinon (inactif + inactif, ou actif+actif déjà couvert ci-dessus) :
    // l'entrée existante reste la meilleure réponse connue.
  }

  return parEquipe;
}

/**
 * Reconstruit, pour UN compte, l'état `chatAccess` de chacune de ses
 * équipes à partir de ses memberships réels (dédupliqués par équipe, voir
 * `reduireAccesParEquipe`). Idempotent — rejouable à chaque requête
 * vérifiée sans effet de bord indésirable.
 *
 * Audit : `tousRattachements` ne contient que les memberships qui
 * EXISTENT ENCORE (requête Firestore sur la collection memberships,
 * voir verifierCompte.ts) — un membership entièrement SUPPRIMÉ (pas
 * seulement désactivé) n'y apparaît plus du tout. L'ancienne version ne
 * traitait que les équipes présentes dans cette liste : un chatAccess
 * déjà actif pour une équipe dont le membership a depuis été supprimé
 * n'était donc jamais révoqué par cette synchronisation, et restait
 * valide jusqu'à l'expiration de sa seule fenêtre de fraîcheur (2h, voir
 * firestore.rules) — pas immédiatement, contrairement à une
 * désactivation (enabled: false), qui elle est bien vue et propagée.
 * Cette fonction interroge maintenant aussi les chatAccess EXISTANTS de
 * ce compte et révoque explicitement (enabled: false) tout document
 * dont l'équipe n'est plus représentée dans les memberships actuels.
 */
export async function synchroniserAccesChat(
  uid: string,
  tousRattachements: Array<Pick<RattachementDocument, "teamId" | "role" | "enabled">>,
): Promise<void> {
  const parEquipe = reduireAccesParEquipe(tousRattachements);
  const db = obtenirFirestoreAdmin();
  const lot = db.batch();
  let ecritures = 0;

  for (const [teamId, etat] of parEquipe) {
    const ref = db.collection("chatAccess").doc(construireIdAccesChat(teamId, uid));
    lot.set(ref, {
      teamId,
      userId: uid,
      role: etat.role,
      enabled: etat.enabled,
      syncedAt: FieldValue.serverTimestamp(),
    });
    ecritures++;
  }

  const chatAccessExistants = await db.collection("chatAccess").where("userId", "==", uid).get();
  for (const doc of chatAccessExistants.docs) {
    const teamId = doc.get("teamId") as string | undefined;
    if (!teamId || parEquipe.has(teamId)) continue;
    if (doc.get("enabled") === false) continue;
    lot.set(
      doc.ref,
      { teamId, userId: uid, role: doc.get("role") as RoleMembre, enabled: false, syncedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
    ecritures++;
  }

  if (ecritures === 0) return;
  await lot.commit();
}
