import { useState } from "react";
import { Link } from "react-router-dom";
import { trouverEquipe } from "../data/teams";
import { CATEGORIES, CATEGORIE_SLUGS, GENRES } from "../data/categoriesBasketball";
import "./ChatPage.css";

/**
 * Chat — page d'entrée depuis la navigation principale. Le site n'a pas de
 * chat unique : chaque équipe a le sien (voir ChatApercuPage). Cette page
 * laisse choisir une équipe (catégorie + genre, comme sur Mon équipe) puis
 * ouvre l'aperçu imagé de son chat.
 */
export default function ChatPage() {
  const [categorie, setCategorie] = useState("Cadet");
  const [genre, setGenre] = useState("masculin");

  const equipe = trouverEquipe("basketball", `${CATEGORIE_SLUGS[categorie]}-${genre}`);

  return (
    <div className="al-chat-entree">
      <span className="al-v2-eyebrow">Alérions Chat</span>
      <h1 className="al-v2-title al-chat-entree__titre">Choisis ton équipe</h1>
      <p className="al-chat-entree__texte">
        Chaque équipe a son propre chat. Ceci est un aperçu de démonstration — aucun message
        réel n'est envoyé ni enregistré.
      </p>

      <div className="al-chat-entree__selecteurs">
        <label className="al-chat-entree__selecteur">
          <span className="sr-only">Choisir une catégorie</span>
          <select value={categorie} onChange={(e) => setCategorie(e.target.value)}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
        <label className="al-chat-entree__selecteur">
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

      {equipe && (
        <Link to={`/equipes/basketball/${equipe.slug}/chat`} className="al-btn-v2 al-btn-v2--red">
          💬 Ouvrir le chat {equipe.nom} <span aria-hidden="true">→</span>
        </Link>
      )}

      <Link to="/mon-equipe" className="al-chat-entree__lien-secondaire">
        Ou retrouve ton équipe sur Mon équipe →
      </Link>
    </div>
  );
}
