import { useParams } from "react-router-dom";
import EmptyState from "../components/EmptyState";
import { categoriesSports, equipes, niveaux } from "../data/teams";
import { evenementsExemple } from "../data/events";
import { resultatsExemple } from "../data/results";
import { cheminPhoto } from "../lib/images";
import "./TeamDetailPage.css";

const rubriques = [
  "Actualités",
  "Horaire",
  "Photos",
  "Vidéos",
  "Documents",
  "Entraîneurs",
];

/**
 * Gabarit réutilisable de page d'équipe (/equipes/:slug).
 * Seule « equipe-exemple » existe pour le moment : la liste officielle des
 * équipes n'a pas été fournie et ne doit pas être inventée.
 */
export default function TeamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const equipe = equipes.find((e) => e.slug === slug);

  if (!equipe) {
    return (
      <section className="al-section al-section--blanc">
        <div className="container">
          <EmptyState
            title="Cette équipe n'est pas encore disponible."
            description="La liste officielle des équipes sera ajoutée prochainement."
          />
        </div>
      </section>
    );
  }

  const sport = categoriesSports.find((c) => c.sport === equipe.sport);
  const niveau = niveaux.find((n) => n.valeur === equipe.niveau);

  const prochainMatch = evenementsExemple
    .filter((e) => e.equipeSlug === equipe.slug && e.type === "match")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const prochainEntrainement = evenementsExemple
    .filter((e) => e.equipeSlug === equipe.slug && e.type === "entrainement")
    .sort((a, b) => a.date.localeCompare(b.date))[0];

  const dernierResultat = resultatsExemple
    .filter((r) => r.equipeSlug === equipe.slug)
    .sort((a, b) => b.date.localeCompare(a.date))[0];

  return (
    <>
      <section className="al-team-hero">
        <div className="al-team-hero__identity">
          <h1>
            <span>{sport?.nom.toUpperCase() ?? equipe.sport.toUpperCase()}</span>
            <span>{niveau?.label.toUpperCase() ?? equipe.niveau.toUpperCase()}</span>
            <span>{equipe.genre.toUpperCase()}</span>
          </h1>
        </div>
        <div className="al-team-hero__media">
          {equipe.photoPrincipale && (
            <img
              src={cheminPhoto(equipe.photoPrincipale)}
              alt="Athlète représentant l'équipe exemple"
            />
          )}
        </div>
      </section>

      <div className="al-team-band">
        <div className="container al-team-band__row">
          <div className="al-team-band__item">
            <span className="al-team-band__label">Prochain match</span>
            <span className="al-team-band__value">
              {prochainMatch ? `${prochainMatch.date} · ${prochainMatch.heure}` : "Information à confirmer"}
            </span>
          </div>
          <div className="al-team-band__item">
            <span className="al-team-band__label">Prochain entraînement</span>
            <span className="al-team-band__value">
              {prochainEntrainement
                ? `${prochainEntrainement.date} · ${prochainEntrainement.heure}`
                : "Information à confirmer"}
            </span>
          </div>
          <div className="al-team-band__item">
            <span className="al-team-band__label">Dernier résultat</span>
            <span className="al-team-band__value">
              {dernierResultat
                ? `vs ${dernierResultat.adversaire} — ${dernierResultat.score}`
                : "Information à confirmer"}
            </span>
          </div>
        </div>
      </div>

      <section className="al-section al-section--blanc">
        <div className="container">
          <div className="al-numbered">
            {rubriques.map((rubrique, index) => (
              <div className="al-numbered__row" key={rubrique}>
                <span className="al-numbered__index">{String(index + 1).padStart(2, "0")}</span>
                <div className="al-numbered__body">
                  <h3>{rubrique}</h3>
                  <p>Contenu à confirmer</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
