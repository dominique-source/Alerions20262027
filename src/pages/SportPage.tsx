import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import PhotoGrid from "../components/PhotoGrid";
import DocumentRow from "../components/DocumentRow";
import SectionTitle from "../components/SectionTitle";
import { trouverSport } from "../data/sports";
import { equipesParSport } from "../data/teams";
import { documentsParSport } from "../data/documents";
import { photosParSport } from "../data/photos";
import { cheminPublic } from "../lib/images";
import type { Genre } from "../types";
import "./SportPage.css";

const libellesGenre: Record<Genre, string> = {
  feminin: "Féminin",
  masculin: "Masculin",
  mixte: "Mixte",
};

/** Page d'un sport : équipes, filtre genre, calendrier filtré, documents, galerie. */
export default function SportPage() {
  const { sport: sportSlugParam } = useParams<{ sport: string }>();
  const [filtreGenre, setFiltreGenre] = useState<Genre | "">("");

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;

  const equipes = useMemo(() => (sport ? equipesParSport(sport.slug) : []), [sport]);
  const documents = useMemo(() => (sport ? documentsParSport(sport.slug) : []), [sport]);
  const photosGalerie = useMemo(() => (sport ? photosParSport(sport.slug) : []), [sport]);

  if (!sport) {
    return (
      <section className="al-section al-section--blanc">
        <div className="container">
          <EmptyState
            title="Ce sport n'existe pas."
            description="Consultez la liste complète des sports Alérions."
          />
        </div>
      </section>
    );
  }

  const genresDisponibles = Array.from(new Set(equipes.map((e) => e.genre)));
  const equipesFiltrees = filtreGenre
    ? equipes.filter((e) => e.genre === filtreGenre)
    : equipes;

  return (
    <>
      <section
        className={`al-sport-hero ${sport.photoCouverture ? "al-sport-hero--photo" : "al-sport-hero--sansphoto"}`}
      >
        {sport.photoCouverture && (
          <img
            src={cheminPublic(sport.photoCouverture)}
            alt={`Athlète des Alérions en action — programme ${sport.nom}`}
          />
        )}
        <div className="container al-sport-hero__content">
          <h1>{sport.nom}</h1>
          <p className="al-sport-hero__meta">
            {equipes.length} équipe{equipes.length > 1 ? "s" : ""}
          </p>
          <div className="al-sport-actions">
            <Link to={`/calendrier?sport=${sport.slug}`} className="al-btn al-btn--primary">
              Calendrier {sport.nom}
            </Link>
            {documents.length > 0 && (
              <a href="#documents" className="al-btn al-btn--outline">
                Documents
              </a>
            )}
          </div>
        </div>
      </section>

      <section className="al-section al-section--blanc">
        <div className="container">
          {sport.filtreGenre && genresDisponibles.length > 1 && (
            <div className="al-sport-filters" role="group" aria-label="Filtrer par genre">
              <button
                type="button"
                aria-pressed={filtreGenre === ""}
                onClick={() => setFiltreGenre("")}
              >
                Toutes les équipes
              </button>
              {genresDisponibles.map((genre) => (
                <button
                  key={genre}
                  type="button"
                  aria-pressed={filtreGenre === genre}
                  onClick={() => setFiltreGenre(genre)}
                >
                  {libellesGenre[genre]}
                </button>
              ))}
            </div>
          )}

          <div className="al-sport-teams">
            {equipesFiltrees.map((equipe) => (
              <Link
                key={equipe.slug}
                to={`/equipes/${sport.slug}/${equipe.slug}`}
                className="al-sport-team-row"
              >
                <span className="al-sport-team-row__nom">{equipe.nom}</span>
                <span aria-hidden="true">→</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {documents.length > 0 && (
        <section className="al-section al-section--ice" id="documents">
          <div className="container">
            <SectionTitle eyebrow="Ressources" title="Documents" />
            <div className="al-doc-list al-sport-docs">
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
