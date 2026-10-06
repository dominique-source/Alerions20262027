/**
 * Client Google Sheets côté serveur — lecture seule, compte de service.
 *
 * Le serveur choisit TOUJOURS le fichier (GOOGLE_SHEET_ID) et les plages
 * (ÉQUIPES!A:Q, MEMBRES!A:AB) en dur ci-dessous. Aucune route n'accepte un
 * identifiant de fichier ou une plage envoyés par le navigateur.
 *
 * Bibliothèque officielle Google (`google-auth-library`) pour la signature
 * JWT du compte de service ; l'appel à l'API Sheets elle-même passe par
 * `fetch` (disponible nativement sur le runtime Node.js de Vercel), pour
 * éviter d'embarquer le paquet `googleapis` complet (toutes les APIs
 * Google) dans une fonction serverless qui n'en utilise qu'une.
 */
import { JWT } from "google-auth-library";

const SCOPE_LECTURE_SEULE = "https://www.googleapis.com/auth/spreadsheets.readonly";
const PLAGE_EQUIPES = "ÉQUIPES!A:Q";
const PLAGE_MEMBRES = "MEMBRES!A:AB";

export interface ConfigurationGoogle {
  sheetId: string;
  serviceAccountEmail: string;
  privateKey: string;
}

export class ErreurGoogleSheets extends Error {
  constructor(
    public readonly code: "config" | "auth" | "quota" | "indisponible",
    message: string,
  ) {
    super(message);
    this.name = "ErreurGoogleSheets";
  }
}

/**
 * GOOGLE_PRIVATE_KEY arrive sous deux formes possibles selon l'endroit où
 * elle est collée : de vrais retours à la ligne, ou la séquence littérale
 * à deux caractères "\n" (très fréquent quand la valeur passe par une UI
 * web de variables d'environnement qui n'accepte qu'une seule ligne).
 * On normalise systématiquement vers de vrais retours à la ligne.
 */
export function normaliserCléPrivée(cléBrute: string): string {
  return cléBrute.includes("\\n") ? cléBrute.replace(/\\n/g, "\n") : cléBrute;
}

export function lireConfigurationGoogle(): ConfigurationGoogle | null {
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const privateKeyBrute = process.env.GOOGLE_PRIVATE_KEY;

  if (!sheetId || !serviceAccountEmail || !privateKeyBrute) {
    return null;
  }

  return {
    sheetId,
    serviceAccountEmail,
    privateKey: normaliserCléPrivée(privateKeyBrute),
  };
}

let clientJwtMemoise: JWT | null = null;

function obtenirClientJwt(config: ConfigurationGoogle): JWT {
  if (!clientJwtMemoise) {
    clientJwtMemoise = new JWT({
      email: config.serviceAccountEmail,
      key: config.privateKey,
      scopes: [SCOPE_LECTURE_SEULE],
    });
  }
  return clientJwtMemoise;
}

async function attendre(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Lit en un seul appel groupé les plages ÉQUIPES et MEMBRES (batchGet),
 * avec reprises à délai croissant limitées aux erreurs de quota (429) et
 * d'indisponibilité temporaire (5xx) — jamais sur une erreur d'authentification
 * ou de configuration, qui ne se résoudra pas en réessayant.
 */
export async function lireFeuillesEquipesEtMembres(
  config: ConfigurationGoogle,
  tentativesMax = 3,
): Promise<{ equipes: unknown[][]; membres: unknown[][] }> {
  const jwt = obtenirClientJwt(config);

  let jetonAcces: string;
  try {
    const identifiants = await jwt.authorize();
    if (!identifiants.access_token) {
      throw new ErreurGoogleSheets("auth", "Le compte de service n'a renvoyé aucun jeton d'accès.");
    }
    jetonAcces = identifiants.access_token;
  } catch (erreur) {
    if (erreur instanceof ErreurGoogleSheets) throw erreur;
    throw new ErreurGoogleSheets(
      "auth",
      `Authentification du compte de service échouée : ${erreur instanceof Error ? erreur.message : "erreur inconnue"}`,
    );
  }

  const url = new URL(
    `https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(config.sheetId)}/values:batchGet`,
  );
  url.searchParams.append("ranges", PLAGE_EQUIPES);
  url.searchParams.append("ranges", PLAGE_MEMBRES);
  url.searchParams.set("valueRenderOption", "UNFORMATTED_VALUE");
  url.searchParams.set("dateTimeRenderOption", "FORMATTED_STRING");

  let derniereErreur: ErreurGoogleSheets | null = null;

  for (let tentative = 1; tentative <= tentativesMax; tentative++) {
    let reponse: Response;
    try {
      reponse = await fetch(url, {
        headers: { Authorization: `Bearer ${jetonAcces}` },
      });
    } catch {
      derniereErreur = new ErreurGoogleSheets("indisponible", "Impossible de joindre l'API Google Sheets.");
      await attendre(300 * 2 ** (tentative - 1));
      continue;
    }

    if (reponse.status === 429) {
      derniereErreur = new ErreurGoogleSheets("quota", "Quota Google Sheets dépassé.");
      await attendre(500 * 2 ** (tentative - 1));
      continue;
    }

    if (reponse.status === 401 || reponse.status === 403) {
      // Partage insuffisant ou identifiants invalides : réessayer ne sert à rien.
      throw new ErreurGoogleSheets(
        "auth",
        `Accès refusé par Google Sheets (${reponse.status}) — vérifier le partage du fichier avec le compte de service.`,
      );
    }

    if (reponse.status >= 500) {
      derniereErreur = new ErreurGoogleSheets("indisponible", `Google Sheets a répondu ${reponse.status}.`);
      await attendre(400 * 2 ** (tentative - 1));
      continue;
    }

    if (!reponse.ok) {
      throw new ErreurGoogleSheets("auth", `Google Sheets a répondu ${reponse.status}.`);
    }

    const corps = (await reponse.json()) as {
      valueRanges?: Array<{ values?: unknown[][] }>;
    };
    const plages = corps.valueRanges ?? [];
    return {
      equipes: plages[0]?.values ?? [],
      membres: plages[1]?.values ?? [],
    };
  }

  throw derniereErreur ?? new ErreurGoogleSheets("indisponible", "Échec de lecture Google Sheets après plusieurs tentatives.");
}
