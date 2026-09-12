import { z } from 'astro/zod';

export const nonEmptyText = z.string().trim().min(1);
export const contentId = nonEmptyText.regex(
  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
  'Expected a stable lowercase, hyphenated ID',
);
export const rootRelativePath = nonEmptyText
  .regex(
    /^\/(?!\/)/,
    'Expected a root-relative path beginning with a single slash',
  )
  .refine((value) => !value.split('/').includes('..'), {
    message: 'Root-relative paths cannot traverse parent directories',
  });
export const resourceLinkSchema = z.strictObject({
  label: nonEmptyText,
  href: z.union([rootRelativePath, z.url().regex(/^https?:\/\//)]),
});

export const addDuplicateIssues = (
  values: readonly string[],
  path: readonly PropertyKey[],
  label: string,
  context: z.RefinementCtx,
) => {
  const seen = new Set<string>();
  values.forEach((value, index) => {
    const normalized = value.toLowerCase();
    if (seen.has(normalized)) {
      context.addIssue({
        code: 'custom',
        message: `Duplicate ${label}: ${value}`,
        path: [...path, index],
      });
    }
    seen.add(normalized);
  });
};
