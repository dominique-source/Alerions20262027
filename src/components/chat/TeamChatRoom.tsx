import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useTeamChat } from "../../hooks/useTeamChat";
import type { MessageChat } from "../../types";
import "./TeamChatRoom.css";

interface TeamChatRoomProps {
  idEquipe: string;
  nomEquipe: string;
}

function formaterHeure(ms: number | null): string {
  if (ms === null) return "";
  return new Intl.DateTimeFormat("fr-CA", { hour: "2-digit", minute: "2-digit" }).format(new Date(ms));
}

function initiales(nom: string): string {
  const parties = nom.trim().split(/\s+/).filter(Boolean);
  if (parties.length === 0) return "?";
  if (parties.length === 1) return parties[0]!.slice(0, 2).toUpperCase();
  return (parties[0]![0] + parties[parties.length - 1]![0]).toUpperCase();
}

const MESSAGES_ERREUR: Record<string, string> = {
  session_expiree: "Votre session a expiré. Reconnectez-vous pour continuer la conversation.",
  acces_refuse: "Vous n'avez plus accès à cette conversation.",
  erreur: "Connexion interrompue avec le chat. Réessayez.",
};

/**
 * Salon de clavardage d'une équipe — texte uniquement, temps réel via
 * useTeamChat. Le partage de photos n'est pas disponible dans cette
 * version : bouton visible mais désactivé, jamais présenté comme
 * fonctionnel.
 */
