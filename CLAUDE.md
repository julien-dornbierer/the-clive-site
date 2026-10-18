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
- `site/assets/style.css` : styles partagés, couleurs en variables CSS (`--void`, `--surface`, `--line`, `--ink`, `--muted`).
- `site/assets/fonts/` : Jost 400/500/600 auto-hébergée (aucun appel à Google Fonts).
- `site/assets/lost-in-time-preview.mp3` : extrait de 60 s (3:00 à 4:00 du master, fondus). Le titre complet ne va jamais ici.
- Site en anglais uniquement.

## Faits validés (octobre 2026)
- Single A02 // Lost In Time : vendredi 13.11.2026, 4:07, Zwicky Records, distribution Irascible.
- Pre-save : https://lnk.site/the-clive-a02-lost-in-time
- Clip : Pierre Daendliker, col du Sanetsch, prêt une semaine avant la sortie.
- Discographie (source Apple Music) : Stray Hares Run Out Of Mojo et Two Wrongs Don't Make A Clive 2016,
  Spinning Minds et Washed Out 2019, A Blessing In This Clive 10.01.2020, Turn It Up et Renegades 2023.
- Contacts : presse theclivemusic@gmail.com ; booking Nora Weber, Zwicky Records, booking@zwickyrecords.com
  (lien Booking vers https://www.zwickyrecords.com/booking, nouvel onglet).
- EPK public (Drive) : https://drive.google.com/drive/folders/19b0hrpm29Hma1S8oz8RO3ntGw73y_liC
- Titre de l'album : ne pas le publier tant que le groupe ne l'a pas annoncé.

## À faire après le 13.11.2026
- Remplacer le lecteur d'extrait de `press/` par le lecteur Spotify du single, et le bouton Pre-save par Listen.
- Ajouter le lien du clip (accueil, section Videos) dès sa mise en ligne.
- Ajouter la photo presse de face et le logo quand ils existent.
