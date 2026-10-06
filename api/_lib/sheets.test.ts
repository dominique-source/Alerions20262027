import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { lireConfigurationGoogle, normaliserCléPrivée } from "./sheets";

describe("normaliserCléPrivée", () => {
  it("convertit les retours à la ligne littéraux ('\\n' à deux caractères) en vrais retours à la ligne", () => {
    const brute = "-----BEGIN PRIVATE KEY-----\\nABCDEF\\n-----END PRIVATE KEY-----\\n";
    const normalisee = normaliserCléPrivée(brute);
    expect(normalisee).toBe("-----BEGIN PRIVATE KEY-----\nABCDEF\n-----END PRIVATE KEY-----\n");
    expect(normalisee).not.toContain("\\n");
  });

  it("laisse intacte une clé qui contient déjà de vrais retours à la ligne", () => {
    const brute = "-----BEGIN PRIVATE KEY-----\nABCDEF\n-----END PRIVATE KEY-----\n";
    expect(normaliserCléPrivée(brute)).toBe(brute);
  });
});

describe("lireConfigurationGoogle — configuration serveur absente ou incomplète", () => {
  const cles = ["GOOGLE_SHEET_ID", "GOOGLE_SERVICE_ACCOUNT_EMAIL", "GOOGLE_PRIVATE_KEY"] as const;
  const sauvegarde: Record<string, string | undefined> = {};

  beforeEach(() => {
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
  });

  it("renvoie null si une seule des trois variables manque — jamais une configuration partielle", () => {
    process.env.GOOGLE_SHEET_ID = "sheet-id";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "compte@exemple.iam.gserviceaccount.com";
    // GOOGLE_PRIVATE_KEY intentionnellement absente.
    expect(lireConfigurationGoogle()).toBeNull();
  });

  it("renvoie null si les trois sont absentes", () => {
    expect(lireConfigurationGoogle()).toBeNull();
  });

  it("renvoie une configuration normalisée quand tout est présent", () => {
    process.env.GOOGLE_SHEET_ID = "sheet-id";
    process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL = "compte@exemple.iam.gserviceaccount.com";
    process.env.GOOGLE_PRIVATE_KEY = "-----BEGIN PRIVATE KEY-----\\nABC\\n-----END PRIVATE KEY-----\\n";

    const config = lireConfigurationGoogle();
    expect(config).not.toBeNull();
    expect(config!.sheetId).toBe("sheet-id");
    expect(config!.privateKey).toContain("\n");
    expect(config!.privateKey).not.toContain("\\n");
  });
});
