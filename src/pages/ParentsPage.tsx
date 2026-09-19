import ResourceCard from "../components/ResourceCard";

const rubriques = [
  "Calendrier",
  "Informations de saison",
  "Documents",
  "Déplacements",
  "Règlements",
  "Contacts",
];

/** Espace Parents. */
export default function ParentsPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Parents</h1>
          <p>Tout ce qu'il faut savoir pour suivre la saison de votre athlète.</p>
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
