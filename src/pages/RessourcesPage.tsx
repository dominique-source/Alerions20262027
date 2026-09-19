import ResourceCard from "../components/ResourceCard";

const rubriques = [
  "Documents pour les parents",
  "Documents pour les athlètes",
  "Documents pour les entraîneurs",
  "Formulaires",
  "Règlements",
  "Guides",
];

/** Ressources générales, accessibles à tous les publics. */
export default function RessourcesPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Ressources</h1>
          <p>Documents et guides utiles regroupés en un seul endroit.</p>
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
