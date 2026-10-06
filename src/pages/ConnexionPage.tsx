import { useEffect, useState } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./ConnexionPage.css";

interface EtatNavigation {
  depuis?: { pathname?: string };
}

/**
 * Connexion par courriel/mot de passe — comptes existants uniquement
 * (aucune inscription publique ici, voir CLAUDE.md §5). Redirige vers la
 * page privée demandée après connexion, ou /compte par défaut.
 */
export default function ConnexionPage() {
  const { statut, connexion, envoyerCourrielReinitialisation } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const depuis = (location.state as EtatNavigation | null)?.depuis?.pathname ?? "/compte";

  const [courriel, setCourriel] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [enCours, setEnCours] = useState(false);
  const [erreur, setErreur] = useState(false);

  const [modeOublie, setModeOublie] = useState(false);
  const [courrielOublie, setCourrielOublie] = useState("");
  const [oublieEnvoye, setOublieEnvoye] = useState(false);
  const [oublieEnCours, setOublieEnCours] = useState(false);

  useEffect(() => {
    if (statut === "connecte" || statut === "verification_courriel_requise") {
      navigate(depuis, { replace: true });
    }
  }, [statut, depuis, navigate]);

  async function surSoumission(e: React.FormEvent) {
    e.preventDefault();
    setEnCours(true);
    setErreur(false);
    try {
      await connexion(courriel.trim(), motDePasse);
    } catch {
      setErreur(true);
    } finally {
      setEnCours(false);
    }
  }

  async function surSoumissionOublie(e: React.FormEvent) {
    e.preventDefault();
    setOublieEnCours(true);
    await envoyerCourrielReinitialisation(courrielOublie.trim());
    setOublieEnCours(false);
    setOublieEnvoye(true);
  }

  return (
    <div className="al-connexion">
      <div className="al-connexion__carte">
        <Link to="/" className="al-connexion__logo">
          <img src="/images/marque/logo-alerions.png" alt="Alérions" />
        </Link>

        {!modeOublie ? (
          <>
            <h1 className="al-v2-title al-connexion__titre">Connexion</h1>
            <p className="al-connexion__sous-titre">Espace joueurs, entraîneurs et administration</p>

            <form className="al-connexion__formulaire" onSubmit={surSoumission}>
              <label className="al-connexion__champ">
                <span>Courriel</span>
                <input
                  type="email"
                  autoComplete="email"
                  required
                  value={courriel}
                  onChange={(e) => setCourriel(e.target.value)}
                />
              </label>
              <label className="al-connexion__champ">
                <span>Mot de passe</span>
                <input
                  type="password"
                  autoComplete="current-password"
                  required
                  value={motDePasse}
                  onChange={(e) => setMotDePasse(e.target.value)}
                />
              </label>

              {erreur && (
                <p className="al-connexion__erreur" role="alert">
                  Courriel ou mot de passe incorrect.
                </p>
              )}

              <button type="submit" className="al-btn-v2 al-btn-v2--red" disabled={enCours}>
                {enCours ? "Connexion…" : "Se connecter"}
              </button>

              <button type="button" className="al-connexion__lien" onClick={() => setModeOublie(true)}>
                Mot de passe oublié ?
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="al-v2-title al-connexion__titre">Mot de passe oublié</h1>
            <p className="al-connexion__sous-titre">
              Entrez votre courriel. Si un compte y est associé, un lien de réinitialisation sera envoyé.
            </p>

            {oublieEnvoye ? (
              <div className="al-connexion__confirmation" role="status">
                <p>
                  Si un compte existe pour cette adresse, un courriel de réinitialisation vient d'être envoyé.
                  Vérifiez votre boîte de réception (et les indésirables).
                </p>
                <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" onClick={() => setModeOublie(false)}>
                  Retour à la connexion
                </button>
              </div>
            ) : (
              <form className="al-connexion__formulaire" onSubmit={surSoumissionOublie}>
                <label className="al-connexion__champ">
                  <span>Courriel</span>
                  <input
                    type="email"
                    autoComplete="email"
                    required
                    value={courrielOublie}
                    onChange={(e) => setCourrielOublie(e.target.value)}
                  />
                </label>
                <button type="submit" className="al-btn-v2 al-btn-v2--red" disabled={oublieEnCours}>
                  {oublieEnCours ? "Envoi…" : "Envoyer le lien"}
                </button>
                <button type="button" className="al-connexion__lien" onClick={() => setModeOublie(false)}>
                  Retour à la connexion
                </button>
              </form>
            )}
          </>
        )}

        <Link to="/" className="al-connexion__retour-site">
          ← Retour au site public
        </Link>
      </div>
    </div>
  );
}
