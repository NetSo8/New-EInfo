---
titre: Isolation de scripts & agents IA (Windows)
categorie: Outil système & Confinement runtime
annee: 2026
technologies: [Win32, C, Go, AppContainer, Job Objects, WFP]
couverture: ./accueil.png
couvertureAlt: Terminal Windows PowerShell exécutant win-sandbox, affichant l'analyse des privilèges de processus, la création d'un AppContainer avec SID dédié, les quotas Job Object et le filtrage réseau WFP
liens:
  code: https://github.com/NetSo8/win-sandbox
ordre: 1
---

Quand une équipe exécute des scripts générés par une IA ou déploie des agents autonomes sur des postes de travail Windows, ces processus s'exécutent par défaut avec les mêmes droits que l'utilisateur connecté (`MediumIL`). Ils peuvent accéder sans restriction aux fichiers personnels et professionnels, lire des variables d'environnement confidentielles, ou initier des connexions réseau sortantes vers l'extérieur.

Cet outil fournit un harnais de confinement natif pour Windows permettant d'isoler strictement l'exécution de tout script ou sous-processus sans nécessiter la lourdeur d'une machine virtuelle complète.

## Ce que fait le harnais

- **Isolation par AppContainer** : création d'un profil d'intégrité Windows éphémère avec un SID dédié (`S-1-15-2-...`). Le système de fichiers et la base de registre sont verrouillés par défaut ; seuls les dossiers explicitement autorisés sont montés en lecture ou écriture.
- **Confinement matériel via Job Objects** : encapsulation du processus dans un objet Job Win32 avec plafonnement mémoire strict (limitation du commit de travail), quota de cycles CPU et interdiction de détacher des sous-processus non supervisés (`JOB_OBJECT_LIMIT_BREAKAWAY_OK` désactivé).
- **Filtrage réseau par Windows Filtering Platform (WFP)** : injection de règles de filtrage au niveau de la couche réseau du noyau Windows (ALE) pour interdire tout trafic sortant non approuvé. L'agent peut opérer en mode déconnecté strict ou restreint à un endpoint d'API interne défini.
- **Atténuation de privilèges (Token Stripping)** : création d'un jeton restreint supprimant l'ensemble des privilèges facultatifs et assignant un niveau d'intégrité minimal (`LowIL` ou `Untrusted`).

## Architecture et performances

- **Développement natif C & Go** : communication directe avec l'API Win32 et les appels NT sans couche d'émulation ni interpréteur lourd.
- **Démarrage instantané** : initialisation du profil sandbox et attachement du Job Object en moins de 15 millisecondes, rendant le confinement transparent pour les workflows quotidiens d'analyse et de script.
- **Audit et observabilité** : traçage des tentatives d'accès aux fichiers refusées et journalisation des flux réseau bloqués pour auditer précisément le comportement du script avant toute validation.
