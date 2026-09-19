import type { Actualite } from "../types";
import { cheminPhoto } from "../lib/images";
import "./NewsCard.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/** Carte d'actualité (accueil + page Actualités). */
export default function NewsCard({ actualite }: { actualite: Actualite }) {
  return (
    <article className="al-news-card">
      {actualite.photo && (
        <div className="al-news-card__media">
          <img
            src={cheminPhoto(actualite.photo)}
            alt={`Photo associée à la nouvelle : ${actualite.titre}`}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <div className="al-news-card__body">
        <span className="al-news-card__date">{formaterDate(actualite.date)}</span>
        <h3 className="al-news-card__title">{actualite.titre}</h3>
        <p className="al-news-card__excerpt">{actualite.resume}</p>
        {actualite.statut === "exemple" && (
          <span className="al-news-card__badge">Exemple de présentation</span>
        )}
      </div>
    </article>
  );
}
