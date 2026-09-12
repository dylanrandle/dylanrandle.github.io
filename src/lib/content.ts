import { getCollection, type CollectionEntry } from 'astro:content';
import { CONTENT_SECTIONS, type ContentCollection } from '../config';

export type ContentEntry =
  CollectionEntry<'posts'> | CollectionEntry<'projects'>;

const newestFirst = (a: ContentEntry, b: ContentEntry) =>
  b.data.date.valueOf() - a.data.date.valueOf();

// Astro caches getStaticPaths() props, so keep asset-derived metadata out of
// these entries. Cards and detail layouts resolve media when they render.
export const getPublishedContent = async <T extends ContentCollection>(
  collection: T,
) =>
  (await getCollection(collection, ({ data }) => !data.draft)).sort(
    newestFirst,
  );

export const getPublishedPosts = () =>
  getPublishedContent(CONTENT_SECTIONS.posts.collection);
export const getPublishedProjects = () =>
  getPublishedContent(CONTENT_SECTIONS.projects.collection);
