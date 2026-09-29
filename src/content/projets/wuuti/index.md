---
titre: Wuuti
categorie: Application mobile, back-end et landing page
annee: 2026
technologies: [Go, PostgreSQL, River, OpenAPI, Docker, Caddy, Cloudflare R2, Firebase Cloud Messaging, GitHub Actions, HTML/CSS/JS]
couverture: ./accueil.png
couvertureAlt: Landing page de Wuuti, sur fond sombre, avec le titre « Shoote la soirée. Découvre-la demain. » et un téléphone affichant le compte à rebours de deux minutes
captures:
  - src: ./rituel.png
    alt: Section « Tu shootes. Tu ne vois rien. » de la landing page, avec un téléphone affichant l'écran « Tu es aveugle. C'est voulu. »
ordre: 1
liens:
  site: https://wuuti.fr
---
Wuuti est une application photo de soirée, à l'aveugle : l'esprit de l'appareil photo jetable. Chaque invité reçoit ses notifications à un moment différent, dispose de deux minutes pour prendre une photo brute, et personne ne voit rien avant l'ouverture du coffre, le lendemain.

J'ai conçu et développé **le back-end de l'application** et **la landing page** que vous voyez ci-dessus.

## Le back-end

Une API REST en **Go**, environ 20 000 lignes et plus de 220 tests automatisés, qui gère le cycle de vie complet d'un événement : création, adhésion, dépôt des photos, album, likes et commentaires, signalements, purge.

- **Un planificateur par événement.** Chaque événement en cours a son propre planning de notifications, indépendant pour chaque membre : un événement de 500 personnes n'envoie jamais 500 notifications au même instant. L'état d'un membre se calcule à la demande à partir de l'horloge, et une boucle de fond ne fait que déclencher les effets (notification, fenêtre manquée) ; les événements sont relancés automatiquement après un redémarrage.
- **PostgreSQL 16** avec pgx et des migrations SQL versionnées, identifiants UUID v7.
- **Jobs de fond avec River**, persistés dans PostgreSQL : purge des photos au bout de 30 jours (base de données et fichiers), réencodage des images.
- **Photos sur Cloudflare R2** (compatible S3), réencodées en WebP côté serveur avec libvips.
- **Notifications push** via Firebase Cloud Messaging.
- **Modération automatique** des textes et des photos par l'API de modération d'OpenAI, avec signalement par les utilisateurs.
- **Authentification** : mot de passe (Argon2), jetons JWT et jetons de rafraîchissement, connexion Google et Apple, passkeys (WebAuthn).
- **Sécurité :** limitation de débit, détection de la vraie IP du client derrière le proxy, en-têtes de sécurité, CORS configurable. Les analyses `gosec` et `govulncheck` tournent à chaque push.
- **Contrat d'API documenté en OpenAPI**, avec une page Swagger UI et un format d'erreur unique.
- **Back-office d'administration** rendu côté serveur (modèles HTML et htmx), sans framework front : suivi de l'activité, utilisateurs, signalements, stockage.
- **Déploiement :** image Docker de production minimale (utilisateur non-root, sonde de santé intégrée), stack Docker Compose derrière Caddy (HTTPS automatique) sur un VPS, ou sur Render, avec intégration continue GitHub Actions.

## La landing page

Un site statique en HTML, CSS et JavaScript, sans framework, pensé pour être rapide et bien référencé : images WebP, fichier `llms.txt` pour les moteurs de réponse IA, données structurées et pages légales.
