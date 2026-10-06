/**
 * Types partagés par les fonctions serveur du feuillet d'effectifs
 * (Google Sheet « LISTES DE TOUTES LES ÉQUIPES ALÉRIONS SAISON 2026-2027 »).
 *
 * Ces types décrivent deux choses distinctes, à ne jamais confondre :
 *  - les lignes BRUTES telles que lues dans ÉQUIPES / MEMBRES (tous les
 *    champs, y compris les champs privés) — jamais envoyées au navigateur ;
 *  - les formes PUBLIQUES, déjà filtrées par les règles de publication,
 *    seules autorisées à sortir de api/roster.ts.
 */

/** Ligne brute de l'onglet ÉQUIPES (colonnes A à Q), après mappage par en-tête. */
export interface EquipeRow {
  idEquipe: string;
  saison: string;
  sport: string;
  equipe: string;
  categorie: string;
  genre: string;
  division: string;
  statutEquipe: string;
  nbJoueurs: string;
  nbEntraineurs: string;
  ouvrirEquipe: boolean;
  googleCalendarId: string;
  sourceHoraires: string;
  synchronisation: string;
  fuseauHoraire: string;
  slugSite: string;
  notes: string;
}

/** Ligne brute de l'onglet MEMBRES (colonnes A à Z, + AA/AB facultatives). Contient des champs privés. */
export interface MembreRow {
  idMembre: string;
  idPersonne: string;
  idEquipe: string;
  role: string;
  prenom: string;
  nom: string;
  nomComplet: string;
  courrielPrive: string;
  numero: string;
  poste: string;
  capitaine: boolean;
  niveauScolaire: string;
  statutMembre: string;
  statutCompte: string;
  authUserId: string;
  photoUrl: string;
  photoStoragePath: string;
  statutPhoto: string;
  consentementPhoto: string;
  dateConsentement: string;
  donneeFictive: boolean;
  accesChat: string;
  saison: string;
  dateAjout: string;
  dateDepart: string;
  notes: string;
  /** Colonne AA — absente ou vide dans le Sheet tant que l'admin ne l'a pas ajoutée. */
  publicationProfil: boolean;
  /** Colonne AB — idem. */
  publicationPhoto: boolean;
}

/** Catégorie de rattachement déduite de la colonne « rôle ». */
export type CategorieRole = "joueur" | "entraineur";

/** Forme publique d'une équipe — seuls les champs utiles à l'affichage. */
export interface EquipePublique {
  idEquipe: string;
  sport: string;
  nomEquipe: string;
  categorie: string;
  genre: string;
  division: string;
  slugSite: string;
  saison: string;
}

/** Forme publique d'un membre (joueur ou entraîneur) — jamais de champ privé. */
export interface MembrePublic {
  idMembre: string;
  idPersonne: string;
  idEquipe: string;
  categorieRole: CategorieRole;
  nomAffiche: string;
  numero: number | null;
  poste: string | null;
  capitaine: boolean;
  photoUrl: string | null;
  saison: string;
}

export interface RosterReponse {
  equipe: EquipePublique | null;
  joueurs: MembrePublic[];
  entraineurs: MembrePublic[];
  meta: {
    fetchedAt: string;
    cacheAgeSecondes: number;
    prochaineRevalidationSecondes: number;
  };
}

export interface RosterErreur {
  ok: false;
  code:
    | "methode_non_autorisee"
    | "parametres_manquants"
    | "service_non_configure"
    | "equipe_introuvable"
    | "google_auth_echouee"
    | "google_quota_depasse"
    | "google_indisponible"
    | "erreur_inattendue";
}
