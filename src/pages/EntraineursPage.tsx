import ResourceCard from "../components/ResourceCard";

const rubriques = [
  "Guide de l'entraîneur",
  "Philosophie sportive",
  "Calendriers",
  "Documents",
  "Ressources",
  "Formulaires",
];

/** Espace Entraîneurs. */
export default function EntraineursPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Entraîneurs</h1>
          <p>Les outils et références pour encadrer les équipes Alérions.</p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          <div className="al-grid al-grid--3">
            {rubriques.map((rubrique) => (
              <ResourceCard key={rubrique} titre={rubrique} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
