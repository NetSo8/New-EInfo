import { getCollection } from 'astro:content';

/* Tant que ce drapeau est à `false`, les pages du portfolio sont en
   `noindex` (invisibles pour Google). Le passer à `true` au moment de la
   mise en ligne, et retirer '/portfolio/' du filtre du sitemap dans
   astro.config.mjs. */
export const PORTFOLIO_PUBLIE = false;

export async function projetsTries() {
  return (await getCollection('projets')).sort(
    (a, b) => (a.data.ordre ?? Infinity) - (b.data.ordre ?? Infinity) || b.data.annee - a.data.annee,
  );
}
