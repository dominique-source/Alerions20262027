import PhotoGrid from "../components/PhotoGrid";
import SectionTitle from "../components/SectionTitle";
import { photosGalerie } from "../data/gallery";

/** Page Culture Alérions — identité et histoire du programme sportif. */
export default function CulturePage() {
  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Identité</span>
          <h1>Culture Alérions</h1>
          <p>
            Une identité sportive enracinée dans l'histoire du Collège et portée par
            chaque génération d'athlètes.
          </p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          <SectionTitle
            eyebrow="Notre histoire"
            title="Notre histoire"
            description="Information à venir."
          />
        </div>
      </section>

      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle eyebrow="En images" title="La vie Alérions" />
          <PhotoGrid photos={photosGalerie} />
        </div>
      </section>
    </>
  );
}
