import ResultCard from "../components/ResultCard";
import EmptyState from "../components/EmptyState";
import { resultats } from "../data/results";

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
          {resultats.length === 0 ? (
            <EmptyState
              title="Aucun résultat n'a encore été enregistré cette saison."
              description="Cette page se remplit dès qu'un match est joué et confirmé."
            />
          ) : (
            <div className="al-results-list">
              {resultats.map((resultat) => (
                <ResultCard key={resultat.id} resultat={resultat} />
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
