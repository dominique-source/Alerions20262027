import { useRef } from "react";
import { photosLivingXVI } from "../data/livingXVI";
import { cheminPhoto } from "../lib/images";
import "./LivingXVI.css";

/**
 * Mur vivant XVI — ÉTAPE 1 (fondation uniquement).
 *
 * Ce composant prépare la structure du futur « mur vivant » : 16 photos
 * d'athlètes des Alérions, une par tuile, dans une grille 4x4 fixe.
 *
 * Ce qui est fait ici :
 *  - le conteneur pour exactement 16 photos (voir src/data/livingXVI.ts) ;
 *  - une composition photographique statique (aucune animation) ;
 *  - le titre « XVI » et l'amorce « Seize Alérions. Une histoire en
 *    mouvement. » ;
 *  - des points d'ancrage prêts pour l'animation future : une ref sur le
 *    conteneur (`murRef`) et un `data-xvi-index` sur chaque tuile, que la
 *    future logique de défilement (ex. IntersectionObserver ou une
 *    bibliothèque de scroll-animation) pourra cibler individuellement.
 *
 * Ce qui N'est PAS fait ici (volontairement, prochaine étape) :
 *  - aucune animation au défilement n'est branchée ;
 *  - les tuiles ne sont PAS positionnées pour former les lettres « XVI » ;
 *    la grille 4x4 actuelle est un espace réservé neutre, pas la mise en
 *    page finale.
 */
export default function LivingXVI() {
  // Ref réservée à la future logique de scroll (ex. observer les tuiles
  // visibles pour déclencher leur transition individuelle).
  const murRef = useRef<HTMLDivElement>(null);

  return (
    <section className="al-xvi" aria-labelledby="xvi-titre">
      <div className="al-xvi__intro">
        <h2 id="xvi-titre" className="al-xvi__title">
          XVI
        </h2>
        <p className="al-xvi__tagline">Seize Alérions. Une histoire en mouvement.</p>
      </div>

      {/* Conteneur du mur vivant : structure prête, animation à venir. */}
      <div className="al-xvi__mur" ref={murRef} role="list" aria-label="Seize athlètes des Alérions">
        {photosLivingXVI.map((photo, index) => (
          <div
            key={photo.fichier}
            className="al-xvi__tuile"
            data-xvi-index={index}
            role="listitem"
          >
            <img src={cheminPhoto(photo.fichier)} alt={photo.alt} loading="lazy" decoding="async" />
          </div>
        ))}
      </div>
    </section>
  );
}
