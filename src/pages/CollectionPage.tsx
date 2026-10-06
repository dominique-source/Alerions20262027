import { useState } from "react";
import { cartesCollection } from "../data/collection";
import { carteObtenue } from "../lib/collection";
import "./CollectionPage.css";

type Filtre = "toutes" | "obtenues" | "a-venir";

export default function CollectionPage() {
  const [filtre, setFiltre] = useState<Filtre>("toutes");
  const etats = cartesCollection.map((c) => ({ carte: c, obtenue: carteObtenue(c.id) }));
  const nbObtenues = etats.filter((e) => e.obtenue).length;

  const visibles = etats.filter(({ obtenue }) => {
    if (filtre === "obtenues") return obtenue;
    if (filtre === "a-venir") return !obtenue;
    return true;
  });

  return (
    <div className="al-collection">
      <div className="al-collection__entete">
        <div>
          <span className="al-v2-eyebrow">Culture Alérions</span>
          <h1 className="al-v2-title al-collection__titre">
            Mes cartes <span className="al-collection__titre-red">de saison</span>
          </h1>
        </div>
        <div className="al-collection__progression">
          <span className="al-v2-eyebrow">Progression de la collection</span>
          <div className="al-collection__chiffre">
            {nbObtenues} <span>/ {cartesCollection.length}</span>
          </div>
          <div className="al-collection__barre">
            {cartesCollection.map((c) => (
              <span key={c.id} className={carteObtenue(c.id) ? "al-collection__segment--fait" : ""} />
            ))}
          </div>
        </div>
      </div>

      <div className="al-collection__filtres" role="tablist" aria-label="Filtrer les cartes">
        {(
          [
            ["toutes", "Toutes"],
            ["obtenues", "Obtenues"],
            ["a-venir", "À venir"],
          ] as [Filtre, string][]
        ).map(([valeur, label]) => (
          <button
            key={valeur}
            type="button"
            role="tab"
            aria-selected={filtre === valeur}
            className={`al-collection__filtre${filtre === valeur ? " al-collection__filtre--actif" : ""}`}
            onClick={() => setFiltre(valeur)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="al-collection__grille">
        {visibles.map(({ carte, obtenue }) => (
          <div key={carte.id} className={`al-collection__carte${obtenue ? "" : " al-collection__carte--verrouillee"}`}>
            <div className="al-collection__carte-image">
              {obtenue && carte.image ? (
                <img src={carte.image} alt={carte.titre} />
              ) : (
                <span className="al-collection__cadenas" aria-hidden="true">
                  🔒
                </span>
              )}
            </div>
            <div className="al-collection__carte-titre">{carte.titre}</div>
            {!obtenue && <div className="al-collection__carte-regle">{carte.regle}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}
