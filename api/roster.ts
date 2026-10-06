import { ErreurGoogleSheets } from "./_lib/sheets.js";
import { ageCacheSecondes, dureeCacheSecondes, obtenirRoster } from "./_lib/cache.js";
import { normaliserTexte } from "./_lib/normaliser.js";
import { profilEstPublic, redigerEquipe, redigerMembre } from "./_lib/publication.js";
import type { MembrePublic, RosterErreur, RosterReponse } from "./_lib/types.js";

/**
 * GET /api/roster?sport=<slug>&equipe=<slug_site>
 * GET /api/roster?idEquipe=<id_equipe>
 *
 * Renvoie l'effectif public (joueurs + entraîneurs) d'UNE équipe, soit
 * par sport+slug (pages publiques, qui connaissent déjà ce couple via
 * l'URL), soit directement par idEquipe (teamId Firestore — ex. les
 * dashboards privés, qui ne connaissent que le teamId d'un rattachement
 * memberships). Le client choisit QUELLE équipe il regarde, jamais le
 * fichier Sheet ni la plage lue côté serveur — ceux-ci restent fixés
 * dans api/_lib/sheets.ts.
 *
 * Champs renvoyés : voir MembrePublic / EquipePublique dans
 * api/_lib/types.ts. Jamais de courriel, auth_user_id, notes, dates de
 * consentement, chemin de stockage privé, ni ligne brute de Sheet.
 */

interface RequeteMinimale {
  method?: string;
  query?: Record<string, string | string[] | undefined>;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

function parametreTexte(valeur: string | string[] | undefined): string {
  if (Array.isArray(valeur)) return valeur[0] ?? "";
  return (valeur ?? "").trim();
}

function envoyerErreur(res: ReponseMinimale, statut: number, code: RosterErreur["code"]): void {
  const corps: RosterErreur = { ok: false, code };
  res.status(statut).json(corps);
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    envoyerErreur(res, 405, "methode_non_autorisee");
    return;
  }

  const sport = normaliserTexte(parametreTexte(req.query?.sport));
  const equipeSlug = normaliserTexte(parametreTexte(req.query?.equipe));
  const idEquipe = normaliserTexte(parametreTexte(req.query?.idEquipe));

  if (!idEquipe && (!sport || !equipeSlug)) {
    envoyerErreur(res, 400, "parametres_manquants");
    return;
  }

  let roster: Awaited<ReturnType<typeof obtenirRoster>>;
  try {
    roster = await obtenirRoster();
  } catch (erreur) {
    if (erreur instanceof ErreurGoogleSheets) {
      // Le message détaillé (jamais la clé privée elle-même — voir
      // api/_lib/sheets.ts, qui ne rapporte que le message d'erreur de
      // google-auth-library / l'API Sheets) va aux journaux serveur
      // Vercel pour diagnostic ; seul le code générique sort dans la
      // réponse publique.
      console.error(`[api/roster] ${erreur.code} : ${erreur.message}`);
      if (erreur.code === "config") {
        envoyerErreur(res, 503, "service_non_configure");
        return;
      }
      if (erreur.code === "auth") {
        envoyerErreur(res, 502, "google_auth_echouee");
        return;
      }
      if (erreur.code === "quota") {
        envoyerErreur(res, 503, "google_quota_depasse");
        return;
      }
      envoyerErreur(res, 503, "google_indisponible");
      return;
    }
    console.error("[api/roster] erreur_inattendue :", erreur);
    envoyerErreur(res, 500, "erreur_inattendue");
    return;
  }

  const ligneEquipe = idEquipe
    ? roster.equipes.find((e) => normaliserTexte(e.idEquipe) === idEquipe)
    : roster.equipes.find((e) => normaliserTexte(e.sport) === sport && normaliserTexte(e.slugSite) === equipeSlug);

  const reponse: RosterReponse = {
    equipe: ligneEquipe ? redigerEquipe(ligneEquipe) : null,
    joueurs: [],
    entraineurs: [],
    meta: {
      fetchedAt: new Date(roster.recupereA).toISOString(),
      cacheAgeSecondes: ageCacheSecondes(),
      prochaineRevalidationSecondes: dureeCacheSecondes(),
    },
  };

  if (ligneEquipe) {
    const membresEquipe = roster.membres.filter(
      (m) => m.idEquipe === ligneEquipe.idEquipe && profilEstPublic(m),
    );
    const publics: MembrePublic[] = membresEquipe.map(redigerMembre);
    reponse.joueurs = publics.filter((m) => m.categorieRole === "joueur");
    reponse.entraineurs = publics.filter((m) => m.categorieRole === "entraineur");
  }

  // Double couche de cache : mémoire serveur (cache.ts) + CDN Vercel.
  // stale-while-revalidate laisse servir une version légèrement périmée
  // pendant qu'une version fraîche est récupérée en arrière-plan, plutôt
  // que de faire attendre chaque visiteur à la seconde près.
  const dureeCdn = dureeCacheSecondes();
  res.setHeader(
    "Cache-Control",
    `public, max-age=0, s-maxage=${dureeCdn}, stale-while-revalidate=${dureeCdn * 2}`,
  );
  res.status(200).json(reponse);
}
