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
    titre: 'Relecture de code généré par IA',
    probleme: "Une équipe utilise Copilot, Cursor ou ChatGPT pour produire du code, et personne ne l'a relu avant que ça tourne pour de vrai.",
    resume:
      "Une IA générative écrit du code qui fonctionne, pas nécessairement du code sûr : secret oublié en dur, requête construite par concatenation, dépendance qui n'existe pas, comportement qui ne correspond pas à ce que le projet promet. Je relis ce code ligne par ligne, humainement, et je vous dis ce qui doit être corrigé avant la mise en ligne.",
    pour: ['entreprise'],
    livrables: [
      'Relecture manuelle du code, pas un simple passage de linter automatique',
      'Rapport priorisé : ce qui est dangereux, ce qui peut attendre, ce qui est correct',
      "Repérage des erreurs récurrentes propres à l'assistant utilisé (secrets en dur, injection, dépendances inventées)",
      'Vérification que le comportement réel correspond à ce que le code prétend faire',
      'Corrections appliquées ou expliquées, selon ce que vous préférez',
    ],
    motscles: 'audit code généré par IA Perpignan, relecture code ChatGPT Copilot Rivesaltes, sécurité vibe coding 66',
  },
];
