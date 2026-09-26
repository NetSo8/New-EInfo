import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    audience: z.enum(['particulier', 'entreprise', 'tous']).default('tous'),
    tags: z.array(z.string()).default([]),
  }),
});

/* Portfolio : un dossier par projet, `src/content/projets/<nom>/index.md`,
   avec ses captures d'écran à côté. Mode d'emploi : src/content/projets/README.md */
const projets = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/projets' }),
  schema: ({ image }) =>
    z.object({
      titre: z.string(),
      /** Nature du projet, en quelques mots : « Site vitrine », « Application web »… */
      categorie: z.string(),
      annee: z.number().int(),
      technologies: z.array(z.string()).min(1),
      /** Image de la vignette et du haut de la fiche. */
      couverture: image(),
      /** Ce que montre la capture, pour les lecteurs d'écran (obligatoire). */
      couvertureAlt: z.string().min(5),
      captures: z.array(z.object({ src: image(), alt: z.string().min(5) })).default([]),
      liens: z
        .object({ site: z.string().url().optional(), code: z.string().url().optional() })
        .default({}),
      /** Plus petit = plus haut dans la liste. Sinon, du plus récent au plus ancien. */
      ordre: z.number().optional(),
    }),
});

export const collections = { blog, projets };
