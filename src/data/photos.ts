import type { OrientationPhoto, Photo } from "../types";
import { photosGenereesPlan } from "./imagesGenerees";

interface EntreeBrute {
  fichier: string;
  orientation: OrientationPhoto;
  alt: string;
}

/**
 * Les 40 photos réelles déjà présentes dans le dépôt (public/images/alerions/).
 * Toutes montrent le programme de basketball — aucune n'est réutilisée sur
 * une page d'un autre sport (voir règle du mandat). Orientations vérifiées
 * sur les dimensions réelles des fichiers.
 */
const photosReportageBasketball: Photo[] = ([
  { fichier: "images/alerions/DSC_0806.jpg", orientation: "verticale", alt: "Athlète des Alérions concentré en position de jeu" },
  { fichier: "images/alerions/DSC_0811.jpg", orientation: "verticale", alt: "Athlète des Alérions en course sur le terrain" },
  { fichier: "images/alerions/DSC_0812.jpg", orientation: "verticale", alt: "Athlète des Alérions en appui avant un tir" },
  { fichier: "images/alerions/DSC_0824.jpg", orientation: "verticale", alt: "Athlète des Alérions en plein effort durant un entraînement" },
  { fichier: "images/alerions/DSC_0825.jpg", orientation: "verticale", alt: "Athlètes des Alérions dans le feu de l'action" },
  { fichier: "images/alerions/DSC_0826.jpg", orientation: "verticale", alt: "Athlète des Alérions en défense sur le terrain" },
  { fichier: "images/alerions/DSC_0827.jpg", orientation: "verticale", alt: "Athlète des Alérions en position de tir" },
  { fichier: "images/alerions/DSC_0828.jpg", orientation: "verticale", alt: "Athlète des Alérions au rebond" },
  { fichier: "images/alerions/DSC_0829.jpg", orientation: "verticale", alt: "Athlète des Alérions en mouvement vers le panier" },
  { fichier: "images/alerions/DSC_0830.jpg", orientation: "verticale", alt: "Athlète des Alérions en position défensive" },
  { fichier: "images/alerions/DSC_0899.jpg", orientation: "horizontale", alt: "Équipe des Alérions réunie sur le terrain" },
  { fichier: "images/alerions/DSC_0926.jpg", orientation: "verticale", alt: "Athlète des Alérions célébrant un jeu" },
  { fichier: "images/alerions/DSC_0939.jpg", orientation: "verticale", alt: "Athlète des Alérions en action durant un match" },
  { fichier: "images/alerions/DSC_0964.jpg", orientation: "verticale", alt: "Athlète des Alérions en dribble" },
  { fichier: "images/alerions/DSC_0966.jpg", orientation: "verticale", alt: "Athlète des Alérions en position de jeu" },
  { fichier: "images/alerions/DSC_0967.jpg", orientation: "verticale", alt: "Athlète des Alérions en mouvement sur le terrain" },
  { fichier: "images/alerions/DSC_0968.jpg", orientation: "verticale", alt: "Athlète des Alérions concentré avant un tir" },
  { fichier: "images/alerions/DSC_0989.jpg", orientation: "verticale", alt: "Athlète des Alérions en course" },
  { fichier: "images/alerions/DSC_0992.jpg", orientation: "verticale", alt: "Athlète des Alérions en défense" },
  { fichier: "images/alerions/DSC_0993.jpg", orientation: "verticale", alt: "Athlète des Alérions au moment du tir" },
  { fichier: "images/alerions/DSC_1070.jpg", orientation: "verticale", alt: "Athlète des Alérions en position de jeu" },
  { fichier: "images/alerions/DSC_1071.jpg", orientation: "verticale", alt: "Athlète des Alérions en position d'attaque" },
  { fichier: "images/alerions/DSC_1075.jpg", orientation: "verticale", alt: "Athlète des Alérions en plein effort" },
  { fichier: "images/alerions/DSC_1077.jpg", orientation: "verticale", alt: "Athlète des Alérions en dribble serré" },
  { fichier: "images/alerions/DSC_1078.jpg", orientation: "verticale", alt: "Athlète des Alérions en course vers le panier" },
  { fichier: "images/alerions/DSC_1080.jpg", orientation: "verticale", alt: "Athlète des Alérions en position défensive" },
  { fichier: "images/alerions/DSC_1089.jpg", orientation: "verticale", alt: "Athlète des Alérions au moment du saut" },
  { fichier: "images/alerions/DSC_1090.jpg", orientation: "verticale", alt: "Athlète des Alérions en action" },
  { fichier: "images/alerions/DSC_1094.jpg", orientation: "horizontale", alt: "Équipe des Alérions en action lors d'un match" },
  { fichier: "images/alerions/DSC_1095.jpg", orientation: "horizontale", alt: "Athlètes des Alérions en pleine partie" },
  { fichier: "images/alerions/DSC_1119.jpg", orientation: "horizontale", alt: "Athlète des Alérions en pleine action" },
  { fichier: "images/alerions/DSC_1133.jpg", orientation: "horizontale", alt: "Athlète des Alérions au ballon" },
  { fichier: "images/alerions/DSC_1134.jpg", orientation: "horizontale", alt: "Athlètes des Alérions au coup d'envoi" },
  { fichier: "images/alerions/DSC_1136.jpg", orientation: "horizontale", alt: "Athlètes des Alérions alignés avant la rencontre" },
  { fichier: "images/alerions/DSC_1139.jpg", orientation: "horizontale", alt: "Athlètes des Alérions réunis sur le terrain" },
  { fichier: "images/alerions/DSC_1144.jpg", orientation: "verticale", alt: "Athlète des Alérions en position de jeu" },
  { fichier: "images/alerions/DSC_1152.jpg", orientation: "horizontale", alt: "Ambiance d'estrade lors d'un match des Alérions" },
  { fichier: "images/alerions/DSC_1153.jpg", orientation: "horizontale", alt: "Athlètes des Alérions en pleine action durant un match" },
  { fichier: "images/alerions/DSC_1154.jpg", orientation: "horizontale", alt: "Athlètes des Alérions dans l'intensité du match" },
  { fichier: "images/alerions/DSC_1176.jpg", orientation: "verticale", alt: "Athlète des Alérions portant les couleurs de l'équipe" },
] satisfies EntreeBrute[]).map((p, i) => ({
  id: `reportage-${i + 1}`,
  fichier: p.fichier,
  alt: p.alt,
  sportSlug: "basketball" as const,
  orientation: p.orientation,
  type: "reportage" as const,
  credit: null,
}));

/** Toutes les photos disponibles : reportage réel + plan de campagne. */
export const photos: Photo[] = [...photosReportageBasketball, ...photosGenereesPlan];

export function photosParSport(sportSlug: string): Photo[] {
  return photos.filter((p) => p.sportSlug === sportSlug);
}

export const heroPhoto = photosReportageBasketball.find((p) => p.fichier.endsWith("DSC_1119.jpg"))!;
