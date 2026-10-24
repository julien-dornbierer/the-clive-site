---
name: the-clive-website
description: Travailler sur le site du groupe The Clive (the-clive.com) : dépôt GitHub, structure, design, publication, newsletter et vérifications. À utiliser pour toute modification du site.
---

# Site the-clive.com

Site du groupe de rock The Clive (Biel/Bienne). Julien Dornbierer, le bassiste, gère tout. Il ne télécharge jamais de zip : chaque changement se fait dans le dépôt GitHub et se publie par un push.

## 1. Partir de la bonne source

- Dépôt : `julien-dornbierer/the-clive-site` (public). L'ajouter à la session avec accès en écriture (`add_repo`, access `push`), le cloner, puis lire son `CLAUDE.md` : il contient les faits validés (dates, liens, contacts, discographie) et la liste « À faire ». Ce skill ne les répète pas, pour qu'ils ne deviennent pas faux ici.
- **Toujours `git pull` avant de toucher quoi que ce soit.** D'autres sessions modifient le site en parallèle. Ne jamais reconstruire le site à partir d'un ancien artifact, d'un prototype ou d'un zip : ils sont périmés et écraseraient le travail des autres.
- Le site de Zwicky Records (zwickyrecords.com) est un autre site, hors de ce dépôt.

## 2. Comment le site est construit

- HTML statique, sans build, sans framework, sans dépendance. `site/` est publié tel quel sur **GitHub Pages** par `.github/workflows/deploy.yml` à chaque push sur `main`. Le site est en ligne environ 1 minute plus tard.
- Le domaine `www.the-clive.com` (fichier `site/CNAME`) passe par Cloudflare, qui fait proxy devant GitHub Pages.
- Pages : `site/index.html` (accueil), `site/press/index.html` (EPK), `site/privacy/index.html`, `site/unsubscribe/index.html` (noindex).
- **L'en-tête, la navigation et le pied de page sont copiés dans chaque page.** Un changement de navigation ou de pied de page doit être fait dans les 4 fichiers.
- `site/assets/style.css` : tous les styles. Les pages le chargent avec `?v=N`. **Incrémenter N dans les 4 pages à chaque modification du CSS**, sinon les navigateurs gardent l'ancien fichier. Même règle pour `newsletter.js?v=N`.
- Polices : Jost 400/500/600 hébergée dans `site/assets/fonts/`, utilisée comme remplacement de Futura. Aucun appel à Google Fonts, aucun cookie, aucun traceur : c'est ce qui permet de se passer de bannière cookies. Ne rien ajouter qui en pose (Google Analytics, pixel Meta, iframes YouTube) sans en parler à Julien, puisqu'il faudrait alors une bannière et une mise à jour de la page Privacy.
- Assets : `logo.svg` (wordmark), `lost-in-time.webp` (artwork du single), `og.jpg` (image de partage 1200×630), un extrait MP3 de 60 s du single, et le plan de scène en PNG.
- `sitemap.xml` et `robots.txt` sont à tenir à jour quand une page est ajoutée.

## 3. Règles de design (identité visuelle du groupe)

- Minimalisme strict : fond noir, une colonne étroite (720 px max), typographie seule. Aucune forme décorative, aucun dégradé, aucun coin arrondi, aucune ombre.
- Une seule famille de police (la pile `--font` : Futura, puis Jost). Les titres, la navigation et les labels sont en capitales espacées.
- Utiliser uniquement les variables de `:root` : `--void`, `--surface`, `--line`, `--ink`, `--muted`, et `--accent` / `--accent-hi`, le jaune doré relevé sur l'artwork de A02. Ne pas introduire d'autre couleur.
- Les titres de morceaux s'écrivent `CODE // TITRE` (par exemple `A02 // LOST IN TIME`).
- Site en anglais uniquement, avec des phrases courtes, sans point d'exclamation ni emoji.

## 4. Contenu : ce qui ne va jamais dans le dépôt

Le dépôt est public. Ne jamais y mettre :
- le nom de l'album ni les titres des morceaux pas encore annoncés : seuls les codes suivis de `//` sont publics, plus le titre du single sorti ;
- de stratégie, de budget, de contacts privés ;
- de secret (clés, mots de passe).

## 5. Newsletter

- Le formulaire est dans le pied de page de l'accueil et de l'EPK. Le code est dans `site/assets/newsletter.js` (styles `.nl` dans `style.css`), avec un champ caché anti-robots.
- GitHub Pages ne peut pas exécuter de code côté serveur. Les requêtes vers `/api/*` sont donc servies par un **Worker Cloudflare** : le code est dans `worker/newsletter.js`, la mise en place dans `worker/README.md`. Il est attaché à la route `www.the-clive.com/api/*` et enregistre les inscriptions dans une base D1 (binding `DB`). La clé d'export `ADMIN_KEY` est un secret stocké seulement dans Cloudflare.
- Points d'entrée : `POST /api/subscribe`, `POST /api/unsubscribe` (supprime l'adresse), `GET /api/subscribers.csv?key=…` (export de la liste).
- Le Worker se déploie à la main dans le tableau de bord Cloudflare : ce n'est pas un push GitHub. Si tu modifies `worker/newsletter.js`, dis à Julien de recoller le code dans le Worker.
- Les envois se font dans Brevo, en important le CSV. Toute nouvelle collecte de données doit être ajoutée dans `site/privacy/index.html`.

## 6. Vérifier avant de pousser

C'est obligatoire. Il faut un rendu à 1280 px et à 390 px, sans aucun défilement horizontal, sur toutes les pages touchées.

```bash
cd site && python3 -m http.server 8790 &
# Playwright : Chromium est préinstallé dans /opt/pw-browsers. Utiliser playwright@1.56.1,
# la version qui correspond à ce Chromium. Ne jamais lancer `playwright install`.
```

Pour chaque page, comparer `document.documentElement.scrollWidth` et `window.innerWidth` (l'écart doit être de 0), puis regarder une capture d'écran. Le formulaire newsletter répond « Signup opens soon » en local, c'est normal puisque l'API n'existe pas sur le serveur de test.

## 7. Publier

1. `git pull --rebase origin main`, puis commit en français avec un message clair et les lignes d'attribution demandées par la session.
2. `git push origin HEAD:main`. La publication est automatique.
3. Si la structure change, mettre à jour le `CLAUDE.md` du dépôt et ce skill (`.claude/skills/the-clive-website/SKILL.md`).
4. Dire à Julien ce qui a changé en une ou deux phrases, et lui rappeler de recharger avec Ctrl+F5.
