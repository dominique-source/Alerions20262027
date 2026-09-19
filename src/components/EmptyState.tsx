import "./EmptyState.css";

interface EmptyStateProps {
  title: string;
  description?: string;
}

/** État vide générique (ex. « Aucun événement ne correspond à vos filtres. »). */
export default function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <div className="al-empty" role="status">
      <span className="al-empty__icon" aria-hidden="true">
        —
      </span>
      <p className="al-empty__title">{title}</p>
      {description && <p>{description}</p>}
    </div>
  );
}
