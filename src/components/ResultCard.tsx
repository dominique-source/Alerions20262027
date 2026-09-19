import type { Resultat } from "../types";
import "./ResultCard.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/** Carte de résultat (accueil + page Résultats). */
export default function ResultCard({ resultat }: { resultat: Resultat }) {
  return (
    <article className="al-result-card">
      <div className="al-result-card__meta">
        <span>{formaterDate(resultat.date)}</span>
      </div>
      <p className="al-result-card__matchup">Alérions vs {resultat.adversaire}</p>
      <p className="al-result-card__score tnum">{resultat.score}</p>
      {resultat.statut === "exemple" && (
        <span className="al-result-card__badge">Exemple de présentation</span>
      )}
    </article>
  );
}
