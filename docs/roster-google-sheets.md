# Effectifs Alérions — connexion Google Sheets (lecture seule)

Ce document couvre la connexion du site à la feuille Google Sheets
**« LISTES DE TOUTES LES ÉQUIPES ALÉRIONS SAISON 2026-2027 »**
(`1_0_fam1UJxRCjLKvbFnzZ1Hrf1HG6XF_MmQqw1LTLho`) et les cartes de joueurs
qu'elle alimente. Lecture seule : aucune donnée n'est écrite dans le Sheet
depuis le site.

## 1. Ce que cette étape livre

- Une fonction serveur (`api/roster.ts`) qui lit ÉQUIPES et MEMBRES via un
  compte de service Google, applique les règles de publication, et
  renvoie uniquement les champs publics nécessaires à l'affichage.
- Un cache serveur (`ALERIONS_ROSTER_CACHE_SECONDS`, 30 s par défaut) +
  cache CDN Vercel (`stale-while-revalidate`).
- Un hook client (`useRoster`) qui revalide toutes les 30 s, au retour au
  premier plan de l'onglet, avec reprises à délai croissant en cas
  d'échec, et qui arrête tout à la fermeture de la page.
- Une carte joueur/entraîneur réutilisable (`PlayerCard`), à textes
  dynamiques (modifier le Sheet met la carte à jour sans recréer une
  image), branchée dans `TeamDetailPage` (les 38 équipes) et
  `MonEquipePage` (sélecteur Basketball).
- Une page de profil par identifiant stable
  (`/equipes/:sport/:equipe/membres/:idMembre`), qui ne confond jamais
  deux joueurs portant le même numéro dans deux équipes différentes.
- Les deux cartes historiques (n° 25, n° 30, images figées) sont
  **inchangées** — elles ne sont reliées à aucune personne réelle du
  Sheet par ce travail.

## 2. Ce que cette étape NE fait PAS

- Aucun compte utilisateur, aucune authentification joueur/parent/coach.
- Aucun téléversement de photo (voir §7 — Photos & dashboards).
- Aucune synchronisation Google Calendar (`google_calendar_id` /
  `source_horaires` sont lus-prêts, non branchés).
- Aucun stockage des messages du Chat dans le Sheet — le Chat reste un
  aperçu imagé (inchangé, voir `ChatApercuPage.tsx`).
- Aucun bouton public « Synchroniser maintenant » — il n'existe pas
  d'authentification admin fiable à ce stade (voir §8).

## 3. Configuration Google Cloud

1. **Projet GCP** — utiliser un projet existant ou en créer un dédié
   (ex. `alerions-site-roster`).
2. **Activer l'API** — APIs & Services → Library → *Google Sheets API* →
   Enable.
3. **Créer le compte de service** — IAM & Admin → Service Accounts →
   Create Service Account.
   - Nom suggéré : `alerions-roster-lecture`.
   - **Ne lui accorder AUCUN rôle au niveau du projet** (pas de rôle
     Drive, pas de rôle Sheets global). L'accès est donné uniquement par
     le partage du fichier Sheet lui-même (étape 5) — c'est ce qui
     garantit « lecture seule sur ce Sheet, jamais sur tout le Drive ».
4. **Générer une clé** — sur le compte de service créé → Keys → Add Key →
   Create new key → JSON. Télécharger le fichier JSON (il contient
   `client_email` et `private_key`).
5. **Partager le Google Sheet avec ce compte** — ouvrir
   https://docs.google.com/spreadsheets/d/1_0_fam1UJxRCjLKvbFnzZ1Hrf1HG6XF_MmQqw1LTLho/edit,
   bouton *Partager*, coller l'adresse `client_email` du JSON, rôle
   **Lecteur** (jamais Éditeur). C'est l'unique autorisation d'accès que
   ce compte de service possède.

## 4. Variables d'environnement (Vercel)

Vercel → Project → Settings → Environment Variables. À définir pour les
environnements **Preview** (pour tester cette PR) et **Production**
séparément si on veut un compte de service distinct par environnement
(recommandé, mais un seul suffit pour démarrer).

