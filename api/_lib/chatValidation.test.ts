import { describe, expect, it } from "vitest";
import { validerTexteMessage, validerIdTentative, validerTeamId } from "./chatValidation";

describe("validerTexteMessage", () => {
  it("accepte un texte simple et retire les espaces de tête/fin", () => {
    const resultat = validerTexteMessage("  Entraînement déplacé à 17h  ");
    expect(resultat).toEqual({ ok: true, texte: "Entraînement déplacé à 17h" });
  });

  it("refuse un texte vide ou composé uniquement d'espaces", () => {
    expect(validerTexteMessage("")).toEqual({ ok: false, code: "texte_vide" });
    expect(validerTexteMessage("   ")).toEqual({ ok: false, code: "texte_vide" });
  });

  it("refuse une valeur qui n'est pas une chaîne (jamais un objet/tableau accepté)", () => {
    expect(validerTexteMessage(undefined)).toEqual({ ok: false, code: "texte_vide" });
    expect(validerTexteMessage(42)).toEqual({ ok: false, code: "texte_vide" });
    expect(validerTexteMessage({ texte: "injection" })).toEqual({ ok: false, code: "texte_vide" });
  });

  it("refuse un texte de plus de 2000 caractères", () => {
    const texteTropLong = "a".repeat(2001);
    expect(validerTexteMessage(texteTropLong)).toEqual({ ok: false, code: "texte_trop_long" });
  });

  it("accepte exactement 2000 caractères (limite incluse)", () => {
    const texteLimite = "a".repeat(2000);
    const resultat = validerTexteMessage(texteLimite);
    expect(resultat.ok).toBe(true);
  });

  it("ne transforme jamais du HTML/script en balises interprétables — conserve le texte brut tel quel", () => {
    const brut = "<script>alert(1)</script>";
    const resultat = validerTexteMessage(brut);
    expect(resultat).toEqual({ ok: true, texte: brut });
  });
});

describe("validerIdTentative (clientMessageId / idempotence)", () => {
  it("accepte un UUID typique généré par crypto.randomUUID()", () => {
    expect(validerIdTentative("3fa85f64-5717-4562-b3fc-2c963f66afa6")).toBe(true);
  });

  it("refuse un identifiant vide, trop long, ou absent", () => {
    expect(validerIdTentative("")).toBe(false);
    expect(validerIdTentative(undefined)).toBe(false);
    expect(validerIdTentative("a".repeat(101))).toBe(false);
  });

  it("refuse les caractères qui casseraient ou détourneraient le chemin Firestore (ex. '/')", () => {
    expect(validerIdTentative("../../accounts/autre-uid")).toBe(false);
    expect(validerIdTentative("abc/def")).toBe(false);
    expect(validerIdTentative("id avec espace")).toBe(false);
  });

  it("accepte les tirets et underscores", () => {
    expect(validerIdTentative("id-de-tentative_1")).toBe(true);
  });
});

describe("validerTeamId", () => {
  it("accepte un teamId réel", () => {
    expect(validerTeamId("2026-2027-basketball-cadet-masculin")).toBe(true);
  });

  it("refuse un teamId contenant '/' (empêcherait de cibler une sous-collection arbitraire)", () => {
    expect(validerTeamId("equipe-a/messages")).toBe(false);
  });

  it("refuse une valeur vide, non-chaîne, ou de plus de 200 caractères", () => {
    expect(validerTeamId("")).toBe(false);
    expect(validerTeamId(123)).toBe(false);
    expect(validerTeamId("a".repeat(201))).toBe(false);
  });
});
