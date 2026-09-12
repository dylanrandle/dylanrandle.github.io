import { z } from 'astro/zod';
import { CONTENT_SECTIONS, contentDetailPath } from '../config.ts';
import {
  addDuplicateIssues,
  contentId,
  nonEmptyText,
  rootRelativePath,
} from './validation.ts';

const nonEmptyTextList = z.array(nonEmptyText).min(1);
const projectPath = rootRelativePath.refine((value) => {
  const id = value.slice(CONTENT_SECTIONS.projects.detailBase.length + 1, -1);
  return (
    contentId.safeParse(id).success &&
    value === contentDetailPath(CONTENT_SECTIONS.projects, id)
  );
}, 'Expected a canonical project detail path');

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
  id: contentId,
  title: nonEmptyText,
  href: projectPath,
  authors: nonEmptyText,
  venue: nonEmptyText,
});

const projectSchema = z.object({
  id: contentId,
  href: projectPath,
  title: nonEmptyText,
  date: nonEmptyText,
  description: nonEmptyText,
});

const skillSchema = z.object({
  label: nonEmptyText,
  value: nonEmptyText,
});

const resumeSchema = z.object({
  summary: nonEmptyText,
  experience: z.array(experienceSchema).min(1),
  education: z.array(educationSchema).min(1),
  skills: z.array(skillSchema).min(1),
});

// Authored profile data can refer to a publication without repeating its title.
export const profileDataSchema = z.object({
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
  resume: resumeSchema.extend({
    education: z
      .array(
        educationSchema.extend({
          thesisPublicationId: contentId.optional(),
        }),
      )
      .min(1),
  }),
});

// The HTML résumé and PDF generator share this fully resolved contract.
export const profileSchema = profileDataSchema
  .extend({
    resume: resumeSchema.extend({
      publications: z.array(publicationSchema).min(1),
      projects: z.array(projectSchema).min(1),
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

export type ProfileData = z.output<typeof profileDataSchema>;
export type Profile = z.output<typeof profileSchema>;
