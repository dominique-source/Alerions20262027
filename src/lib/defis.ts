import { cleAppareil, ecrireJSON, lireJSON } from "./store";

interface Declaration {
  date: string; // ISO AAAA-MM-JJ
  valideParCoach: boolean;
}

const CLE_DECLARATIONS = "al-defis-declarations";
const CLE_COACH = "al-coach-deverrouille";

function toutesDeclarations(): Record<string, Declaration[]> {
  return lireJSON(CLE_DECLARATIONS, {} as Record<string, Declaration[]>);
}

/** Lundi de la semaine courante, en ISO — sert à borner « cette semaine ». */
export function debutSemaineIso(reference: Date = new Date()): string {
  const jour = (reference.getDay() + 6) % 7; // 0 = lundi
  const lundi = new Date(reference);
  lundi.setHours(0, 0, 0, 0);
  lundi.setDate(reference.getDate() - jour);
  return lundi.toISOString().slice(0, 10);
}

function declarationsCetteSemaine(defiId: string): Declaration[] {
  const debut = debutSemaineIso();
  return (toutesDeclarations()[defiId] ?? []).filter((d) => d.date >= debut);
}

/** Nombre de séances déclarées cette semaine pour ce défi, sur cet appareil. */
export function seancesDeclarees(defiId: string): number {
  return declarationsCetteSemaine(defiId).length;
}

/** Déclare la séance du jour (une seule déclaration par jour calendaire). */
export function declarerSeance(defiId: string): void {
  const aujourdhui = new Date().toISOString().slice(0, 10);
  const tout = toutesDeclarations();
  const liste = tout[defiId] ?? [];
  if (liste.some((d) => d.date === aujourdhui)) return;
  tout[defiId] = [...liste, { date: aujourdhui, valideParCoach: false }];
  ecrireJSON(CLE_DECLARATIONS, tout);
}

export function seancesValideesParCoach(defiId: string): number {
  return declarationsCetteSemaine(defiId).filter((d) => d.valideParCoach).length;
}

export function validerToutesLesSeancesDuCoach(defiId: string): void {
  const tout = toutesDeclarations();
  const debut = debutSemaineIso();
  tout[defiId] = (tout[defiId] ?? []).map((d) => (d.date >= debut ? { ...d, valideParCoach: true } : d));
  ecrireJSON(CLE_DECLARATIONS, tout);
}

/** Identifiant local — exposé pour les règles d'attribution de cartes. */
export function identifiantLocal(): string {
  return cleAppareil();
}

// --- Accès coach : vérifié côté serveur (api/coach-code.ts), jamais de code en clair ici ---
export function coachDeverrouille(): boolean {
  try {
    return sessionStorage.getItem(CLE_COACH) === "1";
  } catch {
    return false;
  }
}

export async function deverrouillerCoach(code: string): Promise<"ok" | "code_invalide" | "service_non_configure" | "erreur"> {
  try {
    const reponse = await fetch("/api/coach-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    const corps = (await reponse.json()) as { ok: boolean; code?: string };
    if (corps.ok) {
      try {
        sessionStorage.setItem(CLE_COACH, "1");
      } catch {
        /* ignore */
      }
      return "ok";
    }
    return corps.code === "service_non_configure" ? "service_non_configure" : "code_invalide";
  } catch {
    return "erreur";
  }
}
