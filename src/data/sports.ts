import type { Sport } from "../types";

/**
 * Les onze sports offerts au Collège François-de-Laval.
 * `photoCouverture` reste `null` tant qu'aucune photo propre au sport n'est
 * disponible dans le dépôt — jamais une photo d'un autre sport (basketball
 * en particulier) n'est réutilisée ici.
 */
export const sports: Sport[] = [
  {
    slug: "basketball",
    nom: "Basketball",
    photoCouverture: "images/alerions/DSC_1094.jpg",
    filtreGenre: true,
  },
  { slug: "volleyball", nom: "Volleyball", photoCouverture: null, filtreGenre: true },
  { slug: "football", nom: "Football", photoCouverture: null, filtreGenre: true },
  {
    slug: "flag-football",
    nom: "Flag-football",
    photoCouverture: null,
    filtreGenre: true,
  },
  {
    slug: "volleyball-plage",
    nom: "Volleyball de plage",
    photoCouverture: null,
    filtreGenre: true,
  },
  { slug: "soccer", nom: "Soccer", photoCouverture: null, filtreGenre: true },
  { slug: "ultimate", nom: "Ultimate", photoCouverture: null, filtreGenre: false },
  {
    slug: "cross-country",
    nom: "Cross-country",
    photoCouverture: null,
    filtreGenre: false,
  },
  { slug: "athletisme", nom: "Athlétisme", photoCouverture: null, filtreGenre: false },
  { slug: "natation", nom: "Natation", photoCouverture: null, filtreGenre: false },
  { slug: "echecs", nom: "Échecs", photoCouverture: null, filtreGenre: false },
];

export function trouverSport(slug: string): Sport | undefined {
  return sports.find((s) => s.slug === slug);
}
