import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { cheminPhoto } from "../lib/images";
import "./PhotoFeature.css";

interface PhotoFeatureProps {
  image: string;
  imageAlt: string;
  title: string;
  eyebrow?: string;
  href?: string;
  size?: "big" | "secondary";
  ctaLabel?: string;
  /** Signale qu'il s'agit d'une photo de référence temporaire, pas de la photo officielle du programme. */
  photoDeReference?: boolean;
}

/**
 * Tuile photographique éditoriale : grande photo, dégradé sombre limité au
 * bas de l'image, titre directement sur la photo. Remplace les cartes
 * blanches identiques (galerie, actualités, équipes).
 */
export default function PhotoFeature({
  image,
  imageAlt,
  title,
  eyebrow,
  href,
  size = "secondary",
  ctaLabel,
  photoDeReference,
}: PhotoFeatureProps) {
  const contenu: ReactNode = (
    <>
      <div className="al-feature__media">
        <img src={cheminPhoto(image)} alt={imageAlt} loading="lazy" decoding="async" />
        <div className="al-feature__scrim" aria-hidden="true" />
      </div>
      {photoDeReference && (
        <span className="al-feature__ref-badge">Photo de référence à remplacer</span>
      )}
      <div className="al-feature__body">
        {eyebrow && <span className="al-feature__eyebrow">{eyebrow}</span>}
        <h3 className="al-feature__title">{title}</h3>
        {ctaLabel && <span className="al-feature__cta">{ctaLabel}</span>}
      </div>
    </>
  );

  const className = `al-feature al-feature--${size}`;

  if (href) {
    return (
      <Link to={href} className={className}>
        {contenu}
      </Link>
    );
  }

  return <div className={className}>{contenu}</div>;
}
