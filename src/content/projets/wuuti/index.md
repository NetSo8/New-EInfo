---
titre: Wuuti
categorie: Application mobile, back-end et landing page
annee: 2026
technologies: [C#, .NET 10, Native AOT, ASP.NET Core, PostgreSQL, Cloudflare R2, Docker, Caddy, OpenAPI, Passkeys, HTML/CSS/JS]
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

J'ai conçu et développé **le back-end de l'application** (WuutiCore) et **la landing page** que vous voyez ci-dessus.

## Le back-end (WuutiCore)

Une API REST en **C# (.NET 10)** compilée en **Native AOT** (binaire 100% natif sans machine virtuelle JIT, démarrage instantané et empreinte mémoire sous les 30 Mo de RAM), totalisant environ 13 000 lignes de code et 58 tests automatisés. Elle gère le cycle de vie complet d'un événement : création, adhésion, invitations, dépôt des photos, album, likes et commentaires, signalements et purge.

- **Un planificateur par événement.** Chaque événement en cours a son propre planning de notifications, indépendant pour chaque membre : un événement de 500 personnes n'envoie jamais 500 notifications au même instant. L'état d'un membre se calcule à la demande à partir de l'horloge, et une boucle de fond déclenche les effets (notification, fenêtre manquée) ; reprise automatique des événements actifs après un redémarrage.
- **PostgreSQL** avec le pilote haute performance `Npgsql` en requêtes directes SQL (sans ORM pour préserver les performances et la compatibilité AOT), migrations SQL embarquées dans le binaire et identifiants UUID v7 natifs.
- **Tâche de rétention en arrière-plan** (`IHostedService`) : purge automatique des photos et données expirées au bout de 30 jours (base de données et Cloudflare R2).
- **Photos sur Cloudflare R2** (compatible S3) avec URLs présignées et réencodage WebP haute performance côté serveur via P/Invoke direct avec **libvips**.
- **Notifications push** multi-plateformes via Firebase Cloud Messaging (FCM) et Apple Push Notification service (APNs en HTTP/2 direct).
- **Achats in-app (IAP)** : validation des abonnements et achats Apple StoreKit Server API avec vérification cryptographique des signatures JWS.
- **Modération automatique** des textes et des photos par l'API de modération d'OpenAI, doublée des signalements d'utilisateurs et rapports de bugs.
- **Authentification complète** : mot de passe haché en Argon2id, jetons JWT et jetons de rafraîchissement révocables, connexion Google et Apple, et support complet des **Passkeys (WebAuthn / FIDO2)** sans mot de passe.
- **Sécurité et robustesse HTTP :** limitation de débit par IP/compte, détection de la vraie IP derrière proxy de confiance, en-têtes de sécurité stricts et CORS configurable.
- **Contrat d'API documenté en OpenAPI**, avec interface Swagger UI intégrée et format d'erreur unique.
- **Déploiement minimaliste :** image Docker multi-stage Debian slim sans SDK ni runtime .NET installé (seul le binaire natif compilé AOT et libvips sont embarqués), utilisateur non-root dédié (`wuuti`), auto-sonde de santé intégrée (`wuuticore healthcheck`), stack Docker Compose derrière Caddy (HTTPS automatique).

## La landing page

Un site statique en HTML, CSS et JavaScript, sans framework, pensé pour être rapide et bien référencé : images WebP, fichier `llms.txt` pour les moteurs de réponse IA, données structurées et pages légales.
