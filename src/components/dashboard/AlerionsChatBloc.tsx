import { Link } from "react-router-dom";
import { useTeamChat } from "../../hooks/useTeamChat";
import "./AlerionsChatBloc.css";

interface AlerionsChatBlocProps {
  idEquipe: string;
  lienChat: string;
}

/**
 * Bloc « Alérions Chat » réutilisé dans les trois dashboards — compteur
 * de non-lus et dernier message RÉELS (useTeamChat), jamais une valeur
 * décorative. Le bouton ouvre la vraie conversation (TeamChatPage,
 * déjà autorisée pour ce compte puisqu'il a accès à cette équipe).
 */
export default function AlerionsChatBloc({ idEquipe, lienChat }: AlerionsChatBlocProps) {
  const chat = useTeamChat(idEquipe, { marquerCommeLuAutomatiquement: false });
  const dernier = [...chat.messages].reverse().find((m) => !m.deleted);

  return (
    <div className="al-bloc-chat">
      <div className="al-bloc-chat__entete">
        <span className="al-v2-eyebrow">Alérions Chat</span>
        {chat.nonLus > 0 && (
          <span className="al-bloc-chat__badge">
            {chat.nonLus} non lu{chat.nonLus > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {chat.etat === "chargement" && <p className="al-bloc-chat__statut">Chargement…</p>}
      {chat.etat === "vide" && <p className="al-bloc-chat__statut">Aucun message pour le moment.</p>}
      {(chat.etat === "erreur" || chat.etat === "acces_refuse" || chat.etat === "session_expiree") && (
        <p className="al-bloc-chat__statut">Chat momentanément indisponible.</p>
      )}

      {dernier && (
        <div className="al-bloc-chat__dernier">
          <span className="al-bloc-chat__auteur">{dernier.authorName}</span>
          <p>{dernier.text}</p>
        </div>
      )}

      <Link to={lienChat === "#" ? "/chat" : lienChat} className="al-btn-v2 al-btn-v2--red al-btn-v2--sm">
        Ouvrir le chat <span aria-hidden="true">→</span>
      </Link>
    </div>
  );
}
