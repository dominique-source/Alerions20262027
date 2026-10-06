import { Link } from "react-router-dom";
import "./SportTile.css";

interface SportTileProps {
  nom: string;
  nombreEquipes: number;
  href: string;
  couleur: "blue" | "deep" | "red";
  size?: "big" | "secondary";
  index: number;
}

/** Tuile typographique pour un sport sans photo propre encore disponible. */
export default function SportTile({
  nom,
  nombreEquipes,
  href,
  couleur,
  size = "secondary",
  index,
}: SportTileProps) {
  return (
    <Link
      to={href}
      className={`al-sport-tile al-sport-tile--${couleur} al-sport-tile--${size}`}
    >
      <span className="al-sport-tile__num" aria-hidden="true">
        {String(index).padStart(2, "0")}
      </span>
      <h3 className="al-sport-tile__title">{nom}</h3>
      <span className="al-sport-tile__count">
        {nombreEquipes} équipe{nombreEquipes > 1 ? "s" : ""}
      </span>
      <span className="al-sport-tile__cta">Découvrir</span>
    </Link>
  );
}
