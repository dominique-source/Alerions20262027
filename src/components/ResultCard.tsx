import type { Resultat } from "../types";
import { trouverSport } from "../data/sports";
import "./ResultCard.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/** Ligne de résultat sobre (pas de carte) — accueil et page Résultats. */
export default function ResultCard({ resultat }: { resultat: Resultat }) {
  const sport = trouverSport(resultat.sportSlug);

  return (
    <article className="al-result-row">
      <span className="al-result-row__date">{formaterDate(resultat.date)}</span>
      <div>
        <p className="al-result-row__matchup">Alérions vs {resultat.adversaire}</p>
        <div className="al-result-row__meta">{sport && <span>{sport.nom}</span>}</div>
      </div>
      <span className="al-result-row__score tnum">{resultat.score}</span>
    </article>
  );
}
