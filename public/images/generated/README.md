# Photos de campagne Alérions — structure d'accueil

Ce dossier accueille les 50 photographies de la campagne Alérions 2026.
Aucun fichier n'y est présent pour le moment : le site fonctionne sans eux
(aucun lien brisé, les emplacements prévus restent simplement vides tant
que les fichiers ne sont pas livrés).

Le manifeste central est `src/data/imagesGenerees.ts`. Dès qu'un fichier
respectant la convention ci-dessous est ajouté dans le bon dossier, le
site le reconnaît automatiquement, sans modification de code.

## Convention de nommage

Chaque dossier reçoit des fichiers `01.jpg`, `02.jpg`, `03.jpg`, … (deux
chiffres, dans l'ordre).

| Dossier               | Sport / contexte                          | Nombre attendu |
| ---------------------- | ------------------------------------------ | -------------- |
| `volleyball/`           | Volleyball                                  | 3              |
| `football/`             | Football                                    | 3              |
| `flag-football/`        | Flag-football                               | 3              |
| `soccer/`                | Soccer                                      | 3              |
| `ultimate/`              | Ultimate                                    | 3              |
| `beach-volley/`          | Volleyball de plage                         | 3              |
| `cross-country/`         | Cross-country                               | 3              |
| `athletisme/`            | Athlétisme                                  | 3              |
| `natation/`              | Natation                                    | 3              |
| `echecs/`                | Échecs                                      | 3              |
| `basket-vieux-quebec/`   | Basketball, extérieur, Vieux-Québec         | 10             |
| `media-day/`             | Media Day (portraits multi-sports)          | 10             |

Total : 30 (multisports) + 10 (Vieux-Québec) + 10 (Media Day) = 50 photos.

## Format

- JPEG, `object-fit: cover` — aucune photo n'est déformée.
- Environ 60 % horizontales, 40 % verticales (voir la répartition prévue
  dans `imagesGenerees.ts`, à ajuster une fois les fichiers réels reçus).
- Aucun nom de personne dans le nom de fichier ni dans le texte alternatif.
