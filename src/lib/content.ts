import { getCollection, type CollectionEntry } from 'astro:content';
import { CONTENT_SECTIONS } from '../config';

export type ContentEntry =
  CollectionEntry<'posts'> | CollectionEntry<'projects'>;

const newestFirst = (a: ContentEntry, b: ContentEntry) =>
  b.data.date.valueOf() - a.data.date.valueOf();

export const getPublishedPosts = async () =>
  (
    await getCollection(
      CONTENT_SECTIONS.posts.collection,
      ({ data }) => !data.draft,
    )
  ).sort(newestFirst);

export const getPublishedProjects = async () =>
  (
    await getCollection(
      CONTENT_SECTIONS.projects.collection,
      ({ data }) => !data.draft,
    )
  ).sort(newestFirst);
