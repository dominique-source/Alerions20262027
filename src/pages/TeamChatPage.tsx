import { Link, useParams } from "react-router-dom";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import { useAuth } from "../contexts/AuthContext";
import { useRoster } from "../hooks/useRoster";
import TeamChatRoom from "../components/chat/TeamChatRoom";
import "./TeamChatPage.css";

/** Conversation privée. Aucun aperçu graphique ne remplace les états réels. */
export default function TeamChatPage() {
  const { sport: sportSlug, equipe: equipeSlug } = useParams();
  const sport = sportSlug ? trouverSport(sportSlug) : undefined;
  const equipe = sport && equipeSlug ? trouverEquipe(sport.slug, equipeSlug) : undefined;
  const { compte } = useAuth();
  const roster = useRoster(sport?.slug, equipe?.slug);
  const idEquipe = roster.equipe?.idEquipe;
  const autorise = idEquipe && compte &&
    (compte.isAdmin || compte.rattachements.some((r) => r.teamId === idEquipe));
  const retour = sport && equipe ? `/equipes/${sport.slug}/${equipe.slug}` : "/equipes";
  const nomEquipe = sport && equipe ? `${sport.nom} ${equipe.nom}` : "Équipe";

  return (
    <main className="al-team-chat">
      <nav className="al-team-chat__barre" aria-label="Navigation du chat">
        <Link to={retour} className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm">← Retour à {nomEquipe}</Link>
        <span className="al-v2-eyebrow">Alérions Chat</span>
      </nav>
      <div className="al-team-chat__corps">
        {!sport || !equipe ? (
          <div className="al-team-chat__etat"><h1>Cette équipe n'existe pas.</h1></div>
        ) : roster.etat === "chargement" ? (
          <div className="al-team-chat__etat" role="status">Chargement de l’équipe…</div>
        ) : roster.etat === "erreur" ? (
          <div className="al-team-chat__etat" role="alert">
            <h1>Connexion à l’équipe indisponible</h1>
            <p>Impossible de charger cette équipe. Réessaie pour ouvrir sa conversation.</p>
            <button className="al-btn-v2 al-btn-v2--gold" onClick={roster.rafraichir}>Réessayer</button>
          </div>
        ) : !idEquipe ? (
          <div className="al-team-chat__etat" role="alert"><h1>Équipe non reliée</h1><p>Cette équipe n’a pas encore de rattachement dans l’effectif.</p></div>
        ) : !autorise ? (
          <div className="al-team-chat__etat" role="alert"><h1>Accès refusé</h1><p>Ton compte n’a pas accès à la conversation de cette équipe.</p><Link to="/chat" className="al-btn-v2 al-btn-v2--gold">Mes conversations</Link></div>
        ) : <TeamChatRoom key={idEquipe} idEquipe={idEquipe} nomEquipe={nomEquipe} />}
      </div>
    </main>
  );
}
