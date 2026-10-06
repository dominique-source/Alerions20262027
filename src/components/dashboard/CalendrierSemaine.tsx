import { Link } from "react-router-dom";
import type { Evenement } from "../../types";
import "./CalendrierSemaine.css";

interface CalendrierSemaineProps {
  evenements: Evenement[];
}

const JOURS = ["LUN", "MAR", "MER", "JEU", "VEN", "SAM", "DIM"];

function debutSemaine(date: Date): Date {
  const d = new Date(date);
  const jour = d.getDay(); // 0=dim..6=sam
  const decalage = jour === 0 ? -6 : 1 - jour;
  d.setDate(d.getDate() + decalage);
  d.setHours(0, 0, 0, 0);
  return d;
}

function versIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

/** Semaine courante (lundi à dimanche) — mêmes événements que le calendrier public, filtrés pour une équipe/sport. */
export default function CalendrierSemaine({ evenements }: CalendrierSemaineProps) {
  const lundi = debutSemaine(new Date());
  const jours = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(lundi);
    d.setDate(d.getDate() + i);
    return d;
  });

  return (
    <div className="al-cal-semaine">
      {jours.map((jour, i) => {
        const iso = versIso(jour);
        const evenementsJour = evenements.filter((e) => e.date === iso);
        return (
          <div key={iso} className="al-cal-semaine__jour">
            <div className="al-cal-semaine__entete">
              <span className="al-cal-semaine__nom">{JOURS[i]}</span>
              <span className="al-cal-semaine__chiffre">{jour.getDate()}</span>
            </div>
            <div className="al-cal-semaine__evenements">
              {evenementsJour.length === 0 ? (
                <span className="al-cal-semaine__rien" aria-hidden="true">
                  —
                </span>
              ) : (
                evenementsJour.map((e) => (
                  <Link
                    key={e.id}
                    to={`/calendrier/evenement/${e.id}`}
                    className={`al-cal-semaine__puce al-cal-semaine__puce--${e.type}`}
                  >
                    <span className="al-cal-semaine__puce-titre">{e.titre}</span>
                    {e.heure && <span className="al-cal-semaine__puce-heure">{e.heure.replace(":", " h ")}</span>}
                  </Link>
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
