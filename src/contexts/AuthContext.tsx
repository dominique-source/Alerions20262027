import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  onIdTokenChanged,
  sendPasswordResetEmail,
  sendEmailVerification,
  signInWithEmailAndPassword,
  signOut,
  type User,
} from "firebase/auth";
import { obtenirAuthClient } from "../lib/firebaseClient";
import type { CompteReponse, MeCodeErreur } from "../types";

/**
 * État d'authentification central. Le statut dérivé d'ici pilote
 * l'affichage (connexion requise, courriel à vérifier, etc.), mais ne
 * constitue jamais une permission en lui-même — chaque endpoint privé
 * revérifie côté serveur (voir api/me.ts). `compte` est exactement la
 * réponse de GET /api/me, jamais enrichie côté client.
 */
export type StatutAuth =
  | "initialisation"
  | "deconnecte"
  | "verification_courriel_requise"
  | "chargement_compte"
  | "connecte"
  | "refuse"
  | "erreur";

export type CodeErreurAuth = MeCodeErreur | "reseau" | "identifiants_invalides";

interface AuthContextValue {
  statut: StatutAuth;
  utilisateur: User | null;
  compte: CompteReponse | null;
  codeErreur: CodeErreurAuth | null;
  connexion: (courriel: string, motDePasse: string) => Promise<void>;
  deconnexion: () => Promise<void>;
  envoyerCourrielReinitialisation: (courriel: string) => Promise<void>;
  renvoyerCourrielVerification: () => Promise<void>;
  actualiserStatutCourriel: () => Promise<void>;
  rafraichirCompte: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

async function chargerCompte(utilisateur: User, forcerNouveauJeton = false): Promise<
  { ok: true; compte: CompteReponse } | { ok: false; code: CodeErreurAuth }
> {
  let jeton: string;
  try {
    jeton = await utilisateur.getIdToken(forcerNouveauJeton);
  } catch {
    return { ok: false, code: "reseau" };
  }

  let reponse: Response;
  try {
    reponse = await fetch("/api/me", {
      headers: { Authorization: `Bearer ${jeton}` },
    });
  } catch {
    return { ok: false, code: "reseau" };
  }

  if (reponse.ok) {
    const compte = (await reponse.json()) as CompteReponse;
    return { ok: true, compte };
  }

  const corps = (await reponse.json().catch(() => null)) as { code?: MeCodeErreur } | null;
  return { ok: false, code: corps?.code ?? "erreur_inattendue" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [statut, setStatut] = useState<StatutAuth>("initialisation");
  const [utilisateur, setUtilisateur] = useState<User | null>(null);
  const [compte, setCompte] = useState<CompteReponse | null>(null);
  const [codeErreur, setCodeErreur] = useState<CodeErreurAuth | null>(null);
  const demonteRef = useRef(false);
  const statutRef = useRef<StatutAuth>("initialisation");
  useEffect(() => {
    statutRef.current = statut;
  }, [statut]);

  const resoudrePourUtilisateur = useCallback(async (u: User, forcerNouveauJeton = false) => {
    if (!u.emailVerified) {
      if (demonteRef.current) return;
      setStatut("verification_courriel_requise");
      setCompte(null);
      setCodeErreur(null);
      return;
    }

    // Audit : écouter onIdTokenChanged (plutôt que onAuthStateChanged, voir
    // plus bas) revalide le compte à chaque renouvellement de jeton, pas
    // seulement à la connexion — ce qui resynchronise régulièrement le
    // miroir chatAccess (firestore.rules borne sa fraîcheur à 2h). Mais un
    // compte déjà connecté ne doit pas voir l'interface clignoter en
    // "chargement_compte" à chaque renouvellement silencieux (~chaque
    // heure) : on ne bascule cet état visible que pour un tout premier
    // chargement (ou après une déconnexion/erreur).
    if (statutRef.current !== "connecte") {
      setStatut("chargement_compte");
    }
    const resultat = await chargerCompte(u, forcerNouveauJeton);
    if (demonteRef.current) return;

    if (resultat.ok) {
      setCompte(resultat.compte);
      setCodeErreur(null);
      setStatut("connecte");
      return;
    }

    if (resultat.code === "jeton_revoque" || resultat.code === "jeton_invalide") {
      const auth = await obtenirAuthClient();
      await signOut(auth);
      return; // onIdTokenChanged gérera la suite (statut "deconnecte")
    }

    if (resultat.code === "courriel_non_verifie") {
      setStatut("verification_courriel_requise");
      setCompte(null);
      setCodeErreur(null);
      return;
    }

    if (resultat.code === "compte_non_autorise") {
      setStatut("refuse");
      setCompte(null);
      setCodeErreur(null);
      return;
    }

    setStatut("erreur");
    setCompte(null);
    setCodeErreur(resultat.code);
  }, []);

  useEffect(() => {
    demonteRef.current = false;
    let detacher: (() => void) | undefined;

    obtenirAuthClient()
      .then((auth) => {
        if (demonteRef.current) return;
        detacher = onIdTokenChanged(auth, (u) => {
          setUtilisateur(u);
          if (!u) {
            setStatut("deconnecte");
            setCompte(null);
            setCodeErreur(null);
            return;
          }
          void resoudrePourUtilisateur(u);
        });
      })
      .catch(() => {
        if (demonteRef.current) return;
        setStatut("erreur");
        setCodeErreur("service_non_configure");
      });

    return () => {
      demonteRef.current = true;
      detacher?.();
    };
  }, [resoudrePourUtilisateur]);

  const connexion = useCallback(async (courriel: string, motDePasse: string) => {
    const auth = await obtenirAuthClient();
    try {
      await signInWithEmailAndPassword(auth, courriel, motDePasse);
      // onIdTokenChanged prend le relais (statut mis à jour via l'effet ci-dessus).
    } catch {
      // Message volontairement générique : ne jamais confirmer si le
      // courriel existe ou si c'est le mot de passe qui est erroné.
      setCodeErreur("identifiants_invalides");
      throw new Error("identifiants_invalides");
    }
  }, []);

  const deconnexion = useCallback(async () => {
    const auth = await obtenirAuthClient();
    await signOut(auth);
  }, []);

  const envoyerCourrielReinitialisation = useCallback(async (courriel: string) => {
    const auth = await obtenirAuthClient();
    try {
      await sendPasswordResetEmail(auth, courriel);
    } catch {
      // Même réponse, succès ou échec (compte inexistant inclus) : ne
      // révèle jamais l'existence d'un compte par ce canal.
    }
  }, []);

  const renvoyerCourrielVerification = useCallback(async () => {
    const auth = await obtenirAuthClient();
    if (!auth.currentUser) return;
    await sendEmailVerification(auth.currentUser);
  }, []);

  const actualiserStatutCourriel = useCallback(async () => {
    const auth = await obtenirAuthClient();
    const u = auth.currentUser;
    if (!u) return;
    await u.reload();
    // Le jeton existant porte encore l'ancienne revendication
    // email_verified=false tant qu'on ne force pas son renouvellement.
    await resoudrePourUtilisateur(u, true);
  }, [resoudrePourUtilisateur]);

  const rafraichirCompte = useCallback(async () => {
    const auth = await obtenirAuthClient();
    const u = auth.currentUser;
    if (!u) return;
    await resoudrePourUtilisateur(u);
  }, [resoudrePourUtilisateur]);

  const valeur = useMemo<AuthContextValue>(
    () => ({
      statut,
      utilisateur,
      compte,
      codeErreur,
      connexion,
      deconnexion,
      envoyerCourrielReinitialisation,
      renvoyerCourrielVerification,
      actualiserStatutCourriel,
      rafraichirCompte,
    }),
    [
      statut,
      utilisateur,
      compte,
      codeErreur,
      connexion,
      deconnexion,
      envoyerCourrielReinitialisation,
      renvoyerCourrielVerification,
      actualiserStatutCourriel,
      rafraichirCompte,
    ],
  );

  return <AuthContext.Provider value={valeur}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé sous AuthProvider");
  return ctx;
}
