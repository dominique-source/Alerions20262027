const PREFIXE = "alerions:derniere-soumission:";
const DELAI_MS = 60_000;

/**
 * Limitation raisonnable des soumissions, côté client (localStorage) :
 * une fonction serverless étant sans état entre les invocations, c'est le
 * mécanisme le plus fiable disponible sans base de données externe (voir
 * aussi la limite best-effort côté serveur dans api/boite-a-idees.ts).
 */
export function peutSoumettre(cle: string): boolean {
  try {
    const derniere = window.localStorage.getItem(PREFIXE + cle);
    if (!derniere) return true;
    return Date.now() - Number(derniere) > DELAI_MS;
  } catch {
    return true;
  }
}

export function marquerSoumission(cle: string): void {
  try {
    window.localStorage.setItem(PREFIXE + cle, String(Date.now()));
  } catch {
    // Stockage indisponible : la limitation reste simplement inactive.
  }
}

export function secondesAvantProchaineSoumission(cle: string): number {
  try {
    const derniere = window.localStorage.getItem(PREFIXE + cle);
    if (!derniere) return 0;
    const reste = DELAI_MS - (Date.now() - Number(derniere));
    return reste > 0 ? Math.ceil(reste / 1000) : 0;
  } catch {
    return 0;
  }
}
