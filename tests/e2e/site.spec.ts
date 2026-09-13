import { expect, test } from '@playwright/test';
import {
  CONTENT_SECTIONS,
  contentDetailPath,
  NAV_ITEMS,
  ROUTES,
  UI_LABELS,
} from '../../src/config.ts';
import { resumeSelection } from '../../src/data/profile.ts';
import { getProfile } from '../../src/lib/resume.ts';
import { SITE } from '../../src/lib/site.ts';
import { readContentEntries } from '../../src/lib/read-content.ts';
import { resolveContentMedia } from '../../src/lib/media.ts';

const profile = getProfile();

const contentInventory = {
  projects: readContentEntries('projects').filter(({ data }) => !data.draft),
  posts: readContentEntries('posts').filter(({ data }) => !data.draft),
};

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
    const expectedEntries = contentInventory[entry.collection].toSorted(
      (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
    );
    expect(expectedEntries.length).toBeGreaterThan(0);
    await expect(cardLinks).toHaveCount(expectedEntries.length);
    await expect(page.locator('.content-card-body > p')).toHaveText(
      expectedEntries.map(({ data }) => data.description),
    );

    const hrefs = await cardLinks.evaluateAll((links) =>
      links.map((link) => link.getAttribute('href')),
    );
    expect(hrefs).toEqual(
      expectedEntries.map((record) => contentDetailPath(entry, record.id)),
    );
    const routePattern = new RegExp(`^${entry.detailBase}/[^/]+/$`);
    expect(
      hrefs.every((href) => href !== null && routePattern.test(href)),
    ).toBe(true);

    // Exercise distinct website/résumé wording when the collection has it.
    const example =
      expectedEntries.find(({ data }) => data.resume?.description) ??
      expectedEntries[0];
    const detailPath = contentDetailPath(entry, example.id);
    await page.locator(`.content-card > a[href="${detailPath}"]`).click();
    await expect(page).toHaveURL(new RegExp(`${entry.detailBase}/[^/]+/$`));
    await expect(page.locator('main h1').first()).toBeVisible();
    await expect(page.locator('.page-header .lede')).toHaveText(
      example.data.description,
    );
    for (const selector of [
      'meta[name="description"]',
      'meta[property="og:description"]',
      'meta[name="twitter:description"]',
    ]) {
      await expect(page.locator(selector)).toHaveAttribute(
        'content',
        example.data.description,
      );
    }
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

  expect(profile.resume.projects.map(({ id }) => id)).toEqual(
    resumeSelection.projects,
  );
  expect(profile.resume.publications.map(({ id }) => id)).toEqual(
    resumeSelection.publications.flatMap((id) => {
      const entry = contentInventory.projects.find((entry) => entry.id === id)!;
      return entry.data.publications.map(({ id }) => id);
    }),
  );
  await expect(page.locator('#projects .project-list h3')).toHaveText(
    profile.resume.projects.map(({ title }) => title),
  );
  await expect(page.locator('#publications .publication-list h3')).toHaveText(
    profile.resume.publications.map(({ title }) => title),
  );

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
  const projects = await Promise.all(
    contentInventory.projects
      .filter(({ data }) => data.video)
      .map(async (entry) => {
        const media = await resolveContentMedia(entry.data);
        return {
          id: entry.id,
          video: entry.data.video!,
          previewVideo: media.previewVideos?.[0]?.src ?? entry.data.video!,
        };
      }),
  );
  expect(projects.length).toBeGreaterThan(0);

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

    const source = await cardVideo
      .locator('source')
      .first()
      .getAttribute('src');
    expect(source).toBe(project.previewVideo);
    expect(indexMarkup).toContain('data-video-poster');

    await page.goto(detailPath);
    const heroVideo = page.locator('.article-hero video');
    await expect(heroVideo).toBeVisible();
    await expect(heroVideo).toHaveJSProperty('muted', true);
    await expect(heroVideo).toHaveJSProperty('loop', true);
    await expect(heroVideo).toHaveJSProperty('controls', false);
    await expect(heroVideo.locator('source').last()).toHaveAttribute(
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
  await expect(videos).toHaveCount(
    contentInventory.projects.filter(({ data }) => data.video).length,
  );

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
    await expect(
      video.locator('..').locator('[data-video-poster]'),
    ).toBeHidden();
    await expect(video).toHaveJSProperty('paused', true);
  }
});

for (const width of [390, 1440]) {
  test(`all image cards use visible responsive previews at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 844 });
    for (const section of contentIndexes) {
      const expectedImages = contentInventory[section.collection].filter(
        ({ data }) => data.image && !data.video,
      );
      await page.goto(section.indexPath);
      await expect(
        page.locator('.content-card img:not([data-video-poster])'),
      ).toHaveCount(expectedImages.length);
      for (const entry of expectedImages) {
        const media = await resolveContentMedia(entry.data);
        const cardImage = page.locator(
          `.content-card > a[href="${contentDetailPath(section, entry.id)}"] img`,
        );
        await expect(cardImage).toHaveAttribute('alt', entry.data.image!.alt);
        await expect(cardImage).toHaveAttribute('src', media.imageSrc!);
        await expect(cardImage).toHaveAttribute(
          'srcset',
          media
            .previewImages!.map(({ src, width }) => `${src} ${width}w`)
            .join(', '),
        );
        await expect(cardImage).toHaveAttribute('sizes', /.+/);
        await cardImage.scrollIntoViewIfNeeded();
        await expect(cardImage).toBeVisible();
        await expect
          .poll(() =>
            cardImage.evaluate((image: HTMLImageElement) => ({
              path: image.currentSrc ? new URL(image.currentSrc).pathname : '',
              loaded: image.complete && image.naturalWidth > 0,
            })),
          )
          .toEqual({ path: media.previewImages![0].src, loaded: true });
      }
    }
  });
}

test('project pages end with collaborator credits and inline resource links', async ({
  page,
}) => {
  for (const entry of contentInventory.projects.filter(
    ({ data }) => data.links.length,
  )) {
    await page.goto(contentDetailPath(CONTENT_SECTIONS.projects, entry.id));
    const footer = page.locator('.content-footer');
    await expect(footer).toBeVisible();
    await expect(footer.getByRole('heading')).toHaveCount(0);
    await expect(footer.locator('ul, ol')).toHaveCount(0);
    const publications = entry.data.publications;
    const collaborators = [
      ...new Set(
        publications.flatMap(({ authors }) => authors.map(({ name }) => name)),
      ),
    ].filter((name) => name !== profile.displayName);
    if (collaborators.length) {
      const credits = footer.locator('.content-credits');
      await expect(credits).toHaveCount(1);
      const text = await credits.innerText();
      for (const name of collaborators)
        expect(text.split(name).length - 1).toBe(1);
    }
    expect(
      await footer.locator('.content-links a').evaluateAll((anchors) =>
        anchors.map((anchor) => ({
          label: anchor.textContent?.trim(),
          href: anchor.getAttribute('href'),
        })),
      ),
    ).toEqual(entry.data.links);
    await expect(
      page.locator(
        'a[href="#publications-heading"], a[href="#resources-heading"]',
      ),
    ).toHaveCount(0);
  }
});

test('Rubik project includes a separate inspection video', async ({ page }) => {
  await page.goto(
    contentDetailPath(CONTENT_SECTIONS.projects, 'rubiks-cube-robot'),
  );

  const heroVideo = page.locator('.article-hero video');
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

  const heroSource = await heroVideo
    .locator('source')
    .last()
    .getAttribute('src');
  const inspectionSource = await inspectionVideo
    .locator('source')
    .last()
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
