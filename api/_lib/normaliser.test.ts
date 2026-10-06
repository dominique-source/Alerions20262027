import { describe, expect, it } from "vitest";
import {
  analyserNumero,
  composerNomAffiche,
  indexerEntetes,
  mapperLigneEquipe,
  mapperLigneMembre,
  normaliserEnTete,
  normaliserTexte,
  versBooleen,
} from "./normaliser";
import {
  ENTETES_EQUIPES,
  ENTETES_MEMBRES_AVEC_AA_AB,
  ENTETES_MEMBRES_SANS_AA_AB,
  LIGNES_EQUIPES,
  LIGNES_MEMBRES,
} from "./fixtures.test-data";

describe("normaliserEnTete", () => {
  it("retire les accents, la casse et les espaces superflus", () => {
    expect(normaliserEnTete("Prénom")).toBe("prenom");
    expect(normaliserEnTete("  Rôle ")).toBe("role");
    expect(normaliserEnTete("Statut Équipe")).toBe("statut_equipe");
    expect(normaliserEnTete("PHOTO_URL")).toBe("photo_url");
  });
});

describe("versBooleen", () => {
  it("reconnaît toutes les formes affirmatives attendues, insensible à la casse/accents", () => {
    for (const v of ["TRUE", "true", "VRAI", "vrai", "Vrai", "1", "oui", "Oui", "x", "X"]) {
      expect(versBooleen(v)).toBe(true);
    }
  });

  it("traite tout le reste — y compris vide, undefined, texte quelconque — comme faux", () => {
    for (const v of ["", "FALSE", "faux", "non", "0", undefined, null, "  "]) {
      expect(versBooleen(v)).toBe(false);
    }
  });
});

describe("analyserNumero", () => {
  it("parse un numéro valide", () => {
    expect(analyserNumero("25")).toBe(25);
    expect(analyserNumero(" 7 ")).toBe(7);
  });
  it("renvoie null pour vide ou non numérique — jamais 0 par défaut", () => {
    expect(analyserNumero("")).toBeNull();
    expect(analyserNumero("abc")).toBeNull();
    expect(analyserNumero("12a")).toBeNull();
  });
});

describe("composerNomAffiche", () => {
  it("compose prénom + nom quand les deux sont présents", () => {
    expect(composerNomAffiche({ prenom: "Alice", nom: "Tremblay", nomComplet: "Ignoré" })).toBe("Alice Tremblay");
  });
  it("retombe sur nom_complet seulement si prénom ET nom manquent", () => {
    expect(composerNomAffiche({ prenom: "", nom: "", nomComplet: "Nom Complet Seulement" })).toBe(
      "Nom Complet Seulement",
    );
  });
});

describe("mappage de lignes — en-têtes avec accents, cellules vides, schéma MEMBRES avec et sans AA/AB", () => {
  it("mappe ÉQUIPES par nom d'en-tête accentué", () => {
    const index = indexerEntetes(ENTETES_EQUIPES);
    const equipe = mapperLigneEquipe(LIGNES_EQUIPES[0]!, index);
    expect(equipe.idEquipe).toBe("eq-basket-cadet-m");
    expect(equipe.equipe).toBe("Cadet Masculin");
    expect(equipe.categorie).toBe("Cadet");
    expect(equipe.ouvrirEquipe).toBe(true);
    expect(equipe.slugSite).toBe("cadet-masculin");
  });

  it("gère une cellule vide sans planter (google_calendar_id de la 2e équipe)", () => {
    const index = indexerEntetes(ENTETES_EQUIPES);
    const equipe = mapperLigneEquipe(LIGNES_EQUIPES[1]!, index);
    expect(equipe.googleCalendarId).toBe("");
    expect(equipe.ouvrirEquipe).toBe(true); // "1" compte comme vrai
  });

  it("mappe MEMBRES quand AA/AB (publication_profil/photo) sont présentes", () => {
    const index = indexerEntetes(ENTETES_MEMBRES_AVEC_AA_AB);
    const alice = mapperLigneMembre(LIGNES_MEMBRES[0]!, index);
    expect(alice.idMembre).toBe("mb-001");
    expect(alice.publicationProfil).toBe(true);
    expect(alice.publicationPhoto).toBe(true);
    expect(alice.capitaine).toBe(true);
  });

  it("AA/AB absentes du schéma → publicationProfil/Photo valent FALSE, jamais une erreur", () => {
    const index = indexerEntetes(ENTETES_MEMBRES_SANS_AA_AB);
    // Les colonnes AA/AB n'existent pas dans ce schéma : la ligne complète
    // (28 valeurs) est quand même fournie, comme le ferait un batchGet
    // Google réel dont la lecture ne couvre que A:Z.
    const alice = mapperLigneMembre(LIGNES_MEMBRES[0]!, index);
    expect(alice.publicationProfil).toBe(false);
    expect(alice.publicationPhoto).toBe(false);
    // Les autres champs, eux, restent correctement mappés.
    expect(alice.idMembre).toBe("mb-001");
  });
});

describe("normaliserTexte", () => {
  it("normalise pour comparaison insensible aux accents/casse", () => {
    expect(normaliserTexte("Accordé")).toBe("accorde");
    expect(normaliserTexte("  Actif ")).toBe("actif");
  });
});
