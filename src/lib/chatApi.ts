import type { CodeErreurEnvoiChat } from "../types";

/** Appels aux endpoints serveur du chat — les seules écritures autorisées (voir api/chat/send.ts, api/chat/delete.ts). */

export type ResultatEnvoiChat = { ok: true } | { ok: false; code: CodeErreurEnvoiChat };

export async function envoyerMessageChat(
  idToken: string,
  teamId: string,
  text: string,
  clientMessageId: string,
): Promise<ResultatEnvoiChat> {
  try {
    const reponse = await fetch("/api/chat/send", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ teamId, text, clientMessageId }),
    });
    if (reponse.ok) return { ok: true };
    const corps = (await reponse.json().catch(() => null)) as { code?: CodeErreurEnvoiChat } | null;
    return { ok: false, code: corps?.code ?? "erreur_inattendue" };
  } catch {
    return { ok: false, code: "reseau" };
  }
}

export async function supprimerMessageChat(
  idToken: string,
  teamId: string,
  messageId: string,
): Promise<ResultatEnvoiChat> {
  try {
    const reponse = await fetch("/api/chat/delete", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${idToken}` },
      body: JSON.stringify({ teamId, messageId }),
    });
    if (reponse.ok) return { ok: true };
    const corps = (await reponse.json().catch(() => null)) as { code?: CodeErreurEnvoiChat } | null;
    return { ok: false, code: corps?.code ?? "erreur_inattendue" };
  } catch {
    return { ok: false, code: "reseau" };
  }
}
