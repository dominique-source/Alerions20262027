import { describe, expect, it } from "vitest";
import { indexerEntetes, mapperLigneMembre } from "./normaliser";
import { photoEstPublique, profilEstPublic, redigerEquipe, redigerMembre, urlPhotoAutorisee } from "./publication";
import { ENTETES_EQUIPES, ENTETES_MEMBRES_AVEC_AA_AB, LIGNES_EQUIPES, LIGNES_MEMBRES } from "./fixtures.test-data";
import { mapperLigneEquipe } from "./normaliser";

const indexMembres = indexerEntetes(ENTETES_MEMBRES_AVEC_AA_AB);
const indexEquipes = indexerEntetes(ENTETES_EQUIPES);

function membre(idMembre: string) {
  const ligne = LIGNES_MEMBRES.find((l) => l[0] === idMembre);
  if (!ligne) throw new Error(`fixture introuvable : ${idMembre}`);
  return mapperLigneMembre(ligne, indexMembres);
}

describe("profilEstPublic — exige donnée_fictive=FALSE, statut_membre=Actif, publication_profil=TRUE", () => {
  it("publie un joueur conforme (Alice, mb-001)", () => {
    expect(profilEstPublic(membre("mb-001"))).toBe(true);
  });

  it("exclut une donnée fictive même si publication_profil=TRUE (mb-004)", () => {
    expect(profilEstPublic(membre("mb-004"))).toBe(false);
  });

  it("exclut un membre Inactif (mb-005)", () => {
    expect(profilEstPublic(membre("mb-005"))).toBe(false);
  });

  it("exclut si publication_profil=FALSE malgré des données réelles valides (mb-006)", () => {
    expect(profilEstPublic(membre("mb-006"))).toBe(false);
  });
});

describe("photoEstPublique — exige en plus publication_photo, consentement Accordé, URL https autorisée", () => {
  it("publie la photo d'Alice (tout conforme)", () => {
    expect(photoEstPublique(membre("mb-001"))).toBe(true);
  });

  it("refuse la photo sans consentement (mb-007)", () => {
    expect(photoEstPublique(membre("mb-007"))).toBe(false);
  });

  it("refuse une URL non HTTPS même avec consentement Accordé (mb-008)", () => {
    expect(photoEstPublique(membre("mb-008"))).toBe(false);
  });
});

describe("urlPhotoAutorisee", () => {
  it("accepte une URL https bien formée", () => {
    expect(urlPhotoAutorisee("https://exemple.com/photo.jpg")).toBe(true);
  });
  it("refuse http, une URL vide ou malformée", () => {
    expect(urlPhotoAutorisee("http://exemple.com/photo.jpg")).toBe(false);
    expect(urlPhotoAutorisee("")).toBe(false);
    expect(urlPhotoAutorisee("pas-une-url")).toBe(false);
  });
});

describe("redigerMembre — ne renvoie jamais un champ privé", () => {
  it("ne contient aucune des clés interdites", () => {
    const public_ = redigerMembre(membre("mb-001"));
    const clesInterdites = [
      "courrielPrive",
      "authUserId",
      "notes",
      "dateConsentement",
      "photoStoragePath",
      "statutCompte",
      "accesChat",
      "niveauScolaire",
      "donneeFictive",
      "statutMembre",
      "publicationProfil",
      "publicationPhoto",
    ];
    for (const cle of clesInterdites) {
      expect(Object.keys(public_)).not.toContain(cle);
    }
  });

  it("masque la photo quand elle n'est pas publique (mb-007) mais garde le reste du profil", () => {
    const public_ = redigerMembre(membre("mb-007"));
    expect(public_.photoUrl).toBeNull();
    expect(public_.nomAffiche).toBe("Sans Consentement");
  });

  it("compose le nom via prénom+nom, retombe sur nom_complet seulement en repli (mb-009)", () => {
    expect(redigerMembre(membre("mb-009")).nomAffiche).toBe("Nom Complet Seulement");
  });

  it("classe le rôle 'Entraîneur-chef' comme catégorie entraineur (mb-003)", () => {
    expect(redigerMembre(membre("mb-003")).categorieRole).toBe("entraineur");
  });
});

describe("deux joueurs portant le même numéro dans deux équipes différentes ne se confondent jamais", () => {
  it("numéro 25 existe dans deux équipes, mais idEquipe + idMembre restent distincts", () => {
    const alice = redigerMembre(membre("mb-001")); // eq-basket-cadet-m
    const marcOlivier = redigerMembre(membre("mb-002")); // eq-basket-juvenile-m

    expect(alice.numero).toBe(25);
    expect(marcOlivier.numero).toBe(25);
    expect(alice.idEquipe).not.toBe(marcOlivier.idEquipe);
    expect(alice.idMembre).not.toBe(marcOlivier.idMembre);
    expect(alice.nomAffiche).not.toBe(marcOlivier.nomAffiche);
  });
});

describe("redigerEquipe", () => {
  it("expose uniquement les champs publics d'une équipe", () => {
    const ligne = LIGNES_EQUIPES.find((l) => l[0] === "eq-basket-cadet-m")!;
    const equipe = mapperLigneEquipe(ligne, indexEquipes);
    const publique = redigerEquipe(equipe);
    expect(publique).toEqual({
      idEquipe: "eq-basket-cadet-m",
      sport: "basketball",
      nomEquipe: "Cadet Masculin",
      categorie: "Cadet",
      genre: "Masculin",
      division: "RSEQ Québec",
      slugSite: "cadet-masculin",
      saison: "2026-2027",
    });
  });
});
