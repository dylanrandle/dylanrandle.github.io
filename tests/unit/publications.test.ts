import assert from 'node:assert/strict';
import { test } from 'node:test';
import { publicationSchema } from '../../src/data/content-schema.ts';
import { formatProjectCredits } from '../../src/lib/publications.ts';

const paper = (authors: Record<string, unknown>[]) =>
  publicationSchema.parse({
    id: 'example-paper',
    authors: authors.map((author) => ({ citation: author.name, ...author })),
    kind: 'conference',
    venue: 'Example Conference',
    year: 2025,
  });

test('project credits combine overlapping authors and preserve lead and advisor roles', () => {
  const publications = [
    paper([
      { name: 'Ada Lovelace', role: 'lead' },
      { name: 'Site Author' },
      { name: 'Grace Hopper' },
      { name: 'Alan Turing', role: 'advisor' },
    ]),
    paper([
      { name: 'Site Author' },
      { name: 'Grace Hopper' },
      { name: 'Alan Turing' },
    ]),
  ];
  assert.equal(
    formatProjectCredits(publications, 'Site Author'),
    'This work was led by Ada Lovelace, with Grace Hopper, advised by Alan Turing.',
  );
});

test('equal-contribution and advisor credits survive related preprints and a solo thesis', () => {
  const publications = [
    paper([
      { name: 'Site Author', equalContribution: true },
      { name: 'Ada Lovelace', equalContribution: true },
      { name: 'Alan Turing', role: 'advisor' },
    ]),
    paper([{ name: 'Site Author' }, { name: 'Alan Turing' }]),
    paper([{ name: 'Site Author' }]),
  ];
  assert.equal(
    formatProjectCredits(publications, 'Site Author'),
    'This work was an equal contribution with Ada Lovelace, advised by Alan Turing.',
  );
});

test('ordinary collaborations use simple prose and solo work adds no credit paragraph', () => {
  assert.equal(
    formatProjectCredits(
      [paper([{ name: 'Site Author' }, { name: 'Ada Lovelace' }])],
      'Site Author',
    ),
    'This work was done with Ada Lovelace.',
  );
  assert.equal(
    formatProjectCredits([paper([{ name: 'Site Author' }])], 'Site Author'),
    undefined,
  );
  assert.equal(formatProjectCredits([], 'Site Author'), undefined);
});
