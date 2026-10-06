import type { Evenement } from "../types";

const CFDL = "Collège François-de-Laval";
const CFDL_LIEN =
  "https://www.google.com/maps/search/?api=1&query=6+rue+de+la+Vieille+Universit%C3%A9+Qu%C3%A9bec";

/**
 * Séances récurrentes du calendrier Cadet CFDL Alérions (octobre 2026),
 * transcrites depuis l'affiche officielle
 * public/images/affiches/calendrier-octobre-reference.png — le bandeau
 * récapitulatif en bas de l'affiche ("PRATIQUE CHAQUE LUNDI", "CHAQUE
 * JEUDI", "BALLERS ONLY SAMEDI") sert de source, car la frise du milieu de
 * la même affiche contient des doublons de date internes (ex. deux lignes
 * « JEU 29 » avec des heures différentes) — le bandeau est la version
 * cohérente.
 */
function seancesRecurrentes(): Evenement[] {
  const lundis = [5, 12, 19, 26];
  const jeudis = [1, 8, 15, 22, 29];
  const samedis = [3, 10, 17, 24, 31];
  const seances: Evenement[] = [];
  for (const jour of lundis) {
    seances.push({
      id: `cadet-pratique-2026-10-${String(jour).padStart(2, "0")}`,
      titre: "Pratique — Cadet",
      type: "pratique",
      sportSlug: "basketball",
      equipeSlug: null,
      date: `2026-10-${String(jour).padStart(2, "0")}`,
      heure: "16:45",
      lieu: CFDL,
      localisation: "domicile",
      lienEmplacement: CFDL_LIEN,
      adversaire: null,
      source: "affiche-calendrier-cadet-2026",
    });
  }
  for (const jour of jeudis) {
    seances.push({
      id: `cadet-pratique-2026-10-${String(jour).padStart(2, "0")}b`,
      titre: "Pratique — Cadet",
      type: "pratique",
      sportSlug: "basketball",
      equipeSlug: null,
      date: `2026-10-${String(jour).padStart(2, "0")}`,
      heure: "15:45",
      lieu: CFDL,
      localisation: "domicile",
      lienEmplacement: CFDL_LIEN,
      adversaire: null,
      source: "affiche-calendrier-cadet-2026",
    });
  }
  for (const jour of samedis) {
    seances.push({
      id: `cadet-ballers-only-2026-10-${String(jour).padStart(2, "0")}`,
      titre: "Ballers Only (optionnel)",
      type: "communautaire",
      sportSlug: "basketball",
      equipeSlug: null,
      date: `2026-10-${String(jour).padStart(2, "0")}`,
      heure: "13:00",
      lieu: CFDL,
      localisation: "domicile",
      lienEmplacement: CFDL_LIEN,
      adversaire: null,
      source: "affiche-calendrier-cadet-2026",
    });
  }
  return seances;
}

/**
 * Événements réels du programme Basketball Alérions, tirés des documents
 * du dépôt (voir public/documents/CFDL_Projet_03_Soirees_Basket…pdf).
 *
 * Le lancement du 11 septembre est la date annoncée dans le document.
 * Les occurrences suivantes (1er et 3e samedi de chaque mois, à partir
 * d'octobre) sont calculées à partir de cette même règle — ce ne sont
 * pas des dates inventées, mais l'application de la récurrence indiquée
 * dans le document source.
 *
 * Aucun calendrier de matchs ou de pratiques par équipe n'est encore
 * disponible (ni horaire RSEQ, ni export de l'ancien calendrier Google) :
 * cette liste ne contient donc aucun match ni pratique inventés. Voir
 * README « Connexion Google Calendar » pour la suite.
 */
