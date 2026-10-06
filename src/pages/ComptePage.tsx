import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { espacesAutorises, type EspaceAutorise } from "../lib/permissions";
import "./ComptePage.css";

const LIBELLES_ESPACE: Record<EspaceAutorise, { titre: string; description: string; chemin: string }> = {
  joueur: { titre: "Espace joueur", description: "Ton équipe, ta carte, le chat.", chemin: "/espace/joueur" },
  entraineur: {
    titre: "Espace entraîneur",
    description: "Effectif, calendrier d'équipe, chat.",
    chemin: "/espace/entraineur",
  },
  administration: {
    titre: "Administration",
    description: "Vue d'ensemble, comptes, connexions.",
    chemin: "/espace/admin",
  },
};

/**
 * Hub de compte — point d'entrée unique après connexion. Gère lui-même
 * tous les statuts (y compris la vérification de courriel), plutôt que
 * d'être protégé par RequireAuth, puisque RequireAuth redirige
 * précisément VERS cette page pour le cas « courriel non vérifié ».
 */
export default function ComptePage() {
  const { statut, compte, codeErreur, renvoyerCourrielVerification, actualiserStatutCourriel, deconnexion } = useAuth();
  const [envoiEnCours, setEnvoiEnCours] = useState(false);
  const [envoye, setEnvoye] = useState(false);
  const [actualisationEnCours, setActualisationEnCours] = useState(false);

  if (statut === "initialisation" || statut === "chargement_compte") {
    return (
      <div className="al-compte al-compte--etat" role="status">
        Chargement…
      </div>
    );
  }

  if (statut === "deconnecte") {
    return <Navigate to="/connexion" replace />;
  }

  if (statut === "verification_courriel_requise") {
    return (
      <div className="al-compte">
        <div className="al-compte__carte">
          <span className="al-v2-eyebrow">Compte</span>
          <h1 className="al-v2-title al-compte__titre">Confirmez votre courriel</h1>
          <p>
            Un courriel de vérification a été envoyé à votre adresse lors de la création du compte. Les fonctions
            privées (chat, effectif, administration) restent bloquées tant que votre courriel n'est pas confirmé.
          </p>

          <div className="al-compte__actions">
            <button
              type="button"
              className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm"
              disabled={envoiEnCours}
              onClick={async () => {
                setEnvoiEnCours(true);
                await renvoyerCourrielVerification();
                setEnvoiEnCours(false);
                setEnvoye(true);
              }}
            >
              {envoiEnCours ? "Envoi…" : "Renvoyer le courriel de vérification"}
            </button>
            <button
              type="button"
              className="al-btn-v2 al-btn-v2--red al-btn-v2--sm"
              disabled={actualisationEnCours}
              onClick={async () => {
                setActualisationEnCours(true);
                await actualiserStatutCourriel();
                setActualisationEnCours(false);
              }}
            >
              {actualisationEnCours ? "Vérification…" : "J'ai confirmé — actualiser"}
            </button>
          </div>

          {envoye && <p className="al-compte__confirmation">Courriel envoyé — vérifiez votre boîte de réception.</p>}

          <button type="button" className="al-compte__deconnexion" onClick={() => void deconnexion()}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (statut === "refuse") {
    return (
      <div className="al-compte">
        <div className="al-compte__carte" role="alert">
          <h1 className="al-v2-title al-compte__titre">Accès non autorisé</h1>
          <p>Ce compte n'a pas (ou plus) d'autorisation privée active. Contactez l'administration des Alérions.</p>
          <button type="button" className="al-compte__deconnexion" onClick={() => void deconnexion()}>
            Se déconnecter
          </button>
        </div>
      </div>
    );
  }

  if (statut === "erreur") {
    return (
      <div className="al-compte">
        <div className="al-compte__carte" role="alert">
          <h1 className="al-v2-title al-compte__titre">Service indisponible</h1>
          <p>
            {codeErreur === "service_non_configure"
              ? "La connexion aux comptes n'est pas encore configurée."
              : "Une erreur réseau est survenue."}
          </p>
          <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // statut === "connecte"
  if (!compte) return null;
  const espaces = espacesAutorises(compte);

  return (
    <div className="al-compte">
      <div className="al-compte__carte al-compte__carte--large">
        <span className="al-v2-eyebrow">Compte</span>
        <h1 className="al-v2-title al-compte__titre">{compte.displayName || "Membre Alérions"}</h1>
        {compte.personId && <p className="al-compte__personid">{compte.personId}</p>}

        {espaces.length === 0 ? (
          <p>Aucun espace privé n'est encore rattaché à ce compte.</p>
        ) : (
          <div className="al-compte__espaces">
            {espaces.map((espace) => {
              const info = LIBELLES_ESPACE[espace];
              return (
                <Link key={espace} to={info.chemin} className="al-compte__espace-carte">
                  <span className="al-compte__espace-titre">{info.titre}</span>
                  <span className="al-compte__espace-desc">{info.description}</span>
                  <span className="al-compte__espace-fleche" aria-hidden="true">
                    →
                  </span>
                </Link>
              );
            })}
          </div>
        )}

        <div className="al-compte__bas">
          <Link to="/" className="al-compte__lien-site">
            ← Retour au site public
          </Link>
          <button type="button" className="al-compte__deconnexion" onClick={() => void deconnexion()}>
            Se déconnecter
          </button>
        </div>
      </div>
    </div>
  );
}
