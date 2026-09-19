import type { Evenement } from "../types";
import { categoriesSports, equipes } from "../data/teams";
import "./EventCard.css";

const libellesType: Record<Evenement["type"], string> = {
  entrainement: "Entraînement",
  match: "Match",
  tournoi: "Tournoi",
  autre: "Activité",
};

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", {
    weekday: "short",
    day: "numeric",
    month: "short",
  }).format(new Date(`${date}T00:00:00`));
}

/** Carte d'événement : date, heure, type, équipe, lieu, sport. */
export default function EventCard({ evenement }: { evenement: Evenement }) {
  const sport = categoriesSports.find((c) => c.sport === evenement.sportSlug);
  const equipe = equipes.find((e) => e.slug === evenement.equipeSlug);

  const meta = [
    formaterDate(evenement.date),
    evenement.lieu,
    sport?.nom,
    equipe?.nom,
  ]
    .filter(Boolean)
    .join(" · ");

  return (
    <article className="al-event-card">
      <span className="al-event-card__heure tnum">{evenement.heure}</span>
      <div className="al-event-card__corps">
        <span className="al-event-card__type">{libellesType[evenement.type]}</span>
        <h3 className="al-event-card__titre">{evenement.titre}</h3>
        <p className="al-event-card__meta">{meta}</p>
        {evenement.statut === "exemple" && (
          <span className="al-event-card__badge">Exemple de présentation</span>
        )}
      </div>
    </article>
  );
}
