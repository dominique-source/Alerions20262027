import NewsCard from "../components/NewsCard";
import EmptyState from "../components/EmptyState";
import { actualitesExemple } from "../data/news";

/** Page Actualités — prête à recevoir les vraies nouvelles des Alérions. */
export default function ActualitesPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Vie sportive</span>
          <h1>Actualités</h1>
          <p>Les dernières nouvelles des Alérions du Collège François-de-Laval.</p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          {actualitesExemple.length === 0 ? (
            <EmptyState title="Aucune actualité n'est disponible pour le moment." />
          ) : (
            <div className="al-grid al-grid--3">
              {actualitesExemple.map((actualite) => (
                <NewsCard key={actualite.id} actualite={actualite} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
