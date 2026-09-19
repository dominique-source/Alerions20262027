import ResultCard from "../components/ResultCard";
import EmptyState from "../components/EmptyState";
import { resultatsExemple } from "../data/results";

/** Page Résultats — présentation sobre, en liste (pas de cartes). */
export default function ResultatsPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Vie sportive</span>
          <h1>Résultats</h1>
          <p>Les résultats des équipes des Alérions, match par match.</p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          {resultatsExemple.length === 0 ? (
            <EmptyState title="Aucun résultat n'est disponible pour le moment." />
          ) : (
            <div className="al-results-list">
              {resultatsExemple.map((resultat) => (
                <ResultCard key={resultat.id} resultat={resultat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
