import PhotoFeature from "../components/PhotoFeature";
import EmptyState from "../components/EmptyState";
import { actualites } from "../data/news";
import "./ActualitesPage.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/**
 * Page Actualités — présentation éditoriale : une grande histoire
 * principale + deux histoires secondaires empilées. Aucune carte blanche.
 */
export default function ActualitesPage() {
  const [histoirePrincipale, ...histoiresSecondaires] = actualites;

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
          {!histoirePrincipale ? (
            <EmptyState title="Aucune actualité n'a encore été publiée." />
          ) : (
            <div className="al-news-editorial">
              {histoirePrincipale.photo && (
                <PhotoFeature
                  image={histoirePrincipale.photo}
                  imageAlt={`Photo associée à la nouvelle : ${histoirePrincipale.titre}`}
                  eyebrow={formaterDate(histoirePrincipale.date)}
                  title={histoirePrincipale.titre}
                  size="big"
                />
              )}
              <div className="al-news-editorial__stack">
                {histoiresSecondaires.map(
                  (actualite) =>
                    actualite.photo && (
                      <PhotoFeature
                        key={actualite.id}
                        image={actualite.photo}
                        imageAlt={`Photo associée à la nouvelle : ${actualite.titre}`}
                        eyebrow={formaterDate(actualite.date)}
                        title={actualite.titre}
                        size="secondary"
                      />
                    ),
                )}
              </div>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
