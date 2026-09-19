/** Construit le chemin public d'une photo organisée dans public/images/alerions/. */
export function cheminPhoto(nomFichier: string): string {
  return `/images/alerions/${nomFichier}`;
}
