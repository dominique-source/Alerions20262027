import { useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
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

/**
 * Page d'un sport (/equipes/:sport) — direction V2 (noir, rouge, or),
 * remplace l'ancien habillage bleu/ivoire. Équipes, filtre genre,
 * calendrier filtré, documents et galerie restent fonctionnels.
 */
export default function SportPage() {
  const { sport: sportSlugParam } = useParams<{ sport: string }>();
  const [filtreGenre, setFiltreGenre] = useState<Genre | "">("");

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;

  const equipes = useMemo(() => (sport ? equipesParSport(sport.slug) : []), [sport]);
  const documents = useMemo(() => (sport ? documentsParSport(sport.slug) : []), [sport]);
  const photosGalerie = useMemo(() => (sport ? photosParSport(sport.slug) : []), [sport]);

  if (!sport) {
    return (
      <div className="al-sportpage">
        <div className="al-sportpage__vide">
          <span className="al-v2-eyebrow">Équipes</span>
          <h1 className="al-v2-title al-sportpage__vide-titre">Ce sport n'existe pas.</h1>
          <p>Consultez la liste complète des sports Alérions.</p>
          <Link to="/equipes" className="al-btn-v2 al-btn-v2--red">
            Voir tous les sports <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const genresDisponibles = Array.from(new Set(equipes.map((e) => e.genre)));
  const equipesFiltrees = filtreGenre ? equipes.filter((e) => e.genre === filtreGenre) : equipes;

  return (
    <div className="al-sportpage">
      <nav className="al-sportpage__fil" aria-label="Fil d'Ariane">
        <Link to="/equipes">Équipes</Link>
        <span aria-hidden="true">›</span>
        <span>{sport.nom}</span>
      </nav>

      <header
        className={`al-sportpage__hero${sport.photoCouverture ? " al-sportpage__hero--photo" : ""}`}
      >
        {sport.photoCouverture && (
          <img
            src={cheminPublic(sport.photoCouverture)}
            alt={`Athlète des Alérions en action — programme ${sport.nom}`}
          />
        )}
        <div className="al-sportpage__hero-texte">
          <span className="al-v2-eyebrow">
            {equipes.length} équipe{equipes.length > 1 ? "s" : ""}
          </span>
          <h1 className="al-v2-title al-sportpage__titre">{sport.nom}</h1>
          <div className="al-sportpage__actions">
            <Link to={`/calendrier?sport=${sport.slug}`} className="al-btn-v2 al-btn-v2--outline">
              Calendrier {sport.nom}
            </Link>
            {documents.length > 0 && (
              <a href="#documents" className="al-btn-v2 al-btn-v2--gold">
                Documents
              </a>
            )}
          </div>
        </div>
      </header>

      <section className="al-sportpage__section">
        {sport.filtreGenre && genresDisponibles.length > 1 && (
          <div className="al-sportpage__filtres" role="group" aria-label="Filtrer par genre">
            <button type="button" aria-pressed={filtreGenre === ""} onClick={() => setFiltreGenre("")}>
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

        <div className="al-sportpage__equipes">
          {equipesFiltrees.map((equipe) => (
            <Link key={equipe.slug} to={`/equipes/${sport.slug}/${equipe.slug}`} className="al-sportpage__equipe">
              <span className="al-sportpage__equipe-nom">{equipe.nom}</span>
              <span aria-hidden="true">→</span>
            </Link>
          ))}
        </div>
      </section>

      {documents.length > 0 && (
        <section className="al-sportpage__section" id="documents">
          <span className="al-v2-eyebrow">Ressources</span>
          <h2 className="al-v2-title al-sportpage__section-titre">Documents</h2>
          <div className="al-sportpage__docs">
            {documents.map((document) => {
              const href = `/documents/${document.fichier}`;
              return (
                <div key={document.slug} className="al-sportpage__doc">
                  <span className="al-sportpage__doc-titre">{document.titre}</span>
                  <span className="al-sportpage__doc-meta">
                    {document.pages} page{document.pages > 1 ? "s" : ""}
                    {document.groupeVersion ? ` · ${document.groupeVersion.etiquette}` : ""}
                  </span>
                  <span className="al-sportpage__doc-actions">
                    <a href={href} target="_blank" rel="noopener noreferrer">
                      Voir
                    </a>
                    <a href={href} download>
                      Télécharger
                    </a>
                  </span>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {photosGalerie.length > 0 && (
        <section className="al-sportpage__section">
          <span className="al-v2-eyebrow">En images</span>
          <h2 className="al-v2-title al-sportpage__section-titre">Galerie {sport.nom}</h2>
          <div className="al-sportpage__galerie">
            {photosGalerie.slice(0, 8).map((photo) => (
              <div key={photo.id} className="al-sportpage__photo">
                <img src={cheminPublic(photo.fichier)} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
