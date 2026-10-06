/**
 * Types partagés du site des Alérions — source de vérité pour la forme des
 * données. Aucun `any` : toute donnée provisoire ou manquante doit être
 * représentée explicitement (`null`, tableau vide), jamais devinée.
 */

/** Les onze sports offerts au Collège François-de-Laval. */
export type SportSlug =
  | "basketball"
  | "volleyball"
  | "football"
  | "flag-football"
  | "volleyball-plage"
  | "soccer"
  | "ultimate"
  | "cross-country"
  | "athletisme"
  | "natation"
  | "echecs";

/** Catégorie d'âge RSEQ, sans division inventée. */
export type Categorie = "atome" | "benjamin" | "cadet" | "juvenile" | "programme-unique";

export type Genre = "feminin" | "masculin" | "mixte";

export interface Sport {
  slug: SportSlug;
  nom: string;
  /** Photo de couverture propre au sport (fichier dans public/images/…), ou null si aucune n'est encore disponible. */
  photoCouverture: string | null;
  /** true si le sport propose un filtre féminin/masculin/mixte (faux pour un programme mixte unique). */
  filtreGenre: boolean;
}

export interface Equipe {
  slug: string;
  sportSlug: SportSlug;
  categorie: Categorie;
  genre: Genre;
  /** Nom d'affichage — catégorie + genre uniquement, jamais de division RSEQ inventée. */
  nom: string;
}

export type TypeActivite = "match" | "pratique" | "communautaire";
export type Localisation = "domicile" | "exterieur";

export interface Evenement {
  id: string;
  titre: string;
  type: TypeActivite;
  sportSlug: SportSlug;
  equipeSlug: string | null;
  date: string; // ISO 8601 (AAAA-MM-JJ)
  heure: string | null; // "HH:MM", ou null si non confirmée
  lieu: string | null; // null si non confirmé — ne jamais inventer
  localisation: Localisation | null;
  /** Lien externe vers l'emplacement (carte), lorsqu'il existe. */
  lienEmplacement: string | null;
  adversaire: string | null;
  /** Source de la donnée, pour traçabilité — jamais affichée comme invention. */
  source: "projet-culture-basketball" | "affiche-calendrier-cadet-2026" | "a-confirmer";
}

export type CategorieDocument =
  | "reglement"
  | "guide"
  | "projet"
  | "identite-visuelle"
  | "formulaire";

export interface DocumentPdf {
  slug: string;
  titre: string;
  description: string;
  /** Nom du fichier dans public/documents/. */
  fichier: string;
  categorie: CategorieDocument;
  pages: number;
  tailleOctets: number;
  /** Regroupe deux versions d'un même projet (ex. version courte / complète). */
  groupeVersion?: { id: string; etiquette: "Version courte" | "Version complète" };
  sportsConcernes: SportSlug[];
}

export type OrientationPhoto = "horizontale" | "verticale";
export type TypePhoto = "reportage" | "campagne";

export interface Photo {
  id: string;
  /** Chemin relatif sous /public (ex. "images/alerions/DSC_1119.jpg"). */
  fichier: string;
  alt: string;
  sportSlug: SportSlug | null;
  orientation: OrientationPhoto;
  type: TypePhoto;
  credit: string | null;
}

export type RoleSoumission = "parent" | "athlete" | "entraineur" | "personnel";

export type CategorieIdee =
  | "equipement"
  | "evenement"
  | "entrainement"
  | "vie-equipe"
  | "communication"
  | "installations"
  | "media-day"
  | "autre";

export interface SoumissionIdee {
  nom: string;
  courriel: string;
  role: RoleSoumission;
  nomEnfant: string | null;
  sportConcerne: SportSlug | "general";
  categorie: CategorieIdee;
  titre: string;
  idee: string;
  resultatSouhaite: string;
  consentement: boolean;
  /** Champ piège invisible — doit rester vide. */
  siteWeb: string;
}

export interface NavLien {
  label: string;
  href: string;
}

export interface Resultat {
  id: string;
  equipeSlug: string;
  sportSlug: SportSlug;
  adversaire: string;
  date: string;
  score: string;
  issue: "victoire" | "defaite" | "nul";
}

export interface Actualite {
  id: string;
  titre: string;
  resume: string;
  date: string;
  photo: string | null;
  lienExterne: string | null;
}

/**
 * --- Types « V2 » (maquettes 1536×1024) ---
 * Joueur numéroté réel (aucun nom inventé — identifié par numéro de
 * chandail, conforme aux maquettes qui n'affichent jamais de nom).
 */
export interface Joueur {
  numero: number;
  equipeNom: string;
  sportSlug: SportSlug;
  /** Crop exact de la carte avant (maquette), tel quel. */
  carteImage: string;
  /** Portrait source propre, utilisé sur la page profil. */
  portraitImage: string;
}

export type TypeContenuMur = "photo" | "video";

export interface ContenuMur {
  id: string;
  titre: string;
  categorie: string;
  date: string;
  type: TypeContenuMur;
  image: string;
  /** Source vidéo réelle, requise si type === "video". */
  videoUrl: string | null;
  equipeConcernee: boolean;
  lien: string | null;
}

export interface OptionVote {
  id: "a" | "b";
  titre: string;
  image: string;
}

export interface SondageMur {
  id: string;
  titre: string;
  sousTitre: string;
  options: [OptionVote, OptionVote];
}

export interface CarteCollection {
  id: string;
  titre: string;
  image: string | null;
  /** Règle d'attribution lisible — jamais un tirage aléatoire. */
  regle: string;
}

export interface DefiSemaine {
  id: string;
  titre: string;
  periode: string;
  consignes: string[];
  lienDemo: string | null;
  seancesCibles: number;
  recompense: string;
}
