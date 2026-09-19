import type { NavLien } from "../types";

/** Navigation principale — rangée haute du header, repliée dans le menu mobile. */
export const navPrincipale: NavLien[] = [
  { label: "Accueil", href: "/" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Équipes", href: "/equipes" },
  { label: "Résultats", href: "/resultats" },
  { label: "Actualités", href: "/actualites" },
  { label: "Culture", href: "/culture" },
];

/**
 * Navigation secondaire, plus discrète — rangée basse du header sur
 * ordinateur, regroupée dans le menu mobile.
 */
export const navEspaces: NavLien[] = [
  { label: "Parents", href: "/parents" },
  { label: "Athlètes", href: "/athletes" },
  { label: "Entraîneurs", href: "/entraineurs" },
  { label: "Ressources", href: "/ressources" },
  { label: "Contact", href: "/contact" },
];
