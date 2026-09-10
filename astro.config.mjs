// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://einformatique.fr',
  integrations: [sitemap()],
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Anciennes URL du site en production
  redirects: {
    '/about': '/a-propos/',
    '/about/': '/a-propos/',
  },
});
