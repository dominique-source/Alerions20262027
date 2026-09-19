import { Link } from "react-router-dom";
import { cheminPhoto } from "../lib/images";
import "./TeamCard.css";

interface TeamCardProps {
  nom: string;
  sousTitre: string;
  href: string;
  photo?: string | null;
  photoAlt?: string;
}

/** Carte d'équipe / de sport — utilisée pour la grille Équipes et l'accueil. */
export default function TeamCard({ nom, sousTitre, href, photo, photoAlt }: TeamCardProps) {
  return (
    <Link
      to={href}
      className={`al-team-card${photo ? "" : " al-team-card--placeholder"}`}
    >
      <div className="al-team-card__media">
        {photo && <img src={cheminPhoto(photo)} alt={photoAlt ?? ""} loading="lazy" />}
      </div>
      <div className="al-team-card__body">
        <span className="al-team-card__sport">{sousTitre}</span>
        <h3 className="al-team-card__nom">{nom}</h3>
      </div>
    </Link>
  );
}
