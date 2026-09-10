---
title: "Accès à distance en TPE : ce qui est raisonnable et ce qui ne l'est pas"
summary: "Ouvrir le bureau à distance sur internet reste l'erreur la plus fréquente que je corrige chez les petites entreprises. Les alternatives, avec leurs coûts réels."
date: 2026-06-24
audience: entreprise
tags: ["sécurité", "réseau", "TPE"]
---

Le scénario revient toujours dans les mêmes termes : le comptable doit accéder au
logiciel de gestion depuis chez lui, quelqu'un a ouvert le port 3389 sur la box, et
ça marche. Ça marche très bien, y compris pour les autres.

## Pourquoi le bureau à distance exposé est un problème

Un port de bureau à distance ouvert sur internet est scanné en continu. Il n'a pas
besoin d'être connu : il est trouvé automatiquement, en quelques minutes. À partir
de là, une seule chose protège l'entreprise, le mot de passe d'un compte Windows.
C'est mince pour couvrir la comptabilité, les devis et le fichier clients.

## Les trois options qui tiennent

**Un VPN sur la box ou sur un petit routeur.** Le poste distant entre d'abord dans
le réseau, puis accède au serveur. Coût : quelques heures de mise en place, zéro
abonnement si le matériel le permet déjà. C'est la solution que je recommande par
défaut en dessous de dix postes.

**Un accès applicatif publié proprement**, derrière une authentification à deux
facteurs, quand l'éditeur du logiciel métier le propose. Plus simple pour
l'utilisateur, mais dépend entièrement du sérieux de l'éditeur.

**Un hébergement du logiciel métier sur un serveur dédié**, avec accès chiffré et
journalisé. C'est le plus solide, et c'est aussi le plus cher. Justifié à partir du
moment où l'activité s'arrête si le logiciel s'arrête.

## Le point qu'on oublie

Quelle que soit l'option, il faut savoir qui s'est connecté, quand, et depuis où.
Sans journalisation, un accès distant compromis reste invisible pendant des mois.
La mise en place prend une demi-journée et vaut plus que la moitié des logiciels de
sécurité vendus aux petites structures.
