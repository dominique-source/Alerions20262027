import { describe, expect, it } from "vitest";
import { reduireAccesParEquipe } from "./chatAccess.js";

/**
 * Trouvé par test (émulateur, scénario à rattachements multiples) :
 * synchroniserAccesChat() écrivait un `set()` par membership dans
 * l'ordre de retour de Firestore (non garanti) — avec deux memberships
 * pour la MÊME équipe (un désactivé + un actif), le dernier traité
 * pouvait écraser le premier, régressant un accès actif selon l'ordre
 * seul. Ces tests couvrent la fonction pure qui remplace ce
 * comportement : un rattachement actif ne doit jamais pouvoir être
 * annulé par un rattachement inactif pour la même équipe, quel que soit
 * l'ordre d'entrée.
 */
describe("reduireAccesParEquipe", () => {
  it("un seul rattachement actif donne un accès actif", () => {
    const resultat = reduireAccesParEquipe([{ teamId: "equipe-a", role: "joueur", enabled: true }]);
    expect(resultat.get("equipe-a")).toEqual({ role: "joueur", enabled: true });
  });

  it("un seul rattachement inactif donne un accès inactif", () => {
    const resultat = reduireAccesParEquipe([{ teamId: "equipe-a", role: "joueur", enabled: false }]);
    expect(resultat.get("equipe-a")).toEqual({ role: "joueur", enabled: false });
  });

  it("rattachement inactif PUIS actif pour la même équipe : l'accès reste actif", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "joueur", enabled: false },
      { teamId: "equipe-a", role: "joueur", enabled: true },
    ]);
    expect(resultat.get("equipe-a")).toEqual({ role: "joueur", enabled: true });
  });

  it("rattachement ACTIF puis inactif pour la même équipe : l'accès reste actif (jamais régressé par l'ordre)", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "joueur", enabled: true },
      { teamId: "equipe-a", role: "joueur", enabled: false },
    ]);
    expect(resultat.get("equipe-a")).toEqual({ role: "joueur", enabled: true });
  });

  it("deux rattachements inactifs pour la même équipe : l'accès reste inactif", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "joueur", enabled: false },
      { teamId: "equipe-a", role: "entraineur", enabled: false },
    ]);
    expect(resultat.get("equipe-a")?.enabled).toBe(false);
  });

  it("joueur actif + entraineur actif pour la même équipe : rôle entraineur retenu (modération)", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "joueur", enabled: true },
      { teamId: "equipe-a", role: "entraineur", enabled: true },
    ]);
    expect(resultat.get("equipe-a")).toEqual({ role: "entraineur", enabled: true });
  });

  it("entraineur inactif + joueur actif pour la même équipe : accès actif, rôle joueur retenu", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "entraineur", enabled: false },
      { teamId: "equipe-a", role: "joueur", enabled: true },
    ]);
    expect(resultat.get("equipe-a")).toEqual({ role: "joueur", enabled: true });
  });

  it("équipes distinctes restent indépendantes", () => {
    const resultat = reduireAccesParEquipe([
      { teamId: "equipe-a", role: "joueur", enabled: true },
      { teamId: "equipe-b", role: "joueur", enabled: false },
    ]);
    expect(resultat.get("equipe-a")?.enabled).toBe(true);
    expect(resultat.get("equipe-b")?.enabled).toBe(false);
    expect(resultat.size).toBe(2);
  });

  it("liste vide : map vide", () => {
    expect(reduireAccesParEquipe([]).size).toBe(0);
  });
});
