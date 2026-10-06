import { defineConfig } from "vitest/config";

/**
 * Config Vitest séparée pour les tests de règles Firestore
 * (test/firestore-rules/) — exclus de `vitest.config.ts` / `npm run
 * test` exprès, car ils exigent l'émulateur Firestore actif sur
 * 127.0.0.1:8080 (voir firebase.json) et échoueraient à la connexion
 * sinon. Lancer via `npm run test:rules`, qui démarre l'émulateur avant
 * d'invoquer cette config.
 */
export default defineConfig({
  test: {
    environment: "node",
    include: ["test/firestore-rules/**/*.test.ts"],
    testTimeout: 20_000,
    hookTimeout: 20_000,
    // Tous les fichiers de ce dossier partagent LA MÊME instance
    // d'émulateur Firestore (démarrée une fois par `firebase
    // emulators:exec`). Vitest exécute les fichiers de test en
    // parallèle par défaut ; ici, le `clearFirestore()` d'un fichier
    // effacerait les fixtures qu'un autre fichier est en train
    // d'utiliser. Exécution séquentielle des fichiers obligatoire.
    fileParallelism: false,
  },
});
