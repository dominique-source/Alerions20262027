import type { CompteReponse, RattachementPublic, RoleMembre } from "../types";

/**
 * Dérivations pures pour les sélecteurs d'espace/équipe — même logique
 * que api/_lib/permissions.ts côté serveur, dupliquée volontairement
 * (même raison que les types dupliqués dans src/types/index.ts : c'est
 * un contrat stable sur une réponse déjà publique, pas une frontière de
 * sécurité — la vraie vérification reste côté serveur à chaque appel).
 * Un sélecteur ne donne jamais de permission : il ne fait que refléter
 * ce que /api/me a déjà confirmé.
 */

export type EspaceAutorise = "joueur" | "entraineur" | "administration";

export function espacesAutorises(compte: Pick<CompteReponse, "isAdmin" | "rattachements">): EspaceAutorise[] {
  const espaces: EspaceAutorise[] = [];
  if (compte.rattachements.some((r) => r.role === "joueur")) espaces.push("joueur");
  if (compte.rattachements.some((r) => r.role === "entraineur")) espaces.push("entraineur");
  if (compte.isAdmin) espaces.push("administration");
  return espaces;
}

export function equipesPourRole(rattachements: RattachementPublic[], role: RoleMembre): string[] {
  const vues = new Set<string>();
  const ordre: string[] = [];
  for (const r of rattachements) {
    if (r.role === role && !vues.has(r.teamId)) {
      vues.add(r.teamId);
      ordre.push(r.teamId);
    }
  }
  return ordre;
}
