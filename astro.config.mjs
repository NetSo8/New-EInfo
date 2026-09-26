// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { readdirSync } from 'node:fs';

const blogVide = !readdirSync('./src/content/blog').some((f) => f.endsWith('.md'));

export default defineConfig({
  site: 'https://einformatique.fr',
  integrations: [
    sitemap({
      // Le plan du site ne liste que des pages indexables : y laisser une page
      // `noindex` fait remonter une erreur « envoyée mais exclue » dans la
      // Search Console. Exclues : maintenance (temporaire), portfolio (prêt,
      // pas encore publié), mentions légales, et le blog tant qu'il est vide.
      filter: (page) =>
        !['/maintenance/', '/portfolio/', '/mentions-legales/'].some((p) => page.includes(p)) &&
        !(blogVide && page.endsWith('/blog/')),
      // Date de build : signale à Google qu'une page a été régénérée depuis
      // le dernier passage, sans dépendre d'une date par page à tenir à jour.
      serialize(item) {
        item.lastmod = new Date().toISOString();
        return item;
      },
    }),
  ],
  vite: { plugins: [tailwindcss()] },
  trailingSlash: 'always',
  build: {
    format: 'directory',
    // Feuille de style intégrée à chaque page : ~12 Ko compressés, une requête
    // bloquante en moins avant le premier affichage sur mobile.
    inlineStylesheets: 'always',
  },
  // Anciennes URL du site en production. Une seule entrée suffit : avec
  // `trailingSlash: 'always'`, Astro génère /about/index.html, qui répond
  // aussi à /about. La déclarer deux fois faisait collision.
  redirects: {
    '/about': '/a-propos/',
  },
});
