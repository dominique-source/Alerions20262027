import { Link, useParams } from "react-router-dom";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import "./ChatApercuPage.css";

/**
 * Aperçu du chat d'équipe — version imagée uniquement.
 *
 * Reproduit exactement les deux maquettes approuvées (chat-desktop.png,
 * chat-mobile.png) comme visuels principaux, pixels inchangés. Aucune
 * bulle, aucun champ et aucun bouton dessiné dans l'image n'est
 * interactif : rien n'est envoyé, stocké ou compté ici. La messagerie
 * réelle (comptes joueurs, appartenance vérifiée, historique) suivra dans
 * une étape future — voir le bloc de documentation en bas de ce fichier.
 *
 * Volontairement en dehors de <Layout> : l'image desktop contient déjà une
 * navigation dessinée (logo, ACCUEIL/MON ÉQUIPE/CALENDRIER/LE MUR, sélecteur
 * d'équipe). Superposer le vrai <Header/> du site créerait une deuxième
 * navigation identique au-dessus de celle de la maquette.
 */
export default function ChatApercuPage() {
  const { sport: sportSlugParam, equipe: equipeSlugParam } = useParams<{
    sport: string;
    equipe: string;
  }>();

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;
  const equipe = sport && equipeSlugParam ? trouverEquipe(sport.slug, equipeSlugParam) : undefined;

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

  return (
    <div className="al-chat-apercu">
      <div className="al-chat-apercu__barre">
        <Link to={retourHref} className="al-chat-apercu__retour">
          <span aria-hidden="true">←</span> Retour à {sport.nom} {equipe.nom}
        </Link>
        <span className="al-chat-apercu__mention">
          Aperçu du chat — démonstration visuelle, aucun message réel n'est envoyé ni enregistré
        </span>
      </div>

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
 * --- Architecture future (documentée, non implémentée dans cette étape) ---
 * Ce que l'ajout d'un vrai chat par équipe demandera plus tard :
 *  - Session joueur authentifiée (compte réel, pas un code coach local ni
 *    un choix d'équipe en localStorage — ni l'un ni l'autre ne prouve une
 *    appartenance).
 *  - Appartenance à l'équipe vérifiée côté serveur (ou dans les règles de
 *    la base de données), pas seulement dans l'URL ou l'état du navigateur.
 *  - Conversation privée par équipe, isolée des autres équipes et des
 *    visiteurs non membres.
 *  - Historique persistant (base de données partagée, pas localStorage).
 *  - Photos privées : stockage et droits d'accès distincts des photos
 *    publiques du site (Le mur, Accueil).
 *  - Compteur de messages non lus réel, par membre, pas une valeur
 *    décorative.
 *  - Mise à jour en temps réel (ex. WebSocket ou flux équivalent) au lieu
 *    d'un instantané statique.
 *  - Idempotence des envois (un message envoyé deux fois par erreur réseau
 *    ne doit pas se dupliquer).
 *  - Suppression réservée à l'auteur du message ou à un responsable
 *    (entraîneur·e), avec vérification côté serveur de ce droit.
 */