export const evenements: Evenement[] = [
  {
    id: "soiree-basket-2026-09-11",
    titre: "Soirée basket extérieure — lancement",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-09-11",
    heure: "17:00",
    lieu: "Pavillon Desjardins, Université Laval (extérieur)",
    localisation: "exterieur",
    lienEmplacement:
      "https://www.google.com/maps/search/?api=1&query=Pavillon+Desjardins+Universit%C3%A9+Laval",
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-10-03",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-10-03",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-10-17",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-10-17",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-11-07",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-11-07",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-11-21",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-11-21",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-12-05",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-12-05",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },
  {
    id: "soiree-basket-2026-12-19",
    titre: "Soirée basket",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-12-19",
    heure: "15:00",
    lieu: "Grand gymnase, Collège François-de-Laval",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: null,
    source: "projet-culture-basketball",
  },

  // --- Calendrier Cadet CFDL Alérions, saison 2026-2027 ---
  // Sources : public/images/affiches/calendrier-octobre-reference.png,
  // cadets-anciens-13-octobre.png, mini-tournoi.png, rochebelle-28-decembre.png.
  ...seancesRecurrentes(),
  {
    id: "cadet-scrimmage-brebeuf-2026-10-07",
    titre: "Scrimmage @ Brébeuf",
    type: "match",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-10-07",
    heure: "16:00",
    lieu: "Collège Jean-de-Brébeuf",
    localisation: "exterieur",
    lienEmplacement: null,
    adversaire: "Collège Jean-de-Brébeuf",
    source: "affiche-calendrier-cadet-2026",
  },
  {
    id: "cadet-scrimmage-anciens-2026-10-13",
    titre: "Cadets × Anciens",
    type: "match",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-10-13",
    heure: "19:00",
    lieu: CFDL,
    localisation: "domicile",
    lienEmplacement: CFDL_LIEN,
    adversaire: "Anciens Alérions",
    source: "affiche-calendrier-cadet-2026",
  },
  // Affiche dédiée (mini-tournoi.png) : « Dimanche 8 novembre » — l'affiche
  // récapitulative d'octobre indique « DIM 9 NOV », mais le 9 novembre 2026
  // tombe un lundi (vérifié) alors que le 8 novembre 2026 est bien un
  // dimanche. L'affiche dédiée, cohérente jour/date et plus détaillée
  // (horaire complet, adresses), prévaut sur l'erreur de l'autre affiche —
  // conformément à la consigne : les dates contradictoires des affiches ne
  // sont pas traitées comme fiables sans vérification.
  {
    id: "juvenile-mini-tournoi-2026-11-08",
    titre: "Mini tournoi — Alérions Juvénile",
    type: "communautaire",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-11-08",
    heure: null,
    lieu: "St-Pat's High School et Collège François-de-Laval, Québec",
    localisation: "domicile",
    lienEmplacement: null,
    adversaire: "Séminaire Saint-Joseph, St-Pat's HS",
    source: "affiche-calendrier-cadet-2026",
  },
  {
    id: "juvenile-mini-tournoi-2026-11-08-ssj",
    titre: "Alérions Juvénile c. Séminaire Saint-Joseph",
    type: "match",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-11-08",
    heure: "13:30",
    lieu: CFDL,
    localisation: "domicile",
    lienEmplacement: CFDL_LIEN,
    adversaire: "Séminaire Saint-Joseph (Juvénile D3)",
    source: "affiche-calendrier-cadet-2026",
  },
  {
    id: "juvenile-mini-tournoi-2026-11-08-stpats",
    titre: "Alérions Juvénile c. St-Pat's HS",
    type: "match",
    sportSlug: "basketball",
    equipeSlug: null,
    date: "2026-11-08",
    heure: "16:00",
    lieu: CFDL,
    localisation: "domicile",
    lienEmplacement: CFDL_LIEN,
    adversaire: "St-Pat's HS (Juvénile D3)",
    source: "affiche-calendrier-cadet-2026",
  },
  {
    id: "cadet-rochebelle-2026-12-28",
    titre: "Rochebelle × Alérions Cadet",
    type: "match",
    sportSlug: "basketball",
    equipeSlug: null,
    // Heure non confirmée sur l'affiche (« Heure à venir ») — ne jamais
    // inventer une heure de match.
    date: "2026-12-28",
    heure: null,
    lieu: CFDL,
    localisation: "domicile",
    lienEmplacement: CFDL_LIEN,
    adversaire: "Rochebelle (Cadet D1)",
    source: "affiche-calendrier-cadet-2026",
  },
];

function estAVenir(e: Evenement, depuisIso: string): boolean {
  return e.date >= depuisIso;
}

/** Aujourd'hui en ISO (AAAA-MM-JJ), heure locale. */
export function aujourdhuiIso(): string {
  return new Date().toISOString().slice(0, 10);
}

/**
 * Le prochain événement à venir (toute activité confondue), ou celui du
 * jour même. Retourne `undefined` si aucune activité à venir n'est connue —
 * jamais une activité inventée. `depuisIso` est injectable pour les tests.
 */
export function prochainEvenement(depuisIso: string = aujourdhuiIso()): Evenement | undefined {
  return [...evenements]
    .filter((e) => estAVenir(e, depuisIso))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.heure ?? "99:99").localeCompare(b.heure ?? "99:99"))[0];
}

/**
 * Le prochain match (exclut pratiques et séances communautaires) — c'est ce
 * que montrent les maquettes Accueil/Mon équipe/Parents sous « Prochain
 * rendez-vous »/« Prochain match ».
 */
export function prochainMatch(depuisIso: string = aujourdhuiIso()): Evenement | undefined {
  return [...evenements]
    .filter((e) => e.type === "match" && estAVenir(e, depuisIso))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.heure ?? "99:99").localeCompare(b.heure ?? "99:99"))[0];
}
