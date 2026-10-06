import { readFileSync } from "node:fs";
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
  type RulesTestEnvironment,
} from "@firebase/rules-unit-testing";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, serverTimestamp } from "firebase/firestore";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

/**
 * Teste les règles du chat d'équipe (teamChats/*, chatAccess) contre
 * l'émulateur — jamais le projet Firebase réel. Scénario demandé :
 * deux membres équipe A, un membre équipe B, un entraîneur équipe A, un
 * admin. Tous les UID/teamId ci-dessous sont des fixtures fabriquées
 * pour ce test, distinctes des comptes et de l'équipe réels.
 */

const UID_A1 = "test-chat-membre-a1";
const UID_A2 = "test-chat-membre-a2";
const UID_B1 = "test-chat-membre-b1";
const UID_COACH_A = "test-chat-coach-a";
const UID_ADMIN = "test-chat-admin";
const UID_DESACTIVE = "test-chat-compte-desactive";

const TEAM_A = "test-chat-equipe-a";
const TEAM_B = "test-chat-equipe-b";

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

    for (const [uid, enabled] of [
      [UID_A1, true],
      [UID_A2, true],
      [UID_B1, true],
      [UID_COACH_A, true],
      [UID_ADMIN, true],
      [UID_DESACTIVE, false],
    ] as const) {
      await setDoc(doc(db, "accounts", uid), {
        displayName: `Fixture ${uid}`,
        personId: `PER-${uid}`,
        isAdmin: uid === UID_ADMIN,
        enabled,
      });
    }

    // chatAccess — normalement écrit par api/_lib/chatAccess.ts ; on le
    // fixe ici directement pour isoler le test des règles de celui des
    // endpoints serveur.
    await setDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_A1}`), {
      teamId: TEAM_A,
      userId: UID_A1,
      role: "joueur",
      enabled: true,
    });
    await setDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_A2}`), {
      teamId: TEAM_A,
      userId: UID_A2,
      role: "joueur",
      enabled: true,
    });
    await setDoc(doc(db, "chatAccess", `${TEAM_B}__${UID_B1}`), {
      teamId: TEAM_B,
      userId: UID_B1,
      role: "joueur",
      enabled: true,
    });
    await setDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_COACH_A}`), {
      teamId: TEAM_A,
      userId: UID_COACH_A,
      role: "entraineur",
      enabled: true,
    });
    // Rattachement désactivé pour A1 sur l'équipe B — ne doit donner aucun accès.
    await setDoc(doc(db, "chatAccess", `${TEAM_B}__${UID_A1}`), {
      teamId: TEAM_B,
      userId: UID_A1,
      role: "joueur",
      enabled: false,
    });

    await setDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1"), {
      teamId: TEAM_A,
      authorUid: UID_A1,
      authorName: "Fixture A1",
      text: "Message de l'équipe A",
      createdAt: serverTimestamp(),
      clientMessageId: "MSG-1",
      deleted: false,
    });
    await setDoc(doc(db, "teamChats", TEAM_B, "messages", "MSG-B-1"), {
      teamId: TEAM_B,
      authorUid: UID_B1,
      authorName: "Fixture B1",
      text: "Message de l'équipe B",
      createdAt: serverTimestamp(),
      clientMessageId: "MSG-B-1",
      deleted: false,
    });
  });
});

describe("teamChats/{teamId}/messages — lecture directe", () => {
  it("un membre de l'équipe A lit les messages de l'équipe A", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertSucceeds(getDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1")));
  });

  it("un membre de l'équipe A NE PEUT PAS lire les messages de l'équipe B (équipe étrangère)", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(getDoc(doc(db, "teamChats", TEAM_B, "messages", "MSG-B-1")));
  });

  it("un membre de l'équipe A NE PEUT PAS lister les messages de l'équipe B directement", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(getDocs(collection(db, "teamChats", TEAM_B, "messages")));
  });

  it("l'entraîneur de l'équipe A lit les messages de l'équipe A", async () => {
    const db = testEnv.authenticatedContext(UID_COACH_A).firestore();
    await assertSucceeds(getDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1")));
  });

  it("un admin lit les messages de n'importe quelle équipe (modération)", async () => {
    const db = testEnv.authenticatedContext(UID_ADMIN).firestore();
    await assertSucceeds(getDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1")));
    await assertSucceeds(getDoc(doc(db, "teamChats", TEAM_B, "messages", "MSG-B-1")));
  });

  it("un compte DÉSACTIVÉ ne peut rien lire, même avec un chatAccess actif par ailleurs", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "chatAccess", `${TEAM_A}__${UID_DESACTIVE}`), {
        teamId: TEAM_A,
        userId: UID_DESACTIVE,
        role: "joueur",
        enabled: true,
      });
    });
    const db = testEnv.authenticatedContext(UID_DESACTIVE).firestore();
    await assertFails(getDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1")));
  });

  it("un rattachement désactivé (chatAccess.enabled=false) ne donne aucun accès, même pour une équipe où l'utilisateur a par ailleurs accès", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(getDoc(doc(db, "teamChats", TEAM_B, "messages", "MSG-B-1")));
  });

  it("un visiteur non connecté ne peut rien lire", async () => {
    const db = testEnv.unauthenticatedContext().firestore();
    await assertFails(getDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1")));
  });
});

describe("teamChats/{teamId}/messages — écriture directe toujours refusée", () => {
  it("un membre de l'équipe A ne peut pas écrire un message directement (doit passer par api/chat/send.ts)", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(
      setDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-FORGE"), {
        teamId: TEAM_A,
        authorUid: UID_A1,
        authorName: "Usurpation",
        text: "Message forgé",
        createdAt: serverTimestamp(),
        clientMessageId: "MSG-FORGE",
        deleted: false,
      }),
    );
  });

  it("un membre ne peut pas usurper un autre auteur dans un message forgé", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(
      setDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-USURPE"), {
        teamId: TEAM_A,
        authorUid: UID_A2,
        authorName: "Fixture A2",
        text: "Je prétends être A2",
        createdAt: serverTimestamp(),
        clientMessageId: "MSG-USURPE",
        deleted: false,
      }),
    );
  });

  it("même un admin ne peut pas écrire un message directement (règle inconditionnelle)", async () => {
    const db = testEnv.authenticatedContext(UID_ADMIN).firestore();
    await assertFails(updateDoc(doc(db, "teamChats", TEAM_A, "messages", "MSG-1"), { text: "modifié" }));
  });
});

describe("teamChats/{teamId}/readState/{uid} — progression de lecture", () => {
  it("un membre peut écrire sa propre progression de lecture sur une équipe où il a accès", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertSucceeds(setDoc(doc(db, "teamChats", TEAM_A, "readState", UID_A1), { lastReadAt: serverTimestamp() }));
  });

  it("un membre ne peut PAS écrire la progression de lecture d'un autre utilisateur", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(setDoc(doc(db, "teamChats", TEAM_A, "readState", UID_A2), { lastReadAt: serverTimestamp() }));
  });

  it("un membre ne peut pas écrire une progression de lecture sur une équipe étrangère", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(setDoc(doc(db, "teamChats", TEAM_B, "readState", UID_A1), { lastReadAt: serverTimestamp() }));
  });

  it("un membre ne peut lire que sa propre progression de lecture", async () => {
    await testEnv.withSecurityRulesDisabled(async (context) => {
      await setDoc(doc(context.firestore(), "teamChats", TEAM_A, "readState", UID_A2), {
        lastReadAt: serverTimestamp(),
      });
    });
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(getDoc(doc(db, "teamChats", TEAM_A, "readState", UID_A2)));
  });
});

describe("chatAccess — jamais accessible directement", () => {
  it("un membre ne peut pas lire son propre document chatAccess directement", async () => {
    const db = testEnv.authenticatedContext(UID_A1).firestore();
    await assertFails(getDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_A1}`)));
  });

  it("un membre ne peut pas s'attribuer un accès en écrivant chatAccess directement", async () => {
    const db = testEnv.authenticatedContext(UID_B1).firestore();
    await assertFails(
      setDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_B1}`), {
        teamId: TEAM_A,
        userId: UID_B1,
        role: "joueur",
        enabled: true,
      }),
    );
  });

  it("même un admin ne peut pas écrire chatAccess directement", async () => {
    const db = testEnv.authenticatedContext(UID_ADMIN).firestore();
    await assertFails(
      setDoc(doc(db, "chatAccess", `${TEAM_A}__${UID_B1}`), {
        teamId: TEAM_A,
        userId: UID_B1,
        role: "joueur",
        enabled: true,
      }),
    );
  });
});

describe("garde-fou fixtures", () => {
  it("les identifiants de test ne sont jamais les vrais UID/teamId de production", () => {
    const vraisUid = ["9WSfbIAVIRZ7EHawO2g9RY8wxl43", "diWrcEefJgODisHYLvCYpJVZrYd2"];
    const vraiTeamId = "2026-2027-basketball-cadet-masculin";
    expect(vraisUid).not.toContain(UID_A1);
    expect(vraisUid).not.toContain(UID_COACH_A);
    expect(TEAM_A).not.toBe(vraiTeamId);
    expect(TEAM_B).not.toBe(vraiTeamId);
  });
});
