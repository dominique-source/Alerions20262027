import ResourceCard from "../components/ResourceCard";

/** Page Contact — coordonnées à confirmer. */
export default function ContactPage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Espaces</span>
          <h1>Contact</h1>
          <p>Rejoignez le programme sportif des Alérions.</p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          <div className="al-grid al-grid--3">
            <ResourceCard titre="Adresse" description="Coordonnées à confirmer" />
            <ResourceCard titre="Téléphone" description="Coordonnées à confirmer" />
            <ResourceCard titre="Courriel" description="Coordonnées à confirmer" />
          </div>
        </div>
      </section>
    </>
  );
}
