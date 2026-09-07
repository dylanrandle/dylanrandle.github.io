import { z } from 'astro/zod';

const nonEmptyText = z.string().trim().min(1);
const nonEmptyTextList = z.array(nonEmptyText).min(1);
const rootRelativePath = nonEmptyText
  .regex(
    /^\/(?!\/)/,
    'Expected a root-relative path beginning with a single slash',
  )
  .refine((value) => !value.split('/').includes('..'), {
    message: 'Root-relative paths cannot traverse parent directories',
  });
const projectPath = nonEmptyText.regex(
  /^\/projects\/[a-z0-9]+(?:-[a-z0-9]+)*\/$/,
  'Expected a canonical project path such as /projects/example/',
);

const roleSchema = z.object({
  title: nonEmptyText,
  period: nonEmptyText,
  bullets: nonEmptyTextList,
});

const experienceSchema = z.object({
  organization: nonEmptyText,
  location: nonEmptyText,
  roles: z.array(roleSchema).min(1),
});

const educationSchema = z.object({
  school: nonEmptyText,
  degree: nonEmptyText,
  period: nonEmptyText,
  location: nonEmptyText,
  bullets: nonEmptyTextList,
});

const publicationSchema = z.object({
  title: nonEmptyText,
  href: projectPath,
  authors: nonEmptyText,
  venue: nonEmptyText,
});

const projectSchema = z.object({
  title: nonEmptyText,
  date: nonEmptyText,
  description: nonEmptyText,
});

const skillSchema = z.object({
  label: nonEmptyText,
  value: nonEmptyText,
});

const addDuplicateIssues = (
  values: readonly string[],
  path: readonly PropertyKey[],
  label: string,
  context: z.RefinementCtx,
) => {
  const seen = new Set<string>();

  values.forEach((value, index) => {
    const normalized = value.toLocaleLowerCase('en-US');
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

export const profileSchema = z
  .object({
    name: nonEmptyText,
    displayName: nonEmptyText,
    email: z.email().trim(),
    portrait: z.object({
      src: rootRelativePath,
      alt: nonEmptyText,
    }),
    links: z.object({
      website: z.url().trim(),
      github: z.url().trim(),
      linkedin: z.url().trim(),
      scholar: z.url().trim(),
      cv: rootRelativePath,
    }),
    intro: z.object({
      eyebrow: nonEmptyText,
      headline: nonEmptyText,
      detail: nonEmptyText,
      aboutHeading: nonEmptyText,
    }),
    resume: z.object({
      summary: nonEmptyText,
      experience: z.array(experienceSchema).min(1),
      education: z.array(educationSchema).min(1),
      publications: z.array(publicationSchema).min(1),
      projects: z.array(projectSchema).min(1),
      skills: z.array(skillSchema).min(1),
    }),
  })
  .superRefine((profile, context) => {
    addDuplicateIssues(
      profile.resume.experience.map(({ organization }) => organization),
      ['resume', 'experience'],
      'organization',
      context,
    );
    addDuplicateIssues(
      profile.resume.publications.map(({ title }) => title),
      ['resume', 'publications'],
      'publication title',
      context,
    );
    addDuplicateIssues(
      profile.resume.projects.map(({ title }) => title),
      ['resume', 'projects'],
      'project title',
      context,
    );
    addDuplicateIssues(
      profile.resume.skills.map(({ label }) => label),
      ['resume', 'skills'],
      'skill label',
      context,
    );
  });

export type ProfileInput = z.input<typeof profileSchema>;
export type Profile = z.output<typeof profileSchema>;
