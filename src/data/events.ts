import type { Evenement } from "../types";

/**
 * Données d'exemple UNIQUEMENT — aucun horaire réel n'est encore fourni.
 * Chaque entrée porte statut: "exemple" afin que l'interface l'affiche
 * clairement comme telle. À remplacer par les vraies données de saison.
 */
export const evenementsExemple: Evenement[] = [
  {
    id: "ex-entrainement-1",
    titre: "Entraînement — exemple",
    type: "entrainement",
    sportSlug: "basketball",
    equipeSlug: "equipe-exemple",
    date: "2026-09-22",
    heure: "16:30",
    lieu: "Gymnase principal (à confirmer)",
    statut: "exemple",
  },
  {
    id: "ex-match-1",
    titre: "Match — exemple",
    type: "match",
    sportSlug: "volleyball",
    equipeSlug: null,
    date: "2026-09-26",
    heure: "18:00",
    lieu: "À confirmer",
    statut: "exemple",
  },
  {
    id: "ex-tournoi-1",
    titre: "Tournoi — exemple",
    type: "tournoi",
    sportSlug: "athletisme",
    equipeSlug: null,
    date: "2026-10-03",
    heure: "09:00",
    lieu: "À confirmer",
    statut: "exemple",
  },
];