| Variable | Valeur | Remarque |
|---|---|---|
| `GOOGLE_SHEET_ID` | `1_0_fam1UJxRCjLKvbFnzZ1Hrf1HG6XF_MmQqw1LTLho` | Segment d'URL entre `/d/` et `/edit`. |
| `GOOGLE_SERVICE_ACCOUNT_EMAIL` | `client_email` du JSON | — |
| `GOOGLE_PRIVATE_KEY` | `private_key` du JSON | Coller tel quel (avec `\n` littéraux) **ou** avec de vrais retours à la ligne — les deux formats sont acceptés et normalisés automatiquement (`api/_lib/sheets.ts`). Dans l'UI Vercel, coller la valeur telle que le JSON la fournit (avec `\n`) est le plus simple. |
| `ALERIONS_ROSTER_CACHE_SECONDS` | `30` | Ajuster si le quota Google devient un problème (plus haut = moins d'appels, délai d'actualisation plus long). |
| `ALERIONS_PHOTO_HOST_ALLOWLIST` | *(optionnel)* | Liste blanche de noms d'hôtes HTTPS pour `photo_url`, séparés par des virgules (ex. `lh3.googleusercontent.com,drive.google.com`). Absent = tout hôte HTTPS accepté (voir limite au §6). |

**Aucune de ces variables ne doit porter le préfixe `VITE_`.** Un
préfixe `VITE_` ferait automatiquement embarquer sa valeur dans le
JavaScript envoyé au navigateur — c'est le mécanisme même que Vite
utilise pour exposer des variables côté client, donc à éviter
absolument ici. Toutes ces variables ne sont lues que par les fichiers
sous `api/`, jamais importées par `src/`.

Après avoir ajouté les variables, redéployer (un redéploiement est
nécessaire pour qu'une fonction serverless existante les relise).

## 5. Structure attendue du Sheet

- Onglet **ÉQUIPES** (A:Q) et **MEMBRES** (A:Z) — sources de vérité,
  lues telles quelles. Les onglets par équipe (vues calculées) ne sont
  **jamais** lus par le code.
- Mappage par **nom d'en-tête**, pas par position de colonne — robuste
  aux accents/casse et à un réordonnancement involontaire des colonnes
  existantes.
- **AA (`publication_profil`) et AB (`publication_photo`)** : à ajouter
  par l'administrateur à droite de MEMBRES, valeurs `TRUE`/`FALSE` (ou
  `VRAI`/`FAUX`, `1`/`0`, `Oui`/vide…). Tant qu'elles sont absentes ou
  vides, le code les traite comme `FALSE` — **aucune ligne n'est donc
  publiée par accident avant que l'administrateur n'ait explicitement
  coché ces colonnes.**
- Identifiants utilisés : `id_equipe`, `id_personne`, `id_membre` — le
  numéro de chandail n'est **jamais** utilisé seul comme identifiant
  (deux équipes peuvent avoir le même numéro ; voir tests dans
  `api/_lib/publication.test.ts`, scénario « deux joueurs portant le
  même numéro »).

## 6. Règles de publication — rappel et limites connues

Un profil est public uniquement si `donnée_fictive = FALSE` **ET**
`statut_membre = Actif` **ET** `publication_profil = TRUE`
(`api/_lib/publication.ts`, `profilEstPublic`). Une photo est publique
en plus si `publication_photo = TRUE` **ET** `consentement_photo =
Accordé` **ET** l'URL est HTTPS (et, si configurée, dans
`ALERIONS_PHOTO_HOST_ALLOWLIST`). Un `rôle` ou un `accès_chat` indiqué
dans le Sheet n'est **jamais** traité comme une preuve d'identité ou une
permission — ces colonnes ne sont même pas lues par les règles de
publication.

