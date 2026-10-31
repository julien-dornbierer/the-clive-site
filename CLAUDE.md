# The Clive : site the-clive.com

Site du groupe The Clive (rock, Biel/Bienne ; Julien Dornbierer est le bassiste). Ce dépôt est **public** :
n'y mets jamais de stratégie interne, de budget, de contacts privés ni le titre complet d'un morceau non sorti.

## Publication
- `site/` est publié tel quel sur GitHub Pages par `.github/workflows/deploy.yml` à chaque push sur `main`
  (environ 1 minute). Pas de build, pas de dépendances.
- Domaine `www.the-clive.com` (fichier `site/CNAME`).
- Après modification : vérifier le rendu (desktop 1280 px + mobile 390 px, aucun scroll horizontal),
  puis commit + push. Rappeler à Julien de recharger avec Ctrl+F5.

## Structure
- `site/index.html` : accueil (single en cours, Incoming, Videos, Live, booking).
- `site/press/index.html` : EPK public (bio, lecteur d'extrait, faits, téléchargements, discographie, contacts).
- `site/assets/style.css` : styles partagés (lien versionné `?v=N` dans les pages : incrémenter N à chaque changement du CSS, sinon les navigateurs gardent l'ancien), couleurs en variables CSS (`--void`, `--surface`, `--line`, `--ink`, `--muted`).
- `site/assets/fonts/` : Jost 400/500/600 auto-hébergée (aucun appel à Google Fonts).
- `site/assets/lost-in-time-preview.mp3` : extrait de 60 s (3:00 à 4:00 du master, fondus). Le titre complet ne va jamais ici.
- Site en anglais uniquement.
- `site/privacy/index.html` : déclaration de confidentialité (lien dans le pied de page de chaque page).
- Newsletter : formulaire dans le pied de page (`site/assets/newsletter.js`, styles `.nl` dans `style.css`),
  page `site/unsubscribe/`. Les inscriptions vont à `/api/*`, servi par un Worker Cloudflare (`worker/newsletter.js`,
  base D1, mise en place décrite dans `worker/README.md`). Aucun secret dans ce dépôt : la clé d'export `ADMIN_KEY`
  est stockée dans Cloudflare uniquement.
- `site/lightshow/` : page **non répertoriée** (noindex, absente du sitemap et de la navigation) pour relire et commenter
  les plans lumière du live, en français, réservée au groupe. Moteur repris du visualiseur du « Light Show State Packet ».
  Rendu = rig v0.3 (27.10.2026) : 2 monolithes noirs, 2 Astera Titan Tube de 16 pixels en // à 70° par monolithe
  (chaque côté du plan, 32 valeurs, s'affiche sur les 2 tubes de son monolithe), strobe dans la grosse caisse
  transparente (notes 50, 51, 87, inchangées). Le Spectra de face est dessiné (`front` dans `compute()`) mais aucune
  note ne le pilote encore. Aucune atténuation : les flashs saturent l'image comme sur scène.
  Test rig B3 (31.10.2026) : un morceau de songs.json avec `"rig": "b3"` est dessiné par `drawB3()` (pas de monolithes :
  barre de 12 têtes derrière la batterie, 2 barres au sol sur les côtés, 2 strobes au sol de chaque côté de la batterie
  (notes 147-151), miroir sur totem, 2 faces + Spectra). Les looks
  donnent seulement les couleurs, les mouvements viennent des calques du canal 2 (notes 128-151, `LAYER`). Entrée de test
  `a02-b3` (plan `OUTILS/plans/a02_b3.py`), A02 v1 reste inchangé.
  Le dépôt ne contient que le moteur (`lightshow.js`, `lightshow.css`) : titres, cues et MP3 sont dans le bucket R2
  `the-clive-lightshow` (fichier `songs.json` + MP3), servis par le Worker derrière le mot de passe `LIGHTSHOW_PASSWORD`.
  Les commentaires sont dans la table D1 `lightshow_comments`. Tout l'album est dans R2 ; les morceaux sans plan
  lumière servent à noter des idées. Donner un plan à un morceau = mettre à jour `songs.json` dans R2 (pas de push).
  Voir `worker/README.md`.
  Depuis le Mac de Julien, Claude publie seul : push GitHub (token dans le trousseau, git lancé hors sandbox) et envoi
  de `songs.json` sur R2 par l'API Cloudflare (token dans le trousseau, service `cloudflare-r2-lightshow`).
  Depuis le PC Windows (clone `C:\Users\julie\Desktop\VSCODE\the-clive-site`), pareil : git pousse directement, le token
  R2 est dans le Gestionnaire d'identification Windows (`keyring`). Détails : README des outils, section Environnement.
  Nouveau plan lumière : suivre `LIGHT SHOW/OUTILS/README.md` dans le Drive (boîte à outils Python, analyses des 11
  morceaux déjà faites dans `LIGHT SHOW/ANALYSE`). Notes MIDI et cues : « The Clive Light Show – State Packet »
  (doc Claude, copie .docx dans le dossier Drive LIGHT SHOW). Les morceaux peuvent changer de tempo : champ `tm` de
  songs.json. Toujours `git pull` avant de toucher au moteur, et pousser le moteur avant d'envoyer un songs.json
  qui utilise de nouvelles notes. Une nouvelle note d'état ne doit jamais trahir un titre non annoncé (69 = DALLE_NOIRE).

## Faits validés (octobre 2026)
- Single A02 // Lost In Time : vendredi 13.11.2026, 4:07, Zwicky Records, distribution Irascible.
- Pre-save : https://lnk.site/the-clive-a02-lost-in-time
- Clip : Pierre Daendliker, col du Sanetsch, prêt une semaine avant la sortie.
- Discographie (source Apple Music) : Stray Hares Run Out Of Mojo et Two Wrongs Don't Make A Clive 2016,
  Spinning Minds et Washed Out 2019, A Blessing In This Clive 10.01.2020, Turn It Up et Renegades 2023.
- Contacts : presse contact@the-clive.com ; booking Nora Weber, Zwicky Records, booking@zwickyrecords.com
  (lien Booking vers https://www.zwickyrecords.com/booking, nouvel onglet).
- EPK public (Drive) : https://drive.google.com/drive/folders/19b0hrpm29Hma1S8oz8RO3ntGw73y_liC
- Titre de l'album : ne pas le publier tant que le groupe ne l'a pas annoncé.

## À faire après le 13.11.2026
- Remplacer le lecteur d'extrait de `press/` par le lecteur Spotify du single, et le bouton Pre-save par Listen.
- Ajouter le lien du clip (accueil, section Videos) dès sa mise en ligne.
- Ajouter la photo presse de face et le logo quand ils existent.
