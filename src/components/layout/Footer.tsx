import { Link } from "react-router-dom";
import { navEspaces, navPrincipale } from "../../data/navigation";
import "./Footer.css";

/** Pied de page : identité, navigation, espaces, coordonnées à confirmer. */
export default function Footer() {
  const anneeCourante = new Date().getFullYear();

  return (
    <footer className="al-footer">
      <div className="container al-footer__top">
        <div className="al-footer__brand">
          <strong>Les Alérions</strong>
          <p>Collège François-de-Laval — l'identité sportive du Collège.</p>
        </div>

        <div className="al-footer__col">
          <h3>Navigation</h3>
          <ul>
            {navPrincipale.map((lien) => (
              <li key={lien.href}>
                <Link to={lien.href}>{lien.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="al-footer__col">
          <h3>Espaces</h3>
          <ul>
            {navEspaces.map((lien) => (
              <li key={lien.href}>
                <Link to={lien.href}>{lien.label}</Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="al-footer__col">
          <h3>Coordonnées</h3>
          <ul>
            <li>
              <span>Adresse — à confirmer</span>
            </li>
            <li>
              <span>Téléphone — à confirmer</span>
            </li>
            <li>
              <span>Courriel — à confirmer</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="container al-footer__bottom">
        <span>© {anneeCourante} Collège François-de-Laval — Les Alérions</span>
        <Link to="/contact">Confidentialité — page à confirmer</Link>
      </div>
    </footer>
  );
}
