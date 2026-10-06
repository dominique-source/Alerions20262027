import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { trouverJoueur } from "../data/joueurs";
import { contenusMur } from "../data/mur";
import { cartesCollection } from "../data/collection";
import { carteObtenue } from "../lib/collection";
import { lireJSON, ecrireJSON } from "../lib/store";
import NotFoundPage from "./NotFoundPage";
import "./JoueurPage.css";

interface ChampsPerso {
  mouvement: string;
  chanson: string;
  objectif: string;
}

function champsVides(): ChampsPerso {
  return { mouvement: "", chanson: "", objectif: "" };
}

function ChampEditable({
  label,
  icone,
  valeur,
  onChange,
}: {
  label: string;
  icone: string;
  valeur: string;
  onChange: (v: string) => void;
}) {
  const [enEdition, setEnEdition] = useState(false);
  const [brouillon, setBrouillon] = useState(valeur);

  if (enEdition) {
    return (
      <form
        className="al-joueur__champ al-joueur__champ--edition"
        onSubmit={(e) => {
          e.preventDefault();
          onChange(brouillon.trim());
          setEnEdition(false);
        }}
      >
        <span className="al-joueur__champ-icone" aria-hidden="true">
          {icone}
        </span>
        <div className="al-joueur__champ-corps">
          <span className="al-joueur__champ-label">{label}</span>
          <input
            autoFocus
            value={brouillon}
            onChange={(e) => setBrouillon(e.target.value)}
            placeholder="À compléter"
            maxLength={80}
          />
        </div>
        <button type="submit" className="al-btn-v2 al-btn-v2--sm al-btn-v2--gold">
          OK
        </button>
      </form>
    );
  }

  return (
    <div className="al-joueur__champ">
      <span className="al-joueur__champ-icone" aria-hidden="true">
        {icone}
      </span>
      <div className="al-joueur__champ-corps">
        <span className="al-joueur__champ-label">{label}</span>
        <span className="al-joueur__champ-valeur">{valeur || "À compléter"}</span>
      </div>
      <button
        type="button"
        className="al-joueur__champ-stylo"
        onClick={() => {
          setBrouillon(valeur);
          setEnEdition(true);
        }}
        aria-label={`Modifier : ${label}`}
      >
        ✎
      </button>
    </div>
  );
}

/**
 * Profil joueur — reproduction de 01_MAQUETTES/profil-joueur-desktop-1536x1024.png.
 * Les champs personnels sont enregistrés localement (voir lib/store.ts) :
 * ce site statique n'a pas de compte joueur, donc « modifier » ici veut dire
 * « modifier sur cet appareil », pas publier pour tout le monde.
 */
export default function JoueurPage() {
  const { numero } = useParams<{ numero: string }>();
  const joueur = numero ? trouverJoueur(Number(numero)) : undefined;
  const cleChamps = `al-profil-${numero}`;
  const [champs, setChamps] = useState<ChampsPerso>(() => lireJSON(cleChamps, champsVides()));

  if (!joueur) return <NotFoundPage />;

  const majChamp = (cle: keyof ChampsPerso, valeur: string) => {
    const suivant = { ...champs, [cle]: valeur };
    setChamps(suivant);
    ecrireJSON(cleChamps, suivant);
  };

  const moments = contenusMur.filter((c) => c.lien === `/joueurs/${joueur.numero}` || c.id === "derriere-maillots");
  const cartesApercu = cartesCollection.slice(0, 3);

  return (
    <div className="al-joueur">
      <nav className="al-joueur__fil" aria-label="Fil d'Ariane">
        <Link to="/mon-equipe">Mon équipe</Link>
        <span aria-hidden="true">›</span>
        <span>N° {joueur.numero}</span>
      </nav>

      <div className="al-joueur__haut">
        <div className="al-joueur__carte">
          <img src={joueur.carteImage} alt={`Carte de saison — joueur numéro ${joueur.numero}`} />
        </div>

        <div className="al-joueur__infos">
          <div>
            <span className="al-equipe__crown" aria-hidden="true">
              ♛
            </span>
            <h1 className="al-joueur__numero">N° {joueur.numero}</h1>
            <p className="al-joueur__sous-titre">{joueur.equipeNom} · Alérions</p>
          </div>
          <a href={joueur.carteImage} download className="al-btn-v2 al-btn-v2--red">
            ⬇ Télécharger ma carte
          </a>

          <div className="al-joueur__champs">
            <ChampEditable
              label="Mon mouvement préféré"
              icone="🏃"
              valeur={champs.mouvement}
              onChange={(v) => majChamp("mouvement", v)}
            />
            <ChampEditable
              label="Ma chanson avant un match"
              icone="🎵"
              valeur={champs.chanson}
              onChange={(v) => majChamp("chanson", v)}
            />
            <ChampEditable
              label="Mon objectif de saison"
              icone="🎯"
              valeur={champs.objectif}
              onChange={(v) => majChamp("objectif", v)}
            />
          </div>
        </div>
      </div>

      <div className="al-joueur__bas">
        <section>
          <div className="al-joueur__section-head">
            <h2 className="al-v2-title al-joueur__section-titre">Mes moments</h2>
            <Link to="/mur">Tous mes moments →</Link>
          </div>
          <div className="al-joueur__moments">
            {moments.slice(0, 2).map((m) => (
              <img key={m.id} src={m.image} alt={m.titre} />
            ))}
          </div>
        </section>

        <section>
          <div className="al-joueur__section-head">
            <h2 className="al-v2-title al-joueur__section-titre">Mes cartes de saison</h2>
            <Link to="/collection">Voir toutes →</Link>
          </div>
          <div className="al-joueur__cartes-apercu">
            {cartesApercu.map((c) => {
              const obtenue = carteObtenue(c.id);
              return (
                <div key={c.id} className={`al-joueur__mini-carte${obtenue ? "" : " al-joueur__mini-carte--verrouillee"}`}>
                  {obtenue && c.image ? <img src={c.image} alt={c.titre} /> : <span aria-hidden="true">🔒</span>}
                </div>
              );
            })}
          </div>
        </section>
      </div>
    </div>
  );
}
