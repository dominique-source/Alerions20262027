import { aDecouvert } from "./decouvertes";
import { seancesDeclarees } from "./defis";
import { defiSemaine } from "../data/defis";
import { presenceConfirmee } from "./presences";
import { monVote } from "./votes";

/**
 * Règle d'attribution de chaque carte — toujours une action réelle déjà
 * posée sur cet appareil, jamais un tirage aléatoire. Voir data/collection.ts
 * pour la règle lisible correspondante.
 */
export function carteObtenue(id: string): boolean {
  switch (id) {
    case "portrait-de-saison":
      return aDecouvert("mon-equipe");
    case "journee-media":
      return aDecouvert("mur-photo");
    case "esprit-equipe":
      return seancesDeclarees(defiSemaine.id) >= 1;
    case "cadets-anciens":
      return presenceConfirmee("cadet-scrimmage-anciens-2026-10-13");
    case "mini-tournoi":
      return presenceConfirmee("juvenile-mini-tournoi-2026-11-08");
    case "defi-collectif":
      return seancesDeclarees(defiSemaine.id) >= defiSemaine.seancesCibles;
    case "les-coulisses":
      return monVote("mur-affiche") !== null;
    case "fin-de-saison":
      return false;
    default:
      return false;
  }
}
