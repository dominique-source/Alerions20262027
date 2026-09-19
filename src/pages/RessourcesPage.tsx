import { documentsExemple } from "../data/resources";
import "./RessourcesPage.css";

/** Ressources — liste simple de documents, aucune grille de cartes. */
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
          <div className="al-doc-list">
            {documentsExemple.map((document) => (
              <div className="al-doc-row" key={document.titre}>
                <span className="al-doc-row__type">{document.type}</span>
                <span className="al-doc-row__titre">{document.titre}</span>
                <span className="al-doc-row__meta">
                  <span>Mis à jour : {document.misAJour}</span>
                  <button
                    type="button"
                    className="al-doc-row__action"
                    disabled
                    title="Document à venir"
                  >
                    Consulter
                  </button>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
