# Ajouter un projet au portfolio

1. Créer un dossier ici, au nom court et sans espace : `mon-projet/`
2. Y déposer les captures d'écran (PNG, JPG ou WebP, taille libre :
   le site les redimensionne et les compresse tout seul).
3. Créer `mon-projet/index.md` sur ce modèle :

```md
---
titre: Nom du projet
categorie: Site vitrine
annee: 2026
technologies: [Astro, Tailwind CSS]
couverture: ./accueil.png
couvertureAlt: Page d'accueil du site, avec le menu et la photo principale
captures:
  - src: ./contact.png
    alt: Page de contact
liens:
  site: https://exemple.fr
  code: https://github.com/NetSo8/mon-projet
---

Texte libre facultatif, affiché sur la fiche du projet.
```

- `couverture` : l'image de la vignette dans la liste.
- `captures` : les autres images de la fiche (facultatif).
- Les `alt` décrivent l'image pour les personnes aveugles : obligatoires.
- `liens` : facultatifs, l'un ou l'autre ou les deux.
- `ordre: 1` (facultatif) force la position ; sinon, les plus récents en premier.

Le projet apparaît sur `/portfolio/` et a sa propre page `/portfolio/mon-projet/`.
