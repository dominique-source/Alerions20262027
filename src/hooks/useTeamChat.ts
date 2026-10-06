import { useCallback, useEffect, useRef, useState } from "react";
import {
  collection,
  doc,
  limit,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  startAfter,
  Timestamp,
  getDocs,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";
import { obtenirFirestoreClient } from "../lib/firebaseClient";
import { envoyerMessageChat, supprimerMessageChat } from "../lib/chatApi";
import { useAuth } from "../contexts/AuthContext";
import type { MessageChat } from "../types";

/**
 * Chat d'équipe en temps réel (Firestore) — lecture directe via
 * onSnapshot (protégée par firestore.rules + chatAccess), écriture
 * UNIQUEMENT via les endpoints serveur (api/chat/send.ts,
 * api/chat/delete.ts). Détache tous ses abonnements au changement
 * d'équipe, au démontage, ou à la perte d'autorisation.
 */

const TAILLE_FENETRE = 50;

export type EtatChat = "chargement" | "pret" | "vide" | "erreur" | "session_expiree" | "acces_refuse";

interface MessageEnAttente {
  id: string;
  text: string;
  statut: "envoi" | "echec";
}

function mapperDoc(d: QueryDocumentSnapshot<DocumentData>): MessageChat {
  const data = d.data();
  const createdAt = data.createdAt;
  return {
    id: d.id,
    teamId: data.teamId ?? "",
    authorUid: data.authorUid ?? "",
    authorName: data.authorName ?? "",
    text: typeof data.text === "string" ? data.text : "",
    createdAtMs: createdAt instanceof Timestamp ? createdAt.toMillis() : null,
    deleted: data.deleted === true,
  };
}

export interface ResultatUseTeamChat {
  etat: EtatChat;
  messages: MessageChat[];
  messagesEnAttente: MessageEnAttente[];
  peutChargerPlusAncien: boolean;
  chargementAncien: boolean;
  nonLus: number;
  nouveauxMessagesDisponibles: boolean;
  envoyerTexte: (texte: string) => Promise<void>;
  reessayerEnvoi: (idPendant: string) => Promise<void>;
  supprimerMessage: (messageId: string) => Promise<ResultatSuppression>;
  chargerPlusAncien: () => Promise<void>;
  marquerCommeLu: () => void;
  definirAuBas: (auBas: boolean) => void;
  effacerNouveauxMessagesDisponibles: () => void;
}

export type ResultatSuppression = { ok: true } | { ok: false; code: string };

export interface OptionsUseTeamChat {
  /**
   * true (défaut) pour un vrai salon (TeamChatRoom) : l'utilisateur est
   * réputé au bas de la conversation dès l'ouverture, donc les messages
   * se marquent comme lus normalement. false pour un widget qui ne fait
   * qu'afficher un aperçu/compteur en arrière-plan (AlerionsChatBloc, le
   * badge de non-lus des dashboards) — ce widget ne doit jamais marquer
   * la conversation comme lue : un simple chargement de données ne
   * constitue pas une lecture par l'utilisateur.
   */
  marquerCommeLuAutomatiquement?: boolean;
}

export function useTeamChat(
  teamId: string | null,
  options: OptionsUseTeamChat = {},
): ResultatUseTeamChat {
  const { marquerCommeLuAutomatiquement = true } = options;
  const { utilisateur } = useAuth();
  const [etat, setEtat] = useState<EtatChat>("chargement");
  const [messages, setMessages] = useState<MessageChat[]>([]);
  const [messagesAnciens, setMessagesAnciens] = useState<MessageChat[]>([]);
  const [messagesEnAttente, setMessagesEnAttente] = useState<MessageEnAttente[]>([]);
  const [lastReadAtMs, setLastReadAtMs] = useState<number | null>(null);
  const [nouveauxMessagesDisponibles, setNouveauxMessagesDisponibles] = useState(false);
  const [chargementAncien, setChargementAncien] = useState(false);
  const [peutChargerPlusAncien, setPeutChargerPlusAncien] = useState(false);

  const auBasRef = useRef(marquerCommeLuAutomatiquement);
  const curseurAncienRef = useRef<QueryDocumentSnapshot<DocumentData> | null>(null);
  const premierSnapshotRef = useRef(true);
  const teamIdRef = useRef(teamId);
  teamIdRef.current = teamId;

  useEffect(() => {
    setMessages([]);
    setMessagesAnciens([]);
    setMessagesEnAttente([]);
    setLastReadAtMs(null);
    setNouveauxMessagesDisponibles(false);
    setPeutChargerPlusAncien(false);
    curseurAncienRef.current = null;
    premierSnapshotRef.current = true;

    if (!teamId || !utilisateur) {
      setEtat("chargement");
      return;
    }

    let annule = false;
    setEtat("chargement");

    let detacherMessages: (() => void) | undefined;
    let detacherLecture: (() => void) | undefined;

    void (async () => {
      let db: Awaited<ReturnType<typeof obtenirFirestoreClient>>;
      try {
        db = await obtenirFirestoreClient();
      } catch {
        if (!annule) setEtat("erreur");
        return;
      }
      if (annule) return;

      const qMessages = query(
        collection(db, "teamChats", teamId, "messages"),
        orderBy("createdAt", "desc"),
        limit(TAILLE_FENETRE),
      );

      detacherMessages = onSnapshot(
        qMessages,
        (snap) => {
          if (annule) return;
          const liste = snap.docs.map(mapperDoc).reverse();
          setMessages(liste);
          setPeutChargerPlusAncien(snap.docs.length === TAILLE_FENETRE);
          if (snap.docs.length > 0) {
            curseurAncienRef.current = snap.docs[snap.docs.length - 1]!;
          }
          setEtat(liste.length > 0 ? "pret" : "vide");
          if (!premierSnapshotRef.current && !auBasRef.current && liste.length > 0) {
            setNouveauxMessagesDisponibles(true);
          }
          premierSnapshotRef.current = false;
        },
        (erreur) => {
          if (annule) return;
          const code = (erreur as { code?: string }).code;
          setEtat(code === "permission-denied" ? "acces_refuse" : "erreur");
        },
      );

      const refLecture = doc(db, "teamChats", teamId, "readState", utilisateur.uid);
      detacherLecture = onSnapshot(
        refLecture,
        (snap) => {
          if (annule) return;
          const data = snap.data();
          const valeur = data?.lastReadAt;
          setLastReadAtMs(valeur instanceof Timestamp ? valeur.toMillis() : null);
        },
        () => {
          // La lecture de readState peut échouer transitoirement sans
          // invalider toute la conversation — seul le compteur non-lus en pâtit.
        },
      );
    })();

    return () => {
      annule = true;
      detacherMessages?.();
      detacherLecture?.();
    };
  }, [teamId, utilisateur]);

  const marquerCommeLu = useCallback(() => {
    const t = teamIdRef.current;
    if (!t || !utilisateur || messages.length === 0) return;
    const dernier = messages[messages.length - 1]!;
    if (dernier.createdAtMs !== null && lastReadAtMs !== null && dernier.createdAtMs <= lastReadAtMs) return;
    void obtenirFirestoreClient().then((db) => {
      void setDoc(doc(db, "teamChats", t, "readState", utilisateur.uid), { lastReadAt: serverTimestamp() }, { merge: true });
    });
  }, [messages, lastReadAtMs, utilisateur]);

  useEffect(() => {
    if (marquerCommeLuAutomatiquement && etat === "pret" && auBasRef.current) {
      marquerCommeLu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat, messages, marquerCommeLuAutomatiquement]);

  const envoyerTexte = useCallback(
    async (texte: string) => {
      const t = teamIdRef.current;
      if (!t || !utilisateur || !texte.trim()) return;
      const id = crypto.randomUUID();
      setMessagesEnAttente((prev) => [...prev, { id, text: texte.trim(), statut: "envoi" }]);

      const idToken = await utilisateur.getIdToken();
      const resultat = await envoyerMessageChat(idToken, t, texte.trim(), id);

      setMessagesEnAttente((prev) => {
        if (resultat.ok) {
          // Laisse l'entrée "envoi" — elle disparaîtra d'elle-même dès que
          // l'abonnement temps réel recevra le message confirmé (même id).
          return prev;
        }
        return prev.map((m) => (m.id === id ? { ...m, statut: "echec" } : m));
      });
    },
    [utilisateur],
  );

  const reessayerEnvoi = useCallback(
    async (idPendant: string) => {
      const t = teamIdRef.current;
      if (!t || !utilisateur) return;
      const cible = messagesEnAttente.find((m) => m.id === idPendant);
      if (!cible) return;
      setMessagesEnAttente((prev) => prev.map((m) => (m.id === idPendant ? { ...m, statut: "envoi" } : m)));
      const idToken = await utilisateur.getIdToken();
      const resultat = await envoyerMessageChat(idToken, t, cible.text, idPendant);
      setMessagesEnAttente((prev) =>
        resultat.ok ? prev : prev.map((m) => (m.id === idPendant ? { ...m, statut: "echec" } : m)),
      );
    },
    [utilisateur, messagesEnAttente],
  );

  // Retire des messages en attente ceux déjà confirmés par le temps réel.
  useEffect(() => {
    if (messagesEnAttente.length === 0) return;
    const idsConfirmes = new Set(messages.map((m) => m.id));
    setMessagesEnAttente((prev) => prev.filter((m) => !idsConfirmes.has(m.id)));
  }, [messages, messagesEnAttente.length]);

  const supprimerMessage = useCallback(
    async (messageId: string): Promise<ResultatSuppression> => {
      const t = teamIdRef.current;
      if (!t || !utilisateur) return { ok: false, code: "non_connecte" };
      const idToken = await utilisateur.getIdToken();
      return supprimerMessageChat(idToken, t, messageId);
    },
    [utilisateur],
  );

  const chargerPlusAncien = useCallback(async () => {
    const t = teamIdRef.current;
    const curseur = curseurAncienRef.current;
    if (!t || !curseur || chargementAncien) return;
    setChargementAncien(true);
    try {
      const db = await obtenirFirestoreClient();
      const qAnciens = query(
        collection(db, "teamChats", t, "messages"),
        orderBy("createdAt", "desc"),
        startAfter(curseur),
        limit(TAILLE_FENETRE),
      );
      const snap = await getDocs(qAnciens);
      const liste = snap.docs.map(mapperDoc).reverse();
      setMessagesAnciens((prev) => [...liste, ...prev]);
      setPeutChargerPlusAncien(snap.docs.length === TAILLE_FENETRE);
      if (snap.docs.length > 0) {
        curseurAncienRef.current = snap.docs[snap.docs.length - 1]!;
      } else {
        curseurAncienRef.current = null;
      }
    } finally {
      setChargementAncien(false);
    }
  }, [chargementAncien]);

  const definirAuBas = useCallback((auBas: boolean) => {
    auBasRef.current = auBas;
    if (auBas) {
      setNouveauxMessagesDisponibles(false);
      if (marquerCommeLuAutomatiquement) marquerCommeLu();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marquerCommeLuAutomatiquement]);

  const effacerNouveauxMessagesDisponibles = useCallback(() => setNouveauxMessagesDisponibles(false), []);

  const nonLus =
    !utilisateur || lastReadAtMs === null
      ? 0
      : messages.filter((m) => m.authorUid !== utilisateur.uid && !m.deleted && m.createdAtMs !== null && m.createdAtMs > lastReadAtMs)
          .length;

  return {
    etat,
    messages: [...messagesAnciens, ...messages],
    messagesEnAttente,
    peutChargerPlusAncien,
    chargementAncien,
    nonLus,
    nouveauxMessagesDisponibles,
    envoyerTexte,
    reessayerEnvoi,
    supprimerMessage,
    chargerPlusAncien,
    marquerCommeLu,
    definirAuBas,
    effacerNouveauxMessagesDisponibles,
  };
}
