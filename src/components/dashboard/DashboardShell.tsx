import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardShell.css";

export interface ElementNavDashboard {
  label: string;
  icone: string;
  to: string;
  badge?: number;
}

interface DashboardShellProps {
  espaceLabel: string;
  titrePage: string;
  elementsNav: ElementNavDashboard[];
  selecteurEspace?: ReactNode;
  children: ReactNode;
}

function initialesNom(nom: string): string {
  const parties = nom.trim().split(/\s+/).filter(Boolean);
  if (parties.length === 0) return "?";
  if (parties.length === 1) return parties[0]!.slice(0, 2).toUpperCase();
  return (parties[0]![0] + parties[parties.length - 1]![0]).toUpperCase();
}

/**
 * Coquille commune aux trois dashboards privés — navigation latérale
 * sombre (noir/rouge/or), reprise des trois maquettes. Isolée des pages
 * publiques : aucune classe ni jeton ici ne modifie Header/Footer/Layout.
 */
export default function DashboardShell({ espaceLabel, titrePage, elementsNav, selecteurEspace, children }: DashboardShellProps) {
  const { compte, deconnexion } = useAuth();
  const [menuOuvert, setMenuOuvert] = useState(false);

  const nom = compte?.displayName || "Membre Alérions";

  return (
    <div className="al-dash">
      <a href="#al-dash-contenu" className="skip-link">
        Aller au contenu principal
      </a>

      <button
        type="button"
        className="al-dash__bouton-menu"
        onClick={() => setMenuOuvert((v) => !v)}
        aria-expanded={menuOuvert}
        aria-controls="al-dash-sidebar"
      >
        <span aria-hidden="true">{menuOuvert ? "✕" : "☰"}</span>
        <span className="sr-only">Menu</span>
      </button>

      <aside id="al-dash-sidebar" className={`al-dash__sidebar${menuOuvert ? " al-dash__sidebar--ouvert" : ""}`}>
        <Link to="/" className="al-dash__logo">
          <img src="/images/marque/logo-alerions.png" alt="Alérions" />
        </Link>

        <span className="al-dash__badge-espace">{espaceLabel}</span>

        <nav className="al-dash__nav" aria-label="Navigation du tableau de bord">
          {elementsNav.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `al-dash__nav-item${isActive ? " al-dash__nav-item--actif" : ""}`}
              onClick={() => setMenuOuvert(false)}
            >
              <span className="al-dash__nav-icone" aria-hidden="true">
                {item.icone}
              </span>
              <span>{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && <span className="al-dash__nav-badge">{item.badge}</span>}
            </NavLink>
          ))}
        </nav>

        <div className="al-dash__sidebar-bas">
          <Link to="/" className="al-dash__lien-bas">
            <span aria-hidden="true">↗</span> Voir le site
          </Link>
          <button type="button" className="al-dash__lien-bas" onClick={() => void deconnexion()}>
            <span aria-hidden="true">⎋</span> Déconnexion
          </button>
        </div>
      </aside>

      {menuOuvert && <div className="al-dash__voile" onClick={() => setMenuOuvert(false)} aria-hidden="true" />}

      <div className="al-dash__principal">
        <header className="al-dash__entete">
          <h1 className="al-dash__titre-page">{titrePage}</h1>
          <div className="al-dash__entete-droite">
            {selecteurEspace}
            <button type="button" className="al-dash__cloche" aria-label="Notifications">
              🔔
            </button>
            <span className="al-dash__avatar" title={nom}>
              {initialesNom(nom)}
            </span>
          </div>
        </header>

        <main id="al-dash-contenu" className="al-dash__contenu">
          {children}
        </main>
      </div>
    </div>
  );
}
