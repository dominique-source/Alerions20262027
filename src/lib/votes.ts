import { ecrireJSON, lireJSON } from "./store";

const CLE = "al-votes-mur";

function tous(): Record<string, "a" | "b"> {
  return lireJSON(CLE, {} as Record<string, "a" | "b">);
}

/** Le choix déjà enregistré pour ce sondage sur cet appareil, s'il existe. */
export function monVote(sondageId: string): "a" | "b" | null {
  return tous()[sondageId] ?? null;
}

/**
 * Enregistre un vote. Un seul vote par sondage et par appareil : aucun
 * compteur agrégé n'est affiché (aucun backend partagé ne permet de le
 * calculer honnêtement) — seule la confirmation du choix personnel l'est.
 */
export function voter(sondageId: string, choix: "a" | "b"): void {
  if (monVote(sondageId)) return;
  const tout = tous();
  tout[sondageId] = choix;
  ecrireJSON(CLE, tout);
}
