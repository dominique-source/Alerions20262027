import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { espacesAutorises, equipesPourRole } from "../lib/permissions";
import { useRoster } from "../hooks/useRoster";
import { useTeamChat } from "../hooks/useTeamChat";
import { evenements } from "../data/events";
import DashboardShell from "../components/dashboard/DashboardShell";
import EspaceSelector from "../components/dashboard/EspaceSelector";
import EquipeSelector from "../components/dashboard/EquipeSelector";
import AlerionsChatBloc from "../components/dashboard/AlerionsChatBloc";
import CalendrierSemaine from "../components/dashboard/CalendrierSemaine";
import PlayerCard from "../components/PlayerCard";
import "./EntraineurDashboardPage.css";

function navItems(nonLus: number) {
  return [
    { label: "Mon dashboard", icone: "🏠", to: "/espace/entraineur" },
    { label: "Mes équipes", icone: "👥", to: "/espace/entraineur" },
    { label: "Effectif", icone: "📋", to: "/espace/entraineur" },
    { label: "Alérions Chat", icone: "💬", to: "/espace/entraineur", badge: nonLus },
    { label: "Calendrier", icone: "📅", to: "/calendrier" },
    { label: "Présences", icone: "✅", to: "/espace/entraineur" },
    { label: "Annonces", icone: "📣", to: "/espace/entraineur" },
  ];
}

/**
 * Dashboard entraîneur — maquette « FAIS GRANDIR TON ÉQUIPE. ». Effectif,
 * compteurs et calendrier proviennent tous de l'équipe réellement
 * sélectionnée (rattachement entraineur actif + /api/roster) — jamais un
 * effectif complété artificiellement pour remplir la grille.
 */
