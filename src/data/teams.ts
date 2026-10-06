import type { Categorie, Equipe, Genre, SportSlug } from "../types";

const libellesCategorie: Record<Categorie, string> = {
  atome: "Atome",
  benjamin: "Benjamin",
  cadet: "Cadet",
  juvenile: "Juvénile",
  "programme-unique": "Programme",
};

const libellesGenre: Record<Genre, string> = {
  feminin: "Féminin",
  masculin: "Masculin",
  mixte: "Mixte",
};

function equipe(sportSlug: SportSlug, categorie: Categorie, genre: Genre): Equipe {
  const slug =
    categorie === "programme-unique"
      ? "programme"
      : `${categorie}-${genre === "feminin" ? "feminin" : genre === "masculin" ? "masculin" : "mixte"}`;
  const nom =
    categorie === "programme-unique"
      ? "Programme mixte"
      : `${libellesCategorie[categorie]} ${libellesGenre[genre]}`;
  return { slug, sportSlug, categorie, genre, nom };
}

/**
 * Les 38 équipes officielles des Alérions, réparties sur onze sports.
 * Aucune division RSEQ n'est inventée : le nom de la catégorie suffit,
 * conformément à la pratique du CFDL.
 */
export const equipes: Equipe[] = [
  // Basketball — 8 équipes
  equipe("basketball", "atome", "feminin"),
  equipe("basketball", "atome", "masculin"),
  equipe("basketball", "benjamin", "feminin"),
  equipe("basketball", "benjamin", "masculin"),
  equipe("basketball", "cadet", "feminin"),
  equipe("basketball", "cadet", "masculin"),
  equipe("basketball", "juvenile", "feminin"),
  equipe("basketball", "juvenile", "masculin"),

  // Volleyball — 6 équipes
  equipe("volleyball", "benjamin", "feminin"),
  equipe("volleyball", "benjamin", "masculin"),
  equipe("volleyball", "cadet", "feminin"),
  equipe("volleyball", "cadet", "masculin"),
  equipe("volleyball", "juvenile", "feminin"),
  equipe("volleyball", "juvenile", "masculin"),

  // Football — 3 équipes
  equipe("football", "atome", "masculin"),
  equipe("football", "benjamin", "masculin"),
  equipe("football", "juvenile", "masculin"),

  // Flag-football — 6 équipes
  equipe("flag-football", "benjamin", "feminin"),
  equipe("flag-football", "benjamin", "masculin"),
  equipe("flag-football", "cadet", "feminin"),
  equipe("flag-football", "cadet", "masculin"),
  equipe("flag-football", "juvenile", "feminin"),
  equipe("flag-football", "juvenile", "masculin"),

  // Volleyball de plage — 6 équipes
  equipe("volleyball-plage", "benjamin", "feminin"),
  equipe("volleyball-plage", "benjamin", "masculin"),
  equipe("volleyball-plage", "cadet", "feminin"),
  equipe("volleyball-plage", "cadet", "masculin"),
  equipe("volleyball-plage", "juvenile", "feminin"),
  equipe("volleyball-plage", "juvenile", "masculin"),

  // Soccer — 2 équipes
  equipe("soccer", "cadet", "masculin"),
  equipe("soccer", "juvenile", "masculin"),

  // Ultimate — 3 équipes mixtes
  equipe("ultimate", "benjamin", "mixte"),
  equipe("ultimate", "cadet", "mixte"),
  equipe("ultimate", "juvenile", "mixte"),

  // Programmes mixtes uniques
  equipe("cross-country", "programme-unique", "mixte"),
  equipe("athletisme", "programme-unique", "mixte"),
  equipe("natation", "programme-unique", "mixte"),
  equipe("echecs", "programme-unique", "mixte"),
];

export function equipesParSport(sportSlug: SportSlug): Equipe[] {
  return equipes.filter((e) => e.sportSlug === sportSlug);
}

export function trouverEquipe(sportSlug: string, equipeSlug: string): Equipe | undefined {
  return equipes.find((e) => e.sportSlug === sportSlug && e.slug === equipeSlug);
}
