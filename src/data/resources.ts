export interface RessourceDocument {
  type: string;
  titre: string;
  misAJour: string;
}

/** Documents d'exemple UNIQUEMENT — aucun document réel n'est encore fourni. */
export const documentsExemple: RessourceDocument[] = [
  { type: "PDF", titre: "Philosophie sportive des Alérions", misAJour: "À confirmer" },
  { type: "PDF", titre: "Guide de l'entraîneur", misAJour: "À confirmer" },
  { type: "PDF", titre: "Règlements de saison", misAJour: "À confirmer" },
  { type: "Formulaire", titre: "Formulaire d'inscription", misAJour: "À confirmer" },
  { type: "PDF", titre: "Politique de déplacement", misAJour: "À confirmer" },
];
