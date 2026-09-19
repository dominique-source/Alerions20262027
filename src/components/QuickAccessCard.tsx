import { Link } from "react-router-dom";
import "./QuickAccessCard.css";

interface QuickAccessCardProps {
  eyebrow: string;
  title: string;
  meta: string;
  href: string;
  linkLabel: string;
}

/**
 * Carte utilisée dans « Prochains événements » (prochain entraînement,
 * prochain match, dernière nouvelle).
 */
export default function QuickAccessCard({
  eyebrow,
  title,
  meta,
  href,
  linkLabel,
}: QuickAccessCardProps) {
  return (
    <article className="al-qac">
      <span className="al-qac__eyebrow">{eyebrow}</span>
      <h3 className="al-qac__title">{title}</h3>
      <p className="al-qac__meta">{meta}</p>
      <Link className="al-qac__link" to={href}>
        {linkLabel} →
      </Link>
    </article>
  );
}
