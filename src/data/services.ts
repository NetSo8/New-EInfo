export interface Service {
  id: string;
  n: string;
  titre: string;
  probleme: string;
  resume: string;
  pour: Array<'particulier' | 'entreprise'>;
  livrables: string[];
  /** Requêtes visées par la prestation. Référence rédactionnelle : ces termes
   *  doivent se retrouver dans les textes visibles, jamais injectés en clair
   *  dans une balise masquée. */
  motscles: string;
}

export const services: Service[] = [
  {
    id: 'depannage',
    n: '01',
    titre: 'Dépannage et assistance',
    probleme: "Votre machine ne démarre plus, rame, ou fait quelque chose d'inquiétant.",
    resume:
      "Le métier de base : technicien informatique. Diagnostic sur place ou à distance, réparation matérielle et logicielle, remise en état. Windows, macOS et Linux. Je vous dis ce qui ne va pas et ce que ça coûte avant de commencer.",
    pour: ['particulier', 'entreprise'],
    livrables: [
      'Diagnostic annoncé et chiffré avant intervention',
      'Réparation logicielle ou remplacement de pièce',
      'Récupération de données quand le support le permet',
      'Nettoyage, remise en service, transfert vers une nouvelle machine',
      'Sauvegarde mise en place et restauration testée devant vous',
    ],
    motscles: 'dépannage informatique Rivesaltes, technicien informatique Perpignan, réparation ordinateur 66',
  },
  {
    id: 'reseau',
    n: '02',
    titre: 'Réseau et sécurité',
    probleme: "Le wifi lâche, l'accès distant est une porte ouverte, et personne ne sait comment le réseau est câblé.",
    resume:
      "C'est mon cœur de métier et le seul chantier que je revendique comme une spécialité. Remise à plat du réseau local et de tout ce qui décide de sa sécurité : plan d'adressage, segmentation, pare-feu, accès distant chiffré, wifi mesuré, sauvegardes testées. Quand l'outil du marché ne convient pas, je code le mien : applications de supervision, utilitaires réseau sur mesure.",
    pour: ['particulier', 'entreprise'],
    livrables: [
      "Plan d'adressage et schéma réseau à jour, remis par écrit",
      'Segmentation VLAN : postes, caisses, wifi invités, équipements isolés',
      'Pare-feu et règles de filtrage documentées, entrantes et sortantes',
      'Accès distant par VPN chiffré, à la place du RDP exposé sur internet',
      'Couverture wifi mesurée sur site, bornes placées sur relevé et non au hasard',
      'Durcissement des accès et des comptes, sauvegardes chiffrées et restauration testée',
      'Supervision continue et alerte quand quelque chose sort du rail',
    ],
    motscles:
      'technicien réseau et sécurité Perpignan, configuration VLAN pare-feu Pyrénées-Orientales, VPN télétravail TPE 66, sécurisation réseau entreprise Rivesaltes',
  },
  {
    id: 'web',
    n: '03',
    titre: 'Site web : création et maintenance',
    probleme: "Votre site est lent, daté, ou tombe sans que vous sachiez pourquoi.",
    resume:
      "Création ou refonte orientée performance et référencement local, puis maintenance dans la durée : mises à jour, sauvegardes, correctifs de sécurité, supervision de disponibilité. L'hébergement va avec, et il est tenu par la même personne que le réseau.",
    pour: ['entreprise'],
    livrables: [
      'Site rapide, accessible, indexable, sans dépendance inutile',
      'Référencement local travaillé sur vos communes',
      'Hébergement et nom de domaine gérés de bout en bout',
      'Serveur ou VPS Linux configuré, durci et documenté pour le faire tourner',
      'Maintenance mensuelle : mises à jour, sauvegardes, correctifs, disponibilité',
    ],
    motscles: 'création site web Perpignan, maintenance site internet Rivesaltes, refonte site vitrine 66',
  },
];
