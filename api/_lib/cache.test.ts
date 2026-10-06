import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { _reinitialiserCachePourTests, obtenirRoster } from "./cache";
import { ErreurGoogleSheets } from "./sheets";

describe("obtenirRoster — identifiants Google non configurés", () => {
  const cles = ["GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"] as const;
  const sauvegarde: Record<string, string | undefined> = {};

  beforeEach(() => {
    _reinitialiserCachePourTests();
    for (const cle of cles) {
      sauvegarde[cle] = process.env[cle];
      delete process.env[cle];
    }
  });

  afterEach(() => {
    for (const cle of cles) {
      if (sauvegarde[cle] === undefined) delete process.env[cle];
      else process.env[cle] = sauvegarde[cle];
    }
    _reinitialiserCachePourTests();
  });

  it("propage une ErreurGoogleSheets('config') plutôt que de servir des données fictives — connexion réelle non vérifiée", async () => {
    await expect(obtenirRoster()).rejects.toBeInstanceOf(ErreurGoogleSheets);
    await expect(obtenirRoster()).rejects.toMatchObject({ code: "config" });
  });
});
