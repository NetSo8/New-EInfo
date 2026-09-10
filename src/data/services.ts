export interface Service {
  id: string;
  n: string;
  titre: string;
  probleme: string;
  resume: string;
  pour: Array<'particulier' | 'entreprise'>;
  livrables: string[];
  delai: string;
  motscles: string;
}

export const services: Service[] = [
  {
    id: 'depannage',
    n: '01',
    titre: 'Dépannage et assistance',
    probleme: "Votre machine ne démarre plus, rame, ou fait quelque chose d'inquiétant.",
    resume:
      "Diagnostic sur place ou à distance, réparation, remise en état. Windows, macOS et Linux. Je vous dis ce qui ne va pas et ce que ça coûte avant de commencer.",
    pour: ['particulier', 'entreprise'],
    livrables: [
      'Diagnostic annoncé et chiffré avant intervention',
      'Réparation logicielle ou remplacement de pièce',
      'Récupération de données quand le support le permet',
      'Nettoyage, remise en service, transfert vers une nouvelle machine',
    ],
    delai: 'Sous 48 h',
    motscles: 'dépannage informatique Rivesaltes, réparation ordinateur Perpignan',
  },
  {
    id: 'infra',
    n: '02',
    titre: 'Infrastructure et hébergement',
    probleme: "Votre hébergement est instable, trop cher, ou personne ne sait comment il est configuré.",
    resume:
      "Serveur Linux monté proprement pour votre activité, déploiement de vos outils métiers, supervision continue avec alerte quand quelque chose sort du rail.",
    pour: ['entreprise'],
    livrables: [
      'VPS Debian ou Ubuntu configuré, documenté, reproductible',
      'Déploiement du site et des services métiers',
      'Supervision 24/7 et alertes Telegram en cas d\'incident',
      'Documentation d\'exploitation qui vous reste, y compris sans moi',
    ],
    delai: '2 à 5 jours',
    motscles: 'hébergement VPS Perpignan, administration serveur Linux Pyrénées-Orientales',
  },
  {
    id: 'securite',
    n: '03',
    titre: 'Sécurité et sauvegardes',
    probleme: "Vous voulez éviter le piratage, la perte de données et l'arrêt d'activité.",
    resume:
      "Durcissement des serveurs, des postes et des accès, sauvegardes réellement testées, traitement des incidents et remise en état.",
    pour: ['particulier', 'entreprise'],
    livrables: [
      'Audit de configuration, rapport lisible et priorisé',
      'Durcissement des accès, du pare-feu et des comptes',
      'Sauvegardes chiffrées, avec restauration testée devant vous',
      'Intervention sur incident : confinement, remise en service, rapport',
    ],
    delai: 'Incident : le jour même',
    motscles: 'sécurité informatique PME Perpignan, sauvegarde entreprise 66',
  },
  {
    id: 'web',
    n: '04',
    titre: 'Site web',
    probleme: "Votre site est lent, daté, ou tombe sans que vous sachiez pourquoi.",
    resume:
      "Création ou refonte orientée performance et référencement local, puis maintenance : mises à jour, sauvegardes, supervision de disponibilité.",
    pour: ['entreprise'],
    livrables: [
      'Site rapide, accessible, indexable, sans dépendance inutile',
      'Référencement local travaillé sur vos communes',
      'Hébergement et nom de domaine gérés de bout en bout',
      'Maintenance mensuelle : mises à jour, sauvegardes, disponibilité',
    ],
    delai: '2 à 6 semaines',
    motscles: 'création site web Perpignan, refonte site internet Rivesaltes',
  },
  {
    id: 'automatisation',
    n: '05',
    titre: 'Automatisation',
    probleme: "Vous passez du temps chaque semaine sur une tâche que la machine peut faire.",
    resume:
      "Scripts sur mesure en Python ou en shell pour les traitements répétitifs, avec journalisation et alertes pour savoir quand ça a tourné et quand ça a échoué.",
    pour: ['entreprise'],
    livrables: [
      'Script sur mesure, versionné et documenté',
      'Exécution planifiée, journalisée, supervisée',
      'Alerte immédiate en cas d\'échec, pas trois semaines après',
      'Transfert de compétence si vous voulez le reprendre',
    ],
    delai: '1 à 10 jours',
    motscles: 'automatisation Python entreprise, script métier sur mesure',
  },
];
