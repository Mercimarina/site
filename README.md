# Site MerciMarina (mercimarina.fr)

Site statique hébergé sur GitHub Pages : aucun outil de compilation, les fichiers sont servis tels quels.

## Pages
- `index.html` : page d'accueil (styles `style.css`, comportements `script.js`)
- `realisation-*.html` : les 4 pages projet (styles `style.css` + `realisation.css`, comportements `realisation.js`)
- `mentions-legales.html`, `politique-confidentialite.html`, `404.html`

## Ressources
- `fonts/` : polices Inter et Playfair Display (hébergées sur le site)
- `realisations/myconnectingia/` : visuels propres à la page MyconnectingIA
- Images à la racine (WebP), préfixées par projet : `fydem-`, `huh-`, `myc-`, `she-`, `ent-`…
- `logo-client-01.svg` à `logo-client-08.svg` : frise des logos clients

## Référencement
- `robots.txt` : recherche ChatGPT (OAI-SearchBot) autorisée, entraînement de l'IA d'OpenAI (GPTBot) refusé, autres robots autorisés
- `sitemap.xml` : à mettre à jour quand une page est ajoutée
- `CNAME` : domaine du site (mercimarina.fr), géré par GitHub Pages — ne pas modifier

## Modifier le site
- Après une modification de `style.css`, `script.js`, `realisation.css` ou `realisation.js`, augmenter le numéro `?v=` dans les pages qui les chargent, pour que les navigateurs récupèrent la nouvelle version.
- Une image ajoutée doit être appelée par une page ; sinon, ne pas la déposer.

## À faire
- Ajouter le lien LinkedIn (bouton de la section « Derrière vos slides » dans `index.html`, actuellement masqué avec `href="#"`).
