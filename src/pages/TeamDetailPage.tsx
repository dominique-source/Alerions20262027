import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { equipes } from "../data/teams";
import { cheminPhoto } from "../lib/images";
import "./TeamDetailPage.css";

/**
 * Gabarit réutilisable de page d'équipe (/equipes/:slug).
 * Seule « equipe-exemple » existe pour le moment : la liste officielle des
 * équipes n'a pas été fournie et ne doit pas être inventée.
 */
export default function TeamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const equipe = equipes.find((e) => e.slug === slug);

  if (!equipe) {
    return (
      <section className="al-section al-section--blanc">
        <div className="container">
          <EmptyState
            title="Cette équipe n'est pas encore disponible."
            description="La liste officielle des équipes sera ajoutée prochainement."
          />
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="al-team-detail__hero">
        {equipe.photoPrincipale && (
          <img
            src={cheminPhoto(equipe.photoPrincipale)}
            alt="Athlète représentant l'équipe exemple"
          />
        )}
        <div className="container al-team-detail__hero-content">
          <h1>{equipe.nom}</h1>
        </div>
      </section>

      <section className="al-section al-section--ivoire">
        <div className="container al-team-detail__sections">
          <div className="al-team-detail__block">
            <h2>Prochain match</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Horaire</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Résultats</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Entraîneurs</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Photos</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Vidéos</h2>
            <p>Contenu à confirmer</p>
          </div>
          <div className="al-team-detail__block">
            <h2>Documents</h2>
            <p>Contenu à confirmer</p>
          </div>
        </div>
      </section>
    </>
  );
}
