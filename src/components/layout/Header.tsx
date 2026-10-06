import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navPrincipale } from "../../data/navigation";
import MobileMenu from "./MobileMenu";
import "./Header.css";

/**
 * En-tête principal — identique sur toutes les pages, reproduit depuis les
 * maquettes approuvées : fond quasi noir, logo officiel, quatre liens
 * principaux (Accueil / Mon équipe / Calendrier / Le mur), ligne rouge sous
 * la page active. Les pages utiles qui ne figurent pas dans les maquettes
 * (Parents, Documents, Boîte à idées…) restent accessibles via « Plus ».
 */
export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  return (
    <header className="al-header">
      <div className="al-header__bar">
        <NavLink to="/" className="al-header__brand" aria-label="Retour à l'accueil des Alérions">
          <img
            src="/images/marque/logo-alerions.png"
            alt="Alérions — Collège François-de-Laval"
            width={175}
            height={40}
            className="al-header__logo"
          />
        </NavLink>

        <nav className="al-header__nav" aria-label="Navigation principale">
          {navPrincipale.map((lien) => (
            <NavLink key={lien.href} to={lien.href} end={lien.href === "/"}>
              {lien.label}
            </NavLink>
          ))}
        </nav>

        <div className="al-header__actions">
          <button
            type="button"
            className="al-header__plus"
            aria-haspopup="true"
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            onClick={() => setMenuOuvert(true)}
          >
            Plus
          </button>

          <button
            type="button"
            className="al-header__burger"
            aria-haspopup="true"
            aria-expanded={menuOuvert}
            aria-controls="menu-mobile"
            onClick={() => setMenuOuvert(true)}
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

      <MobileMenu isOpen={menuOuvert} onClose={() => setMenuOuvert(false)} />
    </header>
  );
}
