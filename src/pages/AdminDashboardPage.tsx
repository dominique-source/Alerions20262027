import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { espacesAutorises } from "../lib/permissions";
import { useComptesAdmin } from "../hooks/useComptesAdmin";
import { sports } from "../data/sports";
import { equipes } from "../data/teams";
import { evenements } from "../data/events";
import DashboardShell from "../components/dashboard/DashboardShell";
import EspaceSelector from "../components/dashboard/EspaceSelector";
import CalendrierSemaine from "../components/dashboard/CalendrierSemaine";
import type { SportSlug } from "../types";
import "./AdminDashboardPage.css";

const navItems = [
  { label: "Vue d'ensemble", icone: "🏠", to: "/espace/admin" },
  { label: "Équipes", icone: "👥", to: "/equipes" },
  { label: "Joueurs et entraîneurs", icone: "🧑‍🤝‍🧑", to: "/espace/admin" },
  { label: "Horaires", icone: "📅", to: "/calendrier" },
  { label: "Modération", icone: "🛡️", to: "/espace/admin" },
  { label: "Connexions Google", icone: "🔗", to: "/espace/admin" },
  { label: "Paramètres", icone: "⚙️", to: "/compte" },
];

type StatutSheets = "inconnu" | "verification" | "ok" | "echec";

/**
 * Dashboard admin — maquette « PILOTE LA SAISON. ». Les indicateurs
 * équipes/joueurs/entraîneurs ne recopient jamais les chiffres de la
 * maquette (38/456/76) : « équipes » vient du catalogue réel
 * (src/data/teams.ts, 38 équipes officielles) ; joueurs/entraîneurs
 * agrégés sur les 38 équipes nécessiteraient 38 lectures Google Sheets —
 * non fait ici, affiché honnêtement comme non disponible plutôt
 * qu'inventé.
 */
