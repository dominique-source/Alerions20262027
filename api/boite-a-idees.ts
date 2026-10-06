import type { SoumissionIdee } from "../src/types.js";

/**
 * Fonction serverless Vercel — reçoit une soumission de la Boîte à idées
 * et l'achemine par courriel à dominique@purinstinct.com via l'API Resend.
 *
 * Variable d'environnement requise (à définir dans Vercel → Settings →
 * Environment Variables, JAMAIS dans le dépôt) :
 *   RESEND_API_KEY — clé API Resend (https://resend.com), lue uniquement
 *   ici, côté serveur. Elle n'est jamais envoyée au navigateur.
 *
 * Tant que RESEND_API_KEY n'est pas configurée, la fonction répond
 * honnêtement avec un code d'erreur « service_non_configure » plutôt que
 * de simuler un envoi réussi.
 */

interface RequeteMinimale {
  method?: string;
  body: unknown;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
  end(): void;
}

const DESTINATAIRE = "dominique@purinstinct.com";

// Limitation la plus fiable est côté client (voir lib/rateLimit.ts) : une
// fonction serverless est sans état entre les invocations (instances
// froides multiples). Ce compteur en mémoire n'est donc qu'une défense
// supplémentaire, à l'efficacité limitée, tant qu'aucun stockage partagé
// (ex. Vercel KV) n'est branché.
const compteurParInstance = new Map<string, number[]>();
const FENETRE_MS = 60_000;
const MAX_PAR_FENETRE = 3;

function limiteAtteinte(cle: string): boolean {
  const maintenant = Date.now();
  const horodatages = (compteurParInstance.get(cle) ?? []).filter(
    (t) => maintenant - t < FENETRE_MS,
  );
  horodatages.push(maintenant);
  compteurParInstance.set(cle, horodatages);
  return horodatages.length > MAX_PAR_FENETRE;
}

function estSoumissionValide(corps: unknown): corps is SoumissionIdee {
  if (!corps || typeof corps !== "object") return false;
  const s = corps as Record<string, unknown>;
  const champsTexteObligatoires = [
    "nom",
    "courriel",
    "role",
    "sportConcerne",
    "categorie",
    "titre",
    "idee",
    "resultatSouhaite",
  ];
  for (const champ of champsTexteObligatoires) {
    if (typeof s[champ] !== "string" || (s[champ] as string).trim() === "") return false;
  }
  if (s.role === "parent" && (typeof s.nomEnfant !== "string" || !s.nomEnfant.trim())) {
    return false;
  }
  if (s.consentement !== true) return false;
  if (typeof s.courriel === "string" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s.courriel)) {
    return false;
  }
  return true;
}

function echapperHtml(texte: string): string {
  return texte
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, code: "methode_non_autorisee" });
    return;
  }

  const soumission = req.body as Partial<SoumissionIdee> & { siteWeb?: string };

  // Champ piège invisible : un robot le remplit, un humain ne le voit jamais.
  if (soumission?.siteWeb) {
    res.status(200).json({ ok: true });
    return;
  }

  if (!estSoumissionValide(soumission)) {
    res.status(400).json({ ok: false, code: "champs_invalides" });
    return;
  }

  const cleLimite = soumission.courriel ?? "inconnu";
  if (limiteAtteinte(cleLimite)) {
    res.status(429).json({ ok: false, code: "trop_de_soumissions" });
    return;
  }

  const cleApi = process.env.RESEND_API_KEY;
  if (!cleApi) {
    res.status(503).json({ ok: false, code: "service_non_configure" });
    return;
  }

  const s = soumission as SoumissionIdee;
  const html = `
    <h2>Nouvelle idée — Boîte à idées Alérions</h2>
    <p><strong>Rôle :</strong> ${echapperHtml(s.role)}</p>
    <p><strong>Nom :</strong> ${echapperHtml(s.nom)}</p>
    <p><strong>Courriel :</strong> ${echapperHtml(s.courriel)}</p>
    ${s.nomEnfant ? `<p><strong>Nom de l'enfant :</strong> ${echapperHtml(s.nomEnfant)}</p>` : ""}
    <p><strong>Sport concerné :</strong> ${echapperHtml(s.sportConcerne)}</p>
    <p><strong>Catégorie :</strong> ${echapperHtml(s.categorie)}</p>
    <p><strong>Titre :</strong> ${echapperHtml(s.titre)}</p>
    <p><strong>Idée :</strong><br>${echapperHtml(s.idee)}</p>
    <p><strong>Résultat souhaité :</strong><br>${echapperHtml(s.resultatSouhaite)}</p>
    <p><strong>Consentement à être recontacté :</strong> Oui</p>
  `;

  try {
    const reponse = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${cleApi}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Domaine d'envoi à remplacer par un domaine vérifié dans Resend
        // (ou onboarding@resend.dev en attendant la vérification DNS).
        from: "Boîte à idées Alérions <idees@alerions.cfdl.dev>",
        to: [DESTINATAIRE],
        reply_to: s.courriel,
        subject: `Boîte à idées — ${s.titre}`,
        html,
      }),
    });

    if (!reponse.ok) {
      res.status(502).json({ ok: false, code: "envoi_echoue" });
      return;
    }

    res.status(200).json({ ok: true });
  } catch {
    res.status(502).json({ ok: false, code: "envoi_echoue" });
  }
}
