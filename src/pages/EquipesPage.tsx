import PhotoFeature from "../components/PhotoFeature";
import SportTile from "../components/SportTile";
import SectionTitle from "../components/SectionTitle";
import TeamSelector from "../components/TeamSelector";
import { sports } from "../data/sports";
import { equipesParSport } from "../data/teams";

const couleurs: Array<"blue" | "deep" | "red"> = ["blue", "deep", "red"];

/** Page générale des sports — composition photographique asymétrique. */
export default function EquipesPage() {
  const [basketball, ...autresSports] = sports;

  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Vie sportive</span>
          <h1>Équipes</h1>
          <p>Onze sports, trente-huit équipes : l'identité sportive des Alérions.</p>
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
              image={basketball.photoCouverture!}
              cheminComplet
              imageAlt={`Athlète des Alérions en action — programme ${basketball.nom}`}
              eyebrow={`${equipesParSport(basketball.slug).length} équipes`}
              title={basketball.nom}
              size="big"
              ctaLabel="Découvrir"
              href={`/equipes/${basketball.slug}`}
            />
            <div className="al-equipes-grid__reste">
              {autresSports.map((sport, i) => (
                <SportTile
                  key={sport.slug}
                  nom={sport.nom}
                  nombreEquipes={equipesParSport(sport.slug).length}
                  href={`/equipes/${sport.slug}`}
                  couleur={couleurs[i % couleurs.length]}
                  index={i + 2}
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
