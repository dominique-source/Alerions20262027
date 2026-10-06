import { initializeApp, type FirebaseApp } from "firebase/app";
import { getAuth, type Auth } from "firebase/auth";
import { getFirestore, type Firestore } from "firebase/firestore";
import type { ConfigWebFirebase } from "../types";

/**
 * Initialise le SDK Firebase côté navigateur à partir de la configuration
 * publique récupérée sur /api/firebase-config — jamais depuis une
 * variable VITE_ en dur : FIREBASE_WEB_CONFIG reste une variable serveur,
 * lue une seule fois au premier appel puis mémoïsée pour la session.
 */

let appPromise: Promise<FirebaseApp> | null = null;

async function recupererConfigWeb(): Promise<ConfigWebFirebase> {
  const reponse = await fetch("/api/firebase-config");
  if (!reponse.ok) {
    throw new Error("config_firebase_indisponible");
  }
  return (await reponse.json()) as ConfigWebFirebase;
}

function obtenirApp(): Promise<FirebaseApp> {
  if (!appPromise) {
    appPromise = recupererConfigWeb()
      .then((config) => initializeApp(config))
      .catch((erreur) => {
        appPromise = null; // permet un nouvel essai au prochain appel
        throw erreur;
      });
  }
  return appPromise;
}

let authPromise: Promise<Auth> | null = null;

export function obtenirAuthClient(): Promise<Auth> {
  if (!authPromise) {
    authPromise = obtenirApp()
      .then((app) => getAuth(app))
      .catch((erreur) => {
        authPromise = null;
        throw erreur;
      });
  }
  return authPromise;
}

let firestorePromise: Promise<Firestore> | null = null;

export function obtenirFirestoreClient(): Promise<Firestore> {
  if (!firestorePromise) {
    firestorePromise = obtenirApp()
      .then((app) => getFirestore(app))
      .catch((erreur) => {
        firestorePromise = null;
        throw erreur;
      });
  }
  return firestorePromise;
}
