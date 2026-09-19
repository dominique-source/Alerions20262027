import { useRef } from "react";
import { photosLivingXVI } from "../data/livingXVI";
import { cheminPhoto } from "../lib/images";
import "./LivingXVI.css";

/**
 * Mur vivant XVI — composition photographique asymétrique et énergique.
 *
 * Ce composant affiche les 16 photos d'athlètes des Alérions (voir
 * src/data/livingXVI.ts) dans une masse photographique dense : formats
 * variés, léger chevauchement, réaction discrète au survol. Ce n'est PAS
 * une grille régulière de 16 cases identiques, et les tuiles ne sont PAS
 * positionnées pour former les lettres « XVI ».
 *
 * Prêt pour l'animation future : une ref sur le conteneur (`murRef`) et un
 * `data-xvi-index` sur chaque tuile, que la future logique de défilement
 * (ex. IntersectionObserver ou une bibliothèque de scroll-animation) pourra
 * cibler individuellement. Aucune animation au défilement n'est branchée
 * ici — volontairement, prochaine étape.
 *
 * Sur téléphone, la composition devient une liste verticale simple (voir
 * LivingXVI.css) pour rester lisible.
 */
export default function LivingXVI() {
  const murRef = useRef<HTMLDivElement>(null);

  return (
    <section className="al-xvi" aria-labelledby="xvi-titre">
      <div className="al-xvi__intro">
        <h2 id="xvi-titre" className="al-xvi__title">
          XVI
        </h2>
        <p className="al-xvi__tagline">
          Seize Alérions.
          <br />
          Une histoire en mouvement.
        </p>
      </div>

      <div
        className="al-xvi__mur"
        ref={murRef}
        role="list"
        aria-label="Seize athlètes des Alérions"
      >
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
