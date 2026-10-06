import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { doc, getDoc, setDoc, updateDoc, deleteDoc } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

/**
 * Teste firestore.rules contre l'émulateur Firestore local — jamais la
 * base réelle. Fixtures de test uniquement (aucun membre réel, aucun des
 * deux comptes de production) : `UID_JOUEUR_TEST`/`UID_COACH_ADMIN_TEST`
 * ci-dessous sont des identifiants fabriqués pour ces tests, distincts
 * des vrais UID (9WSfbIAVIRZ7EHawO2g9RY8wxl43 / diWrcEefJgODisHYLvCYpJVZrYd2).
 *
 * Lancer via `npm run test:rules` (démarre l'émulateur, exécute ce
 * fichier, arrête l'émulateur) — jamais `vitest run` seul, qui n'a pas
 * d'émulateur actif et échouerait à la connexion.
 */

const UID_JOUEUR_TEST = "test-joueur-actif";
const UID_COACH_ADMIN_TEST = "test-coach-admin-actif";
const UID_DESACTIVE_TEST = "test-compte-desactive";
const UID_SANS_DOCUMENT_TEST = "test-sans-document-accounts";

const TEAM_A = "test-equipe-a";
const TEAM_AUTRE = "test-equipe-etrangere";

let testEnv: RulesTestEnvironment;

beforeAll(async () => {
  testEnv = await initializeTestEnvironment({
    projectId: "alerions-rules-test",
    firestore: {
      rules: readFileSync("firestore.rules", "utf8"),
      host: "127.0.0.1",
      port: 8080,
    },
  });
});

afterAll(async () => {
  await testEnv?.cleanup();
});

beforeEach(async () => {
  await testEnv.clearFirestore();
  await testEnv.withSecurityRulesDisabled(async (context) => {
    const db = context.firestore();

    await setDoc(doc(db, "accounts", UID_JOUEUR_TEST), {
      displayName: "Joueur de test (fixture)",
      personId: "PER-FIXTURE-JOUEUR",
      isAdmin: false,
      enabled: true,
    });
    await setDoc(doc(db, "accounts", UID_COACH_ADMIN_TEST), {
      displayName: "Coach-admin de test (fixture)",
      personId: "PER-FIXTURE-COACH-ADMIN",
      isAdmin: true,
      enabled: true,
    });
    await setDoc(doc(db, "accounts", UID_DESACTIVE_TEST), {
      displayName: "Compte désactivé (fixture)",
      personId: "PER-FIXTURE-DESACTIVE",
      isAdmin: false,
      enabled: false,
    });

    await setDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-ACTIF"), {
      userId: UID_JOUEUR_TEST,
      teamId: TEAM_A,
      role: "joueur",
      enabled: true,
    });
    await setDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-INACTIF"), {
      userId: UID_JOUEUR_TEST,
      teamId: TEAM_AUTRE,
      role: "joueur",
      enabled: false,
    });
    await setDoc(doc(db, "memberships", "MEM-FIXTURE-COACH"), {
      userId: UID_COACH_ADMIN_TEST,
      teamId: TEAM_A,
      role: "entraineur",
      enabled: true,
    });
  });
});

describe("accounts/{uid} — lecture", () => {
  it("un compte actif peut lire son propre document", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertSucceeds(getDoc(doc(db, "accounts", UID_JOUEUR_TEST)));
  });

  it("un compte actif ne peut PAS lire le document d'un autre compte non-admin", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(getDoc(doc(db, "accounts", UID_COACH_ADMIN_TEST)));
  });

  it("un admin peut lire le document d'un autre compte", async () => {
    const db = testEnv.authenticatedContext(UID_COACH_ADMIN_TEST).firestore();
    await assertSucceeds(getDoc(doc(db, "accounts", UID_JOUEUR_TEST)));
  });

  it("un compte DÉSACTIVÉ ne peut lire aucun document accounts, pas même le sien", async () => {
    const db = testEnv.authenticatedContext(UID_DESACTIVE_TEST).firestore();
    await assertFails(getDoc(doc(db, "accounts", UID_DESACTIVE_TEST)));
  });

  it("un utilisateur Firebase authentifié SANS document accounts n'obtient aucun accès", async () => {
    const db = testEnv.authenticatedContext(UID_SANS_DOCUMENT_TEST).firestore();
    await assertFails(getDoc(doc(db, "accounts", UID_SANS_DOCUMENT_TEST)));
    await assertFails(getDoc(doc(db, "accounts", UID_JOUEUR_TEST)));
  });

  it("un visiteur non connecté ne peut rien lire", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "accounts", UID_JOUEUR_TEST)));
  });
});

