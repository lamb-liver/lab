import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { conceptSlugs } from './lib/concepts';

/** 跨集合共用概念詞彙（slug）；registry 見 src/lib/concepts.ts */
const conceptEnum = z.enum(conceptSlugs as [string, ...string[]]);

export const exploreCategories = [
  '幾何',
  '代數',
  '統計',
  '拓樸',
  '分析',
] as const;

export type ExploreCategory = (typeof exploreCategories)[number];

export const contentAudiences = [
  '直觀探索',
  '高中概念',
  '大學概念',
] as const;

export type ContentAudience = (typeof contentAudiences)[number];

export const examSubjects = ['學測數A', '學測數B', '分科數甲'] as const;

export type ExamSubject = (typeof examSubjects)[number];

export const examQuestionTypes = ['單選', '多選', '選填', '非選'] as const;

export type ExamQuestionType = (typeof examQuestionTypes)[number];

const works = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/works' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    tags: z.array(z.string()),
    concepts: z.array(conceptEnum).default([]),
    audience: z.enum(contentAudiences).default('高中概念'),
    prerequisites: z.array(z.string()).default([]),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
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
    concepts: z.array(conceptEnum).default([]),
    audience: z.enum(contentAudiences).default('高中概念'),
    prerequisites: z.array(z.string()).default([]),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const exam = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/exam' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    subject: z.enum(examSubjects),
    year: z.number().int(),
    questionType: z.enum(examQuestionTypes),
    questionNo: z.string(),
    unit: z.string(),
    topics: z.array(z.string()),
    concepts: z.array(conceptEnum).default([]),
    sourceUrl: z.string().url().optional(),
    analysisUrl: z.string().url().optional(),
    relatedExplore: z.array(z.string()).default([]),
    relatedWorks: z.array(z.string()).default([]),
    date: z.coerce.date(),
    order: z.number().int().nonnegative(),
    coverImage: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

export const collections = { works, explore, exam };
