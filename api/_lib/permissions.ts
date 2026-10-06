import type { RattachementPublic, RoleMembre } from "./authTypes.js";

/**
 * Dérivations pures des permissions — aucune n'accède à Firestore ou au
 * jeton : elles prennent en entrée ce qu'un appelant a déjà vérifié
 * (typiquement le résultat de api/me.ts) et répondent à « qu'est-ce que
 * ce compte a le droit de voir/faire ». Réutilisées par chaque nouvel
 * endpoint qui doit revérifier une permission — jamais une simple
 * confiance dans ce que le navigateur prétend avoir sélectionné.
 */

export type EspaceAutorise = "joueur" | "entraineur" | "administration";

/** Espaces que ce compte peut ouvrir — ne dépend jamais d'une valeur envoyée par le client. */
export function espacesAutorises(compte: {
  isAdmin: boolean;
  rattachements: RattachementPublic[];
}): EspaceAutorise[] {
  const espaces: EspaceAutorise[] = [];
  if (compte.rattachements.some((r) => r.role === "joueur")) espaces.push("joueur");
  if (compte.rattachements.some((r) => r.role === "entraineur")) espaces.push("entraineur");
  if (compte.isAdmin) espaces.push("administration");
  return espaces;
}

/** Équipes rattachées à ce rôle, dédupliquées, dans l'ordre de première apparition. */
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

/**
 * Vérifie qu'un compte a bien un rattachement actif à ce rôle précis sur
 * cette équipe précise — c'est la seule façon correcte de répondre
 * « ce joueur/entraîneur a-t-il accès à cette équipe ? » : jamais en se
 * fiant à un teamId envoyé par le navigateur sans le confronter aux
 * rattachements réels du compte vérifié.
 */
export function aAccesEquipe(rattachements: RattachementPublic[], role: RoleMembre, teamId: string): boolean {
  return rattachements.some((r) => r.role === role && r.teamId === teamId);
}
