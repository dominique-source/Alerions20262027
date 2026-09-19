import type { PhotoGalerie } from "../types";
import { cheminPhoto } from "../lib/images";
import "./PhotoGrid.css";

/**
 * Composition éditoriale de galerie : la première photo devient la grande
 * image, les suivantes alternent horizontales/verticales. Toutes les images
 * sont chargées en lazy (aucune des 40 photos n'est chargée d'un coup).
 */
export default function PhotoGrid({ photos }: { photos: PhotoGalerie[] }) {
  return (
    <div className="al-photo-grid">
      {photos.map((photo, index) => {
        const modificateur =
          index === 0 ? "grande" : photo.orientation === "horizontale" ? "horizontale" : "verticale";
        return (
          <figure
            key={photo.fichier}
            className={`al-photo-grid__item al-photo-grid__item--${modificateur}`}
          >
            <img src={cheminPhoto(photo.fichier)} alt={photo.alt} loading="lazy" decoding="async" />
          </figure>
        );
      })}
    </div>
  );
}
