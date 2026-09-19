import { Link } from "react-router-dom";
import EmptyState from "../components/EmptyState";

/** Page 404 — route inconnue. */
export default function NotFoundPage() {
  return (
    <section className="al-section al-section--blanc">
      <div className="container">
        <EmptyState
          title="Cette page n'existe pas."
          description="Vérifiez l'adresse ou retournez à l'accueil."
        />
        <p className="al-empty">
          <Link to="/" className="al-btn al-btn--primary">
            Retour à l'accueil
          </Link>
        </p>
      </div>
    </section>
  );
}
