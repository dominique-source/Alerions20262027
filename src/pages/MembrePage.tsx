import { Link, useParams } from "react-router-dom";
import { trouverSport } from "../data/sports";
import { trouverEquipe } from "../data/teams";
import { useRoster } from "../hooks/useRoster";
import NotFoundPage from "./NotFoundPage";
import "./MembrePage.css";

/**
 * Profil d'un membre réel (joueur ou entraîneur) de l'effectif Google
 * Sheet — résolu par id_membre (identifiant stable), jamais par numéro de
 * chandail seul : deux équipes différentes peuvent avoir le même numéro,
 * donc /equipes/:sport/:equipe/membres/:idMembre désambiguïse par équipe
 * ET par identifiant. Distinct de /joueurs/:numero (page héritée des deux
 * cartes statiques n°25/30, inchangée).
 */
export default function MembrePage() {
  const { sport: sportSlugParam, equipe: equipeSlugParam, idMembre } = useParams<{
    sport: string;
    equipe: string;
    idMembre: string;
  }>();

  const sport = sportSlugParam ? trouverSport(sportSlugParam) : undefined;
  const equipe = sport && equipeSlugParam ? trouverEquipe(sport.slug, equipeSlugParam) : undefined;

  const { etat, joueurs, entraineurs } = useRoster(sport?.slug, equipe?.slug);

  if (!sport || !equipe) return <NotFoundPage />;

  if (etat === "chargement") {
    return (
      <div className="al-membre al-membre--chargement" role="status">
        Chargement du profil…
      </div>
    );
  }

  const membre = [...joueurs, ...entraineurs].find((m) => m.idMembre === idMembre);

  if (!membre) {
    return (
      <div className="al-membre al-membre--vide">
        <p>Ce profil n'est pas disponible ou n'est plus publié.</p>
        <Link to={`/equipes/${sport.slug}/${equipe.slug}`} className="al-btn-v2 al-btn-v2--gold">
          Retour à l'équipe
        </Link>
      </div>
    );
  }

  return (
    <div className="al-membre">
      <nav className="al-membre__fil" aria-label="Fil d'Ariane">
        <Link to={`/equipes/${sport.slug}/${equipe.slug}`}>{equipe.nom}</Link>
        <span aria-hidden="true">›</span>
        <span>{membre.nomAffiche}</span>
      </nav>

      <div className="al-membre__haut">
        <div className="al-membre__portrait">
          {membre.photoUrl ? (
            <img src={membre.photoUrl} alt="" loading="eager" />
          ) : (
            <div className="al-membre__avatar" aria-hidden="true">
              {membre.nomAffiche
                .split(/\s+/)
                .filter(Boolean)
                .slice(0, 2)
                .map((p) => p[0])
                .join("")
                .toUpperCase()}
            </div>
          )}
          {membre.numero !== null && <span className="al-membre__numero">{membre.numero}</span>}
        </div>

        <div className="al-membre__infos">
          <span className="al-v2-eyebrow">{membre.categorieRole === "entraineur" ? "Entraîneur" : "Joueur"}</span>
          <h1 className="al-v2-title al-membre__nom">{membre.nomAffiche}</h1>
          <p className="al-membre__sous-titre">
            {membre.poste ? `${membre.poste} · ` : ""}
            {sport.nom} {equipe.nom} · Saison {membre.saison}
            {membre.capitaine ? " · Capitaine" : ""}
          </p>
        </div>
      </div>
    </div>
  );
}
