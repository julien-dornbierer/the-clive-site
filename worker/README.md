# Newsletter : Worker Cloudflare

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
