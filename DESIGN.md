# DESIGN.md — einformatique.fr

## Direction : « fiche d'atelier »
Référence physique : le manuel technique d'une machine industrielle, grille visible,
filets d'un pixel, numérotation en monospace, annotations en marge. L'identité
terminal existante est conservée comme *couche structurelle* (labels, prompts,
états), pas comme décor.

## Thème
Scène : un gérant de garage de 52 ans ouvre le site sur son téléphone, en plein
soleil de midi, sur un parking, parce que sa caisse n'imprime plus.
→ **Clair par défaut.** Le sombre est réservé au `/labo/` et aux blocs terminal :
scène inverse, un pair qui lit un writeup à 23 h. `body.t-nuit` remappe les jetons.

## Couleur — stratégie « Restrained »
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

    --nuit        oklch(0.208 0.028 211)   terminal, labo, bandes sombres
    --nuit-3      filets et repères, jamais du texte
    --nuit-faint  oklch(0.658 0.022 202)   texte secondaire sur nuit

    --state-warn  oklch(0.775 0.118 79)    ambre, un seul rôle : « en cours »,
                                           « à surveiller ». Pas une couleur de marque.

Règles d'emploi :
- Le rouge n'apparaît que via `.btn--cta` (et la case à cocher du formulaire).
  Un lien, un numéro de section, une puce ou un filet n'est jamais rouge.
- Les neutres sont tous teintés vers 199-211. Aucun gris pur, aucun noir pur.
- L'ambre est un état, pas un accent : badge « en cours » et lignes `warn` du terminal.

## Typographie
- **Archivo** (variable) : titres en 700/800, tracking serré. Corps en 400/500.
- **Spline Sans Mono** : labels, numérotation, terminal, métadonnées.
- Échelle fluide en clamp(), ratio ≥ 1.3. Corps limité à 68ch, articles à 72ch.
- Plancher de taille : 10,5 px, sauf annotations de schéma.

## Structure
Grille de 12 colonnes, gouttière 24px. Filets pleine largeur (1px, ink/14 %).
Sections numérotées `§ 01`. Pas de cartes par réflexe : les listes de services,
de preuves et de réalisations sont des **lignes réglées**.
Rayons : `--r-sm` 3px (badges), `--r-md` 5px (boutons, champs), `--r-lg` 7px
(terminal, blocs de code). Tout le reste est à angle vif.

## Motion
Sobre. Révélation au scroll sur une bande par page, curseur du terminal,
transitions 180ms `cubic-bezier(0.22, 1, 0.36, 1)`. Le CTA descend de 2px au survol
et prend une ombre courte ; il revient à plat au clic.
`prefers-reduced-motion` neutralise tout.

## Interdits
Dégradé sur texte, glassmorphisme, bordure latérale colorée, grille de cartes
identiques, tirets cadratins dans la copie, icônes arrondies au-dessus de chaque
titre, rouge ailleurs que sur un appel à l'action.
