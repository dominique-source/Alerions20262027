import { obtenirProjectIdAdmin } from "./_lib/firebaseAdmin.js";

/**
 * GET /api/firebase-config
 *
 * Expose uniquement les champs PUBLICS de la configuration Web Firebase
 * (ceux que le SDK client embarque normalement dans le bundle — aucun
 * n'est un secret en soi) à partir de la variable serveur
 * `FIREBASE_WEB_CONFIG`. Cette variable n'a volontairement pas le
 * préfixe VITE_, donc Vite ne peut pas l'embarquer au build : le client
 * la récupère ici, au chargement.
 *
 * Ne renvoie JAMAIS le contenu de FIREBASE_SERVICE_ACCOUNT_JSON (clé
 * privée du compte de service) — ce fichier n'importe même pas ce
 * module ailleurs que pour la vérification de cohérence de projet.
 */

const CHAMPS_PUBLICS_AUTORISES = [
  "apiKey",
  "authDomain",
  "projectId",
  "storageBucket",
  "messagingSenderId",
  "appId",
] as const;

type ChampPublic = (typeof CHAMPS_PUBLICS_AUTORISES)[number];
type ConfigWebPublique = Partial<Record<ChampPublic, string>>;

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

interface RequeteMinimale {
  method?: string;
}

function envoyerErreur(res: ReponseMinimale, statut: number, code: string): void {
  res.status(statut).json({ ok: false, code });
}

export default function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    envoyerErreur(res, 405, "methode_non_autorisee");
    return;
  }

  const brut = process.env.FIREBASE_WEB_CONFIG;
  if (!brut || !brut.trim()) {
    envoyerErreur(res, 503, "service_non_configure");
    return;
  }

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(brut) as Record<string, unknown>;
  } catch {
    console.error("[api/firebase-config] FIREBASE_WEB_CONFIG n'est pas un JSON valide.");
    envoyerErreur(res, 503, "service_non_configure");
    return;
  }

  // Ne retient QUE les champs explicitement autorisés — tout le reste
  // du JSON (s'il contenait autre chose par erreur) est ignoré, jamais relayé.
  const config: ConfigWebPublique = {};
  for (const champ of CHAMPS_PUBLICS_AUTORISES) {
    const valeur = data[champ];
    if (typeof valeur === "string" && valeur.trim()) {
      config[champ] = valeur;
    }
  }

  if (!config.apiKey || !config.authDomain || !config.projectId || !config.appId) {
    console.error("[api/firebase-config] FIREBASE_WEB_CONFIG est incomplet (apiKey/authDomain/projectId/appId requis).");
    envoyerErreur(res, 503, "service_non_configure");
    return;
  }

  // Vérifie que la configuration Web pointe vers le même projet que le
  // compte de service — une divergence indiquerait une mauvaise
  // variable collée dans l'un des deux environnements.
  try {
    const projectIdAdmin = obtenirProjectIdAdmin();
    if (projectIdAdmin !== config.projectId) {
      console.error(
        `[api/firebase-config] Projets incohérents : admin="${projectIdAdmin}" web="${config.projectId}".`,
      );
      envoyerErreur(res, 500, "projets_incoherents");
      return;
    }
  } catch (erreur) {
    console.error("[api/firebase-config] Impossible de vérifier la cohérence de projet :", erreur);
    envoyerErreur(res, 503, "service_non_configure");
    return;
  }

  // Configuration publique, stable — un cache CDN généreux est sûr.
  res.setHeader("Cache-Control", "public, max-age=0, s-maxage=3600, stale-while-revalidate=86400");
  res.status(200).json(config);
}
