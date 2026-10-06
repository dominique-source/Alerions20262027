/**
 * Fonction serverless Vercel — vérifie le code d'accès « coach » sans jamais
 * exposer ce code au navigateur.
 *
 * Variable d'environnement requise (Vercel → Settings → Environment
 * Variables, jamais dans le dépôt) : COACH_CODE.
 *
 * Tant que COACH_CODE n'est pas configurée, la fonction répond honnêtement
 * avec « service_non_configure » plutôt que d'accepter ou de refuser tout
 * code au hasard.
 *
 * Limite connue : ce site statique n'a pas de compte joueur/coach — la
 * réussite de cette vérification déverrouille la validation des défis
 * uniquement pour la session du navigateur courant (sessionStorage côté
 * client), pas un vrai rôle serveur persistant. C'est documenté comme une
 * limite réelle dans le bilan de livraison, pas présenté comme une
 * authentification complète.
 */

interface RequeteMinimale {
  method?: string;
  body: unknown;
}

interface ReponseMinimale {
  status(code: number): ReponseMinimale;
  json(corps: unknown): void;
  setHeader(nom: string, valeur: string): void;
}

export default async function handler(req: RequeteMinimale, res: ReponseMinimale) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    res.status(405).json({ ok: false, code: "methode_non_autorisee" });
    return;
  }

  const codeAttendu = process.env.COACH_CODE;
  if (!codeAttendu) {
    res.status(503).json({ ok: false, code: "service_non_configure" });
    return;
  }

  const corps = req.body as { code?: unknown };
  const code = typeof corps?.code === "string" ? corps.code.trim() : "";

  if (!code || code !== codeAttendu) {
    res.status(401).json({ ok: false, code: "code_invalide" });
    return;
  }

  res.status(200).json({ ok: true });
}
