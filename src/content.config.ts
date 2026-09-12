import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { contentSchema } from './data/content-schema.ts';
import { contentId } from './data/validation.ts';

const createContentCollection = (base: string) =>
  defineCollection({
    loader: glob({
      base,
      pattern: '*.md',
      generateId: ({ entry }) => contentId.parse(entry.replace(/\.md$/, '')),
    }),
    schema: contentSchema,
  });

export const collections = {
  posts: createContentCollection('./src/content/posts'),
  projects: createContentCollection('./src/content/projects'),
};
