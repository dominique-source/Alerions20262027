import { useId } from "react";
import { Link } from "react-router-dom";
import { sports } from "../data/sports";
import { equipesParSport, trouverEquipe } from "../data/teams";
import { useTeamSelection } from "../hooks/useTeamSelection";
import { cheminPublic } from "../lib/images";
import type { SportSlug } from "../types";
import "./EquipesPage.css";

/**
 * Page générale des sports (/equipes) — direction V2 (noir, rouge, or),
 * remplace l'ancien habillage bleu profond/ivoire. Sélecteur « Mon
 * équipe » et grille des onze sports conservés, reconstruits avec des
 * classes propres à la page plutôt que les anciens composants partagés
 * PhotoFeature/SportTile (non touchés : PhotoFeature reste utilisé par
 * ActualitesPage sur fond clair, inchangée).
 */
export default function EquipesPage() {
  const [basketball, ...autresSports] = sports;
  const { selection, definirSelection } = useTeamSelection();
  const idSport = useId();
  const idEquipe = useId();

  const equipesFiltrees = selection.sport ? equipesParSport(selection.sport as SportSlug) : [];
  const equipeChoisie = selection.sport ? trouverEquipe(selection.sport, selection.equipe) : undefined;

  return (
    <div className="al-equipespage">
      <header className="al-equipespage__entete">
        <span className="al-v2-eyebrow">Vie sportive</span>
        <h1 className="al-v2-title al-equipespage__titre">Équipes</h1>
        <p className="al-equipespage__intro">
          Onze sports, trente-huit équipes : l'identité sportive des Alérions.
        </p>
      </header>

      <section className="al-equipespage__selecteur">
        <span className="al-v2-eyebrow">Accès rapide</span>
        <p>Choisissez votre sport et votre équipe pour un accès rapide sur toutes les pages du site.</p>
        <div className="al-equipespage__selecteur-grille">
          <label className="al-equipespage__champ">
            <span>Sport</span>
            <select
              id={idSport}
              value={selection.sport}
              onChange={(e) => definirSelection({ sport: e.target.value, equipe: "" })}
            >
              <option value="">Choisir un sport</option>
              {sports.map((sport) => (
                <option key={sport.slug} value={sport.slug}>
                  {sport.nom}
                </option>
              ))}
            </select>
          </label>

          <label className="al-equipespage__champ">
            <span>Équipe</span>
            <select
              id={idEquipe}
              value={selection.equipe}
              disabled={!selection.sport}
              onChange={(e) => definirSelection({ equipe: e.target.value })}
            >
              <option value="">Choisir une équipe</option>
              {equipesFiltrees.map((equipe) => (
                <option key={equipe.slug} value={equipe.slug}>
                  {equipe.nom}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="al-equipespage__selecteur-resume" role="status">
          {equipeChoisie ? (
            <>
              Équipe mémorisée : <strong>{equipeChoisie.nom}</strong>
            </>
          ) : (
            "Aucune équipe mémorisée pour le moment."
          )}
        </p>
      </section>

      <section className="al-equipespage__section">
        <span className="al-v2-eyebrow">Sports</span>
        <h2 className="al-v2-title al-equipespage__section-titre">Nos programmes</h2>

        <div className="al-equipespage__grille">
          <Link to={`/equipes/${basketball.slug}`} className="al-equipespage__tuile al-equipespage__tuile--grande">
            <img
              src={cheminPublic(basketball.photoCouverture!)}
              alt={`Athlète des Alérions en action — programme ${basketball.nom}`}
              loading="lazy"
            />
            <div className="al-equipespage__tuile-scrim" aria-hidden="true" />
            <div className="al-equipespage__tuile-corps">
              <span className="al-equipespage__tuile-eyebrow">
                {equipesParSport(basketball.slug).length} équipes
              </span>
              <h3 className="al-equipespage__tuile-titre">{basketball.nom}</h3>
              <span className="al-equipespage__tuile-cta">Découvrir →</span>
            </div>
          </Link>

          <div className="al-equipespage__autres">
            {autresSports.map((sport, i) => (
              <Link
                key={sport.slug}
                to={`/equipes/${sport.slug}`}
                className="al-equipespage__tuile al-equipespage__tuile--typo"
              >
                <span className="al-equipespage__tuile-num" aria-hidden="true">
                  {String(i + 2).padStart(2, "0")}
                </span>
                <h3 className="al-equipespage__tuile-titre">{sport.nom}</h3>
                <span className="al-equipespage__tuile-eyebrow">
                  {equipesParSport(sport.slug).length} équipe{equipesParSport(sport.slug).length > 1 ? "s" : ""}
                </span>
                <span className="al-equipespage__tuile-cta">Découvrir →</span>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
