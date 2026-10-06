import { describe, expect, it } from "vitest";
import { espacesAutorises, equipesPourRole, aAccesEquipe } from "./permissions";
import type { RattachementPublic } from "./authTypes";

describe("espacesAutorises", () => {
  it("ne retourne aucun espace pour un compte sans rattachement ni isAdmin", () => {
    expect(espacesAutorises({ isAdmin: false, rattachements: [] })).toEqual([]);
  });

  it("retourne « joueur » seulement pour un rattachement joueur", () => {
    const rattachements: RattachementPublic[] = [{ teamId: "equipe-a", role: "joueur" }];
    expect(espacesAutorises({ isAdmin: false, rattachements })).toEqual(["joueur"]);
  });

  it("retourne entraineur + administration pour un coach admin (cas Dominique)", () => {
    const rattachements: RattachementPublic[] = [{ teamId: "equipe-a", role: "entraineur" }];
    expect(espacesAutorises({ isAdmin: true, rattachements })).toEqual(["entraineur", "administration"]);
  });

  it("ne déduit jamais l'administration d'un rattachement — seulement de isAdmin", () => {
    const rattachements: RattachementPublic[] = [
      { teamId: "equipe-a", role: "joueur" },
      { teamId: "equipe-b", role: "entraineur" },
    ];
    expect(espacesAutorises({ isAdmin: false, rattachements })).toEqual(["joueur", "entraineur"]);
  });
});

describe("equipesPourRole", () => {
  it("filtre par rôle et déduplique en conservant l'ordre de première apparition", () => {
    const rattachements: RattachementPublic[] = [
      { teamId: "equipe-a", role: "joueur" },
      { teamId: "equipe-b", role: "entraineur" },
      { teamId: "equipe-a", role: "joueur" },
      { teamId: "equipe-c", role: "joueur" },
    ];
    expect(equipesPourRole(rattachements, "joueur")).toEqual(["equipe-a", "equipe-c"]);
    expect(equipesPourRole(rattachements, "entraineur")).toEqual(["equipe-b"]);
  });

  it("retourne un tableau vide si aucun rattachement ne correspond au rôle", () => {
    const rattachements: RattachementPublic[] = [{ teamId: "equipe-a", role: "joueur" }];
    expect(equipesPourRole(rattachements, "entraineur")).toEqual([]);
  });
});

describe("aAccesEquipe", () => {
  const rattachements: RattachementPublic[] = [
    { teamId: "2026-2027-basketball-cadet-masculin", role: "joueur" },
    { teamId: "2026-2027-basketball-cadet-masculin", role: "entraineur" },
  ];

  it("autorise seulement le rôle et l'équipe exacts d'un rattachement réel", () => {
    expect(aAccesEquipe(rattachements, "joueur", "2026-2027-basketball-cadet-masculin")).toBe(true);
    expect(aAccesEquipe(rattachements, "entraineur", "2026-2027-basketball-cadet-masculin")).toBe(true);
  });

  it("refuse une équipe étrangère même avec le bon rôle", () => {
    expect(aAccesEquipe(rattachements, "joueur", "2026-2027-volleyball-benjamin-feminin")).toBe(false);
  });

  it("refuse un rôle que ce compte n'a jamais eu sur cette équipe", () => {
    const seulementJoueur: RattachementPublic[] = [{ teamId: "equipe-a", role: "joueur" }];
    expect(aAccesEquipe(seulementJoueur, "entraineur", "equipe-a")).toBe(false);
  });
});
