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
    titre: 'Outils Windows rapides',
    probleme: "Vos outils du quotidien sont lourds, lents à s'ouvrir et gourmands en mémoire.",
    resume:
      "Des petits logiciels écrits directement pour Windows : ils s'ouvrent instantanément, consomment très peu de mémoire, tiennent dans un seul fichier et n'envoient aucune donnée à l'extérieur.",
    pour: ['particulier'],
    livrables: [
      'Un seul fichier à copier, sans installation lourde',
      'Ouverture immédiate, même sur un poste ancien',
      'Très faible consommation de mémoire',
      'Fonctionnement 100 % local, aucune donnée envoyée',
      'Somme de contrôle fournie pour vérifier chaque version',
    ],
    motscles: 'logiciel windows rapide, outil windows léger, logiciel sur mesure Perpignan',
  },
  {
    id: 'formation-ia',
    n: '02',
    titre: 'Accélération de logiciels',
    probleme: "Votre programme rame, se fige par moments ou monopolise le processeur.",
    resume:
      "Je mesure où le temps est perdu, puis je corrige les points qui comptent. Vous obtenez un logiciel plus rapide, avec des mesures avant et après pour le constater.",
    pour: ['particulier'],
    livrables: [
      'Diagnostic de ce qui ralentit : processeur, mémoire, disque',
      'Correction des points bloquants, sans tout refaire',
      'Mesures avant/après que vous pouvez vérifier',
      'Explications claires, sans jargon',
      "Recommandations adaptées à votre machine",
    ],
    motscles: 'logiciel lent windows, accélérer un programme, optimisation performance windows',
  },
  {
    id: 'web',
    n: '03',
    titre: 'Diagnostic de performance',
    probleme: "Votre logiciel métier ralentit quand il y a du monde ou beaucoup de données.",
    resume:
      "Analyse approfondie d'une application d'entreprise : je trouve ce qui bloque, je le chiffre et je vous remets un rapport priorisé, avec les gains attendus et un plan d'action.",
    pour: ['entreprise'],
    livrables: [
      'Analyse du comportement du logiciel en situation réelle',
      'Identification précise des ralentissements et des blocages',
      'Rapport clair, chiffré, lisible par un non-développeur',
      "Plan d'action priorisé avec gains estimés",
      'Devis écrit avant toute correction',
    ],
    motscles: 'audit performance logiciel PME, diagnostic application lente, logiciel métier lent Perpignan',
  },
  {
    id: 'revue-ia',
    n: '04',
    titre: 'Développement Windows & Administration',
    probleme:
      "Vous avez besoin d'un outil métier sur mesure, d'un ancien logiciel à moderniser, ou de fiabiliser un poste ou serveur Windows.",
    resume:
      "Je conçois des logiciels et services Windows natifs légers et documentés, et j'interviens sur l'administration système Windows si besoin (automatisation, droits, configuration réseau et services).",
    pour: ['entreprise'],
    livrables: [
      'Logiciel ou service Windows sur mesure, léger et fiable',
      "Modernisation, portage ou reprise d'un outil existant",
      'Scripts d\'automatisation et administration système Windows',
      'Configuration propre des services et droits d\'accès',
      'Code source, documentation claire et tests remis à la fin',
    ],
    motscles: 'développement logiciel Windows PME, administration système Windows Perpignan, reprise logiciel Windows',
  },
];
