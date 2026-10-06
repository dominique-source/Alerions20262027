import { ecrireJSON, lireJSON } from "./store";

const CLE = "al-decouvertes";

function toutes(): Record<string, boolean> {
  return lireJSON(CLE, {} as Record<string, boolean>);
}

export function aDecouvert(id: string): boolean {
  return Boolean(toutes()[id]);
}

export function marquerDecouverte(id: string): void {
  const tout = toutes();
  if (tout[id]) return;
  tout[id] = true;
  ecrireJSON(CLE, tout);
}
