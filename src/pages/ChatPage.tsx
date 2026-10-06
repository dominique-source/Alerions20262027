import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { useNomsEquipes } from "../hooks/useNomsEquipes";
import { useRoster } from "../hooks/useRoster";
import { sportSlugDepuisNomBrut } from "../data/sports";
import "./ChatPage.css";

/** Entrée privée : uniquement les équipes confirmées par le serveur. */
export default function ChatPage() {
  const { compte } = useAuth();
  const idEquipes = [...new Set(compte?.rattachements.map((r) => r.teamId) ?? [])];
  const [selection, setSelection] = useState("");
  const idEquipe = idEquipes.includes(selection) ? selection : idEquipes[0];
  const noms = useNomsEquipes(idEquipes);
  const roster = useRoster(undefined, undefined, idEquipe);
  const equipe = roster.equipe;

  return (
    <div className="al-chat-entree">
      <span className="al-v2-eyebrow">Alérions Chat</span>
      <h1 className="al-v2-title al-chat-entree__titre">Mes conversations</h1>
      <p className="al-chat-entree__texte">Retrouve les membres de ton équipe. Les messages restent enregistrés dans sa conversation privée.</p>
      {idEquipes.length > 0 ? (
        <>
          <label className="al-chat-entree__selecteur">
            <span>Équipe</span>
            <select value={idEquipe} onChange={(e) => setSelection(e.target.value)}>
              {idEquipes.map((id) => <option key={id} value={id}>{noms[id] ?? id}</option>)}
            </select>
          </label>
          {roster.etat === "chargement" ? <p role="status">Chargement de l’équipe…</p>
            : roster.etat === "erreur" ? <div role="alert"><p>Connexion à l’équipe indisponible.</p><button className="al-btn-v2 al-btn-v2--gold" onClick={roster.rafraichir}>Réessayer</button></div>
            : equipe?.idEquipe === idEquipe ? (
              <Link to={`/equipes/${sportSlugDepuisNomBrut(equipe.sport)}/${equipe.slugSite}/chat`} className="al-btn-v2 al-btn-v2--red">Ouvrir le chat {equipe.nomEquipe} →</Link>
            ) : <p role="status">Cette équipe n’est pas encore reliée à l’effectif.</p>}
        </>
      ) : <p>Aucune équipe n’est rattachée à ton compte.</p>}
      {compte?.isAdmin && <Link to="/equipes" className="al-chat-entree__lien-secondaire">Administration : choisir une équipe →</Link>}
      <Link to="/compte" className="al-chat-entree__lien-secondaire">Retour à mon compte →</Link>
    </div>
  );
}
