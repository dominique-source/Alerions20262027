import { Link } from "react-router-dom";
import Hero from "../components/Hero";

const rubriques = [
  "Mon horaire",
  "Mes vidéos",
  "Mon développement",
  "Philosophie Alérions",
  "Documents",
];

/** Espace Athlètes — direct et photographique, esprit vestiaire numérique. */
export default function AthletesPage() {
  return (
    <>
      <Hero
        image="DSC_1152.jpg"
        imageAlt="Athlète des Alérions en pleine action"
        eyebrow="Espace Athlètes"
        title={
          <>
            TON ÉQUIPE.
            <br />
            TA SAISON.
          </>
        }
        actions={
          <Link to="/equipes" className="al-btn al-btn--primary">
            Voir mon équipe
          </Link>
        }
      />

      <section className="al-section al-section--deep">
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
