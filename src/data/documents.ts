import type { DocumentPdf, SportSlug } from "../types";

/**
 * Documents réels trouvés dans le dépôt, copiés dans public/documents/.
 * Titres, descriptions et métadonnées lus directement dans chaque PDF —
 * aucun contenu inventé. Les décks « Projet XX » sont des propositions
 * internes de la Culture Basketball (certaines demandent encore une
 * décision) : ils ne sont pas présentés comme des règlements officiels.
 */
export const documents: DocumentPdf[] = [
  {
    slug: "boite-a-idees",
    titre: "Boîte à idées — Culture Basketball",
    description:
      "Proposition pour installer une boîte à idées dans le gymnase et recueillir les suggestions des jeunes, catégorie par catégorie.",
    fichier: "Alerions_Projet_04_Boite_a_idees_4_pages.pdf",
    categorie: "projet",
    pages: 4,
    tailleOctets: 1517729,
    sportsConcernes: ["basketball"],
  },
  {
    slug: "media-day",
    titre: "Media Day — Culture Basketball",
    description:
      "Proposition d'une journée média annuelle : portraits d'athlètes, saison captée par des vidéastes juniors et montage d'un film de fin de saison.",
    fichier: "Alerions_Projet_05_Media_Day_Creative_V2.pdf",
    categorie: "projet",
    pages: 4,
    tailleOctets: 3512374,
    sportsConcernes: ["basketball"],
  },
  {
    slug: "nouveaux-ballons-complet",
    titre: "20 nouveaux ballons",
    description:
      "Proposition d'achat de 20 ballons Wilson Evolution (10 taille 6, 10 taille 7) et de deux bacs de rangement pour les entraînements et les matchs à domicile.",
    fichier: "CFDL_Projet_01_20_nouveaux_ballons_4_pages_corrige.pdf",
    categorie: "projet",
    pages: 4,
    tailleOctets: 1293130,
    groupeVersion: { id: "nouveaux-ballons", etiquette: "Version complète" },
    sportsConcernes: ["basketball"],
  },
  {
    slug: "nouveaux-ballons-court",
    titre: "20 nouveaux ballons",
    description:
      "Version condensée en une page de la même proposition : 20 ballons Wilson Evolution et deux bacs de rangement.",
    fichier: "CFDL_Projet_01_20_nouveaux_ballons_FINAL.pdf",
    categorie: "projet",
    pages: 1,
    tailleOctets: 3067319,
    groupeVersion: { id: "nouveaux-ballons", etiquette: "Version courte" },
    sportsConcernes: ["basketball"],
  },
  {
    slug: "testeur-impulsion",
    titre: "Testeur d'impulsion Alérion",
    description:
      "Proposition d'un outil de mesure de l'impulsion verticale pour suivre la progression et motiver les athlètes à tous les niveaux.",
    fichier: "CFDL_Projet_02_Testeur_Impulsion_Alerion_FINAL_complet.pdf",
    categorie: "projet",
    pages: 6,
    tailleOctets: 18560315,
    sportsConcernes: ["basketball"],
  },
  {
    slug: "soirees-basket-exterieures",
    titre: "Soirées basket extérieures",
    description:
      "Proposition d'un rendez-vous communautaire régulier de basketball libre, avec BBQ et animation, ouvert à tous les jeunes.",
    fichier: "CFDL_Projet_03_Soirees_Basket_Pages_Individuelles.pdf",
    categorie: "projet",
    pages: 6,
    tailleOctets: 3719630,
    sportsConcernes: ["basketball"],
  },
  {
    slug: "basketball-cinema",
    titre: "Basketball + Cinéma",
    description:
      "Proposition d'une soirée combinant basketball, cinéma et communauté pour les élèves de secondaire 3, 4 et 5.",
    fichier: "CFDL_Projet_Basketball_Cinema_12_pages_individuelles.pdf",
    categorie: "projet",
    pages: 12,
    tailleOctets: 2871351,
    sportsConcernes: ["basketball"],
  },
  {
    slug: "identite-sportive-bold",
    titre: "Nouvelle identité sportive — variante Bold",
    description:
      "Proposition de modernisation de l'identité sportive Alérions (armoiries du Collège inchangées) — variante de mise en page « Bold ». Le choix final n'est pas encore arrêté.",
    fichier: "Alerions_Brand_Kit_2026_V3_Bold.pdf",
    categorie: "identite-visuelle",
    pages: 19,
    tailleOctets: 2606820,
    sportsConcernes: [],
  },
  {
    slug: "identite-sportive-direct",
    titre: "Nouvelle identité sportive — variante Direct",
    description:
      "Proposition de modernisation de l'identité sportive Alérions (armoiries du Collège inchangées) — variante de mise en page « Direct ». Le choix final n'est pas encore arrêté.",
    fichier: "Alerions_Brand_Kit_2026_V4_Direct.pdf",
    categorie: "identite-visuelle",
    pages: 11,
    tailleOctets: 2437199,
    sportsConcernes: [],
  },
  {
    slug: "identite-sportive-logos",
    titre: "Nouvelle identité sportive — propositions de logo",
    description:
      "Trois pistes de logo sportif présentées au Collège (symbole Alérion, monogramme A, Varsity A). Aucune option n'est encore choisie.",
    fichier: "Alerions_Brand_Kit_2026_V9_Transparent_Logos_Clean.pdf",
    categorie: "identite-visuelle",
    pages: 12,
    tailleOctets: 3344432,
    sportsConcernes: [],
  },
];

export function documentsParSport(sportSlug: SportSlug): DocumentPdf[] {
  return documents.filter((d) => d.sportsConcernes.includes(sportSlug));
}

export function tailleLisible(octets: number): string {
  if (octets < 1024 * 1024) return `${Math.round(octets / 1024)} Ko`;
  return `${(octets / (1024 * 1024)).toFixed(1)} Mo`;
}
