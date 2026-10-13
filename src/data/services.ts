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
    titre: 'Dépannage et assistance',
    probleme: "Votre machine ne démarre plus, rame, ou fait quelque chose d'inquiétant.",
    resume:
      "Le métier de base : technicien informatique. Diagnostic sur place ou à distance, réparation matérielle et logicielle, remise en état. Windows, macOS et Linux. Je vous dis ce qui ne va pas et ce que ça coûte avant de commencer.",
    pour: ['particulier'],
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
    id: 'formation-ia',
    n: '02',
    titre: "Formation à l'usage de l'IA",
    probleme: "ChatGPT, Copilot ou une autre IA vous intéresse ou vous inquiète, et personne ne vous a montré comment vous en servir sans vous faire piéger.",
    resume:
      "Une prise en main concrète, sur vos propres besoins : rédiger un e-mail, préparer un dossier, trier des photos, comprendre ce qu'une IA peut faire et ce qu'elle invente. On voit aussi ce qu'il ne faut jamais lui confier, et comment repérer une arnaque ou une fausse information générée par IA.",
    pour: ['particulier'],
    livrables: [
      "Prise en main d'un assistant IA (ChatGPT ou équivalent) sur vos cas réels",
      "Ce qu'il ne faut jamais partager avec une IA (données personnelles, bancaires, santé)",
      "Reconnaître un contenu ou une arnaque générée par IA",
      'Réglages de confidentialité expliqués, pas seulement cochés',
      'Support écrit à relire chez vous après la séance',
    ],
    motscles: 'formation ChatGPT particulier Rivesaltes, apprendre à utiliser IA Perpignan, initiation intelligence artificielle 66',
  },
  {
    id: 'web',
    n: '03',
    titre: 'Site web : création et maintenance',
    probleme: "Votre site est lent, daté, ou tombe sans que vous sachiez pourquoi.",
    resume:
      "Création ou refonte orientée performance et référencement local, puis maintenance dans la durée : mises à jour, sauvegardes, correctifs de sécurité, supervision de disponibilité. L'hébergement va avec, et il est tenu par la même personne que le reste.",
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
  {
    id: 'revue-ia',
    n: '04',
    titre: 'Sécurité de code & Confinement IA (Windows)',
    probleme:
      "Vous intégrez du code IA ou des agents autonomes sur votre infrastructure Windows. Audit de sécurité des scripts générés, contrôle des flux et isolation des exécutions (sandboxing) pour protéger vos données métier.",
    resume:
      "Une IA générative écrit du code qui fonctionne, pas nécessairement du code sûr ni confiné : secrets exposés, accès fichiers non restreints, requêtes arbitraires ou dépendances inventées. J'audite vos scripts et je sécurise l'exécution locale de vos agents IA sous Windows : isolation sandbox (AppContainer, Job Objects), restriction des privilèges et blocage des flux non autorisés.",
    pour: ['entreprise'],
    livrables: [
      'Audit de sécurité et relecture manuelle du code généré par IA',
      'Rapport priorisé : vulnérabilités critiques, secrets exposés, dépendances inventées',
      'Confinement d\'exécution sous Windows : isolation sandbox (AppContainer, Job Objects)',
      'Contrôle des flux réseau (WFP) et protection des données métier locales',
      'Corrections appliquées ou plan de durcissement documenté pour votre équipe',
    ],
    motscles: 'sécurité code IA Windows Perpignan, confinement agent IA sandboxing Rivesaltes, audit scripts IA 66',
  },
];
