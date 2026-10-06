import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { joueursCadet } from "../data/joueurs";
import { prochainMatch } from "../data/events";
import { defiSemaine } from "../data/defis";
import { seancesDeclarees } from "../lib/defis";
import { marquerDecouverte } from "../lib/decouvertes";
import { trouverEquipe } from "../data/teams";
import { CATEGORIES, CATEGORIE_SLUGS, GENRES } from "../data/categoriesBasketball";
import "./MonEquipePage.css";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/**
 * Mon équipe — reproduction de 01_MAQUETTES/equipe-desktop-1536x1024.png.
 * Seule l'équipe Cadet dispose de portraits de joueurs confirmés : les
 * autres catégories affichent un état vide honnête plutôt que de réutiliser
 * les mêmes deux joueurs sous une autre bannière.
 */
export default function MonEquipePage() {
  const [categorie, setCategorie] = useState("Cadet");
  const [genre, setGenre] = useState("masculin");
  const match = prochainMatch();
  const progression = seancesDeclarees(defiSemaine.id);

  useEffect(() => {
    marquerDecouverte("mon-equipe");
  }, []);

  const aDesJoueurs = categorie === "Cadet" && genre === "masculin";

  // Résout une équipe précise (sport + catégorie + genre) pour le bouton
  // Chat : la catégorie seule ne suffit pas à cibler une seule équipe
  // réelle (ex. « Cadet » recouvre Cadet Masculin ET Cadet Féminin), donc
  // on ne construit la destination qu'une fois les trois critères connus.
  const equipeSelectionnee = trouverEquipe("basketball", `${CATEGORIE_SLUGS[categorie]}-${genre}`);

  return (
    <div className="al-equipe">
      <div className="al-equipe__selecteur-rangee">
        <div className="al-equipe__selecteurs">
          <label className="al-equipe__selecteur">
            <span className="sr-only">Choisir une catégorie</span>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
              {CATEGORIES.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </label>
          <label className="al-equipe__selecteur">
            <span className="sr-only">Choisir un genre</span>
            <select value={genre} onChange={(e) => setGenre(e.target.value)}>
              {GENRES.map((g) => (
                <option key={g.slug} value={g.slug}>
                  {g.label}
                </option>
              ))}
            </select>
          </label>
        </div>

        {equipeSelectionnee && (
          <Link
            to={`/equipes/basketball/${equipeSelectionnee.slug}/chat`}
            className="al-btn-v2 al-btn-v2--red al-btn-v2--sm"
          >
            💬 Chat de l'équipe <span aria-hidden="true">→</span>
          </Link>
        )}
      </div>

      <div className="al-equipe__top">
        <div className="al-equipe__carte-info">
          <span className="al-v2-eyebrow">Prochain match</span>
          {match ? (
            <>
              <div className="al-equipe__match-titre">{match.titre}</div>
              <div className="al-equipe__match-meta">
                <span>📅 {formaterDate(match.date)}{match.heure ? ` · ${match.heure.replace(":", " h ")}` : ""}</span>
                {match.lieu && <span>📍 {match.lieu}</span>}
              </div>
              <Link to={`/calendrier/evenement/${match.id}`} className="al-btn-v2 al-btn-v2--red al-btn-v2--sm">
                Voir les détails <span aria-hidden="true">→</span>
              </Link>
            </>
          ) : (
            <div className="al-equipe__match-titre">Aucun match confirmé à venir</div>
          )}
        </div>

        <div className="al-equipe__titre-bloc">
          <span className="al-equipe__crown" aria-hidden="true">
            ♛
          </span>
          <div className="al-equipe__nom">{categorie}</div>
          <div className="al-equipe__saison">
            {GENRES.find((g) => g.slug === genre)?.label} · Saison 2026-2027
          </div>
        </div>

        <div className="al-equipe__carte-info">
          <div className="al-equipe__objectif-titre">
            On progresse <span>ensemble</span>
          </div>
          <span className="al-v2-eyebrow">Objectif de la semaine</span>
          <div className="al-equipe__objectif-chiffre">
            {progression} <span>/ {defiSemaine.seancesCibles} séances</span>
          </div>
          <div className="al-equipe__objectif-barre">
            <div
              className="al-equipe__objectif-remplissage"
              style={{ width: `${Math.min(100, (progression / defiSemaine.seancesCibles) * 100)}%` }}
            />
          </div>
          <div className="al-equipe__objectif-valeurs">Discipline · Effort · Équipe</div>
        </div>
      </div>

      <div className="al-equipe__joueurs">
        <div className="al-equipe__joueurs-head">
          <h2 className="al-v2-title al-equipe__joueurs-titre">Les joueurs</h2>
          <Link to="/collection" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm">
            🎴 Mes cartes de saison <span aria-hidden="true">→</span>
          </Link>
        </div>

        {aDesJoueurs ? (
          <div className="al-equipe__cartes">
            {joueursCadet.map((j) => (
              <Link key={j.numero} to={`/joueurs/${j.numero}`} className="al-equipe__carte">
                <img src={j.carteImage} alt={`Carte — joueur numéro ${j.numero}, ${categorie}. Voir le profil.`} />
                <span className="al-equipe__carte-hint">Voir le profil →</span>
              </Link>
            ))}
            <div className="al-equipe__carte al-equipe__carte--equipe" aria-label="L'équipe au complet">
              <img src="/images/equipe/carte-equipe.png" alt="L'équipe Cadet au complet" />
            </div>
          </div>
        ) : (
          <div className="al-equipe__vide">
            Aucun portrait de joueur n'est encore disponible pour {equipeSelectionnee?.nom ?? `${categorie} ${genre === "masculin" ? "Masculin" : "Féminin"}`}.
            Les cartes apparaîtront ici dès qu'elles seront fournies.
          </div>
        )}
      </div>
    </div>
  );
}
