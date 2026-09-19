import { useState } from "react";
import { NavLink } from "react-router-dom";
import { navEspaces, navPrincipale } from "../../data/navigation";
import MobileMenu from "./MobileMenu";
import "./Header.css";

/**
 * En-tête principal : fond bleu très foncé, ligne or sous la navigation.
 * Rangée haute = logo + navigation principale + bouton Calendrier.
 * Rangée basse (ordinateur uniquement) = navigation secondaire discrète.
 * Sur téléphone : logo + bouton Calendrier + menu regroupant tout le reste.
 */
export default function Header() {
  const [menuMobileOuvert, setMenuMobileOuvert] = useState(false);

  return (
    <header className="al-header">
      <div className="container al-header__bar">
        <NavLink to="/" className="al-header__brand" aria-label="Retour à l'accueil des Alérions">
          {/*
            Espace réservé au logo officiel des Alérions : aucun fichier de
            logo transparent n'est présent dans le dépôt à ce jour (seules
            les 40 photos DSC_*.jpg y figurent). Ce bloc typographique doit
            être remplacé par le vrai logo dès qu'il sera fourni — ne pas le
            laisser en place s'il s'agit d'une tentative de faux logo.
          */}
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
          <NavLink to="/calendrier" className="al-header__cta">
            Calendrier
          </NavLink>

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

      {/* Navigation secondaire, plus discrète — ordinateur uniquement */}
      <nav className="al-header__secondary" aria-label="Espaces">
        <div className="container al-header__secondary-row">
          {navEspaces.map((lien) => (
            <NavLink key={lien.href} to={lien.href}>
              {lien.label}
            </NavLink>
          ))}
        </div>
      </nav>

      <MobileMenu isOpen={menuMobileOuvert} onClose={() => setMenuMobileOuvert(false)} />
    </header>
  );
}
