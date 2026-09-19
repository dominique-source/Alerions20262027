import type { PhotoGalerie } from "../types";

/**
 * Sélection éditoriale pour la section « Galerie » de l'accueil :
 * une grande photo + deux photos secondaires empilées, avec titres courts.
 */
export const galerieAccueil: { fichier: string; alt: string; titre: string }[] = [
  {
    fichier: "DSC_1153.jpg",
    alt: "Athlètes des Alérions en pleine action durant un match",
    titre: "L'intensité du match",
  },
  {
    fichier: "DSC_1139.jpg",
    alt: "Athlètes des Alérions réunis sur le terrain avant une rencontre",
    titre: "L'esprit d'équipe",
  },
  {
    fichier: "DSC_0806.jpg",
    alt: "Athlète des Alérions concentré en position de jeu",
    titre: "La préparation",
  },
];

/**
 * Sélection de photos pour la composition éditoriale de la galerie.
 * Orientations vérifiées sur les dimensions réelles des fichiers
 * (aucune photo n'est déformée : le rendu utilise object-fit: cover).
 * Textes alternatifs volontairement génériques — aucun nom de jeune.
 */
export const photosGalerie: PhotoGalerie[] = [
  {
    fichier: "DSC_1139.jpg",
    alt: "Athlètes des Alérions réunis sur le terrain avant une rencontre",
    orientation: "horizontale",
  },
  {
    fichier: "DSC_0806.jpg",
    alt: "Athlète des Alérions concentré en position de jeu",
    orientation: "verticale",
  },
  {
    fichier: "DSC_0824.jpg",
    alt: "Athlète des Alérions en plein effort durant un entraînement",
    orientation: "verticale",
  },
  {
    fichier: "DSC_1094.jpg",
    alt: "Équipe des Alérions en action lors d'un match",
    orientation: "horizontale",
  },
  {
    fichier: "DSC_0926.jpg",
    alt: "Athlète des Alérions célébrant un jeu",
    orientation: "verticale",
  },
  {
    fichier: "DSC_1136.jpg",
    alt: "Athlètes des Alérions alignés avant le coup d'envoi",
    orientation: "horizontale",
  },
  {
    fichier: "DSC_0967.jpg",
    alt: "Athlète des Alérions en mouvement sur le terrain",
    orientation: "verticale",
  },
  {
    fichier: "DSC_1071.jpg",
    alt: "Athlète des Alérions en position d'attaque",
    orientation: "verticale",
  },
  {
    fichier: "DSC_1152.jpg",
    alt: "Ambiance d'estrade lors d'un match des Alérions",
    orientation: "horizontale",
  },
  {
    fichier: "DSC_1089.jpg",
    alt: "Athlète des Alérions au moment du saut",
    orientation: "verticale",
  },
  {
    fichier: "DSC_1176.jpg",
    alt: "Athlète des Alérions portant les couleurs de l'équipe",
    orientation: "verticale",
  },
];
