import { obtenirAuthAdmin, obtenirFirestoreAdmin, ErreurFirebaseAdmin } from "./firebaseAdmin.js";
import type { CompteDocument, MeCodeErreur, RattachementDocument } from "./authTypes.js";

/**
 * Vérification serveur centrale — utilisée par api/me.ts ET par chaque
 * endpoint de chat (api/chat/send.ts, api/chat/delete.ts). Un seul
 * endroit qui décide « ce jeton correspond-il à un compte autorisé ? »,
 * pour ne jamais dupliquer (et désynchroniser) cette logique.
 *
 * Ne fait confiance à aucune donnée envoyée par le navigateur autre que
 * le jeton Firebase lui-même : le uid, l'isAdmin et les rattachements
 * viennent uniquement de ce que ce module lit dans Firestore via le SDK
 * Admin, après vérification du jeton.
 */

export interface CompteVerifie {
  uid: string;
  compte: CompteDocument;
  /** TOUS les rattachements (actifs et inactifs) — utile pour synchroniser chatAccess (voir chatAccess.ts). */
  tousRattachements: Array<RattachementDocument & { id: string }>;
  /** Seulement les rattachements actifs — ce que api/me.ts expose au client. */
  rattachementsActifs: Array<RattachementDocument & { id: string }>;
}

export type ResultatVerification = { ok: true; valeur: CompteVerifie } | { ok: false; statut: number; code: MeCodeErreur };

function extraireJeton(entete: string | string[] | undefined): string | null {
  const valeur = Array.isArray(entete) ? entete[0] : entete;
  if (!valeur || !valeur.startsWith("Bearer ")) return null;
  const jeton = valeur.slice("Bearer ".length).trim();
  return jeton || null;
}

export async function verifierJetonEtCompte(
  entetesAutorisation: string | string[] | undefined,
): Promise<ResultatVerification> {
  const jeton = extraireJeton(entetesAutorisation);
  if (!jeton) {
    return { ok: false, statut: 401, code: "jeton_manquant" };
  }

  let auth: ReturnType<typeof obtenirAuthAdmin>;
  let db: ReturnType<typeof obtenirFirestoreAdmin>;
  try {
    auth = obtenirAuthAdmin();
    db = obtenirFirestoreAdmin();
  } catch (erreur) {
    if (erreur instanceof ErreurFirebaseAdmin) {
      console.error(`[verifierCompte] ${erreur.code} : ${erreur.message}`);
    } else {
      console.error("[verifierCompte] erreur_inattendue (init) :", erreur);
    }
    return { ok: false, statut: 503, code: "service_non_configure" };
  }

  let decode: Awaited<ReturnType<typeof auth.verifyIdToken>>;
  try {
    decode = await auth.verifyIdToken(jeton, true);
  } catch (erreur) {
    const code = (erreur as { code?: string } | undefined)?.code ?? "";
    if (code === "auth/id-token-revoked") {
      return { ok: false, statut: 401, code: "jeton_revoque" };
    }
    return { ok: false, statut: 401, code: "jeton_invalide" };
  }

  if (!decode.email_verified) {
    return { ok: false, statut: 403, code: "courriel_non_verifie" };
  }

  const uid = decode.uid;

  try {
    const docCompte = await db.collection("accounts").doc(uid).get();
    if (!docCompte.exists) {
      return { ok: false, statut: 403, code: "compte_non_autorise" };
    }

    const compteBrut = docCompte.data() as Partial<CompteDocument>;
    if (compteBrut.enabled !== true) {
      return { ok: false, statut: 403, code: "compte_non_autorise" };
    }

    const compte: CompteDocument = {
      displayName: typeof compteBrut.displayName === "string" ? compteBrut.displayName : "",
      personId: typeof compteBrut.personId === "string" ? compteBrut.personId : "",
      isAdmin: compteBrut.isAdmin === true,
      enabled: true,
    };

    const snapshot = await db.collection("memberships").where("userId", "==", uid).get();
    const tousRattachements = snapshot.docs
      .map((doc) => ({ id: doc.id, ...(doc.data() as Partial<RattachementDocument>) }))
      .filter(
        (r): r is RattachementDocument & { id: string } =>
          (r.role === "joueur" || r.role === "entraineur") && typeof r.teamId === "string" && r.teamId.length > 0,
      );

    const rattachementsActifs = tousRattachements.filter((r) => r.enabled === true);

    return { ok: true, valeur: { uid, compte, tousRattachements, rattachementsActifs } };
  } catch (erreur) {
    console.error("[verifierCompte] erreur_inattendue (lecture Firestore) :", erreur);
    return { ok: false, statut: 500, code: "erreur_inattendue" };
  }
}
