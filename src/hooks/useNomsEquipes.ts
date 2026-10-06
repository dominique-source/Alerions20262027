import { useEffect, useState } from "react";
import type { RosterReponse } from "../types";

/**
 * Résout le nom affichable (ex. "Basketball Cadet Masculin") d'une
 * liste de teamId (idEquipe Firestore) via /api/roster?idEquipe=...
 * — utilisé uniquement pour l'affichage des sélecteurs d'équipe ; ne
 * donne aucune permission, l'accès reste décidé par le rattachement
 * déjà confirmé par /api/me.
 */
export function useNomsEquipes(idEquipes: string[]): Record<string, string> {
  const cle = idEquipes.join("|");
  const [noms, setNoms] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!cle) {
      setNoms({});
      return;
    }
    let annule = false;
    const liste = cle.split("|");

    void Promise.all(
      liste.map(async (idEquipe) => {
        try {
          const reponse = await fetch(`/api/roster?idEquipe=${encodeURIComponent(idEquipe)}`);
          if (!reponse.ok) return [idEquipe, idEquipe] as const;
          const corps = (await reponse.json()) as RosterReponse;
          return [idEquipe, corps.equipe?.nomEquipe ?? idEquipe] as const;
        } catch {
          return [idEquipe, idEquipe] as const;
        }
      }),
    ).then((paires) => {
      if (annule) return;
      setNoms(Object.fromEntries(paires));
    });

    return () => {
      annule = true;
    };
  }, [cle]);

  return noms;
}
