import { useId } from "react";
import { sports } from "../data/sports";
import { equipesParSport, trouverEquipe } from "../data/teams";
import { useTeamSelection } from "../hooks/useTeamSelection";
import type { SportSlug } from "../types";
import "./TeamSelector.css";

/**
 * Sélecteur « Mon équipe » : Sport / Équipe.
 * Le choix est mémorisé dans le navigateur (localStorage, voir
 * useTeamSelection) — aucune donnée n'est envoyée à un serveur.
 */
export default function TeamSelector() {
  const { selection, definirSelection } = useTeamSelection();
  const idSport = useId();
  const idEquipe = useId();

  const equipesFiltrees = selection.sport
    ? equipesParSport(selection.sport as SportSlug)
    : [];

  const equipeChoisie = selection.sport
    ? trouverEquipe(selection.sport, selection.equipe)
    : undefined;

  return (
    <div className="al-selector">
      <p>
        Choisissez votre sport et votre équipe pour un accès rapide sur toutes les
        pages du site.
      </p>
      <div className="al-selector__grid">
        <div className="al-selector__field">
          <label htmlFor={idSport}>Sport</label>
          <select
            id={idSport}
            value={selection.sport}
            onChange={(evenement) =>
              definirSelection({ sport: evenement.target.value, equipe: "" })
            }
          >
            <option value="">Choisir un sport</option>
            {sports.map((sport) => (
              <option key={sport.slug} value={sport.slug}>
                {sport.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="al-selector__field">
          <label htmlFor={idEquipe}>Équipe</label>
          <select
            id={idEquipe}
            value={selection.equipe}
            disabled={!selection.sport}
            onChange={(evenement) => definirSelection({ equipe: evenement.target.value })}
          >
            <option value="">Choisir une équipe</option>
            {equipesFiltrees.map((equipe) => (
              <option key={equipe.slug} value={equipe.slug}>
                {equipe.nom}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="al-selector__summary" role="status">
        {equipeChoisie ? (
          <>
            Équipe mémorisée : <strong>{equipeChoisie.nom}</strong>
          </>
        ) : (
          "Aucune équipe mémorisée pour le moment."
        )}
      </p>
    </div>
  );
}
