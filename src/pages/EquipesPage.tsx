import TeamCard from "../components/TeamCard";
import SectionTitle from "../components/SectionTitle";
import { categoriesSports, equipes } from "../data/teams";

/** Page générale des sports — liste les familles de sports et les équipes disponibles. */
export default function EquipesPage() {
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
          <SectionTitle eyebrow="Sports" title="Nos sports" />
          <div className="al-grid al-grid--4">
            {categoriesSports.map((categorie) => (
              <TeamCard
                key={categorie.sport}
                nom={categorie.nom}
                sousTitre={categorie.description}
                href="/equipes"
              />
            ))}
          </div>
        </div>
      </section>

      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle
            eyebrow="Gabarit"
            title="Équipes"
            description="Chaque équipe disposera de sa propre page (horaire, résultats, entraîneurs, photos, vidéos, documents). Le modèle ci-dessous est un exemple de présentation."
          />
          <div className="al-grid al-grid--3">
            {equipes.map((equipe) => (
              <TeamCard
                key={equipe.slug}
                nom={equipe.nom}
                sousTitre="Exemple de présentation"
                href={`/equipes/${equipe.slug}`}
                photo={equipe.photoPrincipale}
                photoAlt="Athlète des Alérions représentant l'équipe exemple"
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
