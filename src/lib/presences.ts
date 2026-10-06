import { ecrireJSON, lireJSON } from "./store";

const CLE = "al-presences-confirmees";

function toutes(): Record<string, string> {
  return lireJSON(CLE, {} as Record<string, string>);
}

export function presenceConfirmee(evenementId: string): boolean {
  return Boolean(toutes()[evenementId]);
}

/** Confirme la présence une seule fois par appareil pour cet événement (anti-doublon local). */
export function confirmerPresence(evenementId: string): void {
  const tout = toutes();
  if (tout[evenementId]) return;
  tout[evenementId] = new Date().toISOString();
  ecrireJSON(CLE, tout);
}
