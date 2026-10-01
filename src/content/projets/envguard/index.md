---
titre: envguard
categorie: Outil de sécurité open source
annee: 2026
technologies: [Go, Bubble Tea, HMAC-SHA256, gitleaks, fuzzing]
couverture: ./accueil.png
couvertureAlt: Interface d'envguard dans un terminal, avec les compteurs de requêtes, de secrets et de remplacements, et un journal où une clé Stripe est remplacée par un substitut et où une tentative d'envoi vers x.io est bloquée
liens:
  code: https://github.com/NetSo8/envguard
---
Les assistants de code par IA (Claude Code, Codex, Gemini CLI…) lisent les fichiers d'un projet, y compris les fichiers `.env` qui contiennent les clés d'accès, et envoient tout au fournisseur du modèle. envguard est un proxy local qui s'intercale : chaque clé d'API ou mot de passe est remplacé par un substitut avant de quitter la machine, puis remis à sa place dans la réponse. Le modèle travaille normalement, sans jamais voir la vraie valeur.

J'ai conçu et développé l'outil, en **Go**. Il est publié en open source, sous licence MIT.

## Ce qu'il fait

- **Détection** : environ 45 préfixes de clés connus (Anthropic, OpenAI, GitHub, AWS, Stripe…), jetons JWT, clés privées, mots de passe dans les URL, les quelque 210 règles du projet gitleaks, et les valeurs des fichiers `.env` du projet, reconnues même sans motif particulier.
- **Remplacement réversible** : le substitut est dérivé d'un HMAC-SHA256 avec une clé propre à la machine. Le même secret donne toujours le même substitut, ce qui préserve le cache de prompt des fournisseurs.
- **Streaming** : les réponses de quatre formats (Anthropic, OpenAI Chat et Responses, Gemini) sont réécrites à la volée, y compris quand un substitut arrive coupé entre deux paquets.
- **Anti-exfiltration** : dans une commande que l'agent veut exécuter, une clé n'est remise que si la destination est légitime pour elle. Un `curl` vers un site inconnu reste bloqué et signalé.
- **17 fournisseurs** pris en charge, une interface dans le terminal, et `envguard run -- claude`, qui lance l'outil derrière le proxy et s'arrête avec lui.

## Sécurité et performance

- **Audit de ma propre première version** : 8 failles trouvées et corrigées, dont deux graves (un corps de requête compressé passait sans être masqué, et une course entre requêtes simultanées pouvait laisser filer un secret). Le détail est publié dans le dépôt.
- **Tests** : une soixantaine de tests et de cibles de fuzzing, le détecteur de courses de Go, et plusieurs millions d'entrées aléatoires sans plantage.
- **Performance** : environ 0,3 ms ajoutée par requête, sans allocation mémoire sur le chemin principal. Un tour de conversation de 1,5 Mo passe de 12 ms à 0,6 ms grâce à un cache par message.

## État réel

Publié, testé sur macOS avec des flux simulés et contre les vraies API sans clé. Pas encore validé sur une vraie session d'agent avec une clé d'API : c'est la prochaine étape.
