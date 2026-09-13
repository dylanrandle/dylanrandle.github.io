import { expect, test } from '@playwright/test';
import {
  CONTENT_SECTIONS,
  contentDetailPath,
  ROUTES,
} from '../../src/config.ts';

const cubePath = contentDetailPath(
  CONTENT_SECTIONS.projects,
  'rubiks-cube-robot',
);
const golfPath = contentDetailPath(CONTENT_SECTIONS.projects, 'golf-cv');
const damagePath = contentDetailPath(
  CONTENT_SECTIONS.projects,
  'avoiding-object-damage-robotic-manipulation',
);
const equationsPath = contentDetailPath(
  CONTENT_SECTIONS.projects,
  'differential-equation-nn',
);

for (const [density, candidate] of [
  [1, '480w'],
  [1.75, '720w'],
  [2, '960w'],
  [3, 'robotic-object-damage.webp'],
] as const) {
  test.describe(`mobile display density ${density}`, () => {
    test.use({
      viewport: { width: 412, height: 823 },
      deviceScaleFactor: density,
    });

    test('the hero loads an appropriate image candidate', async ({ page }) => {
      await page.goto(damagePath);
      const hero = page.locator('.article-hero img');
      await expect(hero).toHaveAttribute('fetchpriority', 'high');
      await expect
        .poll(() =>
          hero.evaluate((image: HTMLImageElement) =>
            image.complete && image.naturalWidth > 0 ? image.currentSrc : '',
          ),
        )
        .toContain(candidate);
    });
  });
}

for (const width of [412, 1440]) {
  test.describe(`video layout at ${width}px`, () => {
    test.use({ viewport: { width, height: 960 } });

    test('loading media and replacing posters does not move the article', async ({
      page,
    }) => {
      let release!: () => void;
      const gate = new Promise<void>((resolve) => {
        release = resolve;
      });
      await page.route('**/assets/**', async (route) => {
        if (/\.(webp|mp4)$/.test(route.request().url())) await gate;
        await route.continue();
      });
      await page.goto(cubePath, { waitUntil: 'domcontentloaded' });
      const frames = page.locator('.article-hero, .article-media');
      const measure = () =>
        page
          .locator('.article-hero, .article-shell, .article-media')
          .evaluateAll((elements) =>
            elements.map((element) => {
              const { top, height } = element.getBoundingClientRect();
              return { top, height };
            }),
          );
      const before = await measure();
      expect(before[0].height).toBeGreaterThan(250);
      await expect(
        frames.locator('[data-video-poster]').first(),
      ).not.toHaveAttribute('hidden', '');
      release();
      for (const video of await frames.locator('video').all()) {
        await expect
          .poll(() =>
            video.evaluate((element: HTMLVideoElement) => element.readyState),
          )
          .toBeGreaterThanOrEqual(2);
        await expect(
          video.locator('..').locator('[data-video-poster]'),
        ).toBeHidden();
      }
      const after = await measure();
      after.forEach((box, index) => {
        expect(Math.abs(box.top - before[index].top)).toBeLessThan(1);
        expect(Math.abs(box.height - before[index].height)).toBeLessThan(1);
      });
      const heroVideo = page.locator('.article-hero video');
      await expect
        .poll(() =>
          heroVideo.evaluate((video: HTMLVideoElement) => video.currentSrc),
        )
        .toContain(
          width <= 960
            ? 'rubiks-cube-robot-solve-480w.mp4'
            : 'rubiks-cube-robot-solve.mp4',
        );
      await expect
        .poll(() =>
          page
            .locator('.article-media video')
            .evaluate((video: HTMLVideoElement) => video.currentSrc),
        )
        .toContain(
          width <= 960
            ? 'rubiks-cube-robot-inspect-480w.mp4'
            : 'rubiks-cube-robot-inspect-960w.mp4',
        );
    });
  });
}

