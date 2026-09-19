import type { NavLien } from "../types";

/** Navigation principale — visible dans le header et repliée dans le menu mobile. */
export const navPrincipale: NavLien[] = [
  { label: "Accueil", href: "/" },
  { label: "Calendrier", href: "/calendrier" },
  { label: "Équipes", href: "/equipes" },
  { label: "Résultats", href: "/resultats" },
  { label: "Actualités", href: "/actualites" },
  { label: "Culture Alérions", href: "/culture" },
];

/** Menu « Espaces » — regroupe les sections destinées aux publics spécifiques. */
export const navEspaces: NavLien[] = [
  { label: "Parents", href: "/parents" },
  { label: "Athlètes", href: "/athletes" },
  { label: "Entraîneurs", href: "/entraineurs" },
  { label: "Ressources", href: "/ressources" },
  { label: "Contact", href: "/contact" },
];

/**
 * Sur téléphone, seuls ces deux liens restent visibles en permanence
 * dans la barre de navigation (le reste vit dans le menu mobile).
 */
export const navMobilePrioritaire: NavLien[] = [
  { label: "Mon équipe", href: "/equipes" },
  { label: "Calendrier", href: "/calendrier" },
];
