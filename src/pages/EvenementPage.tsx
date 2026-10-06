import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { evenements } from "../data/events";
import { telechargerICS } from "../lib/ics";
import { confirmerPresence, presenceConfirmee } from "../lib/presences";
import NotFoundPage from "./NotFoundPage";
import "./EvenementPage.css";

function formaterDateLongue(date: string): string {
  return new Intl.DateTimeFormat("fr-CA", { weekday: "long", day: "numeric", month: "long" }).format(
    new Date(`${date}T00:00:00`),
  );
}

/**
 * Détail d'un événement — reproduction de
 * 01_MAQUETTES/evenement-desktop-1536x1024.png. Le schéma géographique de
 * la maquette est décoratif (voir REPRODUCTION.md) : le vrai lien
 * « Itinéraire » ci-dessous pointe sur une adresse validée, pas une carte
 * inventée.
 */
export default function EvenementPage() {
  const { id } = useParams<{ id: string }>();
  const evenement = evenements.find((e) => e.id === id);
  const [confirme, setConfirme] = useState(() => (id ? presenceConfirmee(id) : false));

  if (!evenement) return <NotFoundPage />;

  const estSpecial = evenement.id === "cadet-scrimmage-anciens-2026-10-13";

  return (
    <div className="al-evenement">
      <nav className="al-joueur__fil" aria-label="Fil d'Ariane">
        <Link to="/calendrier">Calendrier</Link>
        <span aria-hidden="true">›</span>
        <span>{evenement.titre}</span>
      </nav>

      <div className="al-evenement__haut">
        <div className="al-evenement__contenu">
          {estSpecial && <span className="al-v2-eyebrow">Match spécial</span>}
          <h1 className="al-v2-title al-evenement__titre">{evenement.titre}</h1>
          <p className="al-evenement__date-heure">
            {formaterDateLongue(evenement.date)}
            {evenement.heure ? ` · ${evenement.heure.replace(":", " h ")}` : " · Heure à venir"}
          </p>

          <div className="al-evenement__badges">
            {evenement.lieu && (
              <span className="al-evenement__badge">
                📍 {evenement.localisation === "domicile" ? "Au CFDL" : evenement.lieu}
              </span>
            )}
            {estSpecial && <span className="al-evenement__badge">🍕 Pizza pour tous</span>}
          </div>

          <div className="al-evenement__actions">
            <button
              type="button"
              className="al-btn-v2 al-btn-v2--red"
              disabled={confirme}
              onClick={() => {
                confirmerPresence(evenement.id);
                setConfirme(true);
              }}
            >
              {confirme ? "✓ Présence confirmée" : "Confirmer ma présence"} <span aria-hidden="true">→</span>
            </button>
            <button type="button" className="al-btn-v2 al-btn-v2--outline" onClick={() => telechargerICS(evenement)}>
              📅 Ajouter au calendrier
            </button>
          </div>
        </div>

        <div className="al-evenement__image">
          <img src="/images/accueil/hero-portraits.png" alt="Athlètes Alérions" />
        </div>
      </div>

      <div className="al-evenement__bas">
        {estSpecial && (
          <div className="al-evenement__bloc">
            <h2 className="al-v2-title al-evenement__bloc-titre">Le programme</h2>
            <div className="al-evenement__programme">
              <div>
                <div className="al-evenement__programme-etape">
                  Les Cadets <em>avec</em> les Anciens
                </div>
                <p>
                  Nos cadets joignent leurs forces avec les anciens pour un premier affrontement. Une
                  occasion unique d'apprendre, d'échanger et de vivre le basketball ensemble.
                </p>
              </div>
              <div>
                <div className="al-evenement__programme-etape">
                  Les Cadets <em>contre</em> les Anciens
                </div>
                <p>Place à la compétition ! Nos cadets affronteront les anciens dans un match amical.</p>
              </div>
            </div>
          </div>
        )}

        {evenement.lieu && (
          <div className="al-evenement__bloc">
            <h2 className="al-v2-title al-evenement__bloc-titre">Pour venir</h2>
            <p className="al-evenement__adresse">📍 {evenement.lieu}</p>
            {evenement.lienEmplacement ? (
              <a
                href={evenement.lienEmplacement}
                target="_blank"
                rel="noopener noreferrer"
                className="al-btn-v2 al-btn-v2--red"
              >
                Itinéraire <span aria-hidden="true">→</span>
              </a>
            ) : (
              <p className="al-evenement__adresse-manquante">Adresse exacte à confirmer.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
