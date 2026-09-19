import PhotoFeature from "../components/PhotoFeature";
import SectionTitle from "../components/SectionTitle";
import TeamSelector from "../components/TeamSelector";
import { composantsEquipesAccueil, equipeExemple } from "../data/teams";
import "./EquipesPage.css";

/** Page générale des sports — composition photographique asymétrique. */
export default function EquipesPage() {
  const { grande, secondaires } = composantsEquipesAccueil;

  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Vie sportive</span>
          <h1>Équipes</h1>
          <p>
            Six zones de compétition, une seule identité Alérions. La liste officielle
            des équipes sera ajoutée dès qu'elle sera confirmée.
          </p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          <TeamSelector />
        </div>
      </section>

      <section className="al-section al-section--ice">
        <div className="container">
          <SectionTitle eyebrow="Sports" title="Nos programmes" />
          <div className="al-equipes-grid">
            <PhotoFeature
              image={grande.photo}
              imageAlt={`Athlète des Alérions en action — programme ${grande.nom}`}
              eyebrow="Programme principal"
              title={grande.nom}
              size="big"
              ctaLabel="Explorer"
              href={`/equipes/${equipeExemple.slug}`}
              photoDeReference={grande.photoDeReference}
            />
            <div className="al-equipes-grid__secondaires">
              {secondaires.map((programme) => (
                <PhotoFeature
                  key={programme.sport}
                  image={programme.photo}
                  imageAlt={`Athlète des Alérions en action — programme ${programme.nom}`}
                  title={programme.nom}
                  size="secondary"
                  ctaLabel="Explorer"
                  href={`/equipes/${equipeExemple.slug}`}
                  photoDeReference={programme.photoDeReference}
                />
              ))}
              <PhotoFeature
                image={equipeExemple.photoPrincipale ?? "DSC_1119.jpg"}
                imageAlt="Aperçu du modèle de page d'équipe des Alérions"
                eyebrow="Aperçu"
                title="Modèle de page"
                size="secondary"
                ctaLabel="Explorer"
                href={`/equipes/${equipeExemple.slug}`}
              />
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
