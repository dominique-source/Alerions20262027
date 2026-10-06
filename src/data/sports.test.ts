import { describe, expect, it } from "vitest";
import { sportSlugDepuisNomBrut } from "./sports";

describe("sportSlugDepuisNomBrut", () => {
  it("résout le slug local à partir du nom brut du Sheet, insensible à la casse", () => {
    expect(sportSlugDepuisNomBrut("Basketball")).toBe("basketball");
    expect(sportSlugDepuisNomBrut("BASKETBALL")).toBe("basketball");
    expect(sportSlugDepuisNomBrut("  Volleyball  ")).toBe("volleyball");
  });

  it("résout un nom composé (Flag-football, Cross-country)", () => {
    expect(sportSlugDepuisNomBrut("Flag-football")).toBe("flag-football");
    expect(sportSlugDepuisNomBrut("Cross-country")).toBe("cross-country");
  });

  it("retombe sur le texte normalisé si aucun sport local ne correspond (jamais un lien vide)", () => {
    expect(sportSlugDepuisNomBrut("Sport Inconnu")).toBe("sport inconnu");
  });
});
