/**
 * Types partagés du site des Alérions.
 * Toute donnée temporaire (exemples, contenu à confirmer) respecte ces
 * mêmes formes afin d'être remplacée par de vraies données sans réécrire
 * les composants.
 */

export type Sport =
  | "basketball"
  | "volleyball"
  | "athletisme"
  | "autres";

export type NiveauScolaire = "secondaire-1-2" | "secondaire-3-4-5";

export type Genre = "masculin" | "feminin" | "mixte";

/** Marque explicitement une donnée comme temporaire / exemple / à confirmer. */
export type StatutContenu = "exemple" | "a-confirmer" | "confirme";

export interface Equipe {
  slug: string;
  nom: string;
  sport: Sport;
  niveau: NiveauScolaire;
  genre: Genre;
  /** Nom de fichier dans public/images/alerions/, ou null si aucune photo assignée. */
  photoPrincipale: string | null;
  statut: StatutContenu;
}

export interface Evenement {
  id: string;
  titre: string;
  type: "entrainement" | "match" | "tournoi" | "autre";
  sportSlug: Sport;
  equipeSlug: string | null;
  date: string; // ISO 8601
  heure: string; // ex. "18:30"
  lieu: string;
  statut: StatutContenu;
}

export interface Resultat {
  id: string;
  equipeSlug: string;
  sportSlug: Sport;
  adversaire: string;
  date: string;
  score: string;
  issue: "victoire" | "defaite" | "nul" | "a-confirmer";
  statut: StatutContenu;
}

export interface Actualite {
  id: string;
  titre: string;
  resume: string;
  date: string;
  photo: string | null;
  statut: StatutContenu;
}

export interface NavLien {
  label: string;
  href: string;
}

export interface PhotoGalerie {
  fichier: string;
  alt: string;
  orientation: "verticale" | "horizontale";
}
