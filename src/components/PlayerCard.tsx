import { useState } from "react";
import { Link } from "react-router-dom";
import type { MembreRoster } from "../types";
import "./PlayerCard.css";

interface PlayerCardProps {
  membre: MembreRoster;
  equipeNom: string;
  /** Destination du profil — construite par l'appelant à partir d'identifiants stables (jamais le numéro seul). */
  lienProfil: string;
}

function initiales(nomAffiche: string): string {
  const parties = nomAffiche.trim().split(/\s+/).filter(Boolean);
  if (parties.length === 0) return "?";
  if (parties.length === 1) return parties[0]!.slice(0, 2).toUpperCase();
  return (parties[0]![0] + parties[parties.length - 1]![0]).toUpperCase();
}

/**
 * Carte joueur/entraîneur réutilisable — textes dynamiques (nom, numéro,
 * poste, équipe, saison), jamais une image pré-composée : modifier une
 * valeur dans le Sheet met la carte à jour sans recréer d'image.
 * Aucune statistique, performance ni trophée n'est affichée : ces données
 * n'existent pas dans le Sheet et ne doivent jamais être inventées ici.
 */
export default function PlayerCard({ membre, equipeNom, lienProfil }: PlayerCardProps) {
  const [erreurImage, setErreurImage] = useState(false);
  const afficherPhoto = membre.photoUrl && !erreurImage;

  return (
    <Link to={lienProfil} className="al-carte-joueur" aria-label={`Voir le profil de ${membre.nomAffiche}`}>
      <div className="al-carte-joueur__portrait">
        {afficherPhoto ? (
          <img
            src={membre.photoUrl!}
            alt=""
            loading="lazy"
            decoding="async"
            onError={() => setErreurImage(true)}
          />
        ) : (
          <div className="al-carte-joueur__avatar" aria-hidden="true">
            {initiales(membre.nomAffiche)}
          </div>
        )}
        {membre.numero !== null && (
          <span className="al-carte-joueur__numero" aria-hidden="true">
            {membre.numero}
          </span>
        )}
        {membre.capitaine && <span className="al-carte-joueur__capitaine">Capitaine</span>}
      </div>

      <div className="al-carte-joueur__corps">
        <span className="al-carte-joueur__nom">{membre.nomAffiche}</span>
        <span className="al-carte-joueur__meta">
          {membre.poste ? `${membre.poste} · ` : ""}
          {equipeNom}
        </span>
        <span className="al-carte-joueur__saison">Saison {membre.saison}</span>
      </div>
    </Link>
  );
}