export default function AdminDashboardPage() {
  const { compte } = useAuth();
  const [sportFiltre, setSportFiltre] = useState<SportSlug>("basketball");
  const equipesDuSport = equipes.filter((e) => e.sportSlug === sportFiltre);
  const [equipeFiltre, setEquipeFiltre] = useState(equipesDuSport[0]?.slug ?? "");
  const [statutSheets, setStatutSheets] = useState<StatutSheets>("inconnu");
  const comptesAdmin = useComptesAdmin(true);

  if (!compte) return null;
  const espaces = espacesAutorises(compte);

  const evenementsFiltres = evenements.filter((e) => e.sportSlug === sportFiltre);

  async function verifierSheets() {
    setStatutSheets("verification");
    try {
      const reponse = await fetch("/api/roster?idEquipe=2026-2027-basketball-cadet-masculin");
      setStatutSheets(reponse.ok ? "ok" : "echec");
    } catch {
      setStatutSheets("echec");
    }
  }

  return (
    <DashboardShell
      espaceLabel="Administration"
      titrePage="Vue d'ensemble"
      elementsNav={navItems}
      selecteurEspace={<EspaceSelector espaces={espaces} actif="administration" />}
    >
      <div className="al-adash">
        <header className="al-adash__entete">
          <div>
            <h1 className="al-v2-title al-adash__titre">
              PILOTE LA <span className="al-adash__titre-accent">SAISON.</span>
            </h1>
            <p className="al-adash__sous-titre">Alérions · Saison 2026-2027</p>
          </div>
          <button type="button" className="al-btn-v2 al-btn-v2--red" disabled title="Prochaine étape">
            + Ajouter un événement
          </button>
        </header>

        <div className="al-adash__indicateurs">
          <div className="al-adash__indicateur">
            <span className="al-adash__indicateur-chiffre">{equipes.length}</span>
            <span className="al-adash__indicateur-label">équipes</span>
          </div>
          <div className="al-adash__indicateur al-adash__indicateur--indispo" title="Nécessite l'agrégation Google Sheets des 38 équipes — non disponible dans cette étape">
            <span className="al-adash__indicateur-chiffre">—</span>
            <span className="al-adash__indicateur-label">joueurs (non agrégé)</span>
          </div>
          <div className="al-adash__indicateur al-adash__indicateur--indispo" title="Nécessite l'agrégation Google Sheets des 38 équipes — non disponible dans cette étape">
            <span className="al-adash__indicateur-chiffre">—</span>
            <span className="al-adash__indicateur-label">entraîneurs (non agrégé)</span>
          </div>
          <div className="al-adash__indicateur">
            <span className="al-adash__indicateur-chiffre al-adash__indicateur-chiffre--sm">2026-2027</span>
            <span className="al-adash__indicateur-label">saison</span>
          </div>
        </div>

        <div className="al-adash__grille">
          <div className="al-adash__colonne-principale">
            <div className="al-adash__bloc">
              <div className="al-adash__bloc-entete">
                <span className="al-v2-eyebrow">Horaires des équipes</span>
                <div className="al-adash__actions-calendrier">
                  <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled title="Prochaine étape">
                    ⚡ Saisie rapide
                  </button>
                  <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled title="Prochaine étape">
                    + Créneau récurrent
                  </button>
                </div>
              </div>

              <div className="al-adash__filtres">
                <label className="al-adash__filtre">
                  <span className="sr-only">Sport</span>
                  <select
                    value={sportFiltre}
                    onChange={(e) => {
                      const slug = e.target.value as SportSlug;
                      setSportFiltre(slug);
                      const premiere = equipes.find((eq) => eq.sportSlug === slug);
                      setEquipeFiltre(premiere?.slug ?? "");
                    }}
                  >
                    {sports.map((s) => (
                      <option key={s.slug} value={s.slug}>
                        {s.nom}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="al-adash__filtre">
                  <span className="sr-only">Équipe</span>
                  <select value={equipeFiltre} onChange={(e) => setEquipeFiltre(e.target.value)}>
                    {equipesDuSport.map((eq) => (
                      <option key={eq.slug} value={eq.slug}>
                        {eq.nom}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <CalendrierSemaine evenements={evenementsFiltres} />

              <p className="al-adash__note-calendrier">
                Modifier les horaires et connecter un calendrier Google sont des prochaines étapes — aucune action ici
                ne simule une sauvegarde.
              </p>
            </div>

            <div className="al-adash__bloc">
              <div className="al-adash__bloc-entete">
                <span className="al-v2-eyebrow">Gestion des équipes</span>
              </div>
              <table className="al-adash__table">
                <thead>
                  <tr>
                    <th>Équipe</th>
                    <th>Sport</th>
                    <th>Effectif</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {equipes.slice(0, 8).map((eq) => {
                    const sport = sports.find((s) => s.slug === eq.sportSlug);
                    return (
                      <tr key={eq.slug + eq.sportSlug}>
                        <td>{eq.nom}</td>
                        <td>{sport?.nom ?? eq.sportSlug}</td>
                        <td className="al-adash__table-dash" title="Voir la fiche de l'équipe pour l'effectif réel">
                          Voir la fiche
                        </td>
                        <td>
                          <Link
                            to={`/equipes/${eq.sportSlug}/${eq.slug}`}
                            className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm"
                          >
                            Voir
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <Link to="/equipes" className="al-adash__voir-tout">
                Voir les {equipes.length} équipes <span aria-hidden="true">→</span>
              </Link>
            </div>
          </div>

          <div className="al-adash__colonne-rail">
            <div className="al-adash__bloc">
              <span className="al-v2-eyebrow">Google Sheets</span>
              <p className="al-adash__statut">Équipes et effectifs.</p>
              <div className="al-adash__statut-badge">
                {statutSheets === "inconnu" && <span className="al-adash__badge al-adash__badge--attente">Non vérifié</span>}
                {statutSheets === "verification" && <span className="al-adash__badge al-adash__badge--attente">Vérification…</span>}
                {statutSheets === "ok" && <span className="al-adash__badge al-adash__badge--ok">Lecture confirmée</span>}
                {statutSheets === "echec" && <span className="al-adash__badge al-adash__badge--echec">Échec de lecture</span>}
              </div>
              <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" onClick={() => void verifierSheets()}>
                Vérifier la connexion
              </button>
            </div>

            <div className="al-adash__bloc">
              <span className="al-v2-eyebrow">Google Calendar</span>
              <span className="al-adash__badge al-adash__badge--echec">Non connecté</span>
              <p className="al-adash__statut">Aucun accès OAuth Google Calendar n'a été confirmé.</p>
              <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled title="Prochaine étape">
                Connecter un calendrier
              </button>
            </div>

            <div className="al-adash__bloc">
              <span className="al-v2-eyebrow">Gestion des accès</span>
              <p className="al-adash__statut">Joueurs, entraîneurs, admins.</p>

              {comptesAdmin.etat === "chargement" && <p className="al-adash__statut">Chargement…</p>}
              {comptesAdmin.etat === "erreur" && <p className="al-adash__statut">Impossible de charger les comptes.</p>}

              {comptesAdmin.etat === "pret" && comptesAdmin.donnees && (
                <ul className="al-adash__liste-comptes">
                  {comptesAdmin.donnees.comptes.map((c) => (
                    <li key={c.uid}>
                      <span className="al-adash__compte-nom">{c.displayName || c.uid}</span>
                      <span className="al-adash__compte-role">
                        {c.isAdmin ? "Admin" : "Compte"} · {c.enabled ? "Actif" : "Désactivé"}
                      </span>
                    </li>
                  ))}
                </ul>
              )}

              <Link to="/espace/admin" className="al-adash__voir-tout">
                Gérer les autorisations <span aria-hidden="true">→</span>
              </Link>
              <p className="al-adash__note-calendrier">La modification des permissions reste hors de cette étape.</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
