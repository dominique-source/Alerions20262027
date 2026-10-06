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
 */

export function construireIdAccesChat(teamId: string, uid: string): string {
  return `${teamId}__${uid}`;
}

/**
 * Reconstruit, pour UN compte, l'état `chatAccess` de chacune de ses
 * équipes (actives et inactives) à partir de ses memberships réels.
 * Idempotent — rejouable à chaque requête vérifiée sans effet de bord
 * indésirable (un `set` identique n'a aucun coût fonctionnel).
 */
export async function synchroniserAccesChat(
  uid: string,
  tousRattachements: Array<Pick<RattachementDocument, "teamId" | "role" | "enabled">>,
): Promise<void> {
  if (tousRattachements.length === 0) return;

  const db = obtenirFirestoreAdmin();
  const lot = db.batch();

  for (const r of tousRattachements) {
    const ref = db.collection("chatAccess").doc(construireIdAccesChat(r.teamId, uid));
    lot.set(ref, {
      teamId: r.teamId,
      userId: uid,
      role: r.role as RoleMembre,
      enabled: r.enabled === true,
      syncedAt: new Date().toISOString(),
    });
  }

  await lot.commit();
}
