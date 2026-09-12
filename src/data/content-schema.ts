import { z } from 'astro/zod';
import {
  addDuplicateIssues,
  contentId,
  nonEmptyText,
  resourceLinkSchema,
  rootRelativePath,
} from './validation.ts';

const authorSchema = z.strictObject({
  name: nonEmptyText,
  citation: nonEmptyText,
  role: z.enum(['lead', 'advisor']).optional(),
  equalContribution: z.boolean().optional(),
});

const imageSchema = z.strictObject({
  src: rootRelativePath,
  alt: nonEmptyText,
  fit: z.enum(['contain', 'cover']).default('contain'),
});

export const publicationSchema = z.strictObject({
  id: contentId,
  // An omitted publication title uses the project title.
  title: nonEmptyText.optional(),
  authors: z.array(authorSchema).min(1),
  kind: z.enum(['conference', 'preprint', 'thesis']),
  venue: nonEmptyText,
  year: z.number().int().positive(),
  track: nonEmptyText.optional(),
});

export const contentSchema = z
  .strictObject({
    title: nonEmptyText,
    description: nonEmptyText,
    date: z.coerce.date(),
    updated: z.coerce.date().optional(),
    tags: z.array(nonEmptyText).default([]),
    draft: z.boolean().default(false),
    image: imageSchema.optional(),
    video: rootRelativePath.optional(),
    category: nonEmptyText.optional(),
    links: z.array(resourceLinkSchema).default([]),
    resume: z
      .strictObject({
        title: nonEmptyText.optional(),
        description: nonEmptyText.optional(),
        date: z.coerce.date().optional(),
      })
      .optional(),
    publications: z.array(publicationSchema).default([]),
  })
  .superRefine((entry, context) => {
    if (entry.video && !entry.image) {
      context.addIssue({
        code: 'custom',
        message: 'image is required as a poster and fallback when video is set',
        path: ['image'],
      });
    }
    addDuplicateIssues(
      entry.publications.map(({ id }) => id),
      ['publications'],
      'publication ID',
      context,
    );
  });

export type ContentData = z.output<typeof contentSchema>;
export type ContentImage = z.output<typeof imageSchema>;
export interface ContentRecord {
  id: string;
  data: ContentData;
}
export type Publication = z.output<typeof publicationSchema>;
export type ResourceLink = z.output<typeof resourceLinkSchema>;
