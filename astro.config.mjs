// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://einformatique.fr',
  integrations: [
    sitemap({
      // La page de maintenance est `noindex` et temporaire : elle n'a rien à
      // faire dans un plan du site destiné à durer.
      filter: (page) => !page.includes('/maintenance/'),
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
  build: { format: 'directory' },
  // Anciennes URL du site en production
  redirects: {
    '/about': '/a-propos/',
    '/about/': '/a-propos/',
  },
});
