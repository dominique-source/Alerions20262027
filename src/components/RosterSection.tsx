import { useRoster } from "../hooks/useRoster";
import PlayerCard from "./PlayerCard";
import type { RosterCodeErreur } from "../types";
import "./RosterSection.css";

interface RosterSectionProps {
  sport: string;
  equipeSlug: string;
  /** Nom affiché sur chaque carte (ex. "Cadet Masculin") — indépendant du nom retourné par le Sheet. */
  equipeNomAffiche: string;
  /** Construit l'URL de profil pour un membre donné (identifiant stable, jamais le numéro seul). */
  construireLienProfil: (idMembre: string) => string;
  titre?: string;
}

const MESSAGES_ERREUR: Record<RosterCodeErreur, string> = {
  methode_non_autorisee: "Erreur technique inattendue.",
  parametres_manquants: "Erreur technique inattendue.",
  service_non_configure: "La connexion à l'effectif n'est pas encore configurée.",
  equipe_introuvable: "Cette équipe n'est pas encore référencée dans l'effectif.",
  google_auth_echouee: "La connexion à l'effectif est momentanément indisponible.",
  google_quota_depasse: "Trop de demandes en ce moment — nouvel essai dans un instant.",
  google_indisponible: "Google Sheets est momentanément indisponible.",
  erreur_inattendue: "Une erreur inattendue est survenue.",
  reseau: "Connexion impossible — vérifiez votre réseau.",
};

function SquelettesCartes() {
  return (
    <div className="al-roster__grille" aria-hidden="true">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="al-roster__squelette" />
      ))}
    </div>
  );
}

export default function RosterSection({
  sport,
  equipeSlug,
  equipeNomAffiche,
  construireLienProfil,
  titre = "Effectif — saison 2026-2027",
}: RosterSectionProps) {
  const { etat, joueurs, entraineurs, meta, codeErreur, rafraichir } = useRoster(sport, equipeSlug);

  return (
    <div className="al-roster">
      <div className="al-roster__entete">
        <span className="al-v2-eyebrow">{titre}</span>
        {meta && etat === "pret" && (
          <span className="al-roster__maj">Mis à jour il y a {meta.cacheAgeSecondes}s</span>
        )}
      </div>

      {etat === "chargement" && (
        <>
          <p className="al-roster__statut" role="status">
            Chargement de l'effectif…
          </p>
          <SquelettesCartes />
        </>
      )}

      {etat === "erreur" && (
        <div className="al-roster__etat" role="alert">
          <p>{MESSAGES_ERREUR[codeErreur ?? "erreur_inattendue"]}</p>
          <button type="button" className="al-btn-v2 al-btn-v2--gold al-btn-v2--sm" onClick={rafraichir}>
            Réessayer
          </button>
        </div>
      )}

      {etat === "vide" && (
        <div className="al-roster__etat" role="status">
          <p>Aucun profil publié pour {equipeNomAffiche} pour le moment.</p>
        </div>
      )}

      {etat === "pret" && (
        <>
          {joueurs.length > 0 && (
            <div className="al-roster__grille">
              {joueurs.map((m) => (
                <PlayerCard
                  key={m.idMembre}
                  membre={m}
                  equipeNom={equipeNomAffiche}
                  lienProfil={construireLienProfil(m.idMembre)}
                />
              ))}
            </div>
          )}

          {entraineurs.length > 0 && (
            <>
              <span className="al-v2-eyebrow al-roster__sous-titre">Entraîneurs</span>
              <div className="al-roster__grille al-roster__grille--entraineurs">
                {entraineurs.map((m) => (
                  <PlayerCard
                    key={m.idMembre}
                    membre={m}
                    equipeNom={equipeNomAffiche}
                    lienProfil={construireLienProfil(m.idMembre)}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
