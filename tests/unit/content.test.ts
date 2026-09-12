import assert from 'node:assert/strict';
import { test } from 'node:test';
import { contentSchema } from '../../src/data/content-schema.ts';

const content = (overrides: Record<string, unknown>) =>
  contentSchema.parse({
    title: 'Example',
    description: 'Example description',
    date: '2020-05-15T12:00:00-04:00',
    ...overrides,
  });

test('cover images require nested src and alt, with an optional fit', () => {
  assert.deepEqual(
    content({ image: { src: '/example.webp', alt: 'An example' } }).image,
    { src: '/example.webp', alt: 'An example', fit: 'contain' },
  );
  assert.throws(() => content({ image: { src: '/example.webp' } }), /alt/);
  assert.throws(() => content({ image: { alt: 'An example' } }), /src/);
  assert.throws(
    () => content({ image: { src: '/example.webp', alt: '  ' } }),
    /alt/,
  );
  assert.throws(() => content({ image: '/example.webp' }), /expected object/);
  for (const legacy of ['imageAlt', 'imageFit']) {
    assert.throws(
      () =>
        content({
          image: { src: '/example.webp', alt: 'An example' },
          [legacy]: 'legacy',
        }),
      /Unrecognized key/,
    );
  }
});

test('videos require a cover image for their poster and accessible description', () => {
  assert.throws(() => content({ video: '/example.mp4' }), /image is required/);
  assert.equal(
    content({
      video: '/example.mp4',
      image: { src: '/example.webp', alt: 'A robot demonstration' },
    }).image?.alt,
    'A robot demonstration',
  );
});

test('resource links belong to the article and publication metadata needs no links', () => {
  const publication = {
    id: 'example-paper',
    authors: [{ name: 'Ada Lovelace', citation: 'A. Lovelace' }],
    kind: 'conference',
    venue: 'Example Conference',
    year: 2025,
  };
  const links = [
    { label: 'Source code', href: 'https://example.com/code' },
    { label: 'Paper', href: '/paper.pdf' },
  ];
  assert.deepEqual(
    content({ publications: [publication], links }).links,
    links,
  );
  assert.deepEqual(content({ publications: [publication] }).links, []);
  assert.throws(
    () => content({ publications: [{ ...publication, links }] }),
    /Unrecognized key.*links/,
  );
});
