import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { espacesAutorises, equipesPourRole } from "../lib/permissions";
import { useRoster } from "../hooks/useRoster";
import { prochainMatch, evenements } from "../data/events";
import { sportSlugDepuisNomBrut } from "../data/sports";
import DashboardShell from "../components/dashboard/DashboardShell";
import EspaceSelector from "../components/dashboard/EspaceSelector";
import AlerionsChatBloc from "../components/dashboard/AlerionsChatBloc";
import CalendrierSemaine from "../components/dashboard/CalendrierSemaine";
import { useTeamChat } from "../hooks/useTeamChat";
import "./JoueurDashboardPage.css";

function initiales(nom: string): string {
  const parties = nom.trim().split(/\s+/).filter(Boolean);
  if (parties.length === 0) return "?";
  if (parties.length === 1) return parties[0]!.slice(0, 2).toUpperCase();
  return (parties[0]![0] + parties[parties.length - 1]![0]).toUpperCase();
}

function navItems(nonLus: number) {
  return [
    { label: "Mon dashboard", icone: "🏠", to: "/espace/joueur" },
    { label: "Mon équipe", icone: "👥", to: "/mon-equipe" },
    { label: "Alérions Chat", icone: "💬", to: "/espace/joueur", badge: nonLus },
    { label: "Calendrier", icone: "📅", to: "/calendrier" },
    { label: "Ma carte", icone: "🪪", to: "/espace/joueur" },
    { label: "Mon profil", icone: "⚙️", to: "/compte" },
  ];
}

/**
 * Dashboard joueur — maquette « TON ÉQUIPE. TON UNIVERS. ». Toute donnée
 * provient de /api/me (identité, rattachements) et /api/roster (effectif
 * réel de l'équipe) ; aucune statistique ni portrait de maquette n'est
 * réutilisé comme s'il appartenait au compte connecté.
 */
