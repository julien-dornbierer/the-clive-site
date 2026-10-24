# Worker Cloudflare : newsletter et light show

Le site est statique (GitHub Pages). Les inscriptions à la newsletter passent par un petit Worker Cloudflare
branché sur `www.the-clive.com/api/*`, qui les enregistre dans une base Cloudflare D1.
Le code est dans `newsletter.js` ; il ne contient aucun secret.

## Mise en place (une seule fois, dans le tableau de bord Cloudflare)

1. **Base de données** : Storage & Databases > D1 > Create database, nom `the-clive-newsletter`.
   La table se crée toute seule au premier appel.
2. **Worker** : Compute > Workers & Pages > Create > Worker « Hello World », nom `the-clive-newsletter`, Deploy.
   Puis « Edit code », remplacer tout le contenu par celui de `newsletter.js`, Deploy.
3. **Brancher la base** : dans le Worker, Settings > Bindings > Add > D1 database,
   nom de variable `DB`, base `the-clive-newsletter`.
4. **Clé d'export** : Settings > Variables and secrets > Add, type Secret, nom `ADMIN_KEY`,
   valeur = une longue phrase aléatoire (à garder pour soi).
5. **Route** : Settings > Domains & Routes > Add > Route, `www.the-clive.com/api/*`, zone `the-clive.com`.

## Utilisation

- Télécharger la liste (CSV) : `https://www.the-clive.com/api/subscribers.csv?key=ADMIN_KEY`
- Pour envoyer une newsletter : importer le CSV dans Brevo, qui gère l'envoi et les désinscriptions.
- Désinscrire quelqu'un : https://www.the-clive.com/unsubscribe/ (l'adresse est supprimée de la base).
  À faire aussi pour les personnes qui se désinscrivent depuis un e-mail Brevo.

## Light show (`/lightshow/`, page interne du groupe)

La page publique ne contient que le moteur. Les titres, les cues et les masters non publiés restent hors du dépôt :
ils sont dans un bucket R2 et le Worker ne les sert qu'avec le mot de passe du groupe.

### Mise en place (une seule fois)

1. **Bucket** : Storage & Databases > R2 > Create bucket, nom `the-clive-lightshow` (accès public désactivé).
   Y déposer `songs.json`, les MP3 nommés par code (`z19.mp3`, `a09.mp3`)
   (copies prêtes dans le Drive : `LIGHT SHOW/lightshow-web (R2)/`).
2. **Brancher le bucket** : dans le Worker, Settings > Bindings > Add > R2 bucket, nom de variable `LIGHTSHOW`,
   bucket `the-clive-lightshow`.
3. **Mot de passe** : Settings > Variables and secrets > Add, type Secret, nom `LIGHTSHOW_PASSWORD`,
   valeur = le mot de passe à donner aux copains. Le changer déconnecte tout le monde.
4. **Code** : « Edit code », recoller tout `newsletter.js`, Deploy. La table `lightshow_comments` se crée seule
   dans la base D1 existante.

### Ajouter ou modifier un morceau

- `songs.json` contient une liste `songs` ; chaque morceau :
  `{key, code, name, ver, bpm, off, dur, start, audio, ev:[[beat, note, len], ...], sec:[[secondes, "Section", "#hex"(, 1 = fond clair)], ...]}`
  (`off` = début du clip dans le fichier, en secondes ; `ev` = la liste du générateur, identique au .mid).
- Déposer le MP3 (192k) et le nouveau `songs.json` dans le bucket. Aucun push n'est nécessaire.
- Changer `ver` (v2 → v3) quand les cues changent : les anciens commentaires affichent alors « sur v2 ».
- Une note d'état nouvelle (69 et plus) demande d'ajouter son nom, sa description, sa couleur et son rendu
  dans `site/lightshow/lightshow.js` (`NAMES`, `DESC`, `SWATCH`, `STATES`, `base()`), puis un push.

### Lire les commentaires hors de la page

D1 > `the-clive-newsletter` > Console :
`SELECT song, t, author, body, resolved FROM lightshow_comments ORDER BY song, t;`
