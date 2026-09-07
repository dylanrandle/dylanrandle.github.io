import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const contentSchema = z
  .object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    image: z.string().optional(),
    previewImages: z
      .array(
        z.object({
          src: z.string(),
          width: z.number().int().positive(),
        }),
      )
      .min(1)
      .optional(),
    video: z.string().optional(),
    previewVideo: z.string().optional(),
    imageAlt: z.string().trim().min(1).optional(),
    imageFit: z.enum(['contain', 'cover']).default('contain'),
    category: z.string().optional(),
  })
  .superRefine((entry, context) => {
    if (entry.image && !entry.imageAlt) {
      context.addIssue({
        code: 'custom',
        message: 'imageAlt is required when image is set',
        path: ['imageAlt'],
      });
    }
    if (entry.video && !entry.image) {
      context.addIssue({
        code: 'custom',
        message: 'image is required as a poster and fallback when video is set',
        path: ['image'],
      });
    }
    if (entry.previewImages && !entry.image) {
      context.addIssue({
        code: 'custom',
        message: 'image is required when previewImages is set',
        path: ['image'],
      });
    }
    if (entry.image && !entry.previewImages) {
      context.addIssue({
        code: 'custom',
        message: 'previewImages is required when image is set',
        path: ['previewImages'],
      });
    }
    if (entry.previewVideo && !entry.video) {
      context.addIssue({
        code: 'custom',
        message: 'video is required when previewVideo is set',
        path: ['video'],
      });
    }
  });

const createContentCollection = (base: string) =>
  defineCollection({
    loader: glob({ base, pattern: '**/*.md' }),
    schema: contentSchema,
  });

const posts = createContentCollection('./src/content/posts');
const projects = createContentCollection('./src/content/projects');

export const collections = { posts, projects };
