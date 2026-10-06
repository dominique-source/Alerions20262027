import { useEffect, useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import type { ComptesAdminReponse } from "../types";

export type EtatComptesAdmin = "chargement" | "pret" | "erreur";

interface ResultatUseComptesAdmin {
  etat: EtatComptesAdmin;
  donnees: ComptesAdminReponse | null;
}

/**
 * Vue « Gestion des accès » de l'admin — lit /api/admin/comptes, qui
 * revérifie lui-même isAdmin côté serveur (voir api/admin/comptes.ts).
 * Lecture seule : aucune mutation n'est exposée ici.
 */
export function useComptesAdmin(actif: boolean): ResultatUseComptesAdmin {
  const { utilisateur } = useAuth();
  const [etat, setEtat] = useState<EtatComptesAdmin>("chargement");
  const [donnees, setDonnees] = useState<ComptesAdminReponse | null>(null);

  useEffect(() => {
    if (!actif || !utilisateur) return;
    let annule = false;
    setEtat("chargement");

    void (async () => {
      try {
        const idToken = await utilisateur.getIdToken();
        const reponse = await fetch("/api/admin/comptes", {
          headers: { Authorization: `Bearer ${idToken}` },
        });
        if (annule) return;
        if (!reponse.ok) {
          setEtat("erreur");
          return;
        }
        const corps = (await reponse.json()) as ComptesAdminReponse;
        if (annule) return;
        setDonnees(corps);
        setEtat("pret");
      } catch {
        if (!annule) setEtat("erreur");
      }
    })();

    return () => {
      annule = true;
    };
  }, [actif, utilisateur]);

  return { etat, donnees };
}
