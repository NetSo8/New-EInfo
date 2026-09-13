# einformatique.fr

Site vitrine d'E Informatique (Elian, technicien réseau et sécurité freelance à
Rivesaltes, 66). Astro 7, aucun framework client, sortie 100 % statique.

```bash
npm install
npm run dev            # http://localhost:4321
npm run build          # ./dist, puis contrôles RGPD et accessibilité
npm run preview
npm run check:privacy  # contrôle seul, sur un ./dist déjà construit
npm run check:a11y     # idem
```

## Règle non négociable : rien ne sort de l'hébergement

Consulter ce site ne doit adresser **aucune requête à un serveur tiers**. C'est ce qui
permet d'affirmer dans les mentions légales qu'aucune adresse IP de visiteur n'est
transmise à qui que ce soit d'autre que l'hébergeur, sans bandeau de consentement.

Concrètement :

- **Polices** dans `public/fonts/` (woff2), déclarées en `@font-face` en tête de
  `src/styles/app.css`. Ni Google Fonts ni Fontshare, ni aucun autre CDN.
- **Images** dans `src/assets/`, passées par `astro:assets` : conversion webp,
  redimensionnement et `srcset` au build. Jamais de hotlink.
- **Icônes** via `@lucide/astro`, rendues en SVG inline au build : zéro JavaScript
  client, zéro requête.
- **Aucun** outil de mesure d'audience, bouton social, iframe, police d'icônes ou
  script tiers, quel qu'en soit le prétexte.

`npm run build` échoue si une ressource externe réapparaît : `scripts/check-no-third-party.mjs`
relit `dist/` et refuse tout `src`, `href`, `srcset` ou `url()` pointant hors du domaine.
Les liens `<a>` sortants restent autorisés — ils ne partent que sur un clic volontaire —
et portent `rel="noopener noreferrer"` pour ne pas transmettre la page d'origine.

Le seul état conservé côté visiteur est la préférence de thème clair/sombre, dans
`localStorage`. Elle ne quitte jamais l'appareil : préférence strictement nécessaire,
exemptée de consentement.

## Accessibilité

Objectif : WCAG 2.2 niveau AA, vérifié plutôt que déclaré. Les points qui coûtent cher
à réparer après coup, et qu'il ne faut donc pas casser :

- **Jamais d'information portée par la seule couleur.** Les lignes du `Terminal`
  portent un signe (`+`, `!`) en plus de leur teinte, les liens dans un paragraphe sont
  soulignés, un état se double toujours d'un mot. C'est ce qui rend le site lisible
  pour un daltonien.
- **Contrastes calculés, pas estimés.** Toutes les associations texte/fond dépassent
  4,5:1 dans les deux registres, la plupart 7:1. Avant de changer un jeton de couleur,
  refaire le calcul — l'œil se trompe, surtout sur fond sombre.
- **Tout est atteignable au clavier**, avec un focus visible en permanence. Échap ferme
  le menu mobile et rend le focus au bouton. `scroll-padding-top` empêche l'en-tête
  collant de recouvrir la cible qu'on vient d'atteindre.
- **Zones cliquables d'au moins 24 px**, y compris les petits liens de pied de page :
  un pointeur imprécis ne vise pas une ligne de 17 px de haut.
- **Le mouvement s'arrête.** Les fonds bouclent sans fin : le réglage système est
  respecté et un bouton de pied de page le fait aussi (`data-motion` sur `<html>`).
- **`prefers-contrast: more`** sert une variante à bords francs. Ce mode doit être
  traité dans les *deux* registres : un renfort écrit pour le registre clair peint des
  filets sombres sur un fond sombre.

`npm run build` échoue si une page perd son `lang`, saute un niveau de titre, présente
deux `h1`, contient une image sans `alt` ou un bouton sans nom accessible
(`scripts/check-a11y.mjs`). Ce contrôle attrape les régressions grossières, pas tout :
pour une vérification sérieuse, passer axe-core sur les pages construites et parcourir
le site au clavier.

## Ce que le site doit faire

Deux audiences, deux parcours, une seule marque :

| Parcours | Entrée | Page | CTA |
| --- | --- | --- | --- |
| Particulier | porte gauche de l'accueil | `/particuliers/` | « Décrire mon problème » |
| Entreprise | porte droite de l'accueil | `/professionnels/` | « Demander un diagnostic » |

## Arborescence

