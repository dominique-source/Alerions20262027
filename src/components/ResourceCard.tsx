import "./ResourceCard.css";

interface ResourceCardProps {
  titre: string;
  description?: string;
}

/** Carte simple pour lister les rubriques des pages Espaces (Parents, Athlètes...). */
export default function ResourceCard({ titre, description }: ResourceCardProps) {
  return (
    <article className="al-resource-card">
      <span className="al-resource-card__icon" aria-hidden="true">
        {titre.charAt(0)}
      </span>
      <h3 className="al-resource-card__title">{titre}</h3>
      <p className="al-resource-card__desc">{description ?? "Information à venir"}</p>
    </article>
  );
}
