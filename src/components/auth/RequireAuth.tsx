import type { ReactNode } from "react";
import { Link, Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { espacesAutorises, type EspaceAutorise } from "../../lib/permissions";
import "./RequireAuth.css";

interface RequireAuthProps {
  children: ReactNode;
  /** Si fourni, exige en plus que ce statut ait accès à cet espace précis (revérifié ici côté client pour l'affichage — api/me.ts reste la seule source de vérité). */
  espaceRequis?: EspaceAutorise;
}

const LIBELLES_ESPACE: Record<EspaceAutorise, string> = {
  joueur: "Espace joueur",
  entraineur: "Espace entraîneur",
  administration: "Administration",
};

/** Garde de route : n'affiche les enfants que pour un compte connecté, vérifié et autorisé. */
export default function RequireAuth({ children, espaceRequis }: RequireAuthProps) {
  const { statut, compte, codeErreur } = useAuth();
  const location = useLocation();

  if (statut === "initialisation" || statut === "chargement_compte") {
    return (
      <div className="al-auth-etat" role="status">
        <div className="al-auth-etat__spinner" aria-hidden="true" />
        <p>Vérification de votre accès…</p>
      </div>
    );
  }

  if (statut === "deconnecte") {
    return <Navigate to="/connexion" state={{ depuis: location }} replace />;
  }

  if (statut === "verification_courriel_requise") {
    return <Navigate to="/compte" state={{ depuis: location }} replace />;
  }

  if (statut === "refuse") {
    return (
      <div className="al-auth-etat" role="alert">
        <p className="al-auth-etat__titre">Accès non autorisé</p>
        <p>
          Ce compte n'a pas (ou plus) d'autorisation privée active. Si c'est inattendu, contactez
          l'administration des Alérions.
        </p>
        <Link to="/" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm">
          Retour au site public
        </Link>
      </div>
    );
  }

  if (statut === "erreur") {
    return (
      <div className="al-auth-etat" role="alert">
        <p className="al-auth-etat__titre">Connexion au service indisponible</p>
        <p>
          {codeErreur === "service_non_configure"
            ? "La connexion aux comptes n'est pas encore configurée."
            : "Une erreur réseau est survenue."}
        </p>
        <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" onClick={() => window.location.reload()}>
          Réessayer
        </button>
      </div>
    );
  }

  // statut === "connecte"
  if (espaceRequis && compte) {
    const espaces = espacesAutorises(compte);
    if (!espaces.includes(espaceRequis)) {
      return (
        <div className="al-auth-etat" role="alert">
          <p className="al-auth-etat__titre">{LIBELLES_ESPACE[espaceRequis]} non autorisé</p>
          <p>Ce compte n'a pas accès à cet espace.</p>
          <Link to="/compte" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm">
            Retour à mon compte
          </Link>
        </div>
      );
    }
  }

  return <>{children}</>;
}
