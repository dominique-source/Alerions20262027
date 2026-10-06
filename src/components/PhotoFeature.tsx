import { useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { cheminPhoto, cheminPublic } from "../lib/images";
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
  /** true si `image` est déjà un chemin relatif complet (ex. photos de campagne), plutôt qu'un simple nom de fichier dans images/alerions/. */
  cheminComplet?: boolean;
}

/**
 * Tuile photographique éditoriale : grande photo, dégradé sombre limité au
 * bas de l'image, titre directement sur la photo. Remplace les cartes
 * blanches identiques (galerie, actualités, équipes).
 *
 * Si le fichier n'existe pas encore (photo de campagne pas encore livrée),
 * la tuile entière disparaît au premier échec de chargement — jamais
 * d'icône d'image brisée ni de lien visuellement cassé.
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
  cheminComplet,
}: PhotoFeatureProps) {
  const [manquante, setManquante] = useState(false);
  if (manquante) return null;

  const src = cheminComplet ? cheminPublic(image) : cheminPhoto(image);
  const contenu: ReactNode = (
    <>
      <div className="al-feature__media">
        <img
          src={src}
          alt={imageAlt}
          loading="lazy"
          decoding="async"
          onError={() => setManquante(true)}
        />
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
