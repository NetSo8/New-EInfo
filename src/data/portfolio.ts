export interface Projet {
  titre: string;
  client: string;
  annee: string;
  type: 'livré' | 'recherche' | 'maintenance';
  resume: string;
  faits: string[];
  stack: string[];
  lien?: { href: string; label: string };
}

export const projets: Projet[] = [
  {
    titre: 'Migration et supervision d\'un parc de 12 postes',
    client: 'Cabinet comptable, Perpignan',
    annee: '2026',
    type: 'livré',
    resume:
      "Parc vieillissant, sauvegardes jamais vérifiées, accès distant ouvert sur internet. Reprise complète du réseau et de la politique de sauvegarde, sans interruption d'activité pendant la période fiscale.",
    faits: [
      'Bureau à distance exposé remplacé par un tunnel VPN',
      'Sauvegardes chiffrées quotidiennes, restauration testée tous les mois',
      '12 postes migrés hors des heures ouvrées',
      'Zéro interruption pendant la migration',
    ],
    stack: ['WireGuard', 'Restic', 'Debian', 'Windows 11'],
  },
  {
    titre: 'Reprise d\'un VPS abandonné et remise en supervision',
    client: 'Agence immobilière, littoral 66',
    annee: '2025',
    type: 'maintenance',
    resume:
      "Serveur repris sans documentation, trois ans sans mise à jour, site indisponible plusieurs fois par mois. Reconstruction sur une base propre et reproductible, puis contrat de maintenance mensuel.",
    faits: [
      'Serveur reconstruit à partir d\'une configuration versionnée',
      'Disponibilité passée de 96,4 % à 99,9 % sur douze mois',
      'Alertes Telegram sur incident, délai de détection sous 60 s',
      'Coût d\'hébergement divisé par deux',
    ],
    stack: ['Debian', 'nftables', 'Caddy', 'Uptime Kuma', 'Python'],
  },
  {
    titre: 'Refonte de site vitrine et référencement local',
    client: 'Artisan, Rivesaltes',
    annee: '2025',
    type: 'livré',
    resume:
      "Ancien site sous constructeur propriétaire, 6 s de chargement sur mobile, invisible sur les recherches locales. Refonte en site statique, données structurées, contenus par commune.",
    faits: [
      'Chargement mobile ramené sous 1 s',
      '100/100 aux quatre catégories Lighthouse',
      'Demandes entrantes multipliées par trois sur six mois',
      'Coût d\'hébergement annuel : moins de 20 €',
    ],
    stack: ['Astro', 'JSON-LD', 'Cloudflare'],
  },
  {
    titre: 'Banc de mesure de canaux auxiliaires temporels',
    client: 'Recherche personnelle',
    annee: '2026',
    type: 'recherche',
    resume:
      "Outil de mesure de l'écart temporel dans les routines de comparaison de secrets, avec agrégation statistique et détection de la réintroduction de branches par le compilateur.",
    faits: [
      'Écart de 41 ns détecté sous un bruit de mesure de 300 ns',
      'Vérification automatique de l\'assembleur produit',
      'Écrit en C, sans dépendance externe',
      'Travail en cours, publié au fil des résultats',
    ],
    stack: ['C', 'GCC', 'perf', 'Python'],
    lien: { href: '/labo/constant-time-comparaison/', label: 'Lire le writeup' },
  },
  {
    titre: 'Lecture critique de l\'attestation Nitro Enclaves',
    client: 'Recherche personnelle',
    annee: '2026',
    type: 'recherche',
    resume:
      "Analyse de ce que le document d'attestation d'AWS Nitro Enclaves prouve réellement, et de ce que trois bibliothèques clientes courantes laissent passer lors de la validation de la chaîne.",
    faits: [
      'Travail en cours, banc de test non terminé',
      'Notes publiées à l\'état de brouillon annoté',
      'Aucune conclusion avancée avant reproductibilité',
    ],
    stack: ['AWS Nitro', 'CBOR / COSE', 'Rust'],
    lien: { href: '/labo/nitro-enclaves-attestation/', label: 'Lire les notes' },
  },
];
