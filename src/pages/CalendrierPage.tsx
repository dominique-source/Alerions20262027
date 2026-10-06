import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { evenements, prochainEvenement } from "../data/events";
import { telechargerICS } from "../lib/ics";
import type { Evenement } from "../types";
import "./CalendrierPage.css";

type Vue = "mois" | "semaine";
type FiltreEquipe = "toutes" | "cadet" | "juvenile";

const JOURS = ["Lun", "Mar", "Mer", "Jeu", "Ven", "Sam", "Dim"];

function categorieDe(e: Evenement): FiltreEquipe {
  if (e.id.startsWith("cadet-")) return "cadet";
  if (e.id.startsWith("juvenile-")) return "juvenile";
  return "toutes";
}

function debutMois(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function clesJour(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** Les cases du quadrillage (lundi en première colonne), semaines complètes. */
function cellulesDuMois(moisVise: Date): Date[] {
  const premier = debutMois(moisVise);
  const decalage = (premier.getDay() + 6) % 7; // 0 = lundi
  const debut = new Date(premier);
  debut.setDate(premier.getDate() - decalage);
  const cellules: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const jour = new Date(debut);
    jour.setDate(debut.getDate() + i);
    cellules.push(jour);
  }
  return cellules;
}

function debutSemaineDe(date: Date): Date {
  const decalage = (date.getDay() + 6) % 7;
  const lundi = new Date(date);
  lundi.setDate(date.getDate() - decalage);
  lundi.setHours(0, 0, 0, 0);
  return lundi;
}

export default function CalendrierPage() {
  const prochain = prochainEvenement();
  const dateInitiale = prochain ? new Date(`${prochain.date}T00:00:00`) : new Date();

  const [vue, setVue] = useState<Vue>("mois");
  const [moisVise, setMoisVise] = useState(() => debutMois(dateInitiale));
  const [semaineVisee, setSemaineVisee] = useState(() => debutSemaineDe(dateInitiale));
  const [filtreEquipe, setFiltreEquipe] = useState<FiltreEquipe>("toutes");
  const [selectionId, setSelectionId] = useState<string | null>(prochain?.id ?? null);

  const evenementsFiltres = useMemo(
    () => evenements.filter((e) => filtreEquipe === "toutes" || categorieDe(e) === filtreEquipe),
    [filtreEquipe],
  );

  const evenementsParJour = useMemo(() => {
    const carte = new Map<string, Evenement[]>();
    for (const e of evenementsFiltres) {
      const liste = carte.get(e.date) ?? [];
      liste.push(e);
      carte.set(e.date, liste);
    }
    for (const liste of carte.values()) {
      liste.sort((a, b) => (a.heure ?? "99:99").localeCompare(b.heure ?? "99:99"));
    }
    return carte;
  }, [evenementsFiltres]);

  const evenementSelectionne = evenements.find((e) => e.id === selectionId) ?? null;
  const aujourdhuiIso = new Date().toISOString().slice(0, 10);

  const cellules = useMemo(() => cellulesDuMois(moisVise), [moisVise]);
  const semaineJours = useMemo(() => {
    const jours: Date[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date(semaineVisee);
      d.setDate(semaineVisee.getDate() + i);
      jours.push(d);
    }
    return jours;
  }, [semaineVisee]);

  function choisirJour(jour: Date) {
    const evenementsJour = evenementsParJour.get(clesJour(jour)) ?? [];
    if (evenementsJour[0]) setSelectionId(evenementsJour[0].id);
  }

  return (
    <div className="al-calendrier">
      <div className="al-calendrier__entete">
        <div>
          <span className="al-v2-eyebrow">Saison 2026-2027</span>
          <h1 className="al-v2-title al-calendrier__titre">Le calendrier</h1>
        </div>
      </div>

      <div className="al-calendrier__corps">
        <div className="al-calendrier__principal">
          <div className="al-calendrier__barre">
            {vue === "mois" ? (
              <div className="al-calendrier__nav-mois">
                <button
                  type="button"
                  aria-label="Mois précédent"
                  onClick={() => setMoisVise((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))}
                >
                  ‹
                </button>
                <span className="al-calendrier__mois-nom">
                  {new Intl.DateTimeFormat("fr-CA", { month: "long", year: "numeric" }).format(moisVise)}
                </span>
                <button
                  type="button"
                  aria-label="Mois suivant"
                  onClick={() => setMoisVise((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))}
                >
                  ›
                </button>
              </div>
            ) : (
              <div className="al-calendrier__nav-mois">
                <button
                  type="button"
                  aria-label="Semaine précédente"
                  onClick={() => setSemaineVisee((s) => new Date(s.getFullYear(), s.getMonth(), s.getDate() - 7))}
                >
                  ‹
                </button>
                <span className="al-calendrier__mois-nom">
                  Semaine du {new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(semaineVisee)}
                </span>
                <button
                  type="button"
                  aria-label="Semaine suivante"
                  onClick={() => setSemaineVisee((s) => new Date(s.getFullYear(), s.getMonth(), s.getDate() + 7))}
                >
                  ›
                </button>
              </div>
            )}

            <div className="al-calendrier__controles">
              <label className="al-calendrier__select">
                <span className="sr-only">Filtrer par équipe</span>
                <select value={filtreEquipe} onChange={(e) => setFiltreEquipe(e.target.value as FiltreEquipe)}>
                  <option value="toutes">Toutes les équipes</option>
                  <option value="cadet">Cadet</option>
                  <option value="juvenile">Juvénile</option>
                </select>
              </label>
              <div className="al-calendrier__vues" role="tablist" aria-label="Vue">
                <button type="button" role="tab" aria-selected={vue === "mois"} onClick={() => setVue("mois")}>
                  Mois
                </button>
                <button type="button" role="tab" aria-selected={vue === "semaine"} onClick={() => setVue("semaine")}>
                  Semaine
                </button>
              </div>
            </div>
          </div>

          {vue === "mois" ? (
            <div className="al-calendrier__grille">
              {JOURS.map((j) => (
                <div key={j} className="al-calendrier__entete-jour">
                  {j}
                </div>
              ))}
              {cellules.map((jour) => {
                const cle = clesJour(jour);
                const horsMois = jour.getMonth() !== moisVise.getMonth();
                const evenementsJour = evenementsParJour.get(cle) ?? [];
                const estSelectionne = evenementsJour.some((e) => e.id === selectionId);
                const estAujourdhui = cle === aujourdhuiIso;
                return (
                  <button
                    key={cle}
                    type="button"
                    className={`al-calendrier__case${horsMois ? " al-calendrier__case--hors" : ""}${
                      estSelectionne ? " al-calendrier__case--selectionnee" : ""
                    }${estAujourdhui ? " al-calendrier__case--aujourdhui" : ""}`}
                    onClick={() => choisirJour(jour)}
                    disabled={evenementsJour.length === 0}
                  >
                    <span className="al-calendrier__case-num tnum">{jour.getDate()}</span>
                    <span className="al-calendrier__case-pills">
                      {evenementsJour.slice(0, 2).map((e) => (
                        <span
                          key={e.id}
                          className={`al-calendrier__pill al-calendrier__pill--${
                            e.type === "pratique" ? "pratique" : e.type === "match" ? "match" : "optionnel"
                          }`}
                        >
                          {e.type === "pratique" ? "Entraînement" : e.titre}
                          {e.heure ? ` ${e.heure.replace(":", " h ")}` : ""}
                        </span>
                      ))}
                    </span>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="al-calendrier__semaine">
              {semaineJours.map((jour) => {
                const cle = clesJour(jour);
                const evenementsJour = evenementsParJour.get(cle) ?? [];
                return (
                  <div key={cle} className="al-calendrier__semaine-jour">
                    <div className="al-calendrier__semaine-date">
                      <strong>{new Intl.DateTimeFormat("fr-CA", { weekday: "short" }).format(jour)}</strong>
                      <span className="tnum">{jour.getDate()}</span>
                    </div>
                    <div className="al-calendrier__semaine-liste">
                      {evenementsJour.length === 0 ? (
                        <span className="al-calendrier__semaine-vide">—</span>
                      ) : (
                        evenementsJour.map((e) => (
                          <button
                            key={e.id}
                            type="button"
                            className={`al-calendrier__pill al-calendrier__pill--${
                              e.type === "pratique" ? "pratique" : e.type === "match" ? "match" : "optionnel"
                            }${selectionId === e.id ? " al-calendrier__pill--active" : ""}`}
                            onClick={() => setSelectionId(e.id)}
                          >
                            {e.heure ? `${e.heure.replace(":", " h ")} — ` : ""}
                            {e.titre}
                          </button>
                        ))
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <aside className="al-calendrier__panneau">
          {evenementSelectionne ? (
            <>
              <div className="al-calendrier__panneau-date">
                <span className="al-calendrier__panneau-jour tnum">
                  {new Intl.DateTimeFormat("fr-CA", { day: "numeric" }).format(
                    new Date(`${evenementSelectionne.date}T00:00:00`),
                  )}
                </span>
                <span className="al-calendrier__panneau-mois">
                  {new Intl.DateTimeFormat("fr-CA", { month: "long" }).format(
                    new Date(`${evenementSelectionne.date}T00:00:00`),
                  )}
                </span>
              </div>
              <h2 className="al-v2-title al-calendrier__panneau-titre">{evenementSelectionne.titre}</h2>
              {evenementSelectionne.heure && (
                <p className="al-calendrier__panneau-heure">🕐 {evenementSelectionne.heure.replace(":", " h ")}</p>
              )}
              {evenementSelectionne.lieu && <p className="al-calendrier__panneau-lieu">📍 {evenementSelectionne.lieu}</p>}

              <Link to={`/calendrier/evenement/${evenementSelectionne.id}`} className="al-btn-v2 al-btn-v2--red al-calendrier__panneau-bouton">
                Voir les détails <span aria-hidden="true">→</span>
              </Link>

              <div className="al-calendrier__panneau-actions">
                {evenementSelectionne.lienEmplacement && (
                  <a
                    href={evenementSelectionne.lienEmplacement}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm"
                  >
                    📍 Itinéraire
                  </a>
                )}
                <button
                  type="button"
                  className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm"
                  onClick={() => telechargerICS(evenementSelectionne)}
                >
                  📅 Ajouter
                </button>
              </div>
            </>
          ) : (
            <p className="al-calendrier__panneau-vide">Choisis une journée pour voir le détail.</p>
          )}
        </aside>
      </div>
    </div>
  );
}
