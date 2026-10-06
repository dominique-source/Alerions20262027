import type { Actualite } from "../types";

/**
 * Actualités réelles, basées sur les documents du dépôt
 * (voir public/documents/CFDL_Projet_03_Soirees_Basket…pdf).
 */
export const actualites: Actualite[] = [
  {
    id: "lancement-soirees-basket",
    titre: "Lancement des soirées basket extérieures",
    resume:
      "Premier rendez-vous le vendredi 11 septembre au Pavillon Desjardins de l'Université Laval : basketball libre, musique et BBQ, gratuit pour tous.",
    date: "2026-09-11",
    photo: "DSC_1152.jpg",
    lienExterne: null,
  },
  {
    id: "serie-soirees-basket-automne",
    titre: "Soirées basket : un rendez-vous les 1er et 3e samedis",
    resume:
      "À partir d'octobre, la communauté Alérions se retrouve au grand gymnase un samedi sur deux, de 15 h à 18 h.",
    date: "2026-10-03",
    photo: "DSC_1094.jpg",
    lienExterne: null,
  },
];
