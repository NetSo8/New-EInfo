---
title: "Attestation d'AWS Nitro Enclaves : lire le document avant de faire confiance"
summary: "Notes de lecture sur le document d'attestation, ce qu'il prouve réellement, et ce qu'une intégration naïve laisse passer. Travail en cours."
date: 2026-07-03
status: en cours
tags: ["confidential computing", "AWS", "zero-trust", "attestation"]
readingTime: "brouillon annoté"
---

> Article en cours. Publié à l'état de notes parce que la démarche compte autant que
> la conclusion. Le banc de test n'est pas terminé.

Une enclave Nitro produit un document d'attestation signé par la racine AWS. Ce
document contient les registres de configuration de plateforme (PCR) qui mesurent
l'image exécutée. L'usage attendu : un service de gestion de clés ne libère un secret
que si l'attestation correspond à une image connue.

## Ce que l'attestation prouve

- Que le code mesuré par PCR0 s'exécute bien dans une enclave Nitro.
- Que l'instance parente ne dispose d'aucun accès interactif à la mémoire de l'enclave.
- Que le document a été produit dans la fenêtre de validité annoncée.

## Ce qu'elle ne prouve pas

- Que le code mesuré est correct. Une enclave peut exécuter fidèlement du code fautif.
- Que le canal `vsock` entre le parent et l'enclave est correctement cloisonné côté
  application.
- Que la chaîne de construction de l'image est reproductible. Sans build reproductible,
  la valeur de PCR0 n'est comparable à rien.

## Point ouvert

La validation de la chaîne de certificats renvoyée dans le document est l'endroit où
les intégrations que j'ai lues sont les plus faibles : racine codée en dur sans
rotation prévue, ou pire, vérification de signature sans contrôle de la chaîne.
Le banc de test en cours mesure ce que laissent passer trois bibliothèques clientes
courantes.

Suite quand les résultats sont reproductibles.
