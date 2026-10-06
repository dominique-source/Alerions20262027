import type { Evenement } from "../types";

/**
 * Couche préparée pour la connexion future à un calendrier Google officiel.
 *
 * Aucune connexion n'est active : `evenements` (src/data/events.ts) reste la
 * seule source de vérité tant qu'aucun flux réel n'est branché. Cette
 * fonction sert de point d'intégration unique pour la suite.
 *
 * Trois façons de brancher un vrai calendrier Google, par ordre de
 * simplicité :
 *
 * 1. Calendrier Google public → export ICS : le lien
 *    « Adresse publique au format iCal » d'un agenda Google partagé
 *    publiquement peut être récupéré côté build (script Node, pas dans le
 *    navigateur) et transformé en `Evenement[]`. Aucune clé requise.
 * 2. API Google Calendar (calendrier privé) : nécessite une clé API ou un
 *    compte de service. La clé ne doit JAMAIS être exposée dans le code
 *    client — elle doit vivre dans une variable d'environnement lue par
 *    une fonction serveur (ex. une fonction Vercel sous /api), qui répond
 *    au site avec du JSON déjà filtré.
 * 3. Flux ICS générique (autre système que Google) : même principe que 1.
 *
 * Variable d'environnement prévue (à définir dans Vercel, jamais dans le
 * dépôt) : `GOOGLE_CALENDAR_ICS_URL` — lue uniquement côté serveur/build.
 */
export async function chargerEvenementsExternes(): Promise<Evenement[]> {
  // Aucune source externe connectée pour le moment.
  return [];
}