**Limite documentée** : sans `ALERIONS_PHOTO_HOST_ALLOWLIST` configurée,
n'importe quel hôte HTTPS est accepté pour `photo_url` — il n'y a pas
encore de proxy d'image qui restreint les domaines/formats/tailles
réellement servis au navigateur. Configurer cette liste blanche (ou
construire un proxy d'image, voir §7) avant d'ouvrir `photo_url` à une
saisie non supervisée.

## 7. Photos & dashboards — prochaine étape (hors scope ici)

Cette étape ne connecte le Sheet qu'en **lecture seule**. `photo_url` et
`photo_storage_path` préparent de futurs téléversements (dashboard
joueur pour sa propre photo, dashboard entraîneur pour ses équipes,
dashboard admin pour tous les membres), mais **aucun upload n'est
construit ici** : il n'existe pas encore d'authentification serveur ni
de stockage sécurisé, et créer un upload public ou des permissions
simulées en `localStorage` recréerait exactement le problème que ces
règles de publication existent pour éviter.

La prochaine étape devra définir, dans cet ordre :
1. Vérification des droits **côté serveur** (qui peut modifier la photo
   de qui) — jamais une vérification uniquement côté client.
2. Validation du format et de la taille des images à l'upload.
3. Stockage (ex. Vercel Blob, Google Cloud Storage, ou équivalent).
4. Mise à jour du profil — et décision explicite de la **source
   d'autorité** : si une photo est à la fois modifiée dans le Sheet et
   dans un futur dashboard, laquelle gagne ? (Suggestion : le Sheet reste
   autoritaire tant que `statut_photo` n'indique pas une photo gérée par
   dashboard, pour éviter qu'une modification Sheet n'écrase
   silencieusement un upload récent, ou l'inverse — à trancher au moment
   de construire cette étape, pas avant.)

## 8. « Synchroniser maintenant » — reporté

Un bouton admin de purge/forçage du cache nécessite une authentification
admin fiable (actuellement, `api/coach-code.ts` protège seulement le
déverrouillage des défis côté session navigateur — ce n'est pas une
authentification serveur persistante). Tant que cette authentification
n'existe pas, **aucune route publique de purge n'est créée** :
`obtenirRoster(forcer: true)` existe déjà côté serveur
(`api/_lib/cache.ts`) et n'attend qu'une route admin protégée pour
l'exposer, à construire avec l'authentification admin de la phase
suivante.

## 9. Délai réel d'actualisation

Il n'y a **aucune garantie de temps réel instantané**. Le délai observé
dépend de deux couches de cache :
- Cache serveur (`ALERIONS_ROSTER_CACHE_SECONDS`, 30 s par défaut).
- Cycle de revalidation client (`useRoster`, 30 s pendant que l'onglet
  est visible, immédiat au retour au premier plan).

Dans le pire cas (une modification Sheet survient juste après une
lecture serveur), le délai total avant qu'un visiteur avec l'onglet déjà
ouvert la voie peut approcher `ALERIONS_ROSTER_CACHE_SECONDS` + le cycle
client, soit **jusqu'à ~60 secondes** avec les valeurs par défaut — à
mesurer en conditions réelles une fois les identifiants configurés (voir
§11, test #10).

Limite d'hébergement additionnelle : le cache serveur vit dans le
processus de chaque fonction serverless Vercel. Vercel peut recycler une
instance froide à tout moment, et plusieurs instances tournent en
parallèle sous charge — ce n'est donc **pas un cache partagé global
garanti**, seulement une réduction du nombre d'appels à Google sur une
instance chaude. Si un cache réellement partagé devient nécessaire
(trafic élevé, quota Google serré), évoluer vers Vercel KV ou Edge
Config plutôt que d'augmenter indéfiniment
`ALERIONS_ROSTER_CACHE_SECONDS`.

## 10. Rétention des données retirées

Les règles de publication (§6) sont évaluées à **chaque lecture** — dès
que `publication_profil` repasse à `FALSE` dans le Sheet (ou que
`statut_membre` devient autre que `Actif`), le profil disparaît de l'API
publique au plus tard après expiration du cache serveur (30 s par
défaut). Rien n'est donc jamais retenu indéfiniment côté serveur après
retrait d'autorisation : il n'y a pas de duplication de données hors du
Sheet lui-même (pas de base de données miroir), donc pas de purge
supplémentaire à faire à ce stade. Si une base miroir est introduite plus
tard (ex. pour accélérer encore les lectures), prévoir alors une purge
active sur retrait de publication plutôt que de se fier seulement à
l'expiration du cache.

## 11. Tests

### Automatisés (`npm run test`, Vitest)

Fixtures dans `api/_lib/fixtures.test-data.ts`. Voir
`api/_lib/normaliser.test.ts`, `publication.test.ts`, `sheets.test.ts`,
`cache.test.ts` — 33 tests couvrant : accents dans les en-têtes,
booléens sous toutes les formes rencontrées (`TRUE`/`VRAI`/`1`/`oui`/`x`
et leur absence), cellules vides, schéma MEMBRES avec et sans AA/AB,
exclusion d'une donnée fictive, d'un membre inactif, d'un profil non
publié, refus d'une photo sans consentement ou avec une URL non HTTPS,
repli sur `nom_complet`, **deux joueurs portant le même numéro dans deux
équipes différentes** (ne se confondent jamais), absence de champs
privés dans la forme publique, normalisation de `GOOGLE_PRIVATE_KEY`
(retours à la ligne réels et littéraux), configuration Google absente.

### Manuels (faits pendant cette livraison, sans identifiants Google réels)

- `npm run build`, `npm run lint`, `npm run test` : verts.
- Effectif branché visuellement via un faux serveur `/api/roster` local
  (fixtures), car aucun identifiant Google réel n'était disponible dans
  cette session — voir captures jointes à la PR. **La connexion réelle à
  Google Sheets reste à vérifier une fois les identifiants configurés**
  (voir checklist ci-dessous) : ni cette session ni l'assistant n'a
  manipulé de clé privée réelle, conformément à la consigne de ne jamais
  en demander une dans la conversation.
- Vérifié : route `/joueurs/:numero` (cartes historiques n° 25/30)
  inchangée ; nouvelle route
  `/equipes/:sport/:equipe/membres/:idMembre` fonctionnelle et distincte ;
  état vide affiché proprement pour une équipe sans ligne MEMBRES
  publiable ; affichage mobile (390px) et desktop (1440px) sans
  débordement horizontal.
- Non vérifiable sans identifiants réels : quota Google réel, délai
  d'actualisation réel de bout en bout, comportement sur erreur de
  partage/403 réelle.

### Checklist à exécuter une fois les identifiants Google configurés (Preview)

- [ ] Les 38 équipes : chaque route `/equipes/:sport/:equipe` retrouve
      bien sa ligne ÉQUIPES via `sport` + `slug_site`.
- [ ] Modifier un numéro, un nom, une photo dans le Sheet → la carte
      correspondante change sans redéploiement.
- [ ] Mesurer le délai réel observé après une modification Sheet
      (onglet déjà ouvert vs onglet rouvert).
- [ ] Mettre `publication_profil` à `FALSE` → le profil disparaît de
      l'effectif public après expiration du cache.
- [ ] Vérifier dans l'onglet Réseau du navigateur qu'aucun courriel, URL
      de stockage privé, ni secret ne transite jamais vers le client.
- [ ] Simuler un partage retiré (retirer temporairement l'accès Lecteur
      du compte de service) → l'API répond une erreur claire
      (`google_auth_echouee`), jamais un plantage silencieux.
- [ ] Désactiver temporairement l'API Sheets côté GCP → vérifier le
      comportement de quota/indisponibilité et les reprises à délai
      croissant.

## 12. Rollback

Cette fonctionnalité est additive : aucune route existante n'est
supprimée, aucune donnée existante n'est migrée ou détruite. Deux
niveaux de retour arrière possibles, du plus léger au plus lourd :

1. **Désactiver sans retirer de code** — retirer (ou vider)
   `GOOGLE_SHEET_ID` / `GOOGLE_SERVICE_ACCOUNT_EMAIL` /
   `GOOGLE_PRIVATE_KEY` dans Vercel. `api/roster.ts` répond alors
   systématiquement `503 service_non_configure`, et chaque
   `RosterSection` affiche son état d'erreur avec bouton Réessayer — le
   reste du site (maquettes, cartes historiques n° 25/30, Chat,
   Calendrier) continue de fonctionner normalement. Aucun redéploiement
   de code nécessaire, seulement un changement de variables + redeploy.
2. **Retirer le code** — ne pas fusionner cette PR, ou la revert après
   fusion (`git revert` du commit de merge). Tous les fichiers ajoutés
   sont listés dans la description de la PR ; aucun fichier existant
   n'a été supprimé, donc un revert standard suffit sans conflit attendu.
   Cette branche n'a pas touché `src/data/joueurs.ts` ni
   `src/pages/JoueurPage.tsx` (cartes n° 25/30) : un rollback ne les
   affecte donc d'aucune façon.

Dans tous les cas, **main et la production ne sont jamais touchés par ce
travail tant que cette PR n'est pas fusionnée et redéployée
explicitement** — cette livraison reste sur une branche, sans fusion ni
déploiement en production.
