import { Link } from "react-router-dom";
import { prochainMatch } from "../data/events";
import "./HomePage.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" })
    .format(new Date(`${date}T00:00:00`))
    .replace(".", "")
    .toUpperCase();
}

/**
 * Accueil — reproduction fidèle de 01_MAQUETTES/accueil-desktop-1536x1024.png.
 * Hero (titre + portraits), bande « Prochain rendez-vous » alimentée par le
 * vrai prochain match, puis trois tuiles vers Le mur / Défis / Collection.
 */
export default function HomePage() {
  const match = prochainMatch();

  return (
    <div className="al-accueil">
      <section className="al-accueil__hero">
        <div className="al-accueil__hero-text">
          <span className="al-accueil__eyebrow">Saison 2026-2027</span>
          <h1 className="al-accueil__title">
            <span className="al-accueil__title-white">Alérions.</span>
            <span className="al-accueil__title-red">À nous de jouer.</span>
          </h1>
          <Link to="/mon-equipe" className="al-btn-v2 al-btn-v2--red">
            Voir mon équipe <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="al-accueil__hero-image">
          <img src="/images/accueil/hero-portraits.png" alt="Deux athlètes Alérions en portrait de saison" />
        </div>
      </section>

      <section className="al-accueil__bande" aria-label="Prochain rendez-vous">
        {match ? (
          <>
            <div className="al-accueil__bande-item">
              <span className="al-accueil__bande-icon" aria-hidden="true">
                📅
              </span>
              <span className="al-accueil__bande-label">Prochain rendez-vous</span>
            </div>
            <div className="al-accueil__bande-divider" aria-hidden="true" />
            <div className="al-accueil__bande-titre">{match.titre}</div>
            <div className="al-accueil__bande-divider" aria-hidden="true" />
            <div className="al-accueil__bande-item">
              <span className="al-accueil__bande-icon" aria-hidden="true">
                📅
              </span>
              <span>
                {formaterDate(match.date)}
                {match.heure ? ` · ${match.heure.replace(":", " h ")}` : ""}
              </span>
            </div>
            <Link to="/calendrier" className="al-btn-v2 al-btn-v2--outline al-accueil__bande-cta">
              Voir le calendrier <span aria-hidden="true">→</span>
            </Link>
          </>
        ) : (
          <div className="al-accueil__bande-item">
            <span className="al-accueil__bande-icon" aria-hidden="true">
              📅
            </span>
            <span className="al-accueil__bande-label">Aucun match à venir pour le moment</span>
            <Link to="/calendrier" className="al-btn-v2 al-btn-v2--outline al-accueil__bande-cta">
              Voir le calendrier <span aria-hidden="true">→</span>
            </Link>
          </div>
        )}
      </section>

      <section className="al-accueil__tuiles" aria-label="Accès rapide">
        <Link to="/mur" className="al-accueil__tuile">
          <img src="/images/accueil/tuile-mur.png" alt="Le mur — photos, moments forts et fierté Alérions" />
        </Link>
        <Link to="/defis" className="al-accueil__tuile">
          <img src="/images/accueil/tuile-defi.png" alt="Défi de la semaine — technique, progression, esprit d'équipe" />
        </Link>
        <Link to="/collection" className="al-accueil__tuile">
          <img src="/images/accueil/tuile-cartes.png" alt="Les cartes de saison — collectionne, encourage, fais partie de l'histoire" />
        </Link>
      </section>
    </div>
  );
}
