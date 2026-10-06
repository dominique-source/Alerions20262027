import { Link, useParams } from "react-router-dom";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import { useAuth } from "../contexts/AuthContext";
import { useRoster } from "../hooks/useRoster";
import TeamChatRoom from "../components/chat/TeamChatRoom";
import "./ChatApercuPage.css";

/**
 * Chat d'équipe — aperçu imagé public, ou vraie conversation pour les
 * membres autorisés.
 *
 * Pour un visiteur non connecté (ou connecté mais sans accès à cette
 * équipe précise), reproduit exactement les deux maquettes approuvées
 * (chat-desktop.png, chat-mobile.png), pixels inchangés — rien n'est
 * jamais envoyé ni enregistré pour ce public. Pour un membre authentifié
 * avec un rattachement actif à cette équipe (ou un admin), affiche la
 * vraie conversation temps réel (TeamChatRoom) : messages texte, envoi,
 * suppression, tout vérifié côté serveur (api/chat/*, firestore.rules).
 * Jamais de messagerie « fonctionnelle en apparence » tant que l'accès
 * n'est pas confirmé par /api/me.
 *
 * Volontairement en dehors de <Layout> : l'image desktop contient déjà une
 * navigation dessinée (logo, ACCUEIL/MON ÉQUIPE/CALENDRIER/LE MUR, sélecteur
 * d'équipe), et le vrai salon a besoin de toute la hauteur disponible.
 * Superposer le vrai <Header/> du site créerait une deuxième navigation.
 */
export default function ChatApercuPage() {
  const { sport: sportSlugParam, equipe: equipeSlugParam } = useParams<{
    sport: string;
    equipe: string;
  }>();

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;
  const equipe = sport && equipeSlugParam ? trouverEquipe(sport.slug, equipeSlugParam) : undefined;

  const { statut, compte } = useAuth();
  const { equipe: equipeRoster } = useRoster(sport?.slug, equipe?.slug);
  const idEquipe = equipeRoster?.idEquipe ?? null;

  const aAcces =
    statut === "connecte" &&
    compte !== null &&
    idEquipe !== null &&
    (compte.isAdmin || compte.rattachements.some((r) => r.teamId === idEquipe));

  if (!sport || !equipe) {
    return (
      <div className="al-chat-apercu al-chat-apercu--vide">
        <div className="al-chat-apercu__vide-corps">
          <span className="al-v2-eyebrow">Alérions Chat</span>
          <h1 className="al-v2-title al-chat-apercu__vide-titre">Cette équipe n'existe pas.</h1>
          <p>Le chat d'équipe n'est disponible que pour une équipe réelle du catalogue Alérions.</p>
          <Link to="/equipes" className="al-btn-v2 al-btn-v2--red">
            Voir toutes les équipes <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    );
  }

  const retourHref = `/equipes/${sport.slug}/${equipe.slug}`;

  if (aAcces && idEquipe) {
    return (
      <div className="al-chat-apercu al-chat-apercu--salon">
        <div className="al-chat-apercu__barre">
          <Link to={retourHref} className="al-chat-apercu__retour">
            <span aria-hidden="true">←</span> Retour à {sport.nom} {equipe.nom}
          </Link>
          <span className="al-chat-apercu__mention">Alérions Chat — {sport.nom} {equipe.nom}</span>
        </div>
        <div className="al-chat-apercu__salon-corps">
          <TeamChatRoom idEquipe={idEquipe} nomEquipe={`${sport.nom} ${equipe.nom}`} />
        </div>
      </div>
    );
  }

  return (
    <div className="al-chat-apercu">
      <div className="al-chat-apercu__barre">
        <Link to={retourHref} className="al-chat-apercu__retour">
          <span aria-hidden="true">←</span> Retour à {sport.nom} {equipe.nom}
        </Link>
        <span className="al-chat-apercu__mention">
          {statut === "connecte"
            ? "Aperçu du chat — ce compte n'a pas accès à cette équipe"
            : "Aperçu du chat — démonstration visuelle, aucun message réel n'est envoyé ni enregistré"}
        </span>
      </div>

      {statut !== "connecte" && (
        <p className="al-chat-apercu__connexion">
          Membre de cette équipe ?{" "}
          <Link to="/connexion" state={{ depuis: { pathname: `${retourHref}/chat` } }}>
            Connectez-vous
          </Link>{" "}
          pour accéder à la vraie conversation.
        </p>
      )}

      <div className="al-chat-apercu__image">
        <picture>
          {/*
            767px testé d'abord comme suggéré, mais à 768px l'image desktop
            (1536px de large, texte dense) devient illisible une fois
            réduite à la largeur d'une tablette. L'image mobile (portrait,
            1024×1536) reste nette et lisible jusqu'à 1023px — le point de
            rupture est donc relevé à 1023px après inspection des deux
            captures, conformément à la consigne « à ajuster après
            inspection ».
          */}
          <source media="(max-width: 1023px)" srcSet="/images/chat/chat-mobile.png" />
          <img
            src="/images/chat/chat-desktop.png"
            alt={
              `Aperçu du clavardage « Alérions Chat » de l'équipe ${equipe.nom} — conversation de ` +
              "démonstration entre trois membres fictifs (Alex Martin, Noah Tremblay, Sarah Dubois, " +
              "entraîneuse) au sujet de l'heure de pratique, avec une photo du gymnase et d'un ballon " +
              "partagée dans la conversation, et deux messages marqués comme non lus."
            }
            loading="eager"
          />
        </picture>
      </div>
    </div>
  );
}

/*
 * --- État réel vs reste à faire ---
 * Le chat texte est maintenant réel pour un membre authentifié et
 * autorisé (TeamChatRoom : session Firebase, appartenance vérifiée
 * serveur à chaque appel, conversation isolée par équipe via
 * firestore.rules + chatAccess, historique Firestore persistant,
 * temps réel par abonnement, idempotence des envois, suppression
 * auteur/entraîneur/admin vérifiée côté serveur).
 *
 * Reste hors de cette étape :
 *  - Photos privées (stockage et droits d'accès) — le bouton associé
 *    reste visible mais désactivé ("Photos bientôt disponibles"),
 *    jamais présenté comme fonctionnel.
 */
