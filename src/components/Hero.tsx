import type { ReactNode } from "react";
import { cheminPhoto } from "../lib/images";
import "./Hero.css";

interface HeroProps {
  image: string;
  imageAlt: string;
  eyebrow?: string;
  title: ReactNode;
  lead?: string;
  actions?: ReactNode;
}

/** Section principale plein écran avec photo, titre court et appels à l'action. */
export default function Hero({ image, imageAlt, eyebrow, title, lead, actions }: HeroProps) {
  return (
    <section className="al-hero">
      <div className="al-hero__media">
        {/* Image principale chargée en priorité (LCP) : pas de lazy loading ici. */}
        <img src={cheminPhoto(image)} alt={imageAlt} fetchPriority="high" />
        <div className="al-hero__scrim" aria-hidden="true" />
      </div>
      <div className="container al-hero__content">
        {eyebrow && <span className="al-hero__eyebrow">{eyebrow}</span>}
        <h1 className="al-hero__title">{title}</h1>
        {lead && <p className="al-hero__lead">{lead}</p>}
        {actions && <div className="al-hero__actions">{actions}</div>}
      </div>
    </section>
  );
}
