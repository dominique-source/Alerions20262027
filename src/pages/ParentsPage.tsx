import { useState } from "react";
import { Link } from "react-router-dom";
import { evenements, prochainMatch } from "../data/events";
import { telechargerICS } from "../lib/ics";
import "./ParentsPage.css";

const CATEGORIES = ["Atome", "Benjamin", "Cadet", "Juvénile"];

function debutSemaine(reference: Date): Date {
  const d = new Date(reference);
  d.setHours(0, 0, 0, 0);
  const decalage = (d.getDay() + 6) % 7;
  d.setDate(d.getDate() - decalage);
  return d;
}

function formaterCourt(date: string): { jour: string; num: string; mois: string } {
  const d = new Date(`${date}T00:00:00`);
  return {
    jour: new Intl.DateTimeFormat("fr-CA", { weekday: "long" }).format(d).toUpperCase(),
    num: new Intl.DateTimeFormat("fr-CA", { day: "numeric" }).format(d),
    mois: new Intl.DateTimeFormat("fr-CA", { month: "long" }).format(d).toUpperCase(),
  };
}

/**
 * Espace Parents — reproduction de 01_MAQUETTES/parents-desktop-1536x1024.png.
 * Mêmes événements que le calendrier principal (src/data/events.ts).
 */
export default function ParentsPage() {
  const [categorie, setCategorie] = useState("Cadet");
  const match = prochainMatch();

  const debut = debutSemaine(new Date());
  const fin = new Date(debut);
  fin.setDate(debut.getDate() + 7);
  const finIso = fin.toISOString().slice(0, 10);
  const debutIso = debut.toISOString().slice(0, 10);

  const semaine = evenements
    .filter((e) => e.date >= debutIso && e.date < finIso)
    .filter((e) => (categorie === "Cadet" ? !e.id.startsWith("juvenile-") : true))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.heure ?? "").localeCompare(b.heure ?? ""))
    .slice(0, 6);

  return (
    <div className="al-parents">
      <div className="al-parents__hero">
        <div className="al-parents__hero-texte">
          <span className="al-equipe__crown" aria-hidden="true">
            ♛
          </span>
          <h1 className="al-v2-title al-parents__titre">
            La semaine de <span className="al-parents__titre-red">mon équipe</span>
          </h1>
          <label className="al-parents__select">
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c} 2026-2027
                </option>
              ))}
            </select>
          </label>
          {semaine.length > 0 && (
            <button
              type="button"
              className="al-btn-v2 al-btn-v2--red"
              onClick={() => semaine.forEach((e) => telechargerICS(e))}
            >
              📅 Ajouter les rendez-vous à mon calendrier
            </button>
          )}
        </div>
        <img className="al-parents__hero-image" src="/images/accueil/hero-portraits.png" alt="Athlètes Alérions" />
      </div>

      <div className="al-parents__corps">
        <div>
          <h2 className="al-v2-title al-parents__section-titre">Rendez-vous de la semaine</h2>
          {semaine.length === 0 ? (
            <p className="al-parents__vide">Aucun rendez-vous confirmé cette semaine pour le moment.</p>
          ) : (
            <div className="al-parents__liste">
              {semaine.map((e) => {
                const { jour, num, mois } = formaterCourt(e.date);
                return (
                  <div key={e.id} className="al-parents__ligne">
                    <div className="al-parents__ligne-date">
                      <span className="al-parents__ligne-jour">{jour}</span>
                      <span className="al-parents__ligne-num tnum">{num}</span>
                      <span className="al-parents__ligne-mois">{mois}</span>
                    </div>
                    <span className="al-parents__ligne-icone" aria-hidden="true">
                      {e.type === "pratique" ? "🏀" : e.type === "match" ? "🏆" : "👥"}
                    </span>
                    <div className="al-parents__ligne-corps">
                      <div className="al-parents__ligne-titre">{e.titre}</div>
                      {e.heure && <div className="al-parents__ligne-heure">🕐 {e.heure.replace(":", " h ")}</div>}
                    </div>
                    {e.lienEmplacement && (
                      <a
                        href={e.lienEmplacement}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm"
                      >
                        📍 Voir le lieu
                      </a>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="al-parents__aside">
          <div className="al-parents__bloc">
            <span className="al-v2-eyebrow">Prochain événement</span>
            {match ? (
              <>
                <div className="al-parents__bloc-titre">{match.titre}</div>
                <p className="al-parents__bloc-texte">
                  {new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
                    new Date(`${match.date}T00:00:00`),
                  )}
                  {match.heure ? ` · ${match.heure.replace(":", " h ")}` : ""}
                </p>
                <Link to={`/calendrier/evenement/${match.id}`} className="al-btn-v2 al-btn-v2--red al-btn-v2--sm">
                  Voir les détails <span aria-hidden="true">→</span>
                </Link>
              </>
            ) : (
              <p className="al-parents__bloc-texte">Aucun événement confirmé à venir.</p>
            )}
          </div>

          <div className="al-parents__bloc">
            <span className="al-v2-eyebrow">Documents</span>
            <ul className="al-parents__documents">
              <li>
                <Link to="/ressources">📄 Documents de la saison</Link>
              </li>
              <li>
                <Link to="/calendrier">📅 Calendrier complet</Link>
              </li>
            </ul>
          </div>

          <div className="al-parents__bloc">
            <span className="al-v2-eyebrow">Une question ?</span>
            <p className="al-parents__bloc-texte">
              Pour toute question concernant l'équipe, les horaires ou la saison.
            </p>
            <Link to="/contact" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm">
              💬 Écrire au responsable <span aria-hidden="true">→</span>
            </Link>
          </div>
        </aside>
      </div>
    </div>
  );
}