export default function JoueurDashboardPage() {
  const { compte } = useAuth();
  const idEquipes = compte ? equipesPourRole(compte.rattachements, "joueur") : [];
  const [idEquipeActif, setIdEquipeActif] = useState<string | null>(null);
  const equipeCourante = idEquipeActif ?? idEquipes[0] ?? null;

  const { equipe, joueurs, etat: etatRoster } = useRoster(undefined, undefined, equipeCourante);
  const chat = useTeamChat(equipeCourante);

  if (!compte) return null;

  const espaces = espacesAutorises(compte);
  const membre = equipe ? joueurs.find((j) => j.idPersonne === compte.personId) ?? null : null;
  const match = prochainMatch();
  const evenementsEquipe = equipe ? evenements.filter((e) => e.sportSlug === equipe.sport) : [];

  if (idEquipes.length === 0) {
    return (
      <DashboardShell
        espaceLabel="Espace joueur"
        titrePage="Mon dashboard"
        elementsNav={navItems(0)}
        selecteurEspace={<EspaceSelector espaces={espaces} actif="joueur" />}
      >
        <p className="al-v2-eyebrow">Aucune équipe rattachée</p>
        <p>Ce compte n'a pas (ou plus) de rattachement actif comme joueur.</p>
      </DashboardShell>
    );
  }

  const lienChat = equipe ? `/equipes/${sportSlugDepuisNomBrut(equipe.sport)}/${equipe.slugSite}/chat` : "#";

  return (
    <DashboardShell
      espaceLabel="Espace joueur"
      titrePage="Mon dashboard"
      elementsNav={navItems(chat.nonLus)}
      selecteurEspace={<EspaceSelector espaces={espaces} actif="joueur" />}
    >
      <div className="al-jdash">
        <header className="al-jdash__entete">
          <span className="al-v2-eyebrow">
            {equipe ? `${equipe.sport} · Saison ${equipe.saison}` : "Chargement…"}
          </span>
          <h1 className="al-v2-title al-jdash__titre">
            TON ÉQUIPE. <span className="al-jdash__titre-accent">TON UNIVERS.</span>
          </h1>
          {equipe && <p className="al-jdash__sous-titre">{equipe.nomEquipe}</p>}
        </header>

        {idEquipes.length > 1 && (
          <label className="al-jdash__selecteur-equipe">
            <span className="sr-only">Choisir une équipe</span>
            <select value={equipeCourante ?? ""} onChange={(e) => setIdEquipeActif(e.target.value)}>
              {idEquipes.map((id) => (
                <option key={id} value={id}>
                  {id === equipeCourante && equipe ? equipe.nomEquipe : id}
                </option>
              ))}
            </select>
          </label>
        )}

        <div className="al-jdash__grille">
          <div className="al-jdash__carte-joueur">
            {membre ? (
              <>
                <div className="al-jdash__carte-portrait">
                  {membre.photoUrl ? (
                    <img src={membre.photoUrl} alt="" loading="lazy" />
                  ) : (
                    <div className="al-jdash__carte-avatar" aria-hidden="true">
                      {initiales(membre.nomAffiche)}
                    </div>
                  )}
                </div>
                <span className="al-jdash__carte-numero">
                  {membre.numero !== null ? `N° ${membre.numero}` : "Numéro à compléter"}
                </span>
                <span className="al-jdash__carte-nom">{membre.nomAffiche}</span>
              </>
            ) : (
              <div className="al-jdash__carte-vide">
                <div className="al-jdash__carte-avatar" aria-hidden="true">
                  {initiales(compte.displayName || "?")}
                </div>
                <span className="al-jdash__carte-numero">Numéro à compléter</span>
                <span className="al-jdash__carte-nom">{compte.displayName || "Membre Alérions"}</span>
              </div>
            )}
            <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" disabled title="Prochaine étape">
              Modifier mon profil
            </button>
            <button type="button" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled title="Prochaine étape">
              Changer ma photo
            </button>
          </div>

          <div className="al-jdash__colonne-principale">
            <div className="al-jdash__bloc-match">
              <span className="al-v2-eyebrow">Prêt pour le prochain rendez-vous ?</span>
              {match ? (
                <>
                  <p className="al-jdash__match-titre">{match.titre}</p>
                  <p className="al-jdash__match-infos">
                    {new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" }).format(
                      new Date(`${match.date}T12:00:00`),
                    )}
                    {match.heure ? ` · ${match.heure.replace(":", " h ")}` : ""}
                  </p>
                  {match.lieu && <p className="al-jdash__match-lieu">{match.lieu}</p>}
                  <Link to="/calendrier" className="al-btn-v2 al-btn-v2--red al-btn-v2--sm">
                    Voir le calendrier <span aria-hidden="true">→</span>
                  </Link>
                </>
              ) : (
                <p>Aucun prochain match confirmé pour le moment.</p>
              )}
            </div>

            <div className="al-jdash__rangee-deux">
              {equipeCourante && <AlerionsChatBloc idEquipe={equipeCourante} lienChat={lienChat} />}

              <div className="al-jdash__bloc-annonce">
                <span className="al-v2-eyebrow">Annonce du coach</span>
                <p className="al-jdash__statut">
                  Aucune annonce pour le moment. La publication d'annonces par l'entraîneur est une prochaine étape.
                </p>
              </div>
            </div>

            <div className="al-jdash__bloc-calendrier">
              <div className="al-jdash__bloc-entete">
                <span className="al-v2-eyebrow">Calendrier de la semaine</span>
                <Link to="/calendrier" className="al-jdash__voir-tout">
                  Voir tout <span aria-hidden="true">→</span>
                </Link>
              </div>
              <CalendrierSemaine evenements={evenementsEquipe} />
            </div>

            <div className="al-jdash__bloc-objectif">
              <span className="al-v2-eyebrow">Mon objectif</span>
              <p className="al-jdash__statut">
                Aucun objectif personnel enregistré. La saisie d'un objectif hebdomadaire est une prochaine étape.
              </p>
              <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" disabled title="Prochaine étape">
                Modifier
              </button>
            </div>
          </div>
        </div>

        {etatRoster === "erreur" && (
          <p className="al-jdash__erreur" role="alert">
            L'effectif de l'équipe n'a pas pu être chargé pour le moment.
          </p>
        )}

        <p className="al-jdash__note">Ta photo et tes infos restent sous ton contrôle.</p>
      </div>
    </DashboardShell>
  );
}