export default function EntraineurDashboardPage() {
  const { compte } = useAuth();
  const idEquipes = compte ? equipesPourRole(compte.rattachements, "entraineur") : [];
  const [idEquipeActif, setIdEquipeActif] = useState<string | null>(null);
  const equipeCourante = idEquipeActif ?? idEquipes[0] ?? null;

  const { equipe, joueurs, entraineurs, etat: etatRoster } = useRoster(undefined, undefined, equipeCourante);
  const chat = useTeamChat(equipeCourante);

  if (!compte) return null;
  const espaces = espacesAutorises(compte);

  if (idEquipes.length === 0) {
    return (
      <DashboardShell
        espaceLabel="Espace entraîneur"
        titrePage="Mon dashboard"
        elementsNav={navItems(0)}
        selecteurEspace={<EspaceSelector espaces={espaces} actif="entraineur" />}
      >
        <p className="al-v2-eyebrow">Aucune équipe rattachée</p>
        <p>Ce compte n'a pas (ou plus) de rattachement actif comme entraîneur.</p>
      </DashboardShell>
    );
  }

  const lienChat = equipe ? `/equipes/${equipe.sport}/${equipe.slugSite}/chat` : "#";
  const evenementsEquipe = equipe ? evenements.filter((e) => e.sportSlug === equipe.sport) : [];
  const prochaineSeance = evenementsEquipe.find((e) => e.date >= new Date().toISOString().slice(0, 10));

  return (
    <DashboardShell
      espaceLabel="Espace entraîneur"
      titrePage="Mon dashboard"
      elementsNav={navItems(chat.nonLus)}
      selecteurEspace={<EspaceSelector espaces={espaces} actif="entraineur" />}
    >
      <div className="al-edash">
        <header className="al-edash__entete">
          <div>
            <h1 className="al-v2-title al-edash__titre">
              FAIS GRANDIR <span className="al-edash__titre-accent">TON ÉQUIPE.</span>
            </h1>
            {equipe && (
              <p className="al-edash__sous-titre">
                {equipe.sport} · {equipe.nomEquipe} · Saison {equipe.saison}
              </p>
            )}
          </div>
          <EquipeSelector idEquipes={idEquipes} idEquipeActif={equipeCourante} onChange={setIdEquipeActif} />
        </header>

        <div className="al-edash__indicateurs">
          <div className="al-edash__indicateur">
            <span className="al-edash__indicateur-chiffre">{etatRoster === "chargement" ? "…" : joueurs.length}</span>
            <span className="al-edash__indicateur-label">joueurs</span>
          </div>
          <div className="al-edash__indicateur">
            <span className="al-edash__indicateur-chiffre">{etatRoster === "chargement" ? "…" : entraineurs.length}</span>
            <span className="al-edash__indicateur-label">entraîneurs</span>
          </div>
          <div className="al-edash__indicateur">
            <span className="al-edash__indicateur-chiffre">{chat.nonLus}</span>
            <span className="al-edash__indicateur-label">messages non lus</span>
          </div>
          <div className="al-edash__indicateur">
            <span className="al-edash__indicateur-chiffre al-edash__indicateur-chiffre--sm">
              {prochaineSeance ? (prochaineSeance.heure ?? prochaineSeance.date) : "—"}
            </span>
            <span className="al-edash__indicateur-label">prochaine séance</span>
          </div>
        </div>

        <div className="al-edash__grille">
          <div className="al-edash__colonne-principale">
            <div className="al-edash__bloc">
              <div className="al-edash__bloc-entete">
                <span className="al-v2-eyebrow">Mon effectif</span>
                {equipe && (
                  <Link to={`/equipes/${equipe.sport}/${equipe.slugSite}`} className="al-edash__voir-tout">
                    Gérer les joueurs <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>

              {etatRoster === "chargement" && <p className="al-edash__statut">Chargement de l'effectif…</p>}
              {etatRoster === "erreur" && <p className="al-edash__statut">L'effectif n'a pas pu être chargé.</p>}
              {etatRoster === "vide" && <p className="al-edash__statut">Aucun joueur ni entraîneur trouvé pour cette équipe.</p>}

              {joueurs.length > 0 && (
                <div className="al-edash__grille-joueurs">
                  {joueurs.slice(0, 6).map((j) =>
                    equipe ? (
                      <PlayerCard
                        key={j.idMembre}
                        membre={j}
                        equipeNom={equipe.nomEquipe}
                        lienProfil={`/equipes/${equipe.sport}/${equipe.slugSite}/membres/${j.idMembre}`}
                      />
                    ) : null,
                  )}
                </div>
              )}

              {joueurs.length > 6 && equipe && (
                <Link to={`/equipes/${equipe.sport}/${equipe.slugSite}`} className="al-edash__voir-plus">
                  Voir les {joueurs.length} joueurs <span aria-hidden="true">→</span>
                </Link>
              )}
            </div>

            <div className="al-edash__bloc">
              <div className="al-edash__bloc-entete">
                <span className="al-v2-eyebrow">Calendrier d'équipe</span>
                <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled title="Prochaine étape">
                  Proposer un changement
                </button>
              </div>
              <CalendrierSemaine evenements={evenementsEquipe} />
            </div>
          </div>

          <div className="al-edash__colonne-rail">
            {equipeCourante && <AlerionsChatBloc idEquipe={equipeCourante} lienChat={lienChat} />}

            <div className="al-edash__bloc">
              <span className="al-v2-eyebrow">Présences</span>
              <p className="al-edash__statut">
                {prochaineSeance
                  ? `Prochaine séance : ${new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric" }).format(new Date(`${prochaineSeance.date}T12:00:00`))}${prochaineSeance.heure ? ` · ${prochaineSeance.heure.replace(":", " h ")}` : ""}`
                  : "Aucune séance à venir pour le moment."}
              </p>
              <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" disabled title="Prochaine étape">
                Prendre les présences
              </button>
            </div>

            <div className="al-edash__bloc">
              <span className="al-v2-eyebrow">Une info à transmettre ?</span>
              <p className="al-edash__statut">
                Partagez rapidement une annonce avec votre équipe. La publication d'annonces est une prochaine étape.
              </p>
              <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" disabled title="Prochaine étape">
                Publier une annonce
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardShell>
  );
}
