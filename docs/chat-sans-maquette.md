# Chat privé et direction visuelle unique

Base : feat/firebase-auth-dashboards, commit 9e910d6.
Branche locale : fix/live-chat-new-site.

## Comportement livré

- /chat et /equipes/:sport/:equipe/chat exigent une session autorisée via RequireAuth.
- Le visiteur déconnecté va à /connexion avec sa destination conservée.
- Le courriel non confirmé mène au parcours de vérification existant.
- TeamChatPage affiche les états de chargement, erreur, équipe non reliée et accès refusé. Aucun état ne montre la maquette.
- Le membre autorisé voit TeamChatRoom existant, branché sur Firestore et les endpoints privés existants.
- Le retour pointe vers /equipes/:sport/:equipe, la page V2 déjà redessinée.
- /chat propose les équipes présentes dans les rattachements confirmés par le serveur. L’admin dispose aussi du catalogue des équipes.
- Les anciennes entrées /athletes et /entraineurs redirigent vers les dashboards privés.
- Les deux PNG du chat et ChatApercuPage sont supprimés.
- Les anciens jetons bleu/blanc/ivoire sont supprimés. Les composants et les sections secondaires emploient la même palette noire, rouge et or.
- Calendrier, effectifs Sheets, documents, photos et API restent présents.

## Vérification

67 tests unitaires réussis, dont 6 tests de rendu de la route du chat : vrai salon, retour canonique, chargement, erreur réseau, autre équipe, admin et route inconnue.
Compilation réussie. Lint : aucune erreur, un avertissement préexistant dans AuthContext.
Les tests de rendu mockent Auth, Sheets et TeamChatRoom. Ils ne prouvent pas les échanges Firebase réels.
Aucun identifiant secret ajouté.

## Limites à terminer avant validation réelle

Pas de test de connexion réelle ni de réception entre deux comptes depuis cette session.
Pas de capture navigateur : Chromium absent et téléchargement du navigateur invalide dans cet environnement.
Pas de publication de règles Firestore ni de déploiement Vercel.
Les règles existantes du chat nécessitent les corrections identifiées dans l’audit : email_verified en lecture directe et révocation fiable lors de suppression/désactivation d’un membership. Ces corrections serveur ne font pas partie de ce correctif visuel/routage.
Le partage de photos reste désactivé dans le chat existant.
La production/main conserve l’ancienne version tant que la PR et le déploiement n’ont pas été traités.
