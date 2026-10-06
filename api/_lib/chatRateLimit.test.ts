import { afterEach, describe, expect, it } from "vitest";
import { limiteEnvoiAtteinte, _reinitialiserLimiteEnvoiPourTests } from "./chatRateLimit";

describe("limiteEnvoiAtteinte", () => {
  afterEach(() => {
    _reinitialiserLimiteEnvoiPourTests();
  });

  it("n'atteint pas la limite pour les premiers envois", () => {
    for (let i = 0; i < 10; i++) {
      expect(limiteEnvoiAtteinte("uid-joueur-1")).toBe(false);
    }
  });

  it("atteint la limite après trop d'envois rapprochés dans la fenêtre", () => {
    for (let i = 0; i < 10; i++) {
      limiteEnvoiAtteinte("uid-joueur-2");
    }
    expect(limiteEnvoiAtteinte("uid-joueur-2")).toBe(true);
  });

  it("compte chaque uid indépendamment — un envoi en rafale d'un compte ne limite pas un autre", () => {
    for (let i = 0; i < 10; i++) {
      limiteEnvoiAtteinte("uid-rafale");
    }
    expect(limiteEnvoiAtteinte("uid-rafale")).toBe(true);
    expect(limiteEnvoiAtteinte("uid-tranquille")).toBe(false);
  });
});
