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
    titre: 'Dépannage & Réparation de matériel',
    probleme: "Votre ordinateur est lent, bloqué, infecté par un virus ou refuse de démarrer.",
    resume:
      "Diagnostic complet sur place ou en atelier. Remplacement de disque dur par un SSD ultra-rapide, réparation de pièces défaillantes, nettoyage logiciel, désinfection et remise à neuf de vos postes Windows et Mac.",
    pour: ['particulier'],
    livrables: [
      'Diagnostic clair et devis annoncé avant toute intervention',
      'Remplacement de disque lent par un SSD rapide pour un démarrage instantané',
      'Nettoyage logiciel complet, suppression des virus et publicités intempestives',
      'Récupération de vos documents et photos personnels',
      'Sauvegarde automatique mise en place et testée devant vous',
    ],
    motscles: 'dépannage informatique Rivesaltes, réparation ordinateur Perpignan, réparateur PC 66, changement SSD Rivesaltes',
  },
  {
    id: 'formation-ia',
    n: '02',
    titre: 'Assistance, Réseau & Outils du quotidien',
    probleme: "Votre imprimante refuse d'imprimer, le Wi-Fi ne capte pas partout ou vous souhaitez apprivoiser les nouveaux outils.",
    resume:
      "Configuration de vos équipements (Wi-Fi, box internet, imprimantes, messagerie) et accompagnement pratique sur mesure. Initiation utile aux outils actuels et à l'intelligence artificielle pour vos courriers et démarches.",
    pour: ['particulier'],
    livrables: [
      'Configuration de vos box internet, imprimantes et périphériques',
      'Amélioration de la portée et du débit Wi-Fi dans toute la maison',
      'Prise en main concrète des outils bureautiques et numériques',
      'Initiation simple et sécurisée à l\'usage de l\'IA au quotidien',
      'Fiche récapitulative personnalisée conservée chez vous',
    ],
    motscles: 'assistance informatique domicile Rivesaltes, configuration wifi Perpignan, aide informatique débutant 66',
  },
  {
    id: 'web',
    n: '03',
    titre: 'Création & Refonte de Sites Web',
    probleme: "Votre activité manque de visibilité en ligne ou votre site actuel est ancien, lent et illisible sur mobile.",
    resume:
      "Conception de sites vitrines professionnels rapides, épurés et optimisés pour le référencement local (Google & Google Maps). Vos clients vous trouvent sur smartphone et vous contactent directement.",
    pour: ['entreprise'],
    livrables: [
      'Site vitrine rapide, moderne et parfaitement adapté aux smartphones',
      'Optimisation pour la recherche locale (Google & Google Maps)',
      'Nom de domaine, adresses e-mails professionnelles et hébergement inclus',
      'Accompagnement sur la fiche d\'établissement Google Business Profile',
      'Maintenance, sauvegardes et mises à jour de sécurité régulières',
    ],
    motscles: 'création site internet artisan Perpignan, site web local Rivesaltes, création site vitrine PME 66',
  },
  {
    id: 'revue-ia',
    n: '04',
    titre: 'Maintenance & Parc Informatique Pro',
    probleme:
      "Vos postes de travail ralentissent votre activité, les pannes bloquent vos salariés ou vos sauvegardes ne sont pas suivies.",
    resume:
      "Un interlocuteur unique pour gérer l'informatique de votre entreprise : maintien en état des postes et serveurs, gestion des accès et mots de passe, sécurisation des données et dépannage d'urgence.",
    pour: ['entreprise'],
    livrables: [
      'Entretien préventif régulier des postes et serveurs de l\'entreprise',
      'Stratégie de sauvegarde de données automatique et vérifiée',
      'Sécurisation des accès, des postes et du réseau de travail',
      'Dépannage prioritaire sur site ou à distance en cas de blocage',
      'Conseil indépendant pour renouveler votre matériel au juste coût',
    ],
    motscles: 'maintenance informatique entreprise Perpignan, gestion parc informatique PME Rivesaltes, dépannage informatique pro 66',
  },
];
