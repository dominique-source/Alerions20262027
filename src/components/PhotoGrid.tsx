import type { Photo } from "../types";
import { cheminPublic, surErreurImageMasquer } from "../lib/images";
import "./PhotoGrid.css";

/**
 * Composition éditoriale de galerie : la première photo devient la grande
 * image, les suivantes alternent horizontales/verticales. Toutes les images
 * sont chargées en lazy. Une photo de campagne pas encore livrée disparaît
 * simplement de la composition (aucun lien brisé).
 */
export default function PhotoGrid({ photos }: { photos: Photo[] }) {
  return (
    <div className="al-photo-grid">
      {photos.map((photo, index) => {
        const modificateur =
          index === 0 ? "grande" : photo.orientation === "horizontale" ? "horizontale" : "verticale";
        return (
          <figure
            key={photo.id}
            className={`al-photo-grid__item al-photo-grid__item--${modificateur}`}
            data-photo-tuile
          >
            <img
              src={cheminPublic(photo.fichier)}
              alt={photo.alt}
              loading="lazy"
              decoding="async"
              onError={surErreurImageMasquer}
            />
            {photo.type === "campagne" && (
              <span className="al-photo-grid__badge">Campagne Alérions</span>
            )}
          </figure>
        );
      })}
    </div>
  );
}
