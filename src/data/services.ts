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

/** Page de référence d'une prestation : chaque prestation n'est détaillée
 *  qu'à un seul endroit, la page de son public. Deux pages qui décrivent
 *  la même chose se disputent la même recherche Google (cannibalisation). */
export const lienService = (s: Service) =>
  `${s.pour.includes('particulier') ? '/particuliers/' : '/professionnels/'}#${s.id}`;

export const services: Service[] = [
  {
    id: 'depannage',
    n: '01',
    titre: 'Dépannage & Entretien Informatique',
    probleme:
      'Votre ordinateur rame, affiche des erreurs ou refuse de démarrer ? Redonnez-lui sa fluidité d’origine sans perdre vos fichiers.',
    resume:
      'Nettoyage système, suppression des lenteurs et virus, réinstallation propre de Windows ou Linux, sauvegarde de vos données et résolution de pannes logicielles à distance ou en atelier.',
    pour: ['particulier'],
    livrables: [
      'Diagnostic clair et transparent avant toute intervention',
      'Nettoyage système, suppression de lenteurs et virus',
      'Réinstallation propre de Windows ou Linux et configuration initiale',
      'Sauvegarde et sécurisation des données personnelles ou professionnelles',
      'Résolution de pannes logicielles à distance (télémaintenance) ou en atelier',
    ],
    motscles: 'dépannage informatique Perpignan, réparation ordinateur Rivesaltes, réinstallation Windows Linux, télémaintenance PC Mac',
  },
  {
    id: 'reseau',
    n: '02',
    titre: 'Réseaux, Box & Équipements',
    probleme:
      'Fini les coupures Internet dans certaines pièces, les imprimantes introuvables et la peur de perdre vos documents importants.',
    resume:
      'Optimisation du Wi-Fi (zones blanches, répéteurs, CPL), installation de box internet, switchs et imprimantes réseau, et mise en place de serveurs NAS locaux.',
    pour: ['entreprise'],
    livrables: [
      'Optimisation du Wi-Fi à domicile ou dans les locaux (zones blanches, répéteurs, CPL)',
      'Installation et configuration de box internet, routeurs, switchs et imprimantes réseau',
      'Mise en place de serveurs de fichiers locaux ou NAS pour sauvegardes automatiques',
      'Protection de vos photos, documents et factures sans abonnements récurrents',
    ],
    motscles: 'optimisation wifi Perpignan, installation répéteur CPL 66, serveur NAS sauvegarde locale, configuration box imprimante',
  },
  {
    id: 'web',
    n: '03',
    titre: 'Création de Sites Web & Backends légers',
    probleme:
      'Soyez visible avec un site vitrine moderne, ultra-rapide et adapté aux mobiles, sans usine à gaz ni frais cachés.',
    resume:
      'Conception de sites vitrines professionnels rapides pour artisans, commerces locaux et indépendants. Formulaires sur mesure, automatisations métier et hébergement sobre.',
    pour: ['entreprise'],
    livrables: [
      'Création de sites vitrines modernes, très rapides et optimisés mobile',
      'Développement de formulaires sur mesure et petites automatisations',
      'Backends légers et fiables pour connecter vos outils métier',
      'Hébergement sobre, rapide, sans abonnements cachés ni dépendances lourdes',
    ],
    motscles: 'création site internet artisan Perpignan, site vitrine rapide commerce local, développement web sur mesure 66',
  },
];
