import type { NavLien } from "../types";

/**
 * Navigation principale — les quatre pages montrées dans la barre de
 * navigation sur toutes les maquettes approuvées (Accueil, Calendrier,
 * Mon équipe, Le mur), plus Chat (demande explicite, ajouté après la
 * refonte — absent des maquettes d'origine). Identique sur toutes les
 * pages du site.
 */
export const navPrincipale: NavLien[] = [
  { label: "Accueil", href: "/" },
  { label: "Mon équipe", href: "/mon-equipe" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Le mur", href: "/mur" },
  { label: "Chat", href: "/chat" },
];

/**
 * Espaces — pages utiles qui ne figurent pas dans la navigation principale
 * des maquettes, regroupées dans le tiroir « Plus » (ordinateur et mobile).
 */
export const navEspaces: NavLien[] = [
  { label: "Parents", href: "/parents" },
  { label: "Athlètes", href: "/athletes" },
  { label: "Entraîneurs", href: "/entraineurs" },
  { label: "Toutes les équipes", href: "/equipes" },
  { label: "Résultats", href: "/resultats" },
  { label: "Actualités", href: "/actualites" },
  { label: "Culture Alérions", href: "/culture" },
  { label: "Documents", href: "/ressources" },
  { label: "Boîte à idées", href: "/boite-a-idees" },
  { label: "Contact", href: "/contact" },
];
