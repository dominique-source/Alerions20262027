import ResourceCard from "../components/ResourceCard";

const rubriques = [
  "Mon équipe",
  "Horaire",
  "Vidéos",
  "Développement",
  "Philosophie Alérions",
  "Documents",
];

/** Espace Athlètes. */
export default function AthletesPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Athlètes</h1>
          <p>Vos repères pour la saison : équipe, horaire, développement.</p>
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