describe("memberships/{id} — lecture", () => {
  it("un compte actif peut lire son propre rattachement ACTIF", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertSucceeds(getDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-ACTIF")));
  });

  it("un compte actif ne peut PAS lire son propre rattachement INACTIF", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(getDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-INACTIF")));
  });

  it("un compte actif ne peut PAS lire le rattachement d'un autre utilisateur (équipe étrangère)", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(getDoc(doc(db, "memberships", "MEM-FIXTURE-COACH")));
  });

  it("un admin peut lire n'importe quel rattachement, actif ou non", async () => {
    const db = testEnv.authenticatedContext(UID_COACH_ADMIN_TEST).firestore();
    await assertSucceeds(getDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-ACTIF")));
    await assertSucceeds(getDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-INACTIF")));
  });
});

describe("écritures — toujours refusées depuis le navigateur", () => {
  it("un joueur ne peut pas modifier isAdmin sur son propre compte", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(updateDoc(doc(db, "accounts", UID_JOUEUR_TEST), { isAdmin: true }));
  });

  it("un joueur ne peut pas modifier son propre rattachement (ex. changer de teamId)", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(updateDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-ACTIF"), { teamId: TEAM_AUTRE }));
  });

  it("un joueur ne peut pas créer un nouveau rattachement pour lui-même", async () => {
    const db = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(
      setDoc(doc(db, "memberships", "MEM-FIXTURE-FORGE"), {
        userId: UID_JOUEUR_TEST,
        teamId: TEAM_A,
        role: "entraineur",
        enabled: true,
      }),
    );
  });

  it("même un admin ne peut pas écrire depuis le navigateur (règle inconditionnelle)", async () => {
    const db = testEnv.authenticatedContext(UID_COACH_ADMIN_TEST).firestore();
    await assertFails(updateDoc(doc(db, "accounts", UID_JOUEUR_TEST), { enabled: false }));
    await assertFails(deleteDoc(doc(db, "memberships", "MEM-FIXTURE-JOUEUR-ACTIF")));
  });
});

describe("autres collections — fermées par défaut", () => {
  it("une collection non listée dans les règles est inaccessible, même pour un admin", async () => {
    const dbAdmin = testEnv.authenticatedContext(UID_COACH_ADMIN_TEST).firestore();
    await assertFails(getDoc(doc(dbAdmin, "secrets", "whatever")));

    const dbJoueur = testEnv.authenticatedContext(UID_JOUEUR_TEST).firestore();
    await assertFails(setDoc(doc(dbJoueur, "secrets", "whatever"), { x: 1 }));
  });
});

// Sanity : confirme que les constantes de fixture ci-dessus restent
// distinctes des vrais UID de production, pour qu'un copier-coller
// erroné ne finisse jamais par cibler de vrais comptes.
describe("garde-fou fixtures", () => {
  it("les UID de test ne sont jamais les vrais UID de production", () => {
    const vraisUid = ["9WSfbIAVIRZ7EHawO2g9RY8wxl43", "diWrcEefJgODisHYLvCYpJVZrYd2"];
    expect(vraisUid).not.toContain(UID_JOUEUR_TEST);
    expect(vraisUid).not.toContain(UID_COACH_ADMIN_TEST);
    expect(vraisUid).not.toContain(UID_DESACTIVE_TEST);
  });
});
