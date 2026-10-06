import type { DefiSemaine } from "../types";

/**
 * Défi de la semaine — contenu réel tiré de la maquette (consignes,
 * objectif de 3 séances). Un seul défi actif à la fois ; la démo externe
 * n'est pas encore fournie (lienDemo reste null tant qu'aucune vidéo réelle
 * n'est connectée — jamais un lien générique ou inventé).
 */
export const defiSemaine: DefiSemaine = {
  id: "controle-du-ballon-2026-s1",
  titre: "Contrôle du ballon",
  periode: "Cette semaine",
  consignes: ["Main droite.", "Main gauche.", "Changement de main."],
  lienDemo: null,
  seancesCibles: 3,
  recompense: "Photo d'équipe spéciale",
};
