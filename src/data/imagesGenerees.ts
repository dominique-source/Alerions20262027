import type { OrientationPhoto, Photo, SportSlug } from "../types";

/**
 * Manifeste central des 50 photos de campagne Alérions 2026.
 *
 * Aucun fichier n'existe encore dans le dépôt : ce manifeste décrit la
 * structure et la convention de nommage attendues (voir
 * public/images/generated/README.md). Dès qu'un fichier `NN.jpg` est
 * déposé dans le bon dossier, il est automatiquement reconnu — aucune
 * modification de code n'est nécessaire.
 *
 * Pour éviter tout lien brisé tant que les fichiers ne sont pas livrés,
 * les composants qui consomment `Photo.fichier` doivent masquer la tuile
 * au premier échec de chargement (voir `onImageMissing` dans lib/images.ts).
 */

export interface PlanDossier {
  dossier: string;
  sportSlug: SportSlug | null;
  contexte: string;
  nombrePhotos: number;
  /** Répartition horizontale/verticale prévue (brief de tournage, pas une garantie). */
  orientations: OrientationPhoto[];
}

export const plansDossiers: PlanDossier[] = [
  {
    dossier: "volleyball",
    sportSlug: "volleyball",
    contexte: "Volleyball — entraînement et match",
    nombrePhotos: 3,
    orientations: ["horizontale", "horizontale", "verticale"],
  },
  {
    dossier: "football",
    sportSlug: "football",
    contexte: "Football — entraînement et match",
    nombrePhotos: 3,
    orientations: ["horizontale", "horizontale", "verticale"],
  },
  {
    dossier: "flag-football",
    sportSlug: "flag-football",
    contexte: "Flag-football — entraînement et match",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "verticale"],
  },
  {
    dossier: "soccer",
    sportSlug: "soccer",
    contexte: "Soccer — entraînement et match",
    nombrePhotos: 3,
    orientations: ["horizontale", "horizontale", "verticale"],
  },
  {
    dossier: "ultimate",
    sportSlug: "ultimate",
    contexte: "Ultimate — entraînement et match mixte",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "horizontale"],
  },
  {
    dossier: "beach-volley",
    sportSlug: "volleyball-plage",
    contexte: "Volleyball de plage",
    nombrePhotos: 3,
    orientations: ["horizontale", "horizontale", "verticale"],
  },
  {
    dossier: "cross-country",
    sportSlug: "cross-country",
    contexte: "Cross-country — course et entraînement",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "horizontale"],
  },
  {
    dossier: "athletisme",
    sportSlug: "athletisme",
    contexte: "Athlétisme — piste et pelouse",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "horizontale"],
  },
  {
    dossier: "natation",
    sportSlug: "natation",
    contexte: "Natation — entraînement en piscine",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "horizontale"],
  },
  {
    dossier: "echecs",
    sportSlug: "echecs",
    contexte: "Échecs — partie et concentration",
    nombrePhotos: 3,
    orientations: ["horizontale", "verticale", "verticale"],
  },
  {
    dossier: "basket-vieux-quebec",
    sportSlug: "basketball",
    contexte: "Basketball, extérieur, Vieux-Québec",
    nombrePhotos: 10,
    orientations: [
      "horizontale", "verticale", "horizontale", "horizontale", "verticale",
      "horizontale", "verticale", "horizontale", "verticale", "horizontale",
    ],
  },
  {
    dossier: "media-day",
    sportSlug: null,
    contexte: "Media Day — portraits multisports",
    nombrePhotos: 10,
    orientations: [
      "verticale", "horizontale", "verticale", "horizontale", "verticale",
      "horizontale", "verticale", "horizontale", "verticale", "horizontale",
    ],
  },
];

function cheminPhotoGeneree(dossier: string, index: number): string {
  return `images/generated/${dossier}/${String(index).padStart(2, "0")}.jpg`;
}

/** Construit l'ensemble des entrées Photo prévues pour les 50 photos de campagne. */
export const photosGenereesPlan: Photo[] = plansDossiers.flatMap((plan) =>
  Array.from({ length: plan.nombrePhotos }, (_, i) => {
    const index = i + 1;
    return {
      id: `campagne-${plan.dossier}-${index}`,
      fichier: cheminPhotoGeneree(plan.dossier, index),
      alt: `Photo de campagne Alérions — ${plan.contexte}`,
      sportSlug: plan.sportSlug,
      orientation: plan.orientations[i] ?? "horizontale",
      type: "campagne" as const,
      credit: null,
    };
  }),
);

export function photosGenereesPourSport(sportSlug: SportSlug): Photo[] {
  return photosGenereesPlan.filter((p) => p.sportSlug === sportSlug);
}
