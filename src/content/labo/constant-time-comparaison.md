---
title: "Comparaison en temps constant : pourquoi l'égalité naïve fuit vos secrets"
summary: "Un canal auxiliaire temporel se mesure sur un réseau local ordinaire. Démonstration en C, mesures à l'appui, et la primitive correcte."
date: 2026-04-27
status: publié
tags: ["crypto", "C", "canaux auxiliaires"]
readingTime: "12 min"
repo: "https://github.com/NetSo8"
---

La comparaison de deux tampons secrets avec `memcmp` s'arrête au premier octet qui
diffère. Cette sortie anticipée est une information : elle indique combien d'octets
de tête sont corrects.

## Le problème

```c
/* Vulnérable : la durée dépend du contenu. */
int verifier(const uint8_t *recu, const uint8_t *attendu, size_t n) {
    return memcmp(recu, attendu, n) == 0;
}
```

Face à un attaquant capable de rejouer la requête, la durée d'exécution devient un
oracle : on retrouve un jeton de 32 octets en 32 × 256 requêtes au lieu de 256³².

## La mesure

Sur une boucle de vérification d'authentifiant HMAC, 200 000 mesures par valeur
d'octet candidate, machine locale, `clock_gettime(CLOCK_MONOTONIC)` :

- écart médian entre un préfixe correct et un préfixe faux : environ 41 ns
- écart-type du bruit de mesure : environ 300 ns

Le signal est sous le bruit sur une mesure isolée, et parfaitement séparable après
agrégation. C'est précisément ce qui rend ce type de faille durable : elle ne se voit
pas en test unitaire.

## La primitive correcte

```c
/* Temps constant : toutes les positions sont lues, aucune branche sur le secret. */
int verifier_ct(const uint8_t *a, const uint8_t *b, size_t n) {
    uint8_t diff = 0;
    for (size_t i = 0; i < n; i++) diff |= (uint8_t)(a[i] ^ b[i]);
    return (1 & ((diff - 1) >> 8)) - 1 == 0;
}
```

Trois règles tiennent l'essentiel : aucun branchement conditionné par un secret,
aucun indice de tableau dérivé d'un secret, aucune division dont un opérande est
secret.

## Le piège du compilateur

Écrire du code en temps constant ne suffit pas : le compilateur peut réintroduire
une branche. `-O2` sur GCC 14 transforme certaines boucles de ce type en `memcmp`
vectorisé avec sortie anticipée. La vérification se fait sur l'assembleur produit,
pas sur le source.

En production, on utilise la primitive de la bibliothèque : `CRYPTO_memcmp` d'OpenSSL
ou `sodium_memcmp`. Cet article sert à comprendre ce qu'elles font, pas à les
remplacer.
