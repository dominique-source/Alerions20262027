import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import SectionTitle from "../components/SectionTitle";
import QuickAccessCard from "../components/QuickAccessCard";
import TeamSelector from "../components/TeamSelector";
import LivingXVI from "../components/LivingXVI";
import TeamCard from "../components/TeamCard";
import ResultCard from "../components/ResultCard";
import NewsCard from "../components/NewsCard";
import PhotoGrid from "../components/PhotoGrid";
import { evenementsExemple } from "../data/events";
import { actualitesExemple } from "../data/news";
import { resultatsExemple } from "../data/results";
import { categoriesSports } from "../data/teams";
import { photosGalerie } from "../data/gallery";
import "./HomePage.css";

const prochainEntrainement = evenementsExemple.find((e) => e.type === "entrainement");
const prochainMatch = evenementsExemple.find((e) => e.type === "match");
const derniereNouvelle = actualitesExemple[0];

export default function HomePage() {
  return (
    <>
      {/* 2. Section principale */}
      <Hero
        image="DSC_1119.jpg"
        imageAlt="Athlète des Alérions en pleine action"
        eyebrow="Collège François-de-Laval"
        title={
          <>
            PORTER L'HISTOIRE.
            <br />
            ÉCRIRE LA SUITE.
          </>
        }
        lead="L'identité sportive du Collège François-de-Laval."
        actions={
          <>
            <Link to="/calendrier" className="al-btn al-btn--primary">
              Voir le calendrier
            </Link>
            <Link to="/equipes" className="al-btn al-btn--outline">
              Trouver mon équipe
            </Link>
          </>
        }
      />

      {/* 3. Prochains événements */}
      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle eyebrow="À l'horaire" title="Prochains événements" />
          <div className="al-grid al-grid--3">
            {prochainEntrainement && (
              <QuickAccessCard
                eyebrow="Prochain entraînement"
                title={prochainEntrainement.titre}
                meta={`${prochainEntrainement.date} · ${prochainEntrainement.heure} · ${prochainEntrainement.lieu}`}
                href="/calendrier"
                linkLabel="Voir le calendrier"
              />
            )}
            {prochainMatch && (
              <QuickAccessCard
                eyebrow="Prochain match"
                title={prochainMatch.titre}
                meta={`${prochainMatch.date} · ${prochainMatch.heure} · ${prochainMatch.lieu}`}
                href="/calendrier"
                linkLabel="Voir le calendrier"
              />
            )}
            {derniereNouvelle && (
              <QuickAccessCard
                eyebrow="Dernière nouvelle"
                title={derniereNouvelle.titre}
                meta={derniereNouvelle.resume}
                href="/actualites"
                linkLabel="Voir les actualités"
              />
            )}
          </div>
        </div>
      </section>

      {/* 4. Mon équipe */}
      <section className="al-section al-section--blanc">
        <div className="container">
          <SectionTitle
            eyebrow="Personnalisation"
            title="Mon équipe"
            description="Sélectionnez votre sport, votre niveau et votre équipe : ce choix reste mémorisé sur cet appareil."
          />
          <TeamSelector />
        </div>
      </section>

      {/* 5. Mur vivant XVI */}
      <LivingXVI />

      {/* 6. Équipes */}
      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle
            eyebrow="Sports"
            title="Équipes"
            description="Six zones de compétition, une seule identité. La liste officielle des équipes sera ajoutée prochainement."
          />
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

      {/* 7. Résultats et actualités */}
      <section className="al-section al-section--blanc">
        <div className="container">
          <SectionTitle eyebrow="Vie sportive" title="Résultats et actualités" />
          <div className="al-grid al-grid--2 al-home-results">
            {resultatsExemple.map((resultat) => (
              <ResultCard key={resultat.id} resultat={resultat} />
            ))}
          </div>
          <div className="al-grid al-grid--3">
            {actualitesExemple.map((actualite) => (
              <NewsCard key={actualite.id} actualite={actualite} />
            ))}
          </div>
          <div className="al-home-links">
            <Link to="/resultats" className="al-btn al-btn--outline-dark">
              Tous les résultats
            </Link>
            <Link to="/actualites" className="al-btn al-btn--outline-dark">
              Toutes les actualités
            </Link>
          </div>
        </div>
      </section>

      {/* 8. Galerie */}
      <section className="al-section al-section--ivoire">
        <div className="container">
          <SectionTitle
            eyebrow="En images"
            title="Galerie"
            description="Un aperçu de la vie sportive des Alérions."
          />
          <PhotoGrid photos={photosGalerie} />
        </div>
      </section>

      {/* 9. Culture Alérions */}
      <section className="al-section al-section--bleu">
        <div className="container al-home-culture">
          <SectionTitle
            eyebrow="Identité"
            title="Culture Alérions"
          />
          <p>
            Une identité sportive enracinée dans l'histoire du Collège et portée par
            chaque génération d'athlètes.
          </p>
          <Link to="/culture" className="al-btn al-btn--primary">
            Notre histoire
          </Link>
        </div>
      </section>
    </>
  );
}
