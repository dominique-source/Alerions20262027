import { verifierJetonEtCompte } from "../_lib/verifierCompte.js";
import { obtenirFirestoreAdmin, ErreurFirebaseAdmin } from "../_lib/firebaseAdmin.js";
import type { MeCodeErreur } from "../_lib/authTypes.js";

/**
 * GET /api/admin/comptes
 *
 * Vue de lecture seule « Gestion des accès » du dashboard admin — liste
 * les comptes et rattachements réels (Firestore), jamais une donnée
 * inventée. Réservé aux comptes dont isAdmin === true, vérifié ici même
 * si le navigateur prétend l'être (voir verifierJetonEtCompte).
 *
 * Aucune modification n'est possible depuis cet endpoint : la gestion
 * des permissions (isAdmin, memberships) reste hors de cette étape, comme
 * le précise le prompt (section 10).
 *
 * Ne renvoie jamais de courriel : le document accounts/{uid} n'en stocke
 * pas (seul Firebase Auth connaît l'adresse), et uid lui-même n'est pas
 * une donnée personnelle sensible au sens de ce dépôt (déjà exposé par
 * /api/me pour le compte courant).
 */

export interface CompteAdminItem {
  uid: string;
  displayName: string;
  personId: string;
  isAdmin: boolean;
  enabled: boolean;
}

export interface RattachementAdminItem {
  id: string;
  userId: string;
  teamId: string;
  role: "joueur" | "entraineur";
  enabled: boolean;
}

export interface ComptesAdminReponse {
  comptes: CompteAdminItem[];
  rattachements: RattachementAdminItem[];
}

interface RequeteMinimale {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

function envoyerErreur(res: ReponseMinimale, statut: number, code: MeCodeErreur): void {
  res.status(statut).json({ ok: false, code });
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    envoyerErreur(res, 405, "methode_non_autorisee");
    return;
  }

  res.setHeader("Cache-Control", "private, no-store");

  const resultat = await verifierJetonEtCompte(req.headers.authorization);
  if (!resultat.ok) {
    envoyerErreur(res, resultat.statut, resultat.code);
    return;
  }

  if (!resultat.valeur.compte.isAdmin) {
    envoyerErreur(res, 403, "compte_non_autorise");
    return;
  }

  try {
    const db = obtenirFirestoreAdmin();

    const [snapComptes, snapRattachements] = await Promise.all([
      db.collection("accounts").get(),
      db.collection("memberships").get(),
    ]);

    const comptes: CompteAdminItem[] = snapComptes.docs.map((doc) => {
      const data = doc.data() as Record<string, unknown>;
      return {
        uid: doc.id,
        displayName: typeof data.displayName === "string" ? data.displayName : "",
        personId: typeof data.personId === "string" ? data.personId : "",
        isAdmin: data.isAdmin === true,
        enabled: data.enabled === true,
      };
    });

    const rattachements: RattachementAdminItem[] = snapRattachements.docs
      .map((doc) => {
        const data = doc.data() as Record<string, unknown>;
        return {
          id: doc.id,
          userId: typeof data.userId === "string" ? data.userId : "",
          teamId: typeof data.teamId === "string" ? data.teamId : "",
          role: data.role === "entraineur" ? ("entraineur" as const) : ("joueur" as const),
          enabled: data.enabled === true,
        };
      })
      .filter((r) => r.userId && r.teamId);

    const reponse: ComptesAdminReponse = { comptes, rattachements };
    res.status(200).json(reponse);
  } catch (erreur) {
    if (erreur instanceof ErreurFirebaseAdmin) {
      console.error(`[api/admin/comptes] ${erreur.code} : ${erreur.message}`);
      envoyerErreur(res, 503, "service_non_configure");
      return;
    }
    console.error("[api/admin/comptes] erreur_inattendue :", erreur);
    envoyerErreur(res, 500, "erreur_inattendue");
  }
}