for (const [width, density, card, hero, inline] of [
  [412, 1, '-480w', '-480w', '-480w'],
  [412, 1.75, '-720w', '-720w', '-720w'],
  [412, 2, '-960w', '-960w', '-960w'],
  [412, 3, '-960w', '', ''],
  [1440, 1, '-480w', '', '-960w'],
  [1440, 2, '-720w', '', ''],
  [1440, 3, '-960w', '', ''],
] as const) {
  test.describe(`video selection at ${width}px and ${density}x density`, () => {
    test.use({ viewport: { width, height: 960 }, deviceScaleFactor: density });
    test('the browser loads only the selected video encodes', async ({
      page,
    }) => {
      const requested = new Set<string>();
      page.on('request', (request) => {
        const pathname = new URL(request.url()).pathname;
        if (pathname.endsWith('.mp4')) requested.add(pathname);
      });
      await page.goto(ROUTES.home.href);
      const cardVideo = page.locator(
        `.content-card > a[href="${cubePath}"] video`,
      );
      await expect
        .poll(() =>
          cardVideo.evaluate((video: HTMLVideoElement) => video.currentSrc),
        )
        .toContain(`rubiks-cube-robot-solve${card}.mp4`);
      requested.clear();
      await page.goto(cubePath);
      for (const [selector, filename] of [
        ['.article-hero video', `rubiks-cube-robot-solve${hero}.mp4`],
        ['.article-media video', `rubiks-cube-robot-inspect${inline}.mp4`],
      ]) {
        await expect
          .poll(() =>
            page
              .locator(selector)
              .evaluate((video: HTMLVideoElement) =>
                video.readyState >= 2 ? video.currentSrc : '',
              ),
          )
          .toContain(filename);
      }
      expect([...requested].sort()).toEqual([
        `/assets/videos/rubiks-cube-robot-inspect${inline}.mp4`,
        `/assets/videos/rubiks-cube-robot-solve${hero}.mp4`,
      ]);
    });
  });
}

for (const width of [601, 700, 900, 1440]) {
  test.describe(`cover video selection at ${width}px and 2x density`, () => {
    test.use({
      viewport: { width, height: 960 },
      deviceScaleFactor: 2,
      javaScriptEnabled: false,
    });

    test('native sources cover the drawn video width before cropping', async ({
      page,
    }) => {
      const requested = new Set<string>();
      page.on('request', (request) => {
        const pathname = new URL(request.url()).pathname;
        if (pathname.endsWith('.mp4')) requested.add(pathname);
      });
      await page.goto(ROUTES.home.href);
      for (const [path, filename] of [
        [golfPath, 'golf-cv-960w.mp4'],
        [cubePath, 'rubiks-cube-robot-solve-720w.mp4'],
      ]) {
        const video = page.locator(`.content-card > a[href="${path}"] video`);
        await expect
          .poll(() =>
            video.evaluate((element: HTMLVideoElement) =>
              element.readyState >= 2 ? element.currentSrc : '',
            ),
          )
          .toContain(filename);
        const dimensions = await video.evaluate((element: HTMLVideoElement) => {
          const { width, height } = element.getBoundingClientRect();
          const aspectRatio = Number(
            getComputedStyle(element).getPropertyValue('--media-ratio'),
          );
          return {
            fit: getComputedStyle(element).objectFit,
            requiredWidth:
              Math.max(width, height * aspectRatio) * devicePixelRatio,
            selectedWidth: Number(
              element.currentSrc.match(/-(\d+)w\.mp4$/)?.[1],
            ),
          };
        });
        expect(dimensions.fit).toBe('cover');
        expect(dimensions.selectedWidth).toBeGreaterThanOrEqual(
          dimensions.requiredWidth,
        );
      }
      expect([...requested].sort()).toEqual([
        '/assets/videos/golf-cv-960w.mp4',
        '/assets/videos/rubiks-cube-robot-solve-720w.mp4',
      ]);
    });
  });
}

test('inline images and video posters use responsive selection without JavaScript', async ({
  browser,
}) => {
  const context = await browser.newContext({
    baseURL: test.info().project.use.baseURL,
    viewport: { width: 412, height: 823 },
    deviceScaleFactor: 1.75,
    javaScriptEnabled: false,
  });
  const page = await context.newPage();
  await page.goto(equationsPath);
  const inlineImage = page.locator('.article-media img');
  await inlineImage.scrollIntoViewIfNeeded();
  await expect
    .poll(() =>
      inlineImage.evaluate((image: HTMLImageElement) => image.currentSrc),
    )
    .toContain('-720w.webp');
  await page.goto(cubePath);
  const poster = page.locator('.article-hero [data-video-poster]');
  await expect(poster).toBeVisible();
  await expect
    .poll(() => poster.evaluate((image: HTMLImageElement) => image.currentSrc))
    .toContain('-720w.webp');
  await expect
    .poll(() =>
      page
        .locator('.article-hero video')
        .evaluate((video: HTMLVideoElement) => video.currentSrc),
    )
    .toContain('rubiks-cube-robot-solve-720w.mp4');
  await context.close();
});

test('math styles load only on pages with equations', async ({ request }) => {
  const home = await (await request.get(ROUTES.home.href)).text();
  const imageProject = await (await request.get(damagePath)).text();
  const mathProject = await (await request.get(equationsPath)).text();
  expect(home).not.toContain('KaTeX_Main');
  expect(imageProject).not.toContain('KaTeX_Main');
  expect(mathProject).toContain('KaTeX_Main');
});
