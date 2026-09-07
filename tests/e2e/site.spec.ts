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
  const projects = [
    {
      id: 'golf-cv',
      previewPoster: '/assets/images/golf-cv-960w.webp',
      previewVideo: '/assets/videos/golf-cv-960w.mp4',
      video: '/assets/videos/golf-cv.mp4',
    },
    {
      id: 'rubiks-cube-robot',
      previewPoster: '/assets/images/rubiks-cube-robot-960w.webp',
      previewVideo: '/assets/videos/rubiks-cube-robot-solve-960w.mp4',
      video: '/assets/videos/rubiks-cube-robot-solve.mp4',
    },
  ];

  await page.goto(CONTENT_SECTIONS.projects.indexPath);
  const indexResponse = await page.request.get(
    CONTENT_SECTIONS.projects.indexPath,
  );
  const indexMarkup = await indexResponse.text();

  for (const project of projects) {
    const detailPath = contentDetailPath(CONTENT_SECTIONS.projects, project.id);
    const cardVideo = page.locator(
      `.content-card > a[href="${detailPath}"] video`,
    );
    await expect(cardVideo).toBeVisible();
    await expect(cardVideo).toHaveJSProperty('muted', true);
    await expect(cardVideo).toHaveJSProperty('loop', true);

    const source = await cardVideo.locator('source').getAttribute('src');
    expect(source).toBe(project.previewVideo);
    expect(indexMarkup).toContain(`poster="${project.previewPoster}"`);

    await page.goto(detailPath);
    const heroVideo = page.locator('video.article-hero');
    await expect(heroVideo).toBeVisible();
    await expect(heroVideo).toHaveJSProperty('muted', true);
    await expect(heroVideo).toHaveJSProperty('loop', true);
    await expect(heroVideo).toHaveJSProperty('controls', false);
    await expect(heroVideo.locator('source')).toHaveAttribute(
      'src',
      project.video,
    );

    await page.goto(CONTENT_SECTIONS.projects.indexPath);
  }
});

test('loaded video previews show their first frame instead of the poster', async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await page.goto(CONTENT_SECTIONS.projects.indexPath);

  const videos = page.locator('.content-card video');
  await expect(videos).toHaveCount(2);

  for (let index = 0; index < (await videos.count()); index += 1) {
    const video = videos.nth(index);
    await expect
      .poll(() =>
        video.evaluate(
          (element: HTMLVideoElement) =>
            element.readyState >= element.HAVE_CURRENT_DATA,
        ),
      )
      .toBe(true);
    await expect(video).not.toHaveAttribute('poster', /.+/);
    await expect(video).toHaveJSProperty('paused', true);
  }
});

test('all image cards use responsive preview assets', async ({ page }) => {
  const sections = [
    { path: CONTENT_SECTIONS.projects.indexPath, imageCount: 14 },
    { path: CONTENT_SECTIONS.posts.indexPath, imageCount: 2 },
  ];

  for (const section of sections) {
    await page.goto(section.path);
    const cardImages = page.locator('.content-card img');
    await expect(cardImages).toHaveCount(section.imageCount);

    for (let index = 0; index < section.imageCount; index += 1) {
      const cardImage = cardImages.nth(index);
      await expect(cardImage).toHaveAttribute('srcset', / 480w(?:,|$)/);
      await expect(cardImage).toHaveAttribute(
        'sizes',
        '(max-width: 600px) calc(100vw - 1.5rem), (max-width: 1200px) 30vw, 348px',
      );

      await cardImage.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          cardImage.evaluate((image: HTMLImageElement) => image.currentSrc),
        )
        .toMatch(/-480w\.webp$/);
    }
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
  await expect(inspectionVideo).toHaveJSProperty('controls', false);
  await expect(inspectionVideo).toHaveAttribute('data-autoplay-video', '');

  await inspectionVideo.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      inspectionVideo.evaluate((video: HTMLVideoElement) => !video.paused),
    )
    .toBe(true);

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
