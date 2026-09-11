// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  site: 'https://einformatique.fr',
  integrations: [sitemap()],
  vite: { plugins: [tailwindcss()] },
  trailingSlash: 'always',
  build: { format: 'directory' },
  // Anciennes URL du site en production
  redirects: {
    '/about': '/a-propos/',
    '/about/': '/a-propos/',
  },
});
