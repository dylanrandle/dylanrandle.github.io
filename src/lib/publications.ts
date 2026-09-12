import {
  CONTENT_DATE_FORMAT,
  CONTENT_SECTIONS,
  contentDetailPath,
} from '../config.ts';
import type { ContentRecord, Publication } from '../data/content-schema.ts';

export const formatPublicationVenue = (publication: Publication) => {
  const { kind, venue, year, track, authors } = publication;
  let citation =
    kind === 'conference' ? `${venue} ${year}` : `${venue} · ${year}`;
  if (kind === 'thesis') citation = `Master's thesis, ${citation}`;
  if (track) citation += `, ${track}`;
  if (authors.some((author) => author.equalContribution)) {
    citation += ' · Equal contribution';
  }
  return citation;
};

export const getProjectPublications = (project: ContentRecord) =>
  project.data.publications.map((publication) => ({
    ...publication,
    title: publication.title ?? project.data.title,
    projectId: project.id,
    href: contentDetailPath(CONTENT_SECTIONS.projects, project.id),
    citationAuthors: publication.authors
      .map(
        (author) => `${author.citation}${author.equalContribution ? '*' : ''}`,
      )
      .join(', '),
    citationVenue: formatPublicationVenue(publication),
  }));

export type ProjectPublication = ReturnType<
  typeof getProjectPublications
>[number];

const authorList = new Intl.ListFormat(CONTENT_DATE_FORMAT.locale, {
  style: 'long',
  type: 'conjunction',
});

export const formatProjectCredits = (
  publications: Publication[],
  ownName: string,
) => {
  // One project may have several papers with overlapping authors.
  const byName = new Map<string, Publication['authors'][number]>();
  for (const author of publications.flatMap(({ authors }) => authors)) {
    const previous = byName.get(author.name);
    byName.set(author.name, {
      ...author,
      role: previous?.role ?? author.role,
      equalContribution:
        previous?.equalContribution || author.equalContribution,
    });
  }
  const authors = [...byName.values()];
  const leads = authors.filter(({ role }) => role === 'lead');
  const advisors = authors.filter(({ role }) => role === 'advisor');
  const collaborators = authors.filter(
    ({ role, name }) => !role && name !== ownName,
  );
  const names = (group: typeof authors) =>
    authorList.format(group.map(({ name }) => name));

  let credit = '';
  if (leads.length) {
    credit = `This work was led by ${names(leads)}`;
    if (collaborators.length) credit += `, with ${names(collaborators)}`;
  } else if (collaborators.length) {
    const equalContribution =
      authors.find(({ name }) => name === ownName)?.equalContribution &&
      collaborators.every((author) => author.equalContribution);
    credit = equalContribution
      ? `This work was an equal contribution with ${names(collaborators)}`
      : `This work was done with ${names(collaborators)}`;
  }
  if (advisors.length) {
    credit = credit
      ? `${credit}, advised by ${names(advisors)}`
      : `This work was advised by ${names(advisors)}`;
  }
  return credit ? `${credit}.` : undefined;
};
