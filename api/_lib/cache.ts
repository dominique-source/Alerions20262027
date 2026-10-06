/**
 * Cache serveur en mémoire pour les plages ÉQUIPES/MEMBRES.
 *
 * Limite réelle, documentée plutôt que cachée : ce cache vit dans le
 * processus de la fonction serverless. Vercel peut recycler une instance
 * froide à tout moment, et plusieurs instances tournent en parallèle sous
 * charge — chacune a son propre cache. Il réduit donc le nombre d'appels à
 * Google (surtout utile en rafale de requêtes sur une même instance
 * chaude), mais ce n'est PAS un cache partagé global garanti. Voir
 * docs/roster-google-sheets.md pour la discussion complète et la piste
 * d'évolution (Vercel KV / Edge Config) si un cache partagé devient
 * nécessaire.
 */
import { mapperLigneEquipe, mapperLigneMembre, indexerEntetes } from "./normaliser";
import { ErreurGoogleSheets, lireConfigurationGoogle, lireFeuillesEquipesEtMembres } from "./sheets";
import type { EquipeRow, MembreRow } from "./types";

export interface DonneesRoster {
  equipes: EquipeRow[];
  membres: MembreRow[];
  recupereA: number;
}

interface EntreeCache {
  donnees: DonneesRoster;
  expireA: number;
}

let cache: EntreeCache | null = null;
// Évite les appels concurrents en rafale (plusieurs requêtes qui arrivent
// pendant qu'une invalidation est déjà en cours sur la même instance chaude).
let recuperationEnCours: Promise<DonneesRoster> | null = null;

function dureeCacheMs(): number {
  const brut = Number.parseInt(process.env.ALERIONS_ROSTER_CACHE_SECONDS ?? "30", 10);
  const secondes = Number.isFinite(brut) && brut > 0 ? brut : 30;
  return secondes * 1000;
}

function lignesVersObjets(plage: unknown[][]): { entetes: unknown[]; lignes: unknown[][] } {
  const [entetes = [], ...lignes] = plage;
  return { entetes, lignes };
}

async function recupererDepuisGoogle(): Promise<DonneesRoster> {
  const config = lireConfigurationGoogle();
  if (!config) {
    throw new ErreurGoogleSheets("config", "Variables d'environnement Google Sheets absentes.");
  }

  const { equipes: plageEquipes, membres: plageMembres } = await lireFeuillesEquipesEtMembres(config);

  const equipesObj = lignesVersObjets(plageEquipes);
  const indexEquipes = indexerEntetes(equipesObj.entetes);
  const equipes = equipesObj.lignes
    .filter((ligne) => ligne.some((v) => v !== undefined && v !== ""))
    .map((ligne) => mapperLigneEquipe(ligne, indexEquipes));

  const membresObj = lignesVersObjets(plageMembres);
  const indexMembres = indexerEntetes(membresObj.entetes);
  const membres = membresObj.lignes
    .filter((ligne) => ligne.some((v) => v !== undefined && v !== ""))
    .map((ligne) => mapperLigneMembre(ligne, indexMembres));

  return { equipes, membres, recupereA: Date.now() };
}

/**
 * Retourne les données ÉQUIPES/MEMBRES, depuis le cache si encore valide,
 * sinon en les relisant depuis Google Sheets. `forcer: true` ignore le
 * cache (réservé à un futur bouton admin « Synchroniser maintenant » —
 * non exposé publiquement dans cette étape, voir docs).
 */
export async function obtenirRoster(forcer = false): Promise<DonneesRoster> {
  const maintenant = Date.now();

  if (!forcer && cache && cache.expireA > maintenant) {
    return cache.donnees;
  }

  if (recuperationEnCours) {
    return recuperationEnCours;
  }

  recuperationEnCours = recupererDepuisGoogle()
    .then((donnees) => {
      cache = { donnees, expireA: Date.now() + dureeCacheMs() };
      return donnees;
    })
    .finally(() => {
      recuperationEnCours = null;
    });

  // Une panne ne doit pas effacer un cache encore frais : si une valeur
  // (même expirée) existe déjà, elle reste en mémoire pour un appel
  // ultérieur — mais CET appel propage l'erreur pour l'afficher honnêtement.
  return recuperationEnCours;
}

export function ageCacheSecondes(): number {
  if (!cache) return 0;
  return Math.max(0, Math.round((Date.now() - cache.donnees.recupereA) / 1000));
}

export function dureeCacheSecondes(): number {
  return Math.round(dureeCacheMs() / 1000);
}

/** Réservé aux tests : vide le cache module pour repartir d'un état propre. */
export function _reinitialiserCachePourTests(): void {
  cache = null;
  recuperationEnCours = null;
}
