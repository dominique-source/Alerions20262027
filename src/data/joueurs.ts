import type { Joueur } from "../types";

/**
 * Joueurs réels dont le portrait de saison est disponible (voir
 * public/images/equipe/ et public/images/portraits/, issus des maquettes
 * approuvées). Identifiés uniquement par numéro de chandail — aucun nom
 * n'est inventé, conformément aux maquettes elles-mêmes qui n'affichent
 * aucun nom. Seule l'équipe Cadet (basketball) dispose de portraits à ce
 * jour ; les autres équipes n'affichent aucune carte tant qu'aucun portrait
 * ne leur est fourni (voir MonEquipePage — état vide honnête).
 */
export const joueursCadet: Joueur[] = [
  {
    numero: 25,
    equipeNom: "Cadet",
    sportSlug: "basketball",
    carteImage: "/images/equipe/carte-25.png",
    portraitImage: "/images/portraits/portrait-25-fumee-rouge.jpg",
  },
  {
    numero: 30,
    equipeNom: "Cadet",
    sportSlug: "basketball",
    carteImage: "/images/equipe/carte-30.png",
    portraitImage: "/images/portraits/portrait-duo.jpg",
  },
];

export function trouverJoueur(numero: number): Joueur | undefined {
  return joueursCadet.find((j) => j.numero === numero);
}
