import { Link } from "react-router-dom";
import type { EspaceAutorise } from "../../lib/permissions";
import "./EspaceSelector.css";

const LIBELLES: Record<EspaceAutorise, string> = {
  joueur: "Joueur",
  entraineur: "Entraîneur",
  administration: "Administration",
};

const CHEMINS: Record<EspaceAutorise, string> = {
  joueur: "/espace/joueur",
  entraineur: "/espace/entraineur",
  administration: "/espace/admin",
};

interface EspaceSelectorProps {
  espaces: EspaceAutorise[];
  actif: EspaceAutorise;
}

/**
 * Sélecteur d'espace (Joueur / Entraîneur / Administration) — n'affiche
 * que les espaces que ce compte a réellement (compte.isAdmin / ses
 * rattachements). Un clic navigue vers le dashboard correspondant ;
 * chaque dashboard revérifie lui-même l'accès via RequireAuth.
 */
export default function EspaceSelector({ espaces, actif }: EspaceSelectorProps) {
  if (espaces.length <= 1) return null;

  return (
    <nav className="al-espace-selecteur" aria-label="Changer d'espace">
      {espaces.map((espace) => (
        <Link
          key={espace}
          to={CHEMINS[espace]}
          className={`al-espace-selecteur__item${espace === actif ? " al-espace-selecteur__item--actif" : ""}`}
          aria-current={espace === actif ? "page" : undefined}
        >
          {LIBELLES[espace]}
        </Link>
      ))}
    </nav>
  );
}
