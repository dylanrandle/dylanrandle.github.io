import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { PREVIEW_WIDTHS } from '../config.ts';
import type { ContentData } from '../data/content-schema.ts';
import { PUBLIC_DIRECTORY } from './paths.ts';

export const assetPath = (src: string, directory: string) => {
  const target = path.resolve(directory, src.slice(1));
  if (!target.startsWith(`${path.resolve(directory)}${path.sep}`)) {
    throw new Error(`Asset must be inside public: ${src}`);
  }
  return target;
};

const probe = promisify(execFile);

export const readVideoMetadata = async (
  src: string,
  directory = PUBLIC_DIRECTORY,
) => {
  const { stdout } = await probe('ffprobe', [
    '-v',
    'error',
    '-select_streams',
    'v:0',
    '-show_entries',
    'stream=width,height,sample_aspect_ratio:stream_side_data=rotation',
    '-of',
    'json',
    assetPath(src, directory),
  ]);
  const stream = JSON.parse(stdout).streams[0];
  if (!stream?.width || !stream.height)
    throw new Error(`Missing video dimensions: ${src}`);
  const [numerator, denominator] = (stream.sample_aspect_ratio ?? '1:1')
    .split(':')
    .map(Number);
  const pixelRatio = numerator && denominator ? numerator / denominator : 1;
  const rotated = (stream.side_data_list ?? []).some(
    ({ rotation }: { rotation?: number }) =>
      rotation && Math.abs(rotation) % 180 === 90,
  );
  return {
    width: stream.width as number,
    height: stream.height as number,
    aspectRatio: rotated
      ? stream.height / (stream.width * pixelRatio)
      : (stream.width * pixelRatio) / stream.height,
  };
};

export const readImageMetadata = async (
  src: string,
  directory = PUBLIC_DIRECTORY,
) => {
  // Buffer input avoids libvips reusing metadata for a replaced file path.
  const metadata = await sharp(readFileSync(assetPath(src, directory)), {
    animated: true,
  }).metadata();
  return {
    width: metadata.width,
    height: metadata.pageHeight ?? metadata.height,
    frames: metadata.pages ?? 1,
    delay: metadata.delay ?? [],
    loop: metadata.loop,
    hasAlpha: metadata.hasAlpha,
  };
};

export interface ContentMedia {
  imageSrc?: string;
  imageWidth?: number;
  imageHeight?: number;
  previewImages?: { src: string; width: number }[];
  previewVideos?: { src: string; width: number }[];
  videoWidth?: number;
  videoHeight?: number;
  videoAspectRatio?: number;
}

// Generate media metadata from the assets without maintaining a second list of
// filenames and dimensions. Existing encodes are never edited.
export const resolveContentMedia = async (
  data: Pick<ContentData, 'image' | 'video'>,
  directory = PUBLIC_DIRECTORY,
): Promise<ContentMedia> => {
  const result: ContentMedia = {};
  if (data.image) {
    const imageSrc = data.image.src;
    const source = await readImageMetadata(imageSrc, directory);
    const webp = imageSrc.replace(/\.[^.]+$/, '.webp');
    result.imageSrc = imageSrc;
    if (webp !== imageSrc && existsSync(assetPath(webp, directory))) {
      const optimized = await readImageMetadata(webp, directory);
      if (JSON.stringify(optimized) !== JSON.stringify(source))
        throw new Error(
          `Optimized image must preserve source metadata: ${webp}`,
        );
      result.imageSrc = webp;
    }
    result.imageWidth = source.width;
    result.imageHeight = source.height;
    result.previewImages = [];
    const stem = imageSrc.replace(/\.[^.]+$/, '');
    for (const width of PREVIEW_WIDTHS) {
      if (width > source.width) continue;
      const src = `${stem}-${width}w.webp`;
      if (!existsSync(assetPath(src, directory))) {
        if (width === source.width && result.imageSrc.endsWith('.webp'))
          continue;
        throw new Error(`Missing ${width}px preview for ${imageSrc}: ${src}`);
      }
      const preview = await readImageMetadata(src, directory);
      if (preview.width !== width)
        throw new Error(
          `Incorrect width descriptor for ${src}: actual width ${preview.width}`,
        );
      const expectedHeight = Math.round((source.height * width) / source.width);
      if (Math.abs(preview.height - expectedHeight) > 1)
        throw new Error(
          `Preview aspect ratio differs from ${imageSrc}: ${src}`,
        );
      if (
        preview.frames !== source.frames ||
        JSON.stringify(preview.delay) !== JSON.stringify(source.delay) ||
        preview.loop !== source.loop ||
        (source.hasAlpha && !preview.hasAlpha)
      ) {
        throw new Error(
          `Preview must preserve frames, timing, looping, and transparency: ${src}`,
        );
      }
      result.previewImages.push({ src, width });
    }
    const largest = result.previewImages.at(-1)?.width ?? 0;
    if (source.width <= PREVIEW_WIDTHS.at(-1)! && source.width > largest) {
      result.previewImages.push({ src: result.imageSrc, width: source.width });
    }
    if (!result.previewImages.length)
      throw new Error(`No responsive image candidates for ${imageSrc}`);
  }
  if (data.video) {
    if (!existsSync(assetPath(data.video, directory)))
      throw new Error(`Missing video: ${data.video}`);
    const source = await readVideoMetadata(data.video, directory);
    result.videoWidth = source.width;
    result.videoHeight = source.height;
    result.videoAspectRatio = source.aspectRatio;
    result.previewVideos = [];
    for (const width of PREVIEW_WIDTHS) {
      if (width >= source.width) continue;
      const preview: string = data.video.replace(/\.mp4$/, `-${width}w.mp4`);
      if (preview === data.video || !existsSync(assetPath(preview, directory)))
        continue;
      const candidate = await readVideoMetadata(preview, directory);
      if (candidate.width !== width)
        throw new Error(`Incorrect video preview width: ${preview}`);
      if (Math.abs(candidate.aspectRatio / source.aspectRatio - 1) > 0.005)
        throw new Error(`Video preview aspect ratio differs: ${preview}`);
      result.previewVideos.push({ src: preview, width });
    }
    if (source.width <= PREVIEW_WIDTHS.at(-1)!)
      result.previewVideos.push({ src: data.video, width: source.width });
  }
  return result;
};

export const imageSrcset = (media: ContentMedia, includeOriginal = false) => {
  const candidates = [...(media.previewImages ?? [])];
  if (
    includeOriginal &&
    media.imageSrc &&
    media.imageWidth &&
    !candidates.some(({ width }) => width === media.imageWidth)
  ) {
    candidates.push({ src: media.imageSrc, width: media.imageWidth });
  }
  return candidates.map(({ src, width }) => `${src} ${width}w`).join(', ');
};
