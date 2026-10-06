/**
 * Règles de publication et de confidentialité — appliquées identiquement
 * aux joueurs et aux entraîneurs. C'est la SEULE porte de sortie des
 * données MEMBRES vers le public : toute nouvelle route doit passer par
 * `redigerMembre`, jamais renvoyer une ligne brute.
 *
 * Un rôle ou un accès_chat indiqué dans le Sheet n'est PAS une preuve
 * d'identité ni une permission — ces règles ne s'appuient donc jamais sur
 * `accesChat` ni `authUserId` pour décider de ce qui est public.
 */
import { analyserNumero, composerNomAffiche, normaliserTexte } from "./normaliser.js";
import type { CategorieRole, EquipeRow, MembreRow, MembrePublic, EquipePublique } from "./types.js";

/** Domaines d'hébergement d'image publique autorisés par défaut (https uniquement, toujours). */
function hoteAutorise(hostname: string): boolean {
  const listeBrute = process.env.ALERIONS_PHOTO_HOST_ALLOWLIST;
  if (!listeBrute || !listeBrute.trim()) {
    // Aucune liste configurée : on accepte tout hôte HTTPS — c'est une
    // limite documentée (voir docs/roster-google-sheets.md) tant qu'un
    // proxy d'image avec domaines/formats/tailles restreints n'existe pas.
    return true;
  }
  const hotesAutorises = listeBrute.split(",").map((h) => h.trim().toLowerCase()).filter(Boolean);
  return hotesAutorises.includes(hostname.toLowerCase());
}

/** Valide qu'une URL de photo est utilisable publiquement : HTTPS, hôte autorisé, bien formée. */
export function urlPhotoAutorisee(urlBrute: string): boolean {
  if (!urlBrute) return false;
  let url: URL;
  try {
    url = new URL(urlBrute);
  } catch {
    return false;
  }
  if (url.protocol !== "https:") return false;
  return hoteAutorise(url.hostname);
}

/**
 * Un profil peut apparaître publiquement uniquement si donnée_fictive =
 * FALSE, statut_membre = Actif, publication_profil = TRUE.
 */
export function profilEstPublic(membre: MembreRow): boolean {
  return (
    membre.donneeFictive === false &&
    normaliserTexte(membre.statutMembre) === "actif" &&
    membre.publicationProfil === true
  );
}

/**
 * Une photo publique nécessite en plus publication_photo = TRUE,
 * consentement_photo = Accordé, et une URL d'image publique autorisée.
 */
export function photoEstPublique(membre: MembreRow): boolean {
  return (
    profilEstPublic(membre) &&
    membre.publicationPhoto === true &&
    normaliserTexte(membre.consentementPhoto) === "accorde" &&
    urlPhotoAutorisee(membre.photoUrl)
  );
}

function categoriserRole(roleBrut: string): CategorieRole {
  const r = normaliserTexte(roleBrut);
  return r.includes("entrain") || r.includes("coach") ? "entraineur" : "joueur";
}

/**
 * Réduit une ligne MEMBRES brute (qui peut contenir courriel, notes,
 * auth_user_id…) à la forme publique minimale nécessaire à l'affichage
 * d'une carte. Ne JAMAIS retourner `membre` directement ni l'étendre.
 */
export function redigerMembre(membre: MembreRow): MembrePublic {
  return {
    idMembre: membre.idMembre,
    idPersonne: membre.idPersonne,
    idEquipe: membre.idEquipe,
    categorieRole: categoriserRole(membre.role),
    nomAffiche: composerNomAffiche(membre),
    numero: analyserNumero(membre.numero),
    poste: membre.poste.trim() || null,
    capitaine: membre.capitaine,
    photoUrl: photoEstPublique(membre) ? membre.photoUrl : null,
    saison: membre.saison,
  };
}

export function redigerEquipe(equipe: EquipeRow): EquipePublique {
  return {
    idEquipe: equipe.idEquipe,
    sport: equipe.sport,
    nomEquipe: equipe.equipe,
    categorie: equipe.categorie,
    genre: equipe.genre,
    division: equipe.division,
    slugSite: equipe.slugSite,
    saison: equipe.saison,
  };
}
