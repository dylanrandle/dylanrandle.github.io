import { expect, test } from '@playwright/test';
import {
  CONTENT_SECTIONS,
  contentDetailPath,
  NAV_ITEMS,
  ROUTES,
  SITE,
  UI_LABELS,
} from '../../src/config.ts';
import { profile } from '../../src/data/profile.ts';

const topLevelPages = [
  {
    path: ROUTES.home.href,
    title: new RegExp(`${SITE.title} · ${SITE.tagline}`),
  },
  {
    path: ROUTES.projects.href,
    title: new RegExp(`${ROUTES.projects.label} · ${SITE.title}`),
  },
  {
    path: ROUTES.blog.href,
    title: new RegExp(`${ROUTES.blog.label} · ${SITE.title}`),
  },
  {
    path: ROUTES.about.href,
    title: new RegExp(`${ROUTES.about.label} · ${SITE.title}`),
  },
] as const;

const contentIndexes = [
  CONTENT_SECTIONS.projects,
  CONTENT_SECTIONS.posts,
] as const;

test('top-level pages render successfully', async ({ page }) => {
  for (const entry of topLevelPages) {
    const response = await page.goto(entry.path);

    expect(
      response?.ok(),
      `${entry.path} should return a successful response`,
    ).toBe(true);
    await expect(page).toHaveTitle(entry.title);
    await expect(page.locator('main h1').first()).toBeVisible();
  }
});

for (const entry of contentIndexes) {
  test(`${entry.singularLabel} cards open the correct detail routes`, async ({
    page,
  }) => {
    await page.goto(entry.indexPath);

    const cardLinks = page.locator('.content-card > a');
    expect(await cardLinks.count()).toBeGreaterThan(0);

    const hrefs = await cardLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    const routePattern = new RegExp(`^${entry.detailBase}/[^/]+/$`);
    expect(
      hrefs.every((href) => href !== null && routePattern.test(href)),
    ).toBe(true);

    const firstHref = await cardLinks.first().getAttribute('href');
    expect(firstHref).toMatch(routePattern);
    await cardLinks.first().click();
    await expect(page).toHaveURL(new RegExp(`${entry.detailBase}/[^/]+/$`));
    await expect(page.locator('main h1').first()).toBeVisible();
  });
}

test('navigation identifies the active top-level page', async ({ page }) => {
  for (const entry of NAV_ITEMS) {
    await page.goto(entry.href);

    const currentLink = page.locator('.nav-links a[aria-current="page"]');
    await expect(currentLink).toHaveCount(1);
    await expect(currentLink).toHaveText(entry.label);
    await expect(currentLink).toHaveAttribute('href', entry.href);
  }
});

test('theme selection persists across reloads', async ({ page }) => {
  await page.goto(ROUTES.home.href);

  const root = page.locator('html');
  const initialTheme = await root.getAttribute('data-theme');
  expect(['light', 'dark']).toContain(initialTheme);

  const nextTheme = initialTheme === 'dark' ? 'light' : 'dark';
  await page.getByRole('button', { name: UI_LABELS.themeToggle }).click();
  await expect(root).toHaveAttribute('data-theme', nextTheme);

  await page.reload();
  await expect(root).toHaveAttribute('data-theme', nextTheme);
  expect(await page.evaluate(() => localStorage.getItem('theme'))).toBe(
    nextTheme,
  );
});

