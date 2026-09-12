import { CONTENT_SECTIONS, contentDetailPath } from '../config.ts';
import type { ContentRecord } from '../data/content-schema.ts';
import { profileData, resumeSelection } from '../data/profile.ts';
import { profileSchema } from '../data/profile-schema.ts';
import { formatContentDate } from './dates.ts';
import {
  getProjectPublications,
  type ProjectPublication,
} from './publications.ts';
import { readContentEntries } from './read-content.ts';

const selectProjects = (
  ids: readonly string[],
  lookup: (id: string) => ContentRecord,
  section: 'projects' | 'publications',
) => {
  const seen = new Set<string>();
  return ids.map((id) => {
    if (seen.has(id))
      throw new Error(`Duplicate project ID in résumé ${section}: ${id}`);
    seen.add(id);
    return lookup(id);
  });
};

export const createProjectCatalog = (entries: ContentRecord[]) => {
  const projectsById = new Map<string, ContentRecord>();
  const publicationsById = new Map<string, ProjectPublication>();
  for (const entry of entries) {
    if (projectsById.has(entry.id))
      throw new Error(`Duplicate project ID: ${entry.id}`);
    projectsById.set(entry.id, entry);
    for (const publication of getProjectPublications(entry)) {
      if (publicationsById.has(publication.id))
        throw new Error(`Duplicate publication ID: ${publication.id}`);
      publicationsById.set(publication.id, publication);
    }
  }

  const project = (id: string) => {
    const entry = projectsById.get(id);
    if (!entry) throw new Error(`Unknown project ID: ${id}`);
    if (entry.data.draft)
      throw new Error(`Résumé cannot reference draft project: ${id}`);
    return entry;
  };

  const publication = (id: string) => {
    const entry = publicationsById.get(id);
    if (!entry) throw new Error(`Unknown publication ID: ${id}`);
    project(entry.projectId);
    return entry;
  };

  return {
    publication,
    publications: (ids: readonly string[]) =>
      selectProjects(ids, project, 'publications')
        .flatMap((entry) => {
          const publications = getProjectPublications(entry);
          if (publications.length === 0) {
            throw new Error(
              `Résumé publications project has no publications: ${entry.id}`,
            );
          }
          return publications;
        })
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          href: entry.href,
          authors: entry.citationAuthors,
          venue: entry.citationVenue,
        })),
    projects: (ids: readonly string[]) =>
      selectProjects(ids, project, 'projects').map(({ id, data }) => ({
        id,
        href: contentDetailPath(CONTENT_SECTIONS.projects, id),
        title: data.resume?.title ?? data.title,
        date: formatContentDate(data.resume?.date ?? data.date, 'resume'),
        description: data.resume?.description ?? data.description,
      })),
  };
};

// Keep assembly in one place for the HTML résumé and the TeX/PDF generator.
export const getProfile = () => {
  const catalog = createProjectCatalog(readContentEntries('projects'));
  const education = profileData.resume.education.map(
    ({ thesisPublicationId, ...entry }) => ({
      ...entry,
      bullets: thesisPublicationId
        ? [
            `Thesis: ${catalog.publication(thesisPublicationId).title}.`,
            ...entry.bullets,
          ]
        : entry.bullets,
    }),
  );

  return profileSchema.parse({
    ...profileData,
    resume: {
      ...profileData.resume,
      education,
      projects: catalog.projects(resumeSelection.projects),
      publications: catalog.publications(resumeSelection.publications),
    },
  });
};
