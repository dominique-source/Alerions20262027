/**
 * Limitation d'envoi en mémoire, par uid — même limite réelle que
 * api/boite-a-idees.ts : une fonction serverless est sans état entre
 * instances froides multiples, donc ce compteur freine un envoi en
 * rafale sur UNE instance chaude, sans garantir une limite globale
 * stricte tant qu'aucun stockage partagé (ex. Vercel KV) n'est branché.
 * Documenté comme limite réelle, pas présenté comme une garantie.
 */

const FENETRE_MS = 10_000;
const MAX_PAR_FENETRE = 10;

const compteurParUid = new Map<string, number[]>();

export function limiteEnvoiAtteinte(uid: string): boolean {
  const maintenant = Date.now();
  const horodatages = (compteurParUid.get(uid) ?? []).filter((t) => maintenant - t < FENETRE_MS);
  horodatages.push(maintenant);
  compteurParUid.set(uid, horodatages);
  return horodatages.length > MAX_PAR_FENETRE;
}

/** Réservé aux tests. */
export function _reinitialiserLimiteEnvoiPourTests(): void {
  compteurParUid.clear();
}
