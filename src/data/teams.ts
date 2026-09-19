import type { Equipe, Sport } from "../types";

export interface CategorieSport {
  sport: Sport;
  nom: string;
  description: string;
}

/**
 * Grille des sports affichée sur l'accueil et la page Équipes.
 * La liste officielle des équipes (noms, divisions, effectifs) n'est pas
 * encore fournie : ces catégories reflètent uniquement les familles de
 * sports demandées, pas une liste d'équipes inventée.
 */
export const categoriesSports: CategorieSport[] = [
  {
    sport: "basketball",
    nom: "Basketball",
    description: "Contenu à confirmer",
  },
  {
    sport: "volleyball",
    nom: "Volleyball",
    description: "Contenu à confirmer",
  },
  {
    sport: "athletisme",
    nom: "Athlétisme",
    description: "Contenu à confirmer",
  },
  {
    sport: "autres",
    nom: "Autres sports",
    description: "Contenu à confirmer",
  },
];

/**
 * Une seule équipe modèle, explicitement marquée « exemple », pour valider
 * la structure du gabarit /equipes/:slug avant que la liste officielle des
 * équipes ne soit fournie. Ne pas dupliquer pour créer de fausses équipes.
 */
export const equipeExemple: Equipe = {
  slug: "equipe-exemple",
  nom: "Équipe exemple",
  sport: "basketball",
  niveau: "secondaire-3-4-5",
  genre: "mixte",
  photoPrincipale: "DSC_1119.jpg",
  statut: "exemple",
};

export const equipes: Equipe[] = [equipeExemple];

export const niveaux: { valeur: string; label: string }[] = [
  { valeur: "secondaire-1-2", label: "Secondaire 1-2" },
  { valeur: "secondaire-3-4-5", label: "Secondaire 3-4-5" },
];

/**
 * Composition asymétrique de la page Équipes : une grande image (programme
 * principal) + quatre blocs secondaires. Aucune photo par sport n'existe
 * encore : les photos de basketball servent de référence visuelle
 * temporaire pour les programmes sans photo (marquées `photoDeReference`
 * pour un remplacement futur), sauf le dernier bloc qui pointe vers la
 * vraie photo de l'équipe modèle.
 */
export const composantsEquipesAccueil = {
  grande: {
    sport: "basketball" as Sport,
    nom: "Basketball",
    photo: "DSC_1094.jpg",
    photoDeReference: false,
  },
  secondaires: [
    { sport: "volleyball" as Sport, nom: "Volleyball", photo: "DSC_1070.jpg", photoDeReference: true },
    { sport: "athletisme" as Sport, nom: "Athlétisme", photo: "DSC_1089.jpg", photoDeReference: true },
    { sport: "autres" as Sport, nom: "Autres sports", photo: "DSC_0967.jpg", photoDeReference: true },
  ],
};
