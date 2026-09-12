import assert from 'node:assert/strict';
import { mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { test } from 'node:test';
import {
  contentSchema,
  type ContentRecord,
} from '../../src/data/content-schema.ts';
import { readContentEntries } from '../../src/lib/read-content.ts';
import { createProjectCatalog } from '../../src/lib/resume.ts';

const record = (
  id: string,
  overrides: Record<string, unknown> = {},
): ContentRecord => ({
  id,
  data: contentSchema.parse({
    title: 'Project title',
    description: 'Card summary',
    date: '2020-05-15T16:00:00-04:00',
    ...overrides,
  }),
});
const paper = (id: string, overrides: Record<string, unknown> = {}) => ({
  id,
  title: 'Formal paper title',
  authors: [{ name: 'Ada Lovelace', citation: 'A. Lovelace' }],
  kind: 'conference',
  venue: 'Example Conference',
  year: 2022,
  ...overrides,
});

test('résumé includes only selected projects in list order and inherits shared fields', () => {
  const catalog = createProjectCatalog([
    record('older'),
    record('newer', { title: 'Newer', date: '2025-01-01T12:00:00-05:00' }),
    record('additional', { date: '2026-01-01T12:00:00-05:00' }),
    record('research', {
      date: '2023-01-01T12:00:00-05:00',
      publications: [paper('research-paper')],
    }),
    record('draft', { draft: true, date: '2099-01-01T12:00:00-05:00' }),
  ]);
  const projects = catalog.projects(['older', 'newer']);
  assert.deepEqual(
    projects.map(({ id }) => id),
    ['older', 'newer'],
  );
  assert.equal(projects[0].title, 'Project title');
  assert.equal(projects[0].description, 'Card summary');
  assert.equal(projects[0].date, 'May 2020');
});

test('résumé overrides preserve website wording and omitted fields inherit their defaults', () => {
  const entry = record('example', {
    date: '2025-03-01T01:00:00Z',
    description: 'I explored a new idea in this project.',
    resume: {
      title: 'Short title',
      description: 'Built and evaluated a prototype.',
    },
  });
  const selected = createProjectCatalog([entry]).projects(['example'])[0];
  assert.equal(selected.title, 'Short title');
  assert.equal(selected.description, 'Built and evaluated a prototype.');
  assert.equal(
    entry.data.description,
    'I explored a new idea in this project.',
  );
  assert.equal(selected.date, 'Feb 2025');
  entry.data.resume!.date = new Date('2024-01-15T12:00:00-05:00');
  assert.equal(
    createProjectCatalog([entry]).projects(['example'])[0].date,
    'Jan 2024',
  );
  const shared = record('shared', { resume: { title: 'Short title' } });
  assert.equal(
    createProjectCatalog([shared]).projects(['shared'])[0].description,
    'Card summary',
  );
});

test('project ordering follows the selection regardless of dates, IDs, or content order', () => {
  const entries = [
    record('zulu', { date: '2024-01-15T12:00:00-05:00' }),
    record('override', {
      date: '2025-01-15T12:00:00-05:00',
      resume: { date: '2023-01-15T12:00:00-05:00' },
    }),
    record('alpha', { date: '2024-01-15T12:00:00-05:00' }),
  ];
  const ids = Object.freeze(['override', 'alpha', 'zulu']);
  for (const input of [entries, entries.toReversed()]) {
    for (const selection of [ids, ids.toReversed()]) {
      assert.deepEqual(
        createProjectCatalog(input)
          .projects(selection)
          .map(({ id }) => id),
        selection,
      );
    }
  }
});

test('one project can supply multiple publications with their own titles, years, and author credits', () => {
  const entry = record('research', {
    publications: [
      paper('conference', {
        authors: [
          {
            name: 'Ada Lovelace',
            citation: 'A. Lovelace',
            equalContribution: true,
          },
        ],
        track: 'AI for Science',
      }),
      paper('preprint', {
        title: 'Earlier paper',
        kind: 'preprint',
        venue: 'arXiv:1234.56789',
        year: 2020,
      }),
      paper('thesis', {
        title: undefined,
        kind: 'thesis',
        venue: 'Example University',
        year: 2020,
      }),
    ],
  });
  const catalog = createProjectCatalog([entry]);
  const selected = catalog.publications(['research']);
  assert.deepEqual(
    selected.map(({ id }) => id),
    ['conference', 'preprint', 'thesis'],
  );
  assert.equal(new Set(selected.map(({ href }) => href)).size, 1);
  assert.equal(selected[2].title, 'Project title');
  assert.equal(selected[2].venue, "Master's thesis, Example University · 2020");
  assert.equal(selected[0].authors, 'A. Lovelace*');
  assert.equal(
    selected[0].venue,
    'Example Conference 2022, AI for Science · Equal contribution',
  );
  assert.equal(selected[1].venue, 'arXiv:1234.56789 · 2020');
  assert.equal(catalog.publication('thesis').title, 'Project title');
});

test('publications follow selected project order, then frontmatter order, regardless of years or dates', () => {
  const entries = [
    record('recent-article', {
      date: '2025-01-01T12:00:00-05:00',
      publications: [paper('older-paper', { year: 2020 })],
    }),
    record('old-article', {
      date: '2019-01-01T12:00:00-05:00',
      publications: [paper('newer-paper', { year: 2024 })],
    }),
    record('same-year', {
      date: '2023-01-01T12:00:00-05:00',
      publications: [
        paper('zulu', { year: 2018 }),
        paper('alpha', { year: 2026 }),
      ],
    }),
    record('unselected', {
      date: '2099-01-01T12:00:00-05:00',
      publications: [paper('unselected-paper', { year: 2099 })],
    }),
    record('draft', {
      draft: true,
      publications: [paper('draft-paper', { year: 2099 })],
    }),
  ];
  const ids = Object.freeze(['recent-article', 'old-article', 'same-year']);
  const expected = [
    ['older-paper', 'newer-paper', 'zulu', 'alpha'],
    ['zulu', 'alpha', 'newer-paper', 'older-paper'],
  ];
  for (const input of [entries, entries.toReversed()]) {
    for (const [index, selection] of [ids, ids.toReversed()].entries()) {
      assert.deepEqual(
        createProjectCatalog(input)
          .publications(selection)
          .map(({ id }) => id),
        expected[index],
      );
    }
  }
});

test('project and publication selections are independent', () => {
  const catalog = createProjectCatalog([
    record('published', { publications: [paper('published-paper')] }),
  ]);
  assert.deepEqual(catalog.projects([]), []);
  assert.deepEqual(catalog.publications([]), []);
  assert.equal(catalog.projects(['published'])[0].id, 'published');
  assert.equal(catalog.publications(['published'])[0].id, 'published-paper');
  assert.equal(
    catalog.publication('published-paper').title,
    'Formal paper title',
  );
});

test('missing, draft, or repeated résumé references fail validation', () => {
  const catalog = createProjectCatalog([
    record('published', { publications: [paper('published-paper')] }),
    record('draft', { draft: true, publications: [paper('draft-paper')] }),
  ]);
  assert.throws(() => catalog.publication('missing'), /Unknown publication ID/);
  assert.throws(() => catalog.publication('draft-paper'), /draft project/);
  assert.throws(() => catalog.projects(['missing']), /Unknown project ID/);
  assert.throws(() => catalog.projects(['draft']), /draft project/);
  assert.throws(() => catalog.publications(['missing']), /Unknown project ID/);
  assert.throws(() => catalog.publications(['draft']), /draft project/);
  assert.throws(
    () => catalog.publications(['published-paper']),
    /Unknown project ID/,
  );
  assert.throws(
    () => catalog.projects(['published', 'published']),
    /Duplicate project ID in résumé projects/,
  );
  assert.throws(
    () => catalog.publications(['published', 'published']),
    /Duplicate project ID in résumé publications/,
  );
});

test('selecting a project without publications reports the invalid selection', () => {
  const catalog = createProjectCatalog([record('no-papers')]);
  assert.throws(
    () => catalog.publications(['no-papers']),
    /has no publications: no-papers/,
  );
});

test('duplicate content IDs fail validation even without a résumé selection', () => {
  assert.throws(
    () => createProjectCatalog([record('duplicate'), record('duplicate')]),
    /Duplicate project ID/,
  );
  assert.throws(
    () =>
      createProjectCatalog([
        record('one', { publications: [paper('same')] }),
        record('two', { publications: [paper('same')] }),
      ]),
    /Duplicate publication ID/,
  );
});

test('reading Markdown again sees edits immediately and validates the same frontmatter contract', (context) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'portfolio-content-'));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  const file = path.join(directory, 'example.md');
  const source = (title: string) =>
    `---\ntitle: ${title}\ndescription: Summary\ndate: 2020-05-15\n---\nBody\n`;
  writeFileSync(file, source('Before'));
  const url = pathToFileURL(`${directory}/`);
  assert.equal(
    createProjectCatalog(readContentEntries('projects', url)).projects([
      'example',
    ])[0].title,
    'Before',
  );
  writeFileSync(file, source('After'));
  assert.equal(
    createProjectCatalog(readContentEntries('projects', url)).projects([
      'example',
    ])[0].title,
    'After',
  );
  writeFileSync(
    file,
    source('After').replace('date: 2020-05-15', 'date: not-a-date'),
  );
  assert.throws(() => readContentEntries('projects', url), /Invalid content/);
});

test('invalid description overrides, authored media variants, and duplicate publication IDs are rejected', () => {
  for (const description of ['', '   ', 123]) {
    assert.throws(() => record('example', { resume: { description } }));
  }
  assert.throws(
    () =>
      record('example', {
        previewImages: [{ src: '/manual.webp', width: 480 }],
      }),
    /Unrecognized key/,
  );
  assert.throws(
    () =>
      record('example', {
        publications: [paper('duplicate'), paper('duplicate')],
      }),
    /Duplicate publication ID/,
  );
});
