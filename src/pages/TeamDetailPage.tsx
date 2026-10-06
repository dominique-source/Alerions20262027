import { Link, useParams } from "react-router-dom";
import RosterSection from "../components/RosterSection";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import { documentsParSport } from "../data/documents";
import { photosParSport } from "../data/photos";
import { cheminPublic } from "../lib/images";
import "./TeamDetailPage.css";

/**
 * Gabarit de page d'équipe (/equipes/:sport/:equipe) — direction V2 (noir,
 * rouge, or) des maquettes approuvées, remplace l'ancien habillage
 * bleu/ivoire. Les données (effectif réel, calendrier, documents, photos)
 * et le lien Chat sont inchangés — seul l'habillage change.
 */
export default function TeamDetailPage() {
  const { sport: sportSlugParam, equipe: equipeSlugParam } = useParams<{
    sport: string;
    equipe: string;
  }>();

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;
  const equipe = sport && equipeSlugParam ? trouverEquipe(sport.slug, equipeSlugParam) : undefined;

  if (!sport || !equipe) {
    return (
      <div className="al-team">
        <div className="al-team__vide">
          <span className="al-v2-eyebrow">Équipes</span>
          <h1 className="al-v2-title al-team__vide-titre">Cette équipe n'existe pas.</h1>
          <p>Consultez la liste complète des équipes Alérions.</p>
          <Link to="/equipes" className="al-btn-v2 al-btn-v2--red">
            Voir toutes les équipes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const documents = documentsParSport(sport.slug);
  const photosGalerie = photosParSport(sport.slug);

  return (
    <div className="al-team">
      <nav className="al-team__fil" aria-label="Fil d'Ariane">
        <Link to="/equipes">Équipes</Link>
        <span aria-hidden="true">›</span>
        <Link to={`/equipes/${sport.slug}`}>{sport.nom}</Link>
        <span aria-hidden="true">›</span>
        <span>{equipe.nom}</span>
      </nav>

      <header className="al-team__hero">
        <div className="al-team__hero-texte">
          <span className="al-v2-eyebrow">{sport.nom}</span>
          <h1 className="al-v2-title al-team__titre">{equipe.nom}</h1>
          <div className="al-team__actions">
            <Link to={`/calendrier?sport=${sport.slug}`} className="al-btn-v2 al-btn-v2--outline">
              Calendrier {sport.nom}
            </Link>
            <Link to={`/equipes/${sport.slug}/${equipe.slug}/chat`} className="al-btn-v2 al-btn-v2--red">
              💬 Chat de l'équipe <span aria-hidden="true">→</span>
            </Link>
          </div>
        </div>
        {sport.photoCouverture && (
          <div className="al-team__hero-media">
            <img
              src={cheminPublic(sport.photoCouverture)}
              alt={`Athlète des Alérions en action — programme ${sport.nom}`}
            />
          </div>
        )}
      </header>

      <section className="al-team__section">
        <RosterSection
          sport={sport.slug}
          equipeSlug={equipe.slug}
          equipeNomAffiche={`${sport.nom} ${equipe.nom}`}
          construireLienProfil={(idMembre) => `/equipes/${sport.slug}/${equipe.slug}/membres/${idMembre}`}
        />
      </section>

      {documents.length > 0 && (
        <section className="al-team__section">
          <span className="al-v2-eyebrow">Ressources</span>
          <h2 className="al-v2-title al-team__section-titre">Documents</h2>
          <div className="al-team__docs">
            {documents.map((document) => {
              const href = `/documents/${document.fichier}`;
              return (
                <div key={document.slug} className="al-team__doc">
                  <span className="al-team__doc-titre">{document.titre}</span>
                  <span className="al-team__doc-meta">
                    {document.pages} page{document.pages > 1 ? "s" : ""}
                    {document.groupeVersion ? ` · ${document.groupeVersion.etiquette}` : ""}
                  </span>
                  <span className="al-team__doc-actions">
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
        <section className="al-team__section">
          <span className="al-v2-eyebrow">En images</span>
          <h2 className="al-v2-title al-team__section-titre">Galerie {sport.nom}</h2>
          <div className="al-team__galerie">
            {photosGalerie.slice(0, 8).map((photo) => (
              <div key={photo.id} className="al-team__photo">
                <img src={cheminPublic(photo.fichier)} alt={photo.alt} loading="lazy" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
