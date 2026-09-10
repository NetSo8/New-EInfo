---
title: "Durcir un VPS Debian en 40 minutes : ce qui compte vraiment"
summary: "Fail2ban n'est pas une politique de sécurité. Revue des mesures qui réduisent réellement la surface d'attaque d'un VPS exposé, mesurées sur trois mois de journaux."
date: 2026-02-11
status: publié
tags: ["linux", "hardening", "ssh"]
readingTime: "9 min"
---

Un VPS neuf chez n'importe quel hébergeur reçoit sa première tentative
d'authentification SSH en moins de dix minutes. La question n'est donc pas de savoir
si la machine sera attaquée, mais quelles mesures déplacent réellement l'aiguille.

## Ce que trois mois de journaux montrent

Sur un VPS Debian 13 exposé, port 22 par défaut, j'ai laissé tourner la collecte
pendant 92 jours. Répartition des tentatives :

| Vecteur | Tentatives | Réussites |
| --- | --- | --- |
| SSH mot de passe | 418 000 | 0 |
| SSH clé inconnue | 1 240 | 0 |
| HTTP, chemins d'admin | 96 400 | 0 |
| Scan de ports | continu | n/a |

Le volume est impressionnant, l'enseignement l'est moins : la quasi-totalité de ce
bruit disparaît avec deux réglages qui prennent trois minutes.

## L'ordre des priorités

1. **Authentification par clé uniquement.** `PasswordAuthentication no` supprime
   d'un coup 99,7 % des tentatives observées. Tout le reste est secondaire.
2. **Pas de root en direct.** Un compte de service, `sudo`, et la journalisation
   qui va avec.
3. **Pare-feu en liste blanche.** `nftables` en politique `drop` par défaut. On
   ouvre ce qui sert, rien d'autre.
4. **Mises à jour de sécurité automatiques.** `unattended-upgrades` sur les seuls
   dépôts de sécurité, redémarrage planifié annoncé.
5. **Sauvegardes testées.** Une sauvegarde jamais restaurée n'est pas une sauvegarde.

## Ce que je ne fais plus

Changer le port SSH. La mesure réduit le bruit dans les journaux, pas le risque :
un scan complet prend quelques secondes. Elle coûte de la lisibilité opérationnelle
et fait croire à une protection qui n'existe pas.

## Vérification

Le durcissement ne vaut que s'il est vérifiable. Je termine toujours par un contrôle
externe des ports ouverts depuis une autre machine, une tentative d'authentification
par mot de passe qui doit échouer, et une restauration réelle de la sauvegarde la
plus récente dans une machine jetable.
