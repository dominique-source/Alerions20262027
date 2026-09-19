import type { Evenement } from "../types";
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

/** Carte d'événement pour la page Calendrier (et les accès rapides de l'accueil). */
export default function EventCard({ evenement }: { evenement: Evenement }) {
  return (
    <article className="al-event-card">
      <span className="al-event-card__heure tnum">{evenement.heure}</span>
      <div className="al-event-card__corps">
        <span className="al-event-card__type">{libellesType[evenement.type]}</span>
        <h3 className="al-event-card__titre">{evenement.titre}</h3>
        <p className="al-event-card__lieu">
          {formaterDate(evenement.date)} · {evenement.lieu}
        </p>
        {evenement.statut === "exemple" && (
          <span className="al-event-card__badge">Exemple de présentation</span>
        )}
      </div>
    </article>
  );
}
