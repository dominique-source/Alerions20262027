import PhotoGrid from "../components/PhotoGrid";
import SectionTitle from "../components/SectionTitle";
import { photosGalerie } from "../data/gallery";
import "./CulturePage.css";

const jalons = [
  { annee: "1668", legende: "Racines du Collège — à documenter" },
  { annee: "XVI", legende: "Seize Alérions, une identité" },
  { annee: "2026", legende: "Saison en cours" },
  { annee: "Demain", legende: "La suite à écrire" },
];

/**
 * Page Culture Alérions — traitement émotionnel et historique.
 * Seul endroit du site où l'ivoire réapparaît, comme référence historique.
 */
export default function CulturePage() {
  return (
    <>
      <section className="al-culture-intro">
        <h1>
          <span>Culture</span>
          <span>Alérions.</span>
        </h1>
      </section>

      <section className="al-section al-section--blanc">
        <div className="container al-culture-main">
          <span className="al-culture-main__num" aria-hidden="true">
            XVI
          </span>
          <div className="al-culture-main__body">
            <h2>L'histoire n'est pas un décor.</h2>
            <p>
              Seize Alérions : un nombre qui revient dans l'histoire du Collège
              François-de-Laval et qui inspire aujourd'hui l'identité sportive
              portée par chaque équipe, chaque génération d'athlètes. Ce chiffre
              n'est pas un ornement — il rappelle que chaque génération ajoute sa
              propre page à une histoire commune.
            </p>
            <p className="al-culture-main__quote">Porter l'histoire. Écrire la suite.</p>
          </div>
        </div>
      </section>

      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle eyebrow="Repères" title="Une ligne historique" />
          <div className="al-culture-timeline">
            {jalons.map((jalon) => (
              <div className="al-culture-timeline__item" key={jalon.annee}>
                <span className="al-culture-timeline__year">{jalon.annee}</span>
                <p className="al-culture-timeline__caption">{jalon.legende}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="al-section al-section--ice">
        <div className="container">
          <SectionTitle eyebrow="En images" title="La vie Alérions" />
          <PhotoGrid photos={photosGalerie} />
        </div>
      </section>
    </>
  );
}
