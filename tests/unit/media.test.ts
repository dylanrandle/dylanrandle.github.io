import assert from 'node:assert/strict';
import { copyFileSync, mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { test, type TestContext } from 'node:test';
import sharp from 'sharp';
import { readVideoMetadata, resolveContentMedia } from '../../src/lib/media.ts';
import { renderArticleMedia, renderMedia } from '../../src/lib/render-media.ts';

const imageData = (src: string) => ({
  image: { src, alt: 'Test image', fit: 'contain' as const },
});

const fixture = (context: TestContext) => {
  const directory = mkdtempSync(path.join(tmpdir(), 'portfolio-media-'));
  context.after(() => rmSync(directory, { recursive: true, force: true }));
  return directory;
};
const writeImage = (directory: string, name: string, width: number) =>
  sharp({
    create: {
      width,
      height: Math.round(width * 0.75),
      channels: 3,
      background: '#778899',
    },
  })
    .webp()
    .toFile(path.join(directory, name));

test('media dimensions come from the files and a small source is reused without upscaling', async (context) => {
  const directory = fixture(context);
  await writeImage(directory, 'image.webp', 800);
  await writeImage(directory, 'image-480w.webp', 480);
  await writeImage(directory, 'image-720w.webp', 720);
  const media = await resolveContentMedia(imageData('/image.webp'), directory);
  assert.equal(media.imageWidth, 800);
  assert.equal(media.imageHeight, 600);
  assert.deepEqual(media.previewImages, [
    { src: '/image-480w.webp', width: 480 },
    { src: '/image-720w.webp', width: 720 },
    { src: '/image.webp', width: 800 },
  ]);
  await writeImage(directory, 'tiny.webp', 320);
  assert.deepEqual(
    (await resolveContentMedia(imageData('/tiny.webp'), directory))
      .previewImages,
    [{ src: '/tiny.webp', width: 320 }],
  );
});

test('missing previews and incorrect filename width descriptors fail validation', async (context) => {
  const directory = fixture(context);
  await writeImage(directory, 'image.webp', 1200);
  await assert.rejects(
    resolveContentMedia(imageData('/image.webp'), directory),
    /Missing 480px preview/,
  );
  await writeImage(directory, 'image-480w.webp', 400);
  await assert.rejects(
    resolveContentMedia(imageData('/image.webp'), directory),
    /Incorrect width descriptor/,
  );
  await writeImage(directory, 'image-480w.webp', 480);
  await assert.rejects(
    resolveContentMedia(imageData('/image.webp'), directory),
    /Missing 720px preview/,
  );
  await writeImage(directory, 'image-720w.webp', 720);
  await assert.rejects(
    resolveContentMedia(imageData('/image.webp'), directory),
    /Missing 960px preview/,
  );
});

test('media edits are re-read instead of using stale dimensions from a prior call', async (context) => {
  const directory = fixture(context);
  await writeImage(directory, 'image.webp', 300);
  assert.equal(
    (await resolveContentMedia(imageData('/image.webp'), directory)).imageWidth,
    300,
  );
  await writeImage(directory, 'image.webp', 200);
  assert.equal(
    (await resolveContentMedia(imageData('/image.webp'), directory)).imageWidth,
    200,
  );
});

test('an animated preview cannot silently lose frames', async (context) => {
  const directory = fixture(context);
  const original = new URL(
    '../../public/assets/images/harvard-grad.webp',
    import.meta.url,
  );
  await sharp(original.pathname, { animated: true })
    .resize({ width: 600 })
    .webp()
    .toFile(path.join(directory, 'animation.webp'));
  await sharp(original.pathname)
    .resize({ width: 480 })
    .webp()
    .toFile(path.join(directory, 'animation-480w.webp'));
  await assert.rejects(
    resolveContentMedia(imageData('/animation.webp'), directory),
    /preserve frames/,
  );
});

test('video layout uses video metadata and re-reads a replaced asset', async (context) => {
  const directory = fixture(context);
  await writeImage(directory, 'poster.webp', 320);
  const video = path.join(directory, 'demo.mp4');
  copyFileSync(
    new URL(
      '../../public/assets/videos/rubiks-cube-robot-solve.mp4',
      import.meta.url,
    ),
    video,
  );
  const media = await resolveContentMedia(
    { ...imageData('/poster.webp'), video: '/demo.mp4' },
    directory,
  );
  assert.equal(media.imageWidth, 320);
  assert.equal(media.videoWidth, 1288);
  assert.equal(media.videoHeight, 1078);
  assert.equal(media.videoAspectRatio, 1288 / 1078);
  copyFileSync(
    new URL('../../public/assets/videos/golf-cv.mp4', import.meta.url),
    video,
  );
  assert.equal((await readVideoMetadata('/demo.mp4', directory)).width, 1920);
  copyFileSync(
    new URL(
      '../../public/assets/videos/rubiks-cube-robot-solve-480w.mp4',
      import.meta.url,
    ),
    video,
  );
  // An already-small source must remain playable even on a large display.
  assert.match(
    await renderMedia(
      { ...imageData('/poster.webp'), video: '/demo.mp4' },
      'hero',
      directory,
    ),
    /<source src="\/demo.mp4" type="video\/mp4">/,
  );
});

test('article media resolves fresh assets without changing surrounding HTML', async (context) => {
  const directory = fixture(context);
  const assets = path.join(directory, 'assets');
  mkdirSync(assets);
  await writeImage(assets, 'image.webp', 320);
  const before =
    '<p id="example">A &amp; B <img src="/assets/image.webp" alt="A &quot;quoted&quot; caption"> end.</p><code>&lt;img src="example"&gt;</code>';
  const first = await renderArticleMedia(before, directory);
  assert.ok(first.startsWith('<p id="example">A &amp; B '));
  assert.ok(first.endsWith(' end.</p><code>&lt;img src="example"&gt;</code>'));
  assert.match(first, /alt="A &quot;quoted&quot; caption"/);
  assert.match(first, /width="320"/);
  await writeImage(assets, 'image.webp', 200);
  assert.match(await renderArticleMedia(before, directory), /width="200"/);
});
