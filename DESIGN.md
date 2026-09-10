# DESIGN.md — einformatique.fr

## Direction : « Fiche d'atelier catalane »
Référence physique : le manuel technique d'une machine industrielle française des
années 80, imprimé sur papier chaux, annoté au stylo grenat. Grille visible, filets
d'un pixel, numérotation en monospace, annotations en marge. L'identité terminal
existante est conservée comme *couche structurelle* (labels, prompts, états), pas
comme décor.

## Thème
Scène : un gérant de garage de 52 ans ouvre le site sur son téléphone, en plein
soleil de midi, sur un parking, parce que sa caisse n'imprime plus.
→ **Clair par défaut.** Le sombre est réservé au /labo/ et aux blocs terminal :
scène inverse, un pair qui lit un writeup à 23 h.

## Couleur — stratégie « Committed », le grenat porte la marque
Ancrage local assumé : grenat de Perpignan et jaune catalan, jamais le bleu IT.

    --paper    oklch(0.968 0.011 78)   chaux chaude, fond
    --sand     oklch(0.935 0.017 76)   bandes, fonds secondaires
    --ink      oklch(0.235 0.021 45)   texte principal, brun-noir
    --ink-soft oklch(0.455 0.020 55)   texte secondaire
    --grenat   oklch(0.478 0.176 22)   signature, liens, CTA
    --or       oklch(0.780 0.150 76)   accent rare, soulignements
    --nuit     oklch(0.198 0.022 40)   terminal, /labo/
    --jade     oklch(0.700 0.140 150)  états OK dans le terminal uniquement

## Typographie
- **Archivo** (variable) : titres en 700/800, tracking serré, tailles hautes.
  Corps en 400/500. Une seule famille, contraste de graisse assumé.
- **Spline Sans Mono** : labels, numérotation de section, terminal, métadonnées.
- Échelle fluide en clamp(), ratio ≥ 1.3. Corps limité à 68ch.

## Structure
Grille de 12 colonnes visible, gouttière 24px. Filets pleine largeur
(1px, ink/14%) pour séparer les sections. Sections numérotées `§ 01`.
Pas de cartes par réflexe : les services sont des **lignes de tableau réglé**.

## Motion
Sobre. Révélation au scroll sur une seule bande, curseur clignotant du terminal,
transitions 180ms ease-out-quart. `prefers-reduced-motion` respecté partout.

## Interdits
Dégradé sur texte, glassmorphisme, bordure latérale colorée, grille de cartes
identiques, tirets cadratins dans la copie, icônes arrondies au-dessus de chaque titre.
