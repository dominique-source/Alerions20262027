import { useMemo, useState } from "react";
import EventCard from "../components/EventCard";
import EmptyState from "../components/EmptyState";
import { evenementsExemple } from "../data/events";
import { categoriesSports, equipes } from "../data/teams";
import "./CalendrierPage.css";

type Periode = "aujourdhui" | "semaine" | "mois" | "saison";

const onglets: { valeur: Periode; label: string }[] = [
  { valeur: "aujourdhui", label: "Aujourd'hui" },
  { valeur: "semaine", label: "Cette semaine" },
  { valeur: "mois", label: "Ce mois" },
  { valeur: "saison", label: "Ma saison" },
];

function estDansPeriode(dateIso: string, periode: Periode): boolean {
  const date = new Date(`${dateIso}T00:00:00`);
  const aujourdhui = new Date();
  aujourdhui.setHours(0, 0, 0, 0);

  if (periode === "saison") return true;

  if (periode === "aujourdhui") {
    return date.getTime() === aujourdhui.getTime();
  }

  if (periode === "semaine") {
    const dansSeptJours = new Date(aujourdhui);
    dansSeptJours.setDate(dansSeptJours.getDate() + 7);
    return date >= aujourdhui && date <= dansSeptJours;
  }

  // mois
  return (
    date.getFullYear() === aujourdhui.getFullYear() &&
    date.getMonth() === aujourdhui.getMonth()
  );
}

/**
 * Page Calendrier — la page la plus fonctionnelle du site.
 * Présentation par journées : colonne date (gauche) + activités (droite)
 * sur ordinateur, liste verticale avec heure en premier sur téléphone.
 */
export default function CalendrierPage() {
  const [periode, setPeriode] = useState<Periode>("saison");
  const [recherche, setRecherche] = useState("");
  const [sport, setSport] = useState("");
  const [equipe, setEquipe] = useState("");
  const [lieu, setLieu] = useState("");
  const [type, setType] = useState("");
  const [filtresOuverts, setFiltresOuverts] = useState(false);

  const lieux = useMemo(
    () => Array.from(new Set(evenementsExemple.map((e) => e.lieu))),
    [],
  );

  const evenementsFiltres = useMemo(() => {
    return evenementsExemple
      .filter((e) => estDansPeriode(e.date, periode))
      .filter((e) => !recherche || e.titre.toLowerCase().includes(recherche.toLowerCase()))
      .filter((e) => !sport || e.sportSlug === sport)
      .filter((e) => !equipe || e.equipeSlug === equipe)
      .filter((e) => !lieu || e.lieu === lieu)
      .filter((e) => !type || e.type === type)
      .sort((a, b) => a.date.localeCompare(b.date) || a.heure.localeCompare(b.heure));
  }, [periode, recherche, sport, equipe, lieu, type]);

  const evenementsParJour = useMemo(() => {
    const groupes = new Map<string, typeof evenementsExemple>();
    for (const evenement of evenementsFiltres) {
      const liste = groupes.get(evenement.date) ?? [];
      liste.push(evenement);
      groupes.set(evenement.date, liste);
    }
    return groupes;
  }, [evenementsFiltres]);

  const filtresPanneau = (
    <div className="al-cal__filters" hidden={!filtresOuverts}>
      <div className="al-cal__filter-field">
        <label htmlFor="filtre-sport">Sport</label>
        <select id="filtre-sport" value={sport} onChange={(e) => setSport(e.target.value)}>
          <option value="">Tous les sports</option>
          {categoriesSports.map((c) => (
            <option key={c.sport} value={c.sport}>
              {c.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="al-cal__filter-field">
        <label htmlFor="filtre-equipe">Équipe</label>
        <select id="filtre-equipe" value={equipe} onChange={(e) => setEquipe(e.target.value)}>
          <option value="">Toutes les équipes</option>
          {equipes.map((eq) => (
            <option key={eq.slug} value={eq.slug}>
              {eq.nom}
            </option>
          ))}
        </select>
      </div>
      <div className="al-cal__filter-field">
        <label htmlFor="filtre-lieu">Lieu</label>
        <select id="filtre-lieu" value={lieu} onChange={(e) => setLieu(e.target.value)}>
          <option value="">Tous les lieux</option>
          {lieux.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
      </div>
      <div className="al-cal__filter-field">
        <label htmlFor="filtre-type">Type d'activité</label>
        <select id="filtre-type" value={type} onChange={(e) => setType(e.target.value)}>
          <option value="">Tous les types</option>
          <option value="entrainement">Entraînement</option>
          <option value="match">Match</option>
          <option value="tournoi">Tournoi</option>
          <option value="autre">Autre</option>
        </select>
      </div>
    </div>
  );

  return (
    <>
      <header className="al-page-header">
        <div className="container">
          <span className="al-page-header__eyebrow">Saison 2026-2027</span>
          <h1>Calendrier</h1>
          <p>Tous les entraînements, matchs et tournois des Alérions.</p>
        </div>
      </header>

      <section className="al-section al-section--blanc">
        <div className="container">
          <div className="al-cal__toolbar">
            <div className="al-cal__tabs" role="tablist" aria-label="Période">
              {onglets.map((onglet) => (
                <button
                  key={onglet.valeur}
                  type="button"
                  className="al-cal__tab"
                  role="tab"
                  aria-pressed={periode === onglet.valeur}
                  onClick={() => setPeriode(onglet.valeur)}
                >
                  {onglet.label}
                </button>
              ))}
            </div>

            <div className="al-cal__search">
              <label htmlFor="recherche-calendrier" className="sr-only">
                Rechercher un événement
              </label>
              <input
                id="recherche-calendrier"
                type="search"
                placeholder="Rechercher un événement…"
                value={recherche}
                onChange={(e) => setRecherche(e.target.value)}
              />
            </div>

            <button
              type="button"
              className="al-cal__filter-toggle"
              aria-expanded={filtresOuverts}
              aria-controls="filtres-calendrier"
              onClick={() => setFiltresOuverts((v) => !v)}
            >
              {filtresOuverts ? "Masquer les filtres" : "Filtres"}
            </button>
          </div>

          <div className="al-cal__body">
            <div id="filtres-calendrier">{filtresPanneau}</div>

            <div>
              {evenementsFiltres.length === 0 ? (
                <EmptyState title="Aucun événement ne correspond à vos filtres." />
              ) : (
                Array.from(evenementsParJour.entries()).map(([date, evenementsJour]) => {
                  const dateObj = new Date(`${date}T00:00:00`);
                  return (
                    <div className="al-cal__day-group" key={date}>
                      <div className="al-cal__day-date">
                        <span className="al-cal__day-num tnum">
                          {new Intl.DateTimeFormat("fr-CA", { day: "numeric" }).format(dateObj)}
                        </span>
                        <span className="al-cal__day-label">
                          <strong>
                            {new Intl.DateTimeFormat("fr-CA", { weekday: "long" }).format(dateObj)}
                          </strong>
                          <span>
                            {new Intl.DateTimeFormat("fr-CA", { month: "long" }).format(dateObj)}
                          </span>
                        </span>
                      </div>
                      <div className="al-cal__day-events">
                        {evenementsJour.map((evenement) => (
                          <EventCard key={evenement.id} evenement={evenement} />
                        ))}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
