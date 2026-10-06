import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { contenusMur, sondageMur } from "../data/mur";
import { cartesCollection } from "../data/collection";
import { carteObtenue } from "../lib/collection";
import { marquerDecouverte } from "../lib/decouvertes";
import { monVote, voter } from "../lib/votes";
import "./MurPage.css";

type Filtre = "tout" | "equipe" | "photo" | "video";

function formaterDate(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

export default function MurPage() {
  const [filtre, setFiltre] = useState<Filtre>("tout");
  const [ouvert, setOuvert] = useState<number | null>(null);
  const [monChoix, setMonChoix] = useState(() => monVote(sondageMur.id));
  const [choixEnCours, setChoixEnCours] = useState<"a" | "b" | null>(null);

  const visibles = contenusMur.filter((c) => {
    if (filtre === "equipe") return c.equipeConcernee;
    if (filtre === "photo") return c.type === "photo";
    if (filtre === "video") return c.type === "video";
    return true;
  });

  useEffect(() => {
    if (ouvert === null) return;
    marquerDecouverte("mur-photo");
    document.body.style.overflow = "hidden";
    function surTouche(e: KeyboardEvent) {
      if (e.key === "Escape") setOuvert(null);
      if (e.key === "ArrowRight") setOuvert((i) => (i === null ? null : Math.min(visibles.length - 1, i + 1)));
      if (e.key === "ArrowLeft") setOuvert((i) => (i === null ? null : Math.max(0, i - 1)));
    }
    window.addEventListener("keydown", surTouche);
    return () => {
      window.removeEventListener("keydown", surTouche);
      document.body.style.overflow = "";
    };
  }, [ouvert, visibles.length]);

  const soumettreVote = () => {
    if (!choixEnCours || monChoix) return;
    voter(sondageMur.id, choixEnCours);
    setMonChoix(choixEnCours);
  };

  const cartesApercu = cartesCollection.slice(0, 3);
  const nbObtenues = cartesCollection.filter((c) => carteObtenue(c.id)).length;

  return (
    <div className="al-mur">
      <div className="al-mur__entete">
        <h1 className="al-v2-title al-mur__titre">
          Le mur <span className="al-mur__titre-red">des Alérions</span>
        </h1>
        <p className="al-mur__sous-titre">Photos. Vidéos. Coulisses.</p>
      </div>

      <div className="al-mur__filtres" role="tablist" aria-label="Filtrer le mur">
        {(
          [
            ["tout", "Tout"],
            ["equipe", "Mon équipe"],
            ["photo", "Photos"],
            ["video", "Vidéos"],
          ] as [Filtre, string][]
        ).map(([valeur, label]) => (
          <button
            key={valeur}
            type="button"
            role="tab"
            aria-selected={filtre === valeur}
            className={`al-mur__filtre${filtre === valeur ? " al-mur__filtre--actif" : ""}`}
            onClick={() => setFiltre(valeur)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="al-mur__corps">
        <div className="al-mur__grille">
          {visibles.length === 0 ? (
            <p className="al-mur__vide">Aucun contenu pour ce filtre pour le moment.</p>
          ) : (
            visibles.map((c, i) => (
              <button key={c.id} type="button" className="al-mur__tuile" onClick={() => setOuvert(i)}>
                <img src={c.image} alt={c.titre} loading="lazy" />
                <span className="al-mur__tuile-date">{formaterDate(c.date)}</span>
                <span className="al-mur__tuile-bas">
                  <span className="al-mur__tuile-categorie">{c.categorie}</span>
                  <span className="al-mur__tuile-titre">{c.titre}</span>
                </span>
              </button>
            ))
          )}
        </div>

        <aside className="al-mur__aside">
          <div className="al-mur__vote">
            <h2 className="al-v2-title al-mur__vote-titre">À toi de jouer</h2>
            <p className="al-mur__vote-sous">{sondageMur.sousTitre}</p>
            <div className="al-mur__vote-options">
              {sondageMur.options.map((o) => {
                const selectionne = monChoix ? monChoix === o.id : choixEnCours === o.id;
                return (
                  <button
                    key={o.id}
                    type="button"
                    className={`al-mur__vote-option${selectionne ? " al-mur__vote-option--actif" : ""}`}
                    disabled={Boolean(monChoix)}
                    aria-pressed={selectionne}
                    onClick={() => setChoixEnCours(o.id)}
                  >
                    <img src={o.image} alt={o.titre} />
                  </button>
                );
              })}
            </div>
            <button
              type="button"
              className="al-btn-v2 al-btn-v2--red al-mur__vote-bouton"
              onClick={soumettreVote}
              disabled={Boolean(monChoix) || !choixEnCours}
            >
              {monChoix ? "✓ Vote enregistré" : "Voter"} <span aria-hidden="true">→</span>
            </button>
          </div>

          <div className="al-mur__collection">
            <div className="al-mur__collection-head">
              <h2 className="al-v2-title al-mur__collection-titre">Mes cartes</h2>
              <span>
                {nbObtenues} / {cartesCollection.length}
              </span>
            </div>
            <p className="al-mur__collection-sous">Collectionne les cartes de la saison</p>
            <div className="al-mur__collection-grille">
              {cartesApercu.map((c) => {
                const obtenue = carteObtenue(c.id);
                return (
                  <div key={c.id} className={`al-mur__mini-carte${obtenue ? "" : " al-mur__mini-carte--verrouillee"}`}>
                    {obtenue && c.image ? <img src={c.image} alt={c.titre} /> : <span aria-hidden="true">🔒</span>}
                  </div>
                );
              })}
            </div>
            <Link to="/collection" className="al-mur__collection-lien">
              Voir toute la collection →
            </Link>
          </div>
        </aside>
      </div>

      {ouvert !== null && visibles[ouvert] && (
        <div className="al-mur__lightbox" role="dialog" aria-modal="true" aria-label={visibles[ouvert].titre}>
          <button type="button" className="al-mur__lightbox-fermer" onClick={() => setOuvert(null)} aria-label="Fermer">
            ✕
          </button>
          <button
            type="button"
            className="al-mur__lightbox-nav al-mur__lightbox-nav--prec"
            onClick={() => setOuvert((i) => (i === null ? null : Math.max(0, i - 1)))}
            disabled={ouvert === 0}
            aria-label="Photo précédente"
          >
            ‹
          </button>
          <figure>
            <img src={visibles[ouvert].image} alt={visibles[ouvert].titre} />
            <figcaption>{visibles[ouvert].titre}</figcaption>
          </figure>
          <button
            type="button"
            className="al-mur__lightbox-nav al-mur__lightbox-nav--suiv"
            onClick={() => setOuvert((i) => (i === null ? null : Math.min(visibles.length - 1, i + 1)))}
            disabled={ouvert === visibles.length - 1}
            aria-label="Photo suivante"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}
