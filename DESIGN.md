# DESIGN.md : einformatique.fr

## Direction : « fiche d'atelier »
Référence physique : le manuel technique d'une machine industrielle, grille visible,
filets d'un pixel, numérotation en monospace, annotations en marge. L'identité
terminal existante est conservée comme *couche structurelle* (labels, prompts,
états), pas comme décor.

## Thème
Scène : un gérant de garage de 52 ans ouvre le site sur son téléphone, en plein
soleil de midi, sur un parking, parce que sa caisse n'imprime plus.
→ **Clair par défaut.** Le sombre est réservé aux blocs terminal et aux bandes
`on-nuit` (recherche, CTA), qui remappent les jetons localement.

## Couleur : stratégie « Restrained »
**Un seul rouge, #92122A, et il ne sert qu'aux appels à l'action.**
Tout le reste est construit sur son **complémentaire en OKLCH** : la teinte 19 du
rouge devient la teinte 199, un pétrole froid décliné du presque-blanc au
presque-noir. Conséquence recherchée : sur n'importe quelle page, le bouton est le
seul objet saturé, donc le seul point que l'œil accroche.

    --cta         #92122a               action, rien d'autre
    --cta-hi      oklch(0.492 0.168 20) survol
    --cta-glow    ombre portée au survol, 26 % d'opacité

    --paper       oklch(0.978 0.0045 199)  fond
    --paper-warm  oklch(0.961 0.0075 200)  bandes alternées
    --sand        oklch(0.938 0.012 201)   porte particulier
    --ink         oklch(0.245 0.026 209)   texte
    --ink-soft    oklch(0.468 0.026 205)   texte secondaire
    --ink-faint   oklch(0.518 0.024 204)   étiquettes (plancher 4,5:1)

    --accent      oklch(0.455 0.090 210)   numéros de §, puces, liens, filets actifs
    --accent-hi   oklch(0.535 0.095 208)
    --accent-nuit oklch(0.755 0.090 202)   le même, posé sur fond nuit
    --accent-wash 7,5 % : fond de survol des lignes

    --nuit        oklch(0.208 0.028 211)   terminal, bandes sombres
    --nuit-3      filets et repères, jamais du texte
    --nuit-faint  oklch(0.658 0.022 202)   texte secondaire sur nuit

    --state-warn  oklch(0.775 0.118 79)    ambre, un seul rôle : « en cours »,
                                           « à surveiller ». Pas une couleur de marque.

Règles d'emploi :
- Le rouge n'apparaît que via `.btn--cta`.
  Un lien, un numéro de section, une puce ou un filet n'est jamais rouge.
- Les neutres sont tous teintés vers 199-211. Aucun gris pur, aucun noir pur.
- L'ambre est un état, pas un accent : badge « en cours » et lignes `warn` du terminal.

## Typographie
- **Satoshi** : titres en 700/900, tracking serré. Corps en 400/500.
- **Spline Sans Mono** : labels, numérotation, terminal, métadonnées.
- Les deux familles sont servies depuis `public/fonts/`, jamais depuis un CDN :
  cf. la règle « rien ne sort de l'hébergement » du README.
- Échelle fluide en clamp(), ratio ≥ 1.3. Corps limité à 68ch, articles à 72ch.
- Plancher de taille : 10,5 px, sauf annotations de schéma.

## Structure
Grille de 12 colonnes, gouttière 24px. Filets pleine largeur (1px, ink/14 %).
Sections numérotées `§ 01`. Pas de cartes par réflexe : les listes de services,
de preuves et de réalisations sont des **lignes réglées**.
Rayons : `--radius-sm` 3px (badges), `--radius-md` 5px (boutons), `--radius-lg` 7px
(terminal, blocs de code). Tout le reste est à angle vif.

## Élévation
Les boutons et les commandes d'interface sont des **objets posés sur la page**, pas
des rectangles détourés. Une bordure seule donne le dessin d'un bouton sans sa
matière : c'est ce qui fait « gabarit » plutôt que produit.

Trois ingrédients, toujours ensemble :
- **Une surface pleine.** `--color-raised` est le cran au-dessus de `paper` (et de
  `nuit` en registre sombre). Jamais de fond transparent : une ombre a besoin de
  quelque chose à porter.
- **Deux couches d'ombre.** Une ombre de contact très serrée (1-2 px) qui pose la
  pièce, une ombre d'ambiance large et diffuse qui lui donne son volume. Une seule
  couche large produit un halo décoratif ; c'est le contact qui fait croire à l'objet.
  Teinte 200°, jamais du noir pur.
- **Une arête supérieure éclairée** (`--gloss-top`, en `inset`), qui donne l'épaisseur
  sur les boutons pleins. En registre sombre, l'ombre ne se voit plus : c'est l'arête
  et la surface remontée qui font tout le relief.

Le liseré ne disparaît pas, il change de rôle : il ne dessine plus la forme, il retient
le bord là où le fond du bouton et celui de la page se ressemblent (`--color-rule`).

Au survol, la pièce se lève : `translateY(-2px)` **et** l'ombre qui grandit. La
translation seule glisse sans convaincre. À l'appui, l'ombre s'écrase au lieu de
disparaître, sinon le bouton semble s'éteindre plutôt que s'enfoncer.

Le CTA porte son rouge jusque dans son ombre : une ombre grise sous une pièce colorée
la fait flotter au lieu de la poser.

Variables de variante : `--btn-bg`, `--btn-fg`, `--btn-edge`, `--btn-gloss`. Tout le
reste est commun à `.btn`.

## Accessibilité, côté design
Trois règles qui contraignent les choix visuels, pas des vérifications de fin de projet.

- **La couleur ne porte jamais seule une information.** Un état se lit aussi sans elle :
  les lignes du terminal portent `+` ou `!`, les liens d'un paragraphe sont soulignés,
  les badges disent « Livré » ou « Recherche en cours » en toutes lettres. Le registre
  monochrome aide ici : il reste peu de place pour coder par la teinte.
- **Tout contraste se calcule.** Les jetons sont pensés en OKLCH, dont la clarté est
  perceptuelle, ce qui aide — mais une clarté de 0,66 sur 0,32 ne fait pas 4,5:1 pour
  autant. Le seuil se vérifie, dans les deux registres, avant de retenir une valeur.
- **Le mouvement est une option.** Les fonds animés sont décoratifs par construction :
  rien de ce qu'ils montrent n'est nécessaire à la compréhension, et ils s'arrêtent
  tous sur `prefers-reduced-motion` ou sur l'interrupteur du pied de page.

Le registre par défaut assume ses nuances fines (liserés à 14 % d'encre, ombres douces).
C'est `prefers-contrast: more` qui sert la version à bords francs, plutôt que d'aplatir
le design pour tout le monde.

## Motion
Sobre. Révélation au scroll sur une bande par page, curseur du terminal,
transitions 180ms `cubic-bezier(0.22, 1, 0.36, 1)`. Le CTA descend de 2px au survol
et prend une ombre courte ; il revient à plat au clic.
`prefers-reduced-motion` neutralise tout.

## Interdits
Dégradé sur texte, glassmorphisme, bordure latérale colorée, grille de cartes
identiques, tirets cadratins dans la copie, icônes arrondies au-dessus de chaque
titre, rouge ailleurs que sur un appel à l'action.
