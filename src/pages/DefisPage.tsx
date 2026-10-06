import { useState } from "react";
import { defiSemaine } from "../data/defis";
import {
  coachDeverrouille,
  declarerSeance,
  deverrouillerCoach,
  seancesDeclarees,
  seancesValideesParCoach,
  validerToutesLesSeancesDuCoach,
} from "../lib/defis";
import "./DefisPage.css";

export default function DefisPage() {
  const [, forcerRendu] = useState(0);
  const [codeCoach, setCodeCoach] = useState("");
  const [messageCoach, setMessageCoach] = useState<string | null>(null);
  const [envoiEnCours, setEnvoiEnCours] = useState(false);

  const declarees = seancesDeclarees(defiSemaine.id);
  const valideesCoach = seancesValideesParCoach(defiSemaine.id);
  const pourcentage = Math.min(100, (declarees / defiSemaine.seancesCibles) * 100);

  const handleDeclarer = () => {
    declarerSeance(defiSemaine.id);
    forcerRendu((n) => n + 1);
  };

  const handleCoach = async (e: React.FormEvent) => {
    e.preventDefault();
    setEnvoiEnCours(true);
    const resultat = await deverrouillerCoach(codeCoach);
    setEnvoiEnCours(false);
    if (resultat === "ok") {
      setMessageCoach(null);
      setCodeCoach("");
      forcerRendu((n) => n + 1);
    } else if (resultat === "service_non_configure") {
      setMessageCoach("La validation coach n'est pas encore configurée sur ce site (code serveur absent).");
    } else {
      setMessageCoach("Code invalide.");
    }
  };

  return (
    <div className="al-defis">
      <div className="al-defis__haut">
        <div className="al-defis__visuel">
          <img src="/images/portraits/portrait-25-fumee-blanche.jpg" alt="Entraînement Alérions" />
          <span className="al-defis__visuel-legende">Toujours plus loin</span>
        </div>

        <div className="al-defis__intro">
          <span className="al-equipe__crown" aria-hidden="true">
            ♛
          </span>
          <h1 className="al-v2-title al-defis__titre">
            Le défi <span className="al-defis__titre-red">de la semaine</span>
          </h1>

          <div className="al-defis__carte">
            <div className="al-defis__carte-titre">{defiSemaine.titre}</div>
            <p className="al-defis__carte-sous">
              {defiSemaine.seancesCibles} séances {defiSemaine.periode.toLowerCase()}
            </p>
            <ul className="al-defis__consignes">
              {defiSemaine.consignes.map((c) => (
                <li key={c}>{c}</li>
              ))}
            </ul>
            {defiSemaine.lienDemo ? (
              <a href={defiSemaine.lienDemo} className="al-btn-v2 al-btn-v2--red" target="_blank" rel="noopener noreferrer">
                Voir la démonstration <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="al-defis__demo-absente">Démonstration vidéo à venir.</p>
            )}
          </div>
        </div>
      </div>

      <div className="al-defis__bas">
        <div className="al-defis__progression">
          <h2 className="al-v2-title al-defis__bloc-titre">Ma progression</h2>
          <div className="al-defis__cercles">
            {Array.from({ length: defiSemaine.seancesCibles }, (_, i) => i + 1).map((n) => (
              <div key={n} className="al-defis__cercle">
                <span className={`al-defis__cercle-chiffre${n <= declarees ? " al-defis__cercle-chiffre--fait" : ""}`}>
                  {n <= declarees ? "✓" : n}
                </span>
                <span className="al-defis__cercle-label">
                  Séance {n}
                  {n <= declarees ? " — Déclarée" : ""}
                </span>
              </div>
            ))}
          </div>
          <div className="al-defis__compteur">
            {declarees} / {defiSemaine.seancesCibles} séances
          </div>
          <button
            type="button"
            className="al-btn-v2 al-btn-v2--red"
            disabled={declarees >= defiSemaine.seancesCibles}
            onClick={handleDeclarer}
          >
            Déclarer ma séance <span aria-hidden="true">→</span>
          </button>

          <div className="al-defis__coach">
            <span>
              Validation du coach : {valideesCoach} / {declarees} séance{declarees > 1 ? "s" : ""} validée
              {valideesCoach > 1 ? "s" : ""}
            </span>
            {coachDeverrouille() ? (
              <button
                type="button"
                className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm"
                onClick={() => {
                  validerToutesLesSeancesDuCoach(defiSemaine.id);
                  forcerRendu((n) => n + 1);
                }}
              >
                ✓ Valider mes séances
              </button>
            ) : (
              <form className="al-defis__coach-form" onSubmit={handleCoach}>
                <input
                  type="password"
                  value={codeCoach}
                  onChange={(e) => setCodeCoach(e.target.value)}
                  placeholder="Code coach"
                  aria-label="Code d'accès coach"
                />
                <button type="submit" className="al-btn-v2 al-btn-v2--outline al-btn-v2--sm" disabled={envoiEnCours}>
                  {envoiEnCours ? "…" : "Déverrouiller"}
                </button>
              </form>
            )}
            {messageCoach && <p className="al-defis__coach-message">{messageCoach}</p>}
          </div>
        </div>

        <div className="al-defis__objectif">
          <h2 className="al-v2-title al-defis__bloc-titre">
            Objectif <span className="al-defis__titre-red">collectif</span>
          </h2>
          <p className="al-defis__objectif-texte">Atteindre {defiSemaine.seancesCibles} séances déclarées cette semaine</p>
          <div className="al-defis__barre">
            <div className="al-defis__barre-remplissage" style={{ width: `${pourcentage}%` }} />
          </div>
          <div className="al-defis__objectif-chiffre">{Math.round(pourcentage)} %</div>
          <div className="al-defis__recompense">
            <span aria-hidden="true">📸</span>
            <div>
              <span className="al-v2-eyebrow">Récompense</span>
              <div>{defiSemaine.recompense}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
