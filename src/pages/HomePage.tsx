import { Link } from "react-router-dom";
import Hero from "../components/Hero";
import InfoBar from "../components/InfoBar";
import SectionTitle from "../components/SectionTitle";
import QuickAccessCard from "../components/QuickAccessCard";
import LivingXVI from "../components/LivingXVI";
import PhotoFeature from "../components/PhotoFeature";
import { evenementsExemple } from "../data/events";
import { actualitesExemple } from "../data/news";
import { galerieAccueil } from "../data/gallery";
import "./HomePage.css";

const prochainEntrainement = evenementsExemple.find((e) => e.type === "entrainement");
const prochainMatch = evenementsExemple.find((e) => e.type === "match");
const derniereNouvelle = actualitesExemple[0];

export default function HomePage() {
  const [grande, ...secondaires] = galerieAccueil;

  return (
    <>
      {/* A. Hero */}
      <Hero
        image="DSC_1119.jpg"
        imageAlt="Athlète des Alérions en pleine action"
        eyebrow="Collège François-de-Laval"
        title={
          <>
            PORTER
            <br />
            L'HISTOIRE.
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

      {/* B. Bande d'information */}
      <InfoBar />

      {/* C. Cette semaine */}
      <section className="al-section al-section--blanc">
        <div className="container">
          <SectionTitle eyebrow="À l'horaire" title="Cette semaine" />
          <div className="al-week-band">
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

      {/* D. Mur vivant XVI */}
      <LivingXVI />

      {/* E. Galerie éditoriale */}
      <section className="al-section al-section--ice">
        <div className="container">
          <SectionTitle eyebrow="En images" title="Galerie" />
          <div className="al-home-gallery">
            <PhotoFeature
              image={grande.fichier}
              imageAlt={grande.alt}
              title={grande.titre}
              size="big"
            />
            <div className="al-home-gallery__stack">
              {secondaires.map((photo) => (
                <PhotoFeature
                  key={photo.fichier}
                  image={photo.fichier}
                  imageAlt={photo.alt}
                  title={photo.titre}
                  size="secondary"
                />
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
