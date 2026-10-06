import { useCallback, useEffect, useState } from "react";

export interface SelectionEquipe {
  sport: string;
  equipe: string;
}

const CLE_STOCKAGE = "alerions:mon-equipe";

const selectionVide: SelectionEquipe = { sport: "", equipe: "" };

function lireStockage(): SelectionEquipe {
  if (typeof window === "undefined") return selectionVide;
  try {
    const brut = window.localStorage.getItem(CLE_STOCKAGE);
    if (!brut) return selectionVide;
    const valeur = JSON.parse(brut);
    return { ...selectionVide, ...valeur };
  } catch {
    return selectionVide;
  }
}

/**
 * Mémorise le choix « Mon équipe » (sport / équipe) dans le navigateur
 * (localStorage uniquement, aucun serveur). Persiste entre les visites.
 */
export function useTeamSelection() {
  const [selection, setSelection] = useState<SelectionEquipe>(lireStockage);

  useEffect(() => {
    try {
      window.localStorage.setItem(CLE_STOCKAGE, JSON.stringify(selection));
    } catch {
      // Stockage indisponible (mode privé, quota) : on continue sans persister.
    }
  }, [selection]);

  const definirSelection = useCallback((partielle: Partial<SelectionEquipe>) => {
    setSelection((precedente) => ({ ...precedente, ...partielle }));
  }, []);

  const reinitialiser = useCallback(() => setSelection(selectionVide), []);

  return { selection, definirSelection, reinitialiser };
}
