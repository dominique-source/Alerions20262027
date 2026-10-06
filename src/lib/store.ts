/**
 * Petites aides de persistance locale (localStorage).
 *
 * Ce site est statique (Vite, aucune base de données, un seul point de
 * terminaison serveur pour l'envoi de courriels — voir api/boite-a-idees.ts)
 * : les présences, votes et déclarations de défi ci-dessous sont donc
 * enregistrés par appareil, pas dans un registre partagé entre joueurs.
 * C'est une limite réelle du site tel qu'il existe aujourd'hui, pas une
 * donnée simulée présentée comme vraie — jamais de faux compteur agrégé
 * n'est affiché à partir de ces valeurs.
 */

const CLE_APPAREIL = "al-cle-appareil";

/** Identifiant stable pour cet appareil/navigateur — sert à éviter les doublons locaux. */
export function cleAppareil(): string {
  try {
    let cle = localStorage.getItem(CLE_APPAREIL);
    if (!cle) {
      cle = crypto.randomUUID();
      localStorage.setItem(CLE_APPAREIL, cle);
    }
    return cle;
  } catch {
    return "appareil-inconnu";
  }
}

export function lireJSON<T>(cle: string, defaut: T): T {
  try {
    const brut = localStorage.getItem(cle);
    if (!brut) return defaut;
    return JSON.parse(brut) as T;
  } catch {
    return defaut;
  }
}

export function ecrireJSON<T>(cle: string, valeur: T): void {
  try {
    localStorage.setItem(cle, JSON.stringify(valeur));
  } catch {
    // Stockage indisponible (mode privé, quota) — l'action reste sans effet persistant.
  }
}
