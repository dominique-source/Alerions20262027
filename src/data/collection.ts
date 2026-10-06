import type { CarteCollection } from "../types";

/**
 * Les huit cartes de la collection de saison, telles que nommées dans
 * 01_MAQUETTES/collection-desktop-1536x1024.png. Aucune art unique n'est
 * disponible pour chacune (seules trois photos sources existent — voir
 * public/images/portraits/) : les cartes obtenues affichent la photo
 * disponible la plus proche de leur thème ; les autres restent verrouillées
 * (icône + titre, aucune photo inventée) jusqu'à ce que de vraies photos
 * soient fournies pour chaque moment.
 */
export const cartesCollection: CarteCollection[] = [
  {
    id: "portrait-de-saison",
    titre: "Portrait de saison",
    image: "/images/portraits/portrait-25-fumee-rouge.jpg",
    regle: "Débloquée en découvrant la page Mon équipe.",
  },
  {
    id: "journee-media",
    titre: "Journée média",
    image: "/images/portraits/portrait-duo.jpg",
    regle: "Débloquée en ouvrant une photo sur Le mur.",
  },
  {
    id: "esprit-equipe",
    titre: "Esprit d'équipe",
    image: null,
    regle: "Débloquée en déclarant une première séance du défi de la semaine.",
  },
  {
    id: "cadets-anciens",
    titre: "Cadets × Anciens",
    image: null,
    regle: "Débloquée en confirmant ta présence au match Cadets × Anciens.",
  },
  {
    id: "mini-tournoi",
    titre: "Mini tournoi",
    image: null,
    regle: "Débloquée en confirmant ta présence au mini tournoi du 8 novembre.",
  },
  {
    id: "defi-collectif",
    titre: "Défi collectif",
    image: null,
    regle: "Débloquée en atteignant l'objectif de la semaine (3 séances déclarées).",
  },
  {
    id: "les-coulisses",
    titre: "Les coulisses",
    image: null,
    regle: "Débloquée en votant pour la prochaine affiche sur Le mur.",
  },
  {
    id: "fin-de-saison",
    titre: "Fin de saison",
    image: null,
    regle: "Débloquée à la fin de la saison 2026-2027.",
  },
];
