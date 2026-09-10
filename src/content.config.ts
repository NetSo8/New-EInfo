import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const labo = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/labo' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    /** état de la preuve : ce qui est publié, pas ce qui est promis */
    status: z.enum(['publié', 'en cours', 'brouillon']).default('publié'),
    tags: z.array(z.string()).default([]),
    readingTime: z.string().optional(),
    repo: z.string().url().optional(),
  }),
});

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

export const collections = { labo, blog };
