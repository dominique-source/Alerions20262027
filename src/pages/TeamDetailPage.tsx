import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PhotoGrid from "../components/PhotoGrid";
import DocumentRow from "../components/DocumentRow";
import SectionTitle from "../components/SectionTitle";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import { documentsParSport } from "../data/documents";
import { photosParSport } from "../data/photos";
import { cheminPublic } from "../lib/images";
import "./TeamDetailPage.css";

/** Gabarit réutilisable de page d'équipe (/equipes/:sport/:equipe). */
export default function TeamDetailPage() {
  const { sport: sportSlugParam, equipe: equipeSlugParam } = useParams<{
    sport: string;
    equipe: string;
  }>();

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;
  const equipe = sport && equipeSlugParam ? trouverEquipe(sport.slug, equipeSlugParam) : undefined;

  if (!sport || !equipe) {
    return (
      <section className="al-section al-section--blanc">
        <div className="container">
          <EmptyState
            title="Cette équipe n'existe pas."
            description="Consultez la liste complète des équipes Alérions."
          />
          <p className="al-team-back">
            <Link to="/equipes" className="al-btn al-btn--outline-dark">
              Voir toutes les équipes
            </Link>
          </p>
        </div>
      </section>
    );
  }

  const documents = documentsParSport(sport.slug);
  const photosGalerie = photosParSport(sport.slug);

  return (
    <>
      <section className="al-team-hero">
        <div className="al-team-hero__identity">
          <h1>
            <span>{sport.nom.toUpperCase()}</span>
            <span>{equipe.nom.toUpperCase()}</span>
          </h1>
        </div>
        <div className="al-team-hero__media">
          {sport.photoCouverture && (
            <img
              src={cheminPublic(sport.photoCouverture)}
              alt={`Athlète des Alérions en action — programme ${sport.nom}`}
            />
          )}
        </div>
      </section>

      <section className="al-section al-section--blanc">
        <div className="container">
          <Link to={`/calendrier?sport=${sport.slug}`} className="al-btn al-btn--primary">
            Calendrier {sport.nom}
          </Link>
        </div>
      </section>

      {documents.length > 0 && (
        <section className="al-section al-section--ice">
          <div className="container">
            <SectionTitle eyebrow="Ressources" title="Documents" />
            <div className="al-doc-list">
              {documents.map((document) => (
                <DocumentRow key={document.slug} document={document} />
              ))}
            </div>
          </div>
        </section>
      )}

      {photosGalerie.length > 0 && (
        <section className="al-section al-section--blanc">
          <div className="container">
            <SectionTitle eyebrow="En images" title={`Galerie ${sport.nom}`} />
            <PhotoGrid photos={photosGalerie} />
          </div>
        </section>
      )}
    </>
  );
}
