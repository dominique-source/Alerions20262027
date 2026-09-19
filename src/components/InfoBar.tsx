import { Link } from "react-router-dom";
import { evenementsExemple } from "../data/events";
import { equipes } from "../data/teams";
import { useTeamSelection } from "../hooks/useTeamSelection";
import "./InfoBar.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "short" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/** Bande d'information rouge sous le hero : Aujourd'hui / Prochain match / Mon équipe. */
export default function InfoBar() {
  const { selection } = useTeamSelection();
  const equipeChoisie = equipes.find((e) => e.slug === selection.equipe);

  const aujourdhuiIso = new Date().toISOString().slice(0, 10);
  const evenementsAujourdhui = evenementsExemple.filter((e) => e.date === aujourdhuiIso);

  const prochainMatch = evenementsExemple
    .filter((e) => e.type === "match" && e.date >= aujourdhuiIso)
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  return (
    <div className="al-infobar">
      <div className="container al-infobar__row">
        <div className="al-infobar__item">
          <span className="al-infobar__label">Aujourd'hui</span>
          <span className="al-infobar__value">
            {evenementsAujourdhui.length > 0
              ? `${evenementsAujourdhui[0].titre} · ${evenementsAujourdhui[0].heure}`
              : "Information à confirmer"}
          </span>
        </div>

        <div className="al-infobar__item">
          <span className="al-infobar__label">Prochain match</span>
          <span className="al-infobar__value">
            {prochainMatch
              ? `${formaterDate(prochainMatch.date)} · ${prochainMatch.heure}`
              : "Information à confirmer"}
          </span>
        </div>

        <div className="al-infobar__item">
          <span className="al-infobar__label">Mon équipe</span>
          <span className="al-infobar__value">
            {equipeChoisie ? (
              equipeChoisie.nom
            ) : (
              <Link to="/equipes">Choisir mon équipe →</Link>
            )}
          </span>
        </div>
      </div>
    </div>
  );
}
