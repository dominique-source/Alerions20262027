import DocumentRow from "../components/DocumentRow";
import { documents } from "../data/documents";

/** Ressources — liste simple de documents réels, aucune grille de cartes. */
export default function RessourcesPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Ressources</h1>
          <p>Tous les documents Alérions, réunis en un seul endroit.</p>
        </div>
      </header>

      <section className="al-section al-section--panel">
        <div className="container">
          <div className="al-doc-list">
            {documents.map((document) => (
              <DocumentRow key={document.slug} document={document} />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
