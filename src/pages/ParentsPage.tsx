const rubriques = [
  "Calendrier",
  "Informations de saison",
  "Déplacements",
  "Règlements",
  "Contacts",
  "Résultats",
];

/** Espace Parents — calme, clair et pratique. */
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

      <div className="al-split">
        <div className="al-split__panel al-split__panel--blue">
          <h2>Cette semaine</h2>
          <p>Information à confirmer.</p>
        </div>
        <div className="al-split__panel">
          <div className="al-numbered">
            {rubriques.map((rubrique, index) => (
              <div className="al-numbered__row" key={rubrique}>
                <span className="al-numbered__index">{String(index + 1).padStart(2, "0")}</span>
                <div className="al-numbered__body">
                  <h3>{rubrique}</h3>
                  <p>Contenu à confirmer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
