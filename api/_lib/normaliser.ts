/**
 * Normalisation des données brutes Google Sheets : les en-têtes ÉQUIPES et
 * MEMBRES peuvent contenir des accents, des espaces ou une casse variable
 * (« Prénom », « prénom », « PRENOM »…). On mappe donc par NOM d'en-tête
 * normalisé plutôt que par position de colonne, pour rester robuste à un
 * réordonnancement involontaire des colonnes existantes (AA/AB exceptées :
 * elles sont ajoutées à droite, jamais insérées).
 */
import type { EquipeRow, MembreRow } from "./types";

/** "Prénom", "  Rôle ", "PHOTO_URL" → "prenom", "role", "photo_url". */
export function normaliserEnTete(entete: string): string {
  return entete
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_");
}

/** Compare une valeur texte à un mot-clé, insensible aux accents/casse/espaces. */
export function normaliserTexte(valeur: unknown): string {
  if (typeof valeur !== "string") return "";
  return valeur
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .trim()
    .toLowerCase();
}

/** Google Sheets renvoie des chaînes ("TRUE"/"VRAI"/"Oui"/"1"…) ou des cellules vides — jamais de vrai booléen. */
export function versBooleen(valeur: unknown): boolean {
  const v = normaliserTexte(valeur);
  return v === "true" || v === "vrai" || v === "1" || v === "oui" || v === "x";
}

function texte(valeur: unknown): string {
  return typeof valeur === "string" ? valeur.trim() : "";
}

/**
 * Construit un dictionnaire { enTeteNormalisee: index } à partir de la
 * première ligne d'une plage Google Sheets.
 */
export function indexerEntetes(ligneEntetes: unknown[]): Map<string, number> {
  const index = new Map<string, number>();
  ligneEntetes.forEach((brut, i) => {
    if (typeof brut === "string" && brut.trim()) {
      index.set(normaliserEnTete(brut), i);
    }
  });
  return index;
}

function champ(ligne: unknown[], index: Map<string, number>, nom: string): unknown {
  const i = index.get(nom);
  if (i === undefined) return undefined;
  return ligne[i];
}

/** Mappe une ligne brute de l'onglet ÉQUIPES vers un objet typé. Jette si des colonnes obligatoires manquent du schéma. */
export function mapperLigneEquipe(ligne: unknown[], index: Map<string, number>): EquipeRow {
  return {
    idEquipe: texte(champ(ligne, index, "id_equipe")),
    saison: texte(champ(ligne, index, "saison")),
    sport: texte(champ(ligne, index, "sport")),
    equipe: texte(champ(ligne, index, "equipe")),
    categorie: texte(champ(ligne, index, "categorie")),
    genre: texte(champ(ligne, index, "genre")),
    division: texte(champ(ligne, index, "division")),
    statutEquipe: texte(champ(ligne, index, "statut_equipe")),
    nbJoueurs: texte(champ(ligne, index, "nb_joueurs")),
    nbEntraineurs: texte(champ(ligne, index, "nb_entraineurs")),
    ouvrirEquipe: versBooleen(champ(ligne, index, "ouvrir_equipe")),
    googleCalendarId: texte(champ(ligne, index, "google_calendar_id")),
    sourceHoraires: texte(champ(ligne, index, "source_horaires")),
    synchronisation: texte(champ(ligne, index, "synchronisation")),
    fuseauHoraire: texte(champ(ligne, index, "fuseau_horaire")),
    slugSite: texte(champ(ligne, index, "slug_site")),
    notes: texte(champ(ligne, index, "notes")),
  };
}

/** Mappe une ligne brute de l'onglet MEMBRES. AA/AB (publication_profil/photo) sont absentes tant que l'admin ne les a pas ajoutées : valeur par défaut FALSE, jamais une erreur. */
export function mapperLigneMembre(ligne: unknown[], index: Map<string, number>): MembreRow {
  return {
    idMembre: texte(champ(ligne, index, "id_membre")),
    idPersonne: texte(champ(ligne, index, "id_personne")),
    idEquipe: texte(champ(ligne, index, "id_equipe")),
    role: texte(champ(ligne, index, "role")),
    prenom: texte(champ(ligne, index, "prenom")),
    nom: texte(champ(ligne, index, "nom")),
    nomComplet: texte(champ(ligne, index, "nom_complet")),
    courrielPrive: texte(champ(ligne, index, "courriel_prive")),
    numero: texte(champ(ligne, index, "numero")),
    poste: texte(champ(ligne, index, "poste")),
    capitaine: versBooleen(champ(ligne, index, "capitaine")),
    niveauScolaire: texte(champ(ligne, index, "niveau_scolaire")),
    statutMembre: texte(champ(ligne, index, "statut_membre")),
    statutCompte: texte(champ(ligne, index, "statut_compte")),
    authUserId: texte(champ(ligne, index, "auth_user_id")),
    photoUrl: texte(champ(ligne, index, "photo_url")),
    photoStoragePath: texte(champ(ligne, index, "photo_storage_path")),
    statutPhoto: texte(champ(ligne, index, "statut_photo")),
    consentementPhoto: texte(champ(ligne, index, "consentement_photo")),
    dateConsentement: texte(champ(ligne, index, "date_consentement")),
    donneeFictive: versBooleen(champ(ligne, index, "donnee_fictive")),
    accesChat: texte(champ(ligne, index, "acces_chat")),
    saison: texte(champ(ligne, index, "saison")),
    dateAjout: texte(champ(ligne, index, "date_ajout")),
    dateDepart: texte(champ(ligne, index, "date_depart")),
    notes: texte(champ(ligne, index, "notes")),
    // Colonnes prévues à droite de MEMBRES (AA/AB) : absentes du schéma
    // actuel → index.get() renvoie undefined → champ() renvoie undefined →
    // versBooleen(undefined) === false. C'est le comportement voulu.
    publicationProfil: versBooleen(champ(ligne, index, "publication_profil")),
    publicationPhoto: versBooleen(champ(ligne, index, "publication_photo")),
  };
}

/** prénom + nom ; nom_complet seulement si l'un des deux manque. Jamais l'inverse. */
export function composerNomAffiche(membre: Pick<MembreRow, "prenom" | "nom" | "nomComplet">): string {
  const assemble = [membre.prenom, membre.nom].filter((p) => p.length > 0).join(" ").trim();
  if (assemble) return assemble;
  return membre.nomComplet.trim();
}

/** Convertit la colonne "numéro" (texte Sheet) en entier, ou null si absente/invalide — jamais 0 par défaut. */
export function analyserNumero(numeroTexte: string): number | null {
  const propre = numeroTexte.trim();
  if (!propre || !/^\d+$/.test(propre)) return null;
  return Number.parseInt(propre, 10);
}
