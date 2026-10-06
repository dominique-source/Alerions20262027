import { useCallback, useEffect, useRef, useState } from "react";
import type { RosterCodeErreur, RosterReponse } from "../types";

/**
 * Récupère l'effectif public d'une équipe depuis /api/roster et le tient
 * à jour :
 *  - revalidation toutes les 30 s pendant que l'onglet est visible ;
 *  - revalidation immédiate au retour au premier plan (visibilitychange) ;
 *  - arrêt du minuteur et annulation de la requête en vol au démontage ou
 *    dès que l'onglet passe en arrière-plan ;
 *  - reprises à délai croissant (jusqu'à 5 min) en cas d'échec répété,
 *    distinctes du cycle normal de 30 s.
 *
 * Délai réel observé : dépend du cache serveur (ALERIONS_ROSTER_CACHE_SECONDS,
 * 30 s par défaut) + de ce cycle de 30 s côté client — donc un changement
 * dans le Sheet peut prendre jusqu'à ~60 s à apparaître, jamais un temps
 * réel instantané garanti (voir docs/roster-google-sheets.md).
 */

const INTERVALLE_REVALIDATION_MS = 30_000;
const BACKOFF_INITIAL_MS = 5_000;
const BACKOFF_MAX_MS = 300_000;

export type EtatRoster = "chargement" | "pret" | "vide" | "erreur";

export interface ResultatUseRoster {
  etat: EtatRoster;
  equipe: RosterReponse["equipe"];
  joueurs: RosterReponse["joueurs"];
  entraineurs: RosterReponse["entraineurs"];
  meta: RosterReponse["meta"] | null;
  codeErreur: RosterCodeErreur | null;
  rafraichir: () => void;
}

interface ReponseErreurApi {
  ok: false;
  code: RosterCodeErreur;
}

export function useRoster(sport: string | undefined, equipeSlug: string | undefined): ResultatUseRoster {
  const [etat, setEtat] = useState<EtatRoster>("chargement");
  const [donnees, setDonnees] = useState<RosterReponse | null>(null);
  const [codeErreur, setCodeErreur] = useState<RosterCodeErreur | null>(null);
  const [compteurRafraichissement, setCompteurRafraichissement] = useState(0);

  const controleurRef = useRef<AbortController | null>(null);
  const minuteurRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const echecsConsecutifsRef = useRef(0);

  useEffect(() => {
    if (!sport || !equipeSlug) {
      setEtat("vide");
      return;
    }

    let demonte = false;
    echecsConsecutifsRef.current = 0;

    function effacerMinuteur() {
      if (minuteurRef.current) {
        clearTimeout(minuteurRef.current);
        minuteurRef.current = null;
      }
    }

    function planifierProchain(delaiMs: number) {
      effacerMinuteur();
      if (document.hidden) return; // reprendra au visibilitychange
      minuteurRef.current = setTimeout(() => {
        void recuperer();
      }, delaiMs);
    }

    async function recuperer() {
      controleurRef.current?.abort();
      const controleur = new AbortController();
      controleurRef.current = controleur;

      try {
        const reponse = await fetch(
          `/api/roster?sport=${encodeURIComponent(sport!)}&equipe=${encodeURIComponent(equipeSlug!)}`,
          { signal: controleur.signal },
        );

        if (demonte) return;

        if (!reponse.ok) {
          const corpsErreur = (await reponse.json().catch(() => null)) as ReponseErreurApi | null;
          throw new Error(corpsErreur?.code ?? "erreur_inattendue");
        }

        const corps = (await reponse.json()) as RosterReponse;
        if (demonte) return;

        echecsConsecutifsRef.current = 0;
        setDonnees(corps);
        setCodeErreur(null);
        setEtat(corps.equipe && (corps.joueurs.length > 0 || corps.entraineurs.length > 0) ? "pret" : "vide");
        planifierProchain(INTERVALLE_REVALIDATION_MS);
      } catch (erreur) {
        if (demonte || (erreur instanceof DOMException && erreur.name === "AbortError")) {
          return;
        }
        echecsConsecutifsRef.current += 1;
        const code = erreur instanceof Error && erreur.message ? (erreur.message as RosterCodeErreur) : "reseau";
        setCodeErreur(code);
        setEtat("erreur");
        const delai = Math.min(
          BACKOFF_INITIAL_MS * 2 ** (echecsConsecutifsRef.current - 1),
          BACKOFF_MAX_MS,
        );
        planifierProchain(delai);
      }
    }

    function surVisibilite() {
      if (!document.hidden) {
        void recuperer();
      } else {
        effacerMinuteur();
      }
    }

    void recuperer();
    document.addEventListener("visibilitychange", surVisibilite);

    return () => {
      demonte = true;
      effacerMinuteur();
      controleurRef.current?.abort();
      document.removeEventListener("visibilitychange", surVisibilite);
    };
  }, [sport, equipeSlug, compteurRafraichissement]);

  const rafraichir = useCallback(() => {
    echecsConsecutifsRef.current = 0;
    setEtat("chargement");
    setCompteurRafraichissement((n) => n + 1);
  }, []);

  return {
    etat,
    equipe: donnees?.equipe ?? null,
    joueurs: donnees?.joueurs ?? [],
    entraineurs: donnees?.entraineurs ?? [],
    meta: donnees?.meta ?? null,
    codeErreur,
    rafraichir,
  };
}
