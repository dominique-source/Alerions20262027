import type { ReactNode } from "react";
import "./SectionTitle.css";

interface SectionTitleProps {
  eyebrow?: string;
  title: string;
  description?: string;
  center?: boolean;
  action?: ReactNode;
}

/** Titre de section réutilisable : surtitre + titre court + description optionnelle. */
export default function SectionTitle({
  eyebrow,
  title,
  description,
  center,
  action,
}: SectionTitleProps) {
  return (
    <div className={`al-section-title${center ? " al-section-title--center" : ""}`}>
      {eyebrow && <span className="al-section-title__eyebrow">{eyebrow}</span>}
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {action}
    </div>
  );
}
