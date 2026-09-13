/* Conventions d'affichage partagées par la liste et l'article. */

export const AUDIENCE_LABEL = {
  particulier: 'Particuliers',
  entreprise: 'Entreprises',
  tous: 'Tout public',
} as const;

export const formatDate = (d: Date) =>
  d.toLocaleDateString('fr-FR', { day: '2-digit', month: 'long', year: 'numeric' });
