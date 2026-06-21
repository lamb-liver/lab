import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

export const exploreCategories = [
  '幾何',
  '代數',
  '統計',
  '拓樸',
  '分析',
] as const;

export type ExploreCategory = (typeof exploreCategories)[number];

const works = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    ogImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const explore = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/explore' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    category: z.enum(exploreCategories),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, explore };
