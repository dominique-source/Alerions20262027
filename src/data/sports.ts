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

/**
 * Résout le slug local d'un sport à partir du texte brut du Sheet
 * (ex. EquipeRoster.sport = « Basketball ») — nécessaire partout où un
 * lien construit depuis /api/roster doit pointer vers une route du site
 * (ex. /equipes/:sport/:equipe/chat), qui attend le slug, jamais le nom
 * affiché. Retombe sur le texte normalisé si aucun sport local ne
 * correspond, plutôt que de construire un lien manifestement cassé.
 */
export function sportSlugDepuisNomBrut(nomBrut: string): string {
  const trouve = sports.find((s) => s.nom.toLowerCase() === nomBrut.trim().toLowerCase());
  return trouve?.slug ?? nomBrut.trim().toLowerCase();
}
