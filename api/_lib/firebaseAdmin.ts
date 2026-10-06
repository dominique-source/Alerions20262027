/**
 * Initialisation Firebase Admin SDK — strictement côté serveur.
 *
 * Lit `FIREBASE_SERVICE_ACCOUNT_JSON` (le JSON complet du compte de
 * service) une seule fois, construit l'app Admin, et expose des accès
 * mémoïsés à Auth et Firestore. Ce module ne doit jamais être importé
 * depuis `src/` (bundle navigateur) — seuls les fichiers sous `api/`
 * l'utilisent. Le SDK Admin contourne les règles Firestore : chaque
 * endpoint qui s'en sert doit donc vérifier lui-même les permissions
 * (voir api/me.ts) plutôt que de compter sur firestore.rules.
 */
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";
import { getFirestore } from "firebase-admin/firestore";

export class ErreurFirebaseAdmin extends Error {
  constructor(
    public readonly code: "config",
    message: string,
  ) {
    super(message);
    this.name = "ErreurFirebaseAdmin";
  }
}

interface CompteServiceMinimal {
  project_id: string;
  client_email: string;
  private_key: string;
}

/** Même leçon que GOOGLE_PRIVATE_KEY (api/_lib/sheets.ts) : accepte les deux formats de retour à la ligne. */
function normaliserClePrivee(cleBrute: string): string {
  return cleBrute.includes("\\n") ? cleBrute.replace(/\\n/g, "\n") : cleBrute;
}

function lireCompteService(): CompteServiceMinimal {
  const brut = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!brut || !brut.trim()) {
    throw new ErreurFirebaseAdmin("config", "FIREBASE_SERVICE_ACCOUNT_JSON est absente.");
  }

  let data: Partial<CompteServiceMinimal>;
  try {
    data = JSON.parse(brut) as Partial<CompteServiceMinimal>;
  } catch {
    throw new ErreurFirebaseAdmin("config", "FIREBASE_SERVICE_ACCOUNT_JSON n'est pas un JSON valide.");
  }

  if (!data.project_id || !data.client_email || !data.private_key) {
    throw new ErreurFirebaseAdmin(
      "config",
      "FIREBASE_SERVICE_ACCOUNT_JSON est incomplet (project_id, client_email ou private_key manquant).",
    );
  }

  return {
    project_id: data.project_id,
    client_email: data.client_email,
    private_key: normaliserClePrivee(data.private_key),
  };
}

let compteServiceMemoise: CompteServiceMinimal | null = null;
let appMemoisee: App | null = null;

function obtenirCompteService(): CompteServiceMinimal {
  if (!compteServiceMemoise) {
    compteServiceMemoise = lireCompteService();
  }
  return compteServiceMemoise;
}

function obtenirApp(): App {
  if (appMemoisee) return appMemoisee;

  const compte = obtenirCompteService();
  const appsExistantes = getApps();
  appMemoisee =
    appsExistantes.length > 0
      ? appsExistantes[0]!
      : initializeApp({
          credential: cert({
            projectId: compte.project_id,
            clientEmail: compte.client_email,
            privateKey: compte.private_key,
          }),
        });
  return appMemoisee;
}

export function obtenirAuthAdmin() {
  return getAuth(obtenirApp());
}

export function obtenirFirestoreAdmin() {
  return getFirestore(obtenirApp());
}

/** ID du projet Firebase côté serveur — pour comparer avec FIREBASE_WEB_CONFIG (voir api/firebase-config.ts). */
export function obtenirProjectIdAdmin(): string {
  return obtenirCompteService().project_id;
}

/** Réservé aux tests : force une relecture de la configuration au prochain appel. */
export function _reinitialiserAdminPourTests(): void {
  compteServiceMemoise = null;
  appMemoisee = null;
}
