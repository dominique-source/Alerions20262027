import type { DocumentPdf } from "../types";
import { tailleLisible } from "../data/documents";
import "./DocumentRow.css";

const libellesCategorie: Record<DocumentPdf["categorie"], string> = {
  reglement: "Règlement",
  guide: "Guide",
  projet: "Projet",
  "identite-visuelle": "Identité visuelle",
  formulaire: "Formulaire",
};

/**
 * Ligne de document réel : titre exact, description courte, pages, taille,
 * actions « Voir » et « Télécharger » — toujours fonctionnelles, le fichier
 * existe réellement dans public/documents/.
 */
export default function DocumentRow({ document }: { document: DocumentPdf }) {
  const href = `/documents/${document.fichier}`;

  return (
    <div className="al-doc-row">
      <div className="al-doc-row__head">
        <span className="al-doc-row__type">{libellesCategorie[document.categorie]}</span>
        {document.groupeVersion && (
          <span className="al-doc-row__version">{document.groupeVersion.etiquette}</span>
        )}
      </div>
      <span className="al-doc-row__titre">{document.titre}</span>
      <p className="al-doc-row__desc">{document.description}</p>
      <div className="al-doc-row__meta">
        <div className="al-doc-row__facts">
          <span>
            {document.pages} page{document.pages > 1 ? "s" : ""}
          </span>
          <span>{tailleLisible(document.tailleOctets)}</span>
        </div>
        <div className="al-doc-row__actions">
          <a className="al-doc-row__action" href={href} target="_blank" rel="noopener noreferrer">
            Voir le PDF
          </a>
          <a className="al-doc-row__action" href={href} download>
            Télécharger
          </a>
        </div>
      </div>
    </div>
  );
}
