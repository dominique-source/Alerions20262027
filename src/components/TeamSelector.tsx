import { useId } from "react";
import { categoriesSports, equipes, niveaux } from "../data/teams";
import { useTeamSelection } from "../hooks/useTeamSelection";
import "./TeamSelector.css";

/**
 * Sélecteur « Mon équipe » : Sport / Niveau / Équipe.
 * Le choix est mémorisé dans le navigateur (localStorage, voir
 * useTeamSelection) — aucune donnée n'est envoyée à un serveur.
 */
export default function TeamSelector() {
  const { selection, definirSelection } = useTeamSelection();
  const idSport = useId();
  const idNiveau = useId();
  const idEquipe = useId();

  const equipesFiltrees = equipes.filter(
    (equipe) =>
      (!selection.sport || equipe.sport === selection.sport) &&
      (!selection.niveau || equipe.niveau === selection.niveau),
  );

  const equipeChoisie = equipes.find((equipe) => equipe.slug === selection.equipe);

  return (
    <div className="al-selector">
      <p>
        Choisissez votre sport, votre niveau et votre équipe pour un accès rapide sur
        toutes les pages du site.
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
            {categoriesSports.map((categorie) => (
              <option key={categorie.sport} value={categorie.sport}>
                {categorie.nom}
              </option>
            ))}
          </select>
        </div>

        <div className="al-selector__field">
          <label htmlFor={idNiveau}>Niveau</label>
          <select
            id={idNiveau}
            value={selection.niveau}
            onChange={(evenement) =>
              definirSelection({ niveau: evenement.target.value, equipe: "" })
            }
          >
            <option value="">Choisir un niveau</option>
            {niveaux.map((niveau) => (
              <option key={niveau.valeur} value={niveau.valeur}>
                {niveau.label}
              </option>
            ))}
          </select>
        </div>

        <div className="al-selector__field">
          <label htmlFor={idEquipe}>Équipe</label>
          <select
            id={idEquipe}
            value={selection.equipe}
            onChange={(evenement) => definirSelection({ equipe: evenement.target.value })}
          >
            <option value="">
              {equipesFiltrees.length ? "Choisir une équipe" : "Liste à confirmer"}
            </option>
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
