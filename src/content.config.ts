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

export const collections = { blog };