```
/                     accueil, double aiguillage dès le premier écran
/particuliers/        dépannage, méthode de chiffrage, FAQ, ton simple
/professionnels/      formules, périmètre, audit approfondi
/services/            les 3 prestations en détail (ancres #depannage, #reseau, #web)
/portfolio/           missions livrées (clair) + recherche en cours (sombre)
/blog/                contenu grand public
/blog/<slug>/         article
/a-propos/            profil, méthode, trajectoire annoncée sans la survendre
/contact/             adresse e-mail directe, sans formulaire ni intermédiaire
/mentions-legales/    SIRET et TVA à compléter
404                   page d'erreur
/about/ → /a-propos/  redirection depuis l'ancienne URL
```

## Système de design

Voir `DESIGN.md` (direction, palette, typographie) et `PRODUCT.md` (audiences, voix).
En résumé :

- **Un seul rouge.** `#92122A` réservé aux appels à l'action ; l'accent structurel
  (liens, numéros de section, filets actifs) est la même teinte désaturée. Jetons OKLCH
  dans `@theme`, en tête de `src/styles/app.css`.
- **Clair par défaut, sombre par bandes.** Les sections `.on-nuit` remappent les jetons
  localement ; `--color-fixed-paper` / `--color-fixed-nuit` ne s'inversent jamais.
  Le mode sombre redéfinit les variables, aucun `dark:` n'est écrit dans le markup.
- **Grille visible.** Filets d'un pixel, sections numérotées `§ 01`, listes réglées
  plutôt que grilles de cartes.
- **Deux familles.** Satoshi (titres et corps), Spline Sans Mono (étiquettes, terminal,
  métadonnées). Servies localement, cf. plus haut.

Composants dans `src/components/` : `Nav`, `Footer`, `PageHead`, `SectionHead`,
`Terminal`, `ChainDiagram`, `ZoneRadar`, `ProjectCard`, `CtaBand`, `Faq`, plus trois
fonds décoratifs générés au build (`HeroNetworkBg`, `CryptoCrackBg`, `WorldMapBg`).
Ces fonds tirent leur aléa de `mulberry32` (`src/lib/random.ts`) : à graine égale, le
rendu est identique d'un build à l'autre.

`ZoneRadar` place les communes selon leur **distance et leur relèvement réels** depuis
Rivesaltes : modifier le tableau `pts` en tête du composant pour ajuster la zone.

## Contenu

- `src/content/blog/*.md` : `title`, `summary`, `date`,
  `audience` (`particulier` | `entreprise` | `tous`), `tags`. Schéma dans
  `src/content.config.ts`.
- Prestations et réalisations en données typées : `src/data/services.ts` et
  `src/data/portfolio.ts`.

## SEO

- JSON-LD `LocalBusiness` sur toutes les pages (`src/layouts/Base.astro`), `ItemList`
  de `Service` sur `/services/`, `FAQPage` sur les FAQ, `BlogPosting` sur les articles.
- `sitemap-index.xml` généré, `robots.txt` dans `public/`.
- Le champ `motscles` de `src/data/services.ts` est une **référence rédactionnelle** :
  ces termes doivent se retrouver dans les textes visibles. Ne jamais les réinjecter
  dans une balise masquée, c'est du texte caché aux yeux des moteurs.

## À compléter avant mise en ligne

1. **Mentions légales.** SIRET et TVA sont marqués `à compléter`. L'hébergeur déclaré
   est OVH : à corriger si ce n'est plus le cas.
2. **Réalisations.** Les cinq entrées de `src/data/portfolio.ts` sont des exemples
   plausibles, à remplacer par les vraies missions et les vrais chiffres.
3. **Articles.** Les trois articles servent à montrer la forme et le ton.
4. **Photographies.** Les cinq images de `src/assets/` viennent d'Unsplash (licence
   Unsplash). Deux emplacements gagneraient à recevoir de vraies photos : le visuel
   d'`/a-propos/` et la vue d'atelier de `/particuliers/`. Remplacer le fichier dans
   `src/assets/` suffit, le pipeline s'occupe du reste.
5. **Coordonnées.** Aucun numéro de téléphone n'est publié : en ajouter un dans
   `Nav.astro`, `Footer.astro` et le JSON-LD pour capter les appels directs.

## Contrôles effectués

- Aucune ressource tierce, vérifié automatiquement à chaque build.
- axe-core (WCAG 2.0/2.1/2.2 A et AA + bonnes pratiques) sur les 13 pages, dans les
  deux registres : aucune violation.
- Reflow à 320 px et espacement de texte forcé (WCAG 1.4.12) : aucun débordement ni
  chevauchement sur aucune page.
- Contrastes recalculés jeton par jeton, registres clair et sombre.
- Parcours clavier complet : aucune cible masquée par l'en-tête collant, menu mobile
  refermable à Échap avec restitution du focus.
- Cibles de pointage : toutes au-dessus de 24 × 24 px.