export default function TeamChatRoom({ idEquipe, nomEquipe }: TeamChatRoomProps) {
  const { utilisateur, compte } = useAuth();
  const chat = useTeamChat(idEquipe);
  const peutModererEquipe =
    compte?.isAdmin === true || compte?.rattachements.some((r) => r.teamId === idEquipe && r.role === "entraineur") === true;
  const [brouillon, setBrouillon] = useState("");
  const [confirmationSuppression, setConfirmationSuppression] = useState<string | null>(null);
  const finListeRef = useRef<HTMLDivElement>(null);
  const conteneurListeRef = useRef<HTMLDivElement>(null);

  // Défile au bas automatiquement si l'utilisateur y est déjà, à chaque nouveau message.
  useEffect(() => {
    if (chat.etat === "pret") {
      const conteneur = conteneurListeRef.current;
      if (conteneur) {
        const presqueEnBas = conteneur.scrollHeight - conteneur.scrollTop - conteneur.clientHeight < 80;
        if (presqueEnBas) {
          finListeRef.current?.scrollIntoView({ block: "end" });
        }
      } else {
        finListeRef.current?.scrollIntoView({ block: "end" });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chat.messages.length, chat.messagesEnAttente.length]);

  function surDefilement() {
    const conteneur = conteneurListeRef.current;
    if (!conteneur) return;
    const auBas = conteneur.scrollHeight - conteneur.scrollTop - conteneur.clientHeight < 80;
    chat.definirAuBas(auBas);
  }

  function surEnvoi(e: React.FormEvent) {
    e.preventDefault();
    const texte = brouillon;
    if (!texte.trim()) return;
    setBrouillon("");
    void chat.envoyerTexte(texte);
  }

  async function confirmerSuppression() {
    if (!confirmationSuppression) return;
    await chat.supprimerMessage(confirmationSuppression);
    setConfirmationSuppression(null);
  }

  if (chat.etat === "chargement") {
    return (
      <div className="al-chat-salon al-chat-salon--etat" role="status">
        Chargement de la conversation…
      </div>
    );
  }

  if (chat.etat === "erreur" || chat.etat === "session_expiree" || chat.etat === "acces_refuse") {
    return (
      <div className="al-chat-salon al-chat-salon--etat" role="alert">
        <p>{MESSAGES_ERREUR[chat.etat]}</p>
        {chat.etat === "erreur" && (
          <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" onClick={() => window.location.reload()}>
            Réessayer
          </button>
        )}
      </div>
    );
  }

  const tousMessages = chat.messages;

  return (
    <div className="al-chat-salon">
      <div className="al-chat-salon__liste" ref={conteneurListeRef} onScroll={surDefilement}>
        {chat.peutChargerPlusAncien && (
          <button
            type="button"
            className="al-chat-salon__charger-ancien"
            onClick={() => void chat.chargerPlusAncien()}
            disabled={chat.chargementAncien}
          >
            {chat.chargementAncien ? "Chargement…" : "Charger les messages précédents"}
          </button>
        )}

        {chat.etat === "vide" && tousMessages.length === 0 && chat.messagesEnAttente.length === 0 && (
          <p className="al-chat-salon__vide">Aucun message pour le moment. Lance la discussion.</p>
        )}

        {tousMessages.map((m) => (
          <BulleMessage
            key={m.id}
            message={m}
            estSoi={m.authorUid === utilisateur?.uid}
            peutSupprimer={m.authorUid === utilisateur?.uid || peutModererEquipe}
            onSupprimer={() => setConfirmationSuppression(m.id)}
          />
        ))}

        {chat.messagesEnAttente.map((m) => (
          <div key={m.id} className="al-chat-salon__bulle al-chat-salon__bulle--soi al-chat-salon__bulle--attente">
            <div className="al-chat-salon__bulle-corps">
              <p>{m.text}</p>
              <span className="al-chat-salon__statut">
                {m.statut === "envoi" ? (
                  "Envoi en cours…"
                ) : (
                  <>
                    Échec —{" "}
                    <button type="button" onClick={() => void chat.reessayerEnvoi(m.id)}>
                      Réessayer
                    </button>
                  </>
                )}
              </span>
            </div>
          </div>
        ))}

        <div ref={finListeRef} />
      </div>

      {chat.nouveauxMessagesDisponibles && (
        <button
          type="button"
          className="al-chat-salon__nouveaux"
          onClick={() => {
            chat.effacerNouveauxMessagesDisponibles();
            finListeRef.current?.scrollIntoView({ block: "end" });
            chat.definirAuBas(true);
          }}
        >
          ↓ Nouveaux messages
        </button>
      )}

      <form className="al-chat-salon__composeur" onSubmit={surEnvoi}>
        <button
          type="button"
          className="al-chat-salon__photo-bouton"
          disabled
          title="Photos bientôt disponibles"
          aria-label="Photos bientôt disponibles"
        >
          📷
        </button>
        <input
          type="text"
          value={brouillon}
          onChange={(e) => setBrouillon(e.target.value)}
          placeholder={`Écrire à ${nomEquipe}…`}
          maxLength={2000}
          aria-label="Votre message"
        />
        <button type="submit" className="al-chat-salon__envoyer" disabled={!brouillon.trim()}>
          Envoyer
        </button>
      </form>

      {confirmationSuppression && (
        <div className="al-chat-salon__confirm-overlay" role="alertdialog" aria-modal="true">
          <div className="al-chat-salon__confirm">
            <p>Supprimer ce message ? Cette action est définitive.</p>
            <div className="al-chat-salon__confirm-actions">
              <button
                type="button"
                className="al-btn-v2 al-btn-v2--sm"
                onClick={() => setConfirmationSuppression(null)}
                autoFocus
              >
                Annuler
              </button>
              <button type="button" className="al-btn-v2 al-btn-v2--red al-btn-v2--sm" onClick={() => void confirmerSuppression()}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function BulleMessage({
  message,
  estSoi,
  peutSupprimer,
  onSupprimer,
}: {
  message: MessageChat;
  estSoi: boolean;
  peutSupprimer: boolean;
  onSupprimer: () => void;
}) {
  return (
    <div className={`al-chat-salon__bulle${estSoi ? " al-chat-salon__bulle--soi" : ""}`}>
      {!estSoi && (
        <div className="al-chat-salon__avatar" aria-hidden="true">
          {initiales(message.authorName)}
        </div>
      )}
      <div className="al-chat-salon__bulle-corps">
        {!estSoi && <span className="al-chat-salon__auteur">{message.authorName}</span>}
        {message.deleted ? (
          <p className="al-chat-salon__supprime">Message supprimé</p>
        ) : (
          <p>{message.text}</p>
        )}
        <div className="al-chat-salon__meta">
          <span className="al-chat-salon__heure">{formaterHeure(message.createdAtMs)}</span>
          {!message.deleted && peutSupprimer && (
            <button type="button" className="al-chat-salon__supprimer-bouton" onClick={onSupprimer} aria-label="Supprimer ce message">
              Supprimer
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
