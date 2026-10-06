/**
 * Catégories et genres du programme Basketball — partagés entre Mon équipe
 * et Chat (sélecteur identique dans les deux pages, pour résoudre une
 * équipe précise de src/data/teams.ts).
 */
export const CATEGORIES = ["Atome", "Benjamin", "Cadet", "Juvénile"];

export const CATEGORIE_SLUGS: Record<string, string> = {
  Atome: "atome",
  Benjamin: "benjamin",
  Cadet: "cadet",
  Juvénile: "juvenile",
};

export const GENRES: Array<{ label: string; slug: string }> = [
  { label: "Masculin", slug: "masculin" },
  { label: "Féminin", slug: "feminin" },
];
