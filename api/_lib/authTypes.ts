/**
 * Types partagés par les fonctions serveur d'authentification/permissions
 * (Firebase Auth + Firestore, collections `accounts` et `memberships`).
 *
 * Comme pour les types Sheets (api/_lib/types.ts), on distingue les
 * documents Firestore BRUTS (jamais renvoyés tels quels au navigateur)
 * des formes PUBLIQUES déjà filtrées par api/me.ts.
 */

export type RoleMembre = "joueur" | "entraineur";

/** Document brut accounts/{uid}. */
export interface CompteDocument {
  displayName: string;
  personId: string;
  isAdmin: boolean;
  enabled: boolean;
}

/** Document brut memberships/{id}. */
export interface RattachementDocument {
  userId: string;
  teamId: string;
  role: RoleMembre;
  enabled: boolean;
}

/** Forme publique d'un rattachement — exactement ce que le client a besoin pour les sélecteurs. */
export interface RattachementPublic {
  teamId: string;
  role: RoleMembre;
}

/** Réponse de GET /api/me. */
export interface CompteReponse {
  uid: string;
  displayName: string;
  personId: string;
  isAdmin: boolean;
  rattachements: RattachementPublic[];
}

export type MeCodeErreur =
  | "methode_non_autorisee"
  | "jeton_manquant"
  | "jeton_invalide"
  | "jeton_revoque"
  | "courriel_non_verifie"
  | "compte_non_autorise"
  | "service_non_configure"
  | "erreur_inattendue";

export interface MeErreur {
  ok: false;
  code: MeCodeErreur;
}
