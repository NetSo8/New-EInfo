# einformatique.fr

Site vitrine d'E Informatique (Elian, technicien informatique freelance à Rivesaltes, 66).
Astro 7, sans framework client, sortie 100 % statique.

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # ./dist
npm run preview
```

## Ce que le site doit faire

Deux audiences, deux parcours, une seule marque :

| Parcours | Entrée | Page | CTA |
| --- | --- | --- | --- |
| Particulier | porte gauche de l'accueil | `/particuliers/` | « Décrire mon problème » |
| Entreprise | porte droite de l'accueil | `/professionnels/` | « Demander un diagnostic » |
| Pair technique | contenu du labo | `/labo/` | contact qualifié, sans pression |

Le troisième parcours ne dispose d'aucun appel à l'action agressif : il repose
uniquement sur les preuves publiées. L'accueil et les pages de conversion restent
crédibles même si `/labo/` est vide (`ProofStrip` affiche alors un texte d'attente).

## Arborescence

```
/                     accueil, double aiguillage dès le premier écran
/particuliers/        dépannage, méthode de chiffrage, FAQ, ton simple
/professionnels/      formules, périmètre, offre pont d'audit approfondi
/services/            catalogue détaillé des 5 prestations (ancres #depannage, #infra…)
/labo/                writeups techniques, registre sombre
/labo/<slug>/         article technique, sommaire, code coloré
/portfolio/           missions livrées (clair) + recherche en cours (sombre)
/blog/                contenu grand public, séparé du labo
/blog/<slug>/         article grand public
/a-propos/            profil actuel, méthode, trajectoire annoncée sans la survendre
/contact/             formulaire qui qualifie particulier / entreprise / mission
/mentions-legales/    à compléter
404                   page d'erreur
/about/ → /a-propos/  redirection depuis l'ancienne URL
```

## Système de design

Voir `DESIGN.md` (direction, palette, typographie) et `PRODUCT.md` (audiences, voix,
anti-références). En résumé :

- **Grenat sur chaux.** Ancrage catalan assumé, pas de bleu informatique générique.
  Jetons dans `src/styles/tokens.css`, en OKLCH.
- **Clair par défaut, sombre pour le labo.** `<Base theme="nuit">` remappe les jetons
  via `body.t-nuit`. Les valeurs `--fixed-paper` / `--fixed-nuit` ne s'inversent jamais
  (bandeau supérieur, boutons posés sur fond nuit).
- **Grille visible.** Filets d'un pixel, sections numérotées `§ 01`, listes réglées
  plutôt que grilles de cartes.
- **Deux familles.** Archivo (titres et corps), Spline Sans Mono (étiquettes, terminal,
  métadonnées). Chargées depuis Google Fonts.

Composants réutilisables dans `src/components/` : `Nav`, `Footer`, `PageHead`,
`SectionHead`, `Terminal`, `ChainDiagram`, `ZoneRadar`, `ProofStrip`, `CtaBand`, `Faq`.

`ZoneRadar` place les communes selon leur **distance et leur relèvement réels** depuis
Rivesaltes : modifier le tableau `pts` en tête du composant pour ajuster la zone.

## Contenu

Collections définies dans `src/content.config.ts` :

- `src/content/labo/*.md` : `title`, `summary`, `date`, `status`
  (`publié` | `en cours` | `brouillon`), `tags`, `readingTime`, `repo`.
  Le statut est affiché : un travail inachevé est annoncé comme tel.
- `src/content/blog/*.md` : `title`, `summary`, `date`,
  `audience` (`particulier` | `entreprise` | `tous`), `tags`.

Les prestations et les réalisations sont des données typées :
`src/data/services.ts` et `src/data/portfolio.ts`.

## SEO

- JSON-LD `LocalBusiness` sur toutes les pages (`src/layouts/Base.astro`), `Service`
  sur `/services/`, `FAQPage` sur les FAQ, `TechArticle` et `BlogPosting` sur les articles.
- `sitemap-index.xml` généré, `robots.txt` dans `public/`.
- Les mots-clés locaux existants (dépannage Rivesaltes, technicien P.-O., création de
  site Perpignan, sécurité PME, hébergement VPS) restent portés par l'accueil,
  `/particuliers/`, `/professionnels/` et `/services/`.
- Les termes longue traîne (confidential computing, zero-trust, Nitro Enclaves) sont
  confinés à `/labo/` : ils ne remontent pas sur les pages de conversion locales.

## À compléter avant mise en ligne

1. **Endpoint du formulaire.** `FORM_ENDPOINT` en tête de `src/pages/contact.astro`
   pointe vers un identifiant Formspree fictif. Le champ `_gotcha` est un piège à robots
   déjà géré par Formspree, Web3Forms et Basin.
2. **Tarifs : aucun montant n'est publié.** Choix assumé pour l'instant. `/particuliers/`
   remplace la grille par la section « Comment je chiffre » (tableau `chiffrage` en tête
   de page) et `/professionnels/` par des mentions neutres (tableau `formules`). Les deux
   pages contiennent une question de FAQ qui explique pourquoi. Pour afficher des prix
   plus tard, il suffit de renseigner ces deux tableaux et d'adapter les deux réponses.
3. **Réalisations.** Les cinq entrées de `src/data/portfolio.ts` sont des exemples
   plausibles, à remplacer par les vraies missions et les vrais chiffres.
4. **Articles.** Les trois writeups et les trois articles de blog servent à montrer la
   forme et le ton. À remplacer par les contenus réels.
5. **Photographies.** Les images proviennent d'Unsplash et sont chargées en direct.
   Deux emplacements gagneraient beaucoup à recevoir de vraies photos : le visuel
   d'`/a-propos/` et la vue d'atelier de `/particuliers/`. Une fois les photos fournies,
   les servir depuis `public/` plutôt que depuis Unsplash.
6. **Mentions légales.** SIRET, TVA et hébergeur sont marqués `à compléter`.
7. **Coordonnées.** Aucun numéro de téléphone n'est publié : en ajouter un dans
   `Nav.astro`, `Footer.astro` et le JSON-LD si vous voulez capter les appels directs.

## Contrôles effectués

- Aucun débordement horizontal à 375, 748 et 1200 px.
- Contraste : tout le texte atteint 4,5:1 en registre clair et en registre sombre.
- Un seul `h1` par page, hiérarchie de titres sans saut, images avec `alt`, `width` et
  `height`.
- Navigation au clavier : lien d'évitement, focus visible, menu mobile avec
  `aria-expanded`.
- `prefers-reduced-motion` neutralise les animations et le défilement doux.
