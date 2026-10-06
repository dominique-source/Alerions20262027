import type { SyntheticEvent } from "react";

/** Construit le chemin public d'une photo organisée dans public/images/alerions/. */
export function cheminPhoto(nomFichier: string): string {
  return `/images/alerions/${nomFichier}`;
}

/**
 * Construit le chemin public à partir d'un chemin relatif complet sous
 * public/ (ex. "images/generated/volleyball/01.jpg"). Utilisé par le
 * manifeste des photos de campagne et les couvertures de sport.
 */
export function cheminPublic(cheminRelatif: string): string {
  return `/${cheminRelatif}`;
}

/**
 * Masque une image dès qu'elle échoue à charger (fichier de campagne pas
 * encore livré) : jamais d'icône d'image brisée ni de lien visuellement
 * cassé pendant que les 50 photos de campagne sont préparées.
 */
export function surErreurImageMasquer(evenement: SyntheticEvent<HTMLImageElement>): void {
  const cible = evenement.currentTarget;
  const conteneur = cible.closest<HTMLElement>("[data-photo-tuile]");
  if (conteneur) {
    conteneur.style.display = "none";
  } else {
    cible.style.display = "none";
  }
}
