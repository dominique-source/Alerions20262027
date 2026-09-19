import type { Resultat } from "../types";
import { categoriesSports } from "../data/teams";
import "./ResultCard.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/** Ligne de résultat sobre (pas de carte) — accueil et page Résultats. */
export default function ResultCard({ resultat }: { resultat: Resultat }) {
  const sport = categoriesSports.find((c) => c.sport === resultat.sportSlug);

  return (
    <article className="al-result-row">
      <span className="al-result-row__date">{formaterDate(resultat.date)}</span>
      <div>
        <p className="al-result-row__matchup">Alérions vs {resultat.adversaire}</p>
        <div className="al-result-row__meta">
          {sport && <span>{sport.nom}</span>}
          {resultat.statut === "exemple" && (
            <span className="al-result-row__badge">Exemple de présentation</span>
          )}
        </div>
      </div>
      <span className="al-result-row__score tnum">{resultat.score}</span>
    </article>
  );
}
