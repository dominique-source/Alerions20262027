import type { ContenuMur, SondageMur } from "../types";

/**
 * Contenus du Mur — chaque élément correspond à une photo réelle fournie
 * dans l'ensemble d'images approuvé (public/images/mur/). L'affiche
 * « Sur le terrain avec les Alérions » est montrée comme photo plutôt que
 * vidéo : aucune source vidéo réelle n'est disponible, et une tuile « lire
 * la vidéo » sans fichier serait un bouton mort.
 */
export const contenusMur: ContenuMur[] = [
  {
    id: "derriere-maillots",
    titre: "Derrière les maillots",
    categorie: "Journée média",
    date: "2026-09-12",
    type: "photo",
    image: "/images/mur/photo-duo.png",
    videoUrl: null,
    equipeConcernee: true,
    lien: null,
  },
  {
    id: "focus-25",
    titre: "Focus #25",
    categorie: "Portraits de saison",
    date: "2026-09-12",
    type: "photo",
    image: "/images/mur/photo-25.png",
    videoUrl: null,
    equipeConcernee: true,
    lien: "/joueurs/25",
  },
  {
    id: "sur-le-terrain",
    titre: "Sur le terrain avec les Alérions",
    categorie: "Dans les coulisses",
    date: "2026-09-08",
    type: "photo",
    image: "/images/mur/tuile-video.png",
    videoUrl: null,
    equipeConcernee: true,
    lien: null,
  },
  {
    id: "ambiance-gymnase",
    titre: "L'ambiance au gymnase",
    categorie: "Dans les coulisses",
    date: "2026-09-05",
    type: "photo",
    image: "/images/mur/tuile-panier.png",
    videoUrl: null,
    equipeConcernee: true,
    lien: null,
  },
  {
    id: "details-maillots",
    titre: "Les détails qui font la différence",
    categorie: "Journée média",
    date: "2026-08-28",
    type: "photo",
    image: "/images/mur/detail-maillot.png",
    videoUrl: null,
    equipeConcernee: true,
    lien: null,
  },
];

export const sondageMur: SondageMur = {
  id: "mur-affiche",
  titre: "À toi de jouer",
  sousTitre: "Choisis la prochaine affiche",
  options: [
    { id: "a", titre: "Même énergie", image: "/images/mur/affiche-vote-a.png" },
    { id: "b", titre: "Focus", image: "/images/mur/affiche-vote-b.png" },
  ],
};
