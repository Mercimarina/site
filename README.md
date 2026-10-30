# Site MerciMarina (mercimarina.fr)

Site statique : aucun outil de compilation, il suffit de déposer ces fichiers.

## Contenu
- `index.html` : la page d'accueil
- `style.css`, `script.js` : mise en forme et comportements
- `images/`, `fonts/` : visuels (WebP) et polices (hébergées sur le site)
- `mentions-legales.html`, `politique-confidentialite.html`
- `404.html` : page d'erreur
- `robots.txt`, `sitemap.xml`, `favicon.png`, `apple-touch-icon.png`, `og-image.jpg` : référencement et partage

## Mise en ligne avec GitHub Pages
1. Créer un dépôt public sur GitHub et y déposer **le contenu** de ce dossier (pas le dossier lui-même).
2. Dépôt > Settings > Pages > « Deploy from a branch » > branche `main`, dossier `/ (root)`.
3. Dans le même écran, renseigner le domaine personnalisé (mercimarina.fr) puis cocher « Enforce HTTPS » quand c'est possible.
4. Chez OVH, configurer les enregistrements DNS indiqués par la documentation de GitHub Pages.

## Après la mise en ligne
- Envoyer un test du formulaire (Formspree peut demander de confirmer l'adresse e-mail au premier envoi).
- Ajouter le lien LinkedIn (bouton de la section « Derrière vos slides », `href="#"` à remplacer).
- Ajouter le site à Google Search Console et envoyer `sitemap.xml`.
