import { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { navEspaces, navMobilePrioritaire, navPrincipale } from "../../data/navigation";
import MobileMenu from "./MobileMenu";
import "./Header.css";

/**
 * En-tête principal : logo (espace réservé), navigation principale,
 * menu « Espaces » (menu déroulant sur ordinateur) et déclencheur du
 * menu mobile. Sticky pour garder l'accès à la navigation en tout temps.
 */
export default function Header() {
  const [espacesOuvert, setEspacesOuvert] = useState(false);
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);
  const espacesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function surClicExterieur(evenement: MouseEvent) {
      if (
        espacesRef.current &&
        !espacesRef.current.contains(evenement.target as Node)
      ) {
        setEspacesOuvert(false);
      }
    }
    function surEchap(evenement: KeyboardEvent) {
      if (evenement.key === "Escape") setEspacesOuvert(false);
    }
    document.addEventListener("mousedown", surClicExterieur);
    document.addEventListener("keydown", surEchap);
    return () => {
      document.removeEventListener("mousedown", surClicExterieur);
      document.removeEventListener("keydown", surEchap);
    };
  }, []);

  return (
    <header className="al-header">
      <div className="container al-header__bar">
        <NavLink to="/" className="al-header__brand" aria-label="Retour à l'accueil des Alérions">
          {/* Espace réservé pour le futur logo officiel des Alérions */}
          <span className="al-header__crest" aria-hidden="true">
            A
          </span>
          <span className="al-header__wordmark">
            <strong>Les Alérions</strong>
            <span>Collège François-de-Laval</span>
          </span>
        </NavLink>

        <nav className="al-header__nav" aria-label="Navigation principale">
          {navPrincipale.map((lien) => (
            <NavLink key={lien.href} to={lien.href} end={lien.href === "/"}>
              {lien.label}
            </NavLink>
          ))}
        </nav>

        <div className="al-header__actions">
          <div className="al-header__espaces-wrap" ref={espacesRef}>
            <button
              type="button"
              className="al-header__espaces-btn"
              aria-haspopup="true"
              aria-expanded={espacesOuvert}
              onClick={() => setEspacesOuvert((v) => !v)}
            >
              Espaces
              <span aria-hidden="true">{espacesOuvert ? "▲" : "▼"}</span>
            </button>
            {espacesOuvert && (
              <div className="al-header__espaces-menu" role="menu">
                {navEspaces.map((lien) => (
                  <NavLink
                    key={lien.href}
                    to={lien.href}
                    role="menuitem"
                    onClick={() => setEspacesOuvert(false)}
                  >
                    {lien.label}
                  </NavLink>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            className="al-header__burger"
            aria-haspopup="true"
            aria-expanded={menuMobileOuvert}
            aria-controls="menu-mobile"
            onClick={() => setMenuMobileOuvert(true)}
          >
            <span className="sr-only">Ouvrir le menu</span>
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path
                d="M2 5h16M2 10h16M2 15h16"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Accès rapide toujours visible sur téléphone, en dehors du menu replié */}
      <nav className="al-header__mobile-quick" aria-label="Accès rapide">
        {navMobilePrioritaire.map((lien) => (
          <NavLink key={lien.href} to={lien.href}>
            {lien.label}
          </NavLink>
        ))}
      </nav>

      <MobileMenu isOpen={menuMobileOuvert} onClose={() => setMenuMobileOuvert(false)} />
    </header>
  );
}
