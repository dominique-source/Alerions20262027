/**
 * Validation pure du texte d'un message de chat et de son identifiant de
 * tentative (clientMessageId) — testable sans Firestore ni Firebase Auth.
 */

const LONGUEUR_MAX_TEXTE = 2000;
const LONGUEUR_MAX_ID = 100;
const FORMAT_ID_VALIDE = /^[a-zA-Z0-9_-]+$/;

export type ResultatValidationTexte = { ok: true; texte: string } | { ok: false; code: "texte_vide" | "texte_trop_long" };

/** Texte seul, jamais interprété comme HTML — nettoyé des espaces superflus en tête/fin uniquement. */
export function validerTexteMessage(brut: unknown): ResultatValidationTexte {
  if (typeof brut !== "string") return { ok: false, code: "texte_vide" };
  const texte = brut.trim();
  if (texte.length === 0) return { ok: false, code: "texte_vide" };
  if (texte.length > LONGUEUR_MAX_TEXTE) return { ok: false, code: "texte_trop_long" };
  return { ok: true, texte };
}

/**
 * clientMessageId devient un segment de chemin Firestore directement
 * (teamChats/{teamId}/messages/{clientMessageId}) : caractères restreints
 * pour exclure tout ce qui casserait ou détournerait ce chemin (ex. "/").
 */
export function validerIdTentative(brut: unknown): brut is string {
  return typeof brut === "string" && brut.length > 0 && brut.length <= LONGUEUR_MAX_ID && FORMAT_ID_VALIDE.test(brut);
}

export function validerTeamId(brut: unknown): brut is string {
  return typeof brut === "string" && brut.length > 0 && brut.length <= 200 && !brut.includes("/");
}