test('About renders the canonical résumé and offers its PDF', async ({
  page,
  request,
}) => {
  await page.goto(ROUTES.about.href);

  const sectionExpectations = [
    {
      name: 'summary',
      locator: page.locator('.resume-section.summary'),
      values: [profile.resume.summary],
    },
    {
      name: 'experience',
      locator: page.locator('#experience'),
      values: profile.resume.experience.flatMap((employer) => [
        employer.organization,
        employer.location,
        ...employer.roles.flatMap((role) => [
          role.title,
          role.period,
          ...role.bullets,
        ]),
      ]),
    },
    {
      name: 'education',
      locator: page.locator('#education'),
      values: profile.resume.education.flatMap((entry) => [
        entry.school,
        entry.degree,
        entry.period,
        entry.location,
        ...entry.bullets,
      ]),
    },
    {
      name: 'publications',
      locator: page.locator('#publications'),
      values: profile.resume.publications.flatMap((publication) => [
        publication.title,
        publication.authors,
        publication.venue,
      ]),
    },
    {
      name: 'projects',
      locator: page.locator('#projects'),
      values: profile.resume.projects.flatMap((project) => [
        project.title,
        project.date,
        project.description,
      ]),
    },
    {
      name: 'skills',
      locator: page.locator('#skills'),
      values: profile.resume.skills.flatMap((skill) => [
        skill.label,
        skill.value,
      ]),
    },
  ];

  const normalizeWhitespace = (value: string) =>
    value.replace(/\s+/g, ' ').trim();

  for (const section of sectionExpectations) {
    const renderedText = normalizeWhitespace(
      (await section.locator.textContent()) ?? '',
    );
    for (const value of section.values) {
      expect(
        renderedText,
        `The About ${section.name} section should render "${value}" from profile.ts`,
      ).toContain(normalizeWhitespace(value));
    }
  }

  for (const publication of profile.resume.publications) {
    await expect(
      page.locator('#publications').getByRole('link', {
        name: publication.title,
      }),
    ).toHaveAttribute('href', publication.href);
  }
  await expect(page.locator('#projects .project-list a')).toHaveCount(0);

  const resumeLink = page.getByRole('link', { name: 'Download résumé' });
  const resumePath = await resumeLink.getAttribute('href');
  expect(resumePath).toBe(profile.links.cv);

  const response = await request.get(resumePath!);
  expect(response.ok()).toBe(true);
  expect(response.headers()['content-type']).toContain('application/pdf');
});

test('motion-focused projects use muted looping video previews and heroes', async ({
  page,
}) => {
  const projectIds = ['golf-cv', 'rubiks-cube-robot'];

  await page.goto(CONTENT_SECTIONS.projects.indexPath);

  for (const projectId of projectIds) {
    const detailPath = contentDetailPath(CONTENT_SECTIONS.projects, projectId);
    const cardVideo = page.locator(
      `.content-card > a[href="${detailPath}"] video`,
    );
    await expect(cardVideo).toBeVisible();
    await expect(cardVideo).toHaveJSProperty('muted', true);
    await expect(cardVideo).toHaveJSProperty('loop', true);

    const source = await cardVideo.locator('source').getAttribute('src');
    expect(source).toBeTruthy();

    await page.goto(detailPath);
    const heroVideo = page.locator('video.article-hero');
    await expect(heroVideo).toBeVisible();
    await expect(heroVideo).toHaveJSProperty('muted', true);
    await expect(heroVideo).toHaveJSProperty('loop', true);
    await expect(heroVideo).toHaveJSProperty('controls', true);
    await expect(heroVideo.locator('source')).toHaveAttribute('src', source!);

    await page.goto(CONTENT_SECTIONS.projects.indexPath);
  }
});

test('Rubik project includes a separate inspection video', async ({ page }) => {
  await page.goto(
    contentDetailPath(CONTENT_SECTIONS.projects, 'rubiks-cube-robot'),
  );

  const heroVideo = page.locator('video.article-hero');
  const inspectionVideo = page.locator('.prose video');
  await expect(heroVideo).toBeVisible();
  await expect(heroVideo).toHaveCSS('object-fit', 'contain');
  await expect(inspectionVideo).toBeVisible();
  await expect(inspectionVideo).toHaveJSProperty('muted', true);
  await expect(inspectionVideo).toHaveJSProperty('loop', true);
  await expect(inspectionVideo).toHaveJSProperty('controls', true);

  const heroSource = await heroVideo.locator('source').getAttribute('src');
  const inspectionSource = await inspectionVideo
    .locator('source')
    .getAttribute('src');
  expect(heroSource).toBeTruthy();
  expect(inspectionSource).toBeTruthy();
  expect(inspectionSource).not.toBe(heroSource);
});

test.describe('mobile layout', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  test('top-level pages do not overflow horizontally', async ({ page }) => {
    for (const entry of topLevelPages) {
      await page.goto(entry.path);

      const hasHorizontalOverflow = await page.evaluate(
        () =>
          document.documentElement.scrollWidth >
          document.documentElement.clientWidth,
      );
      expect(
        hasHorizontalOverflow,
        `${entry.path} should fit within the mobile viewport`,
      ).toBe(false);
    }
  });
});
