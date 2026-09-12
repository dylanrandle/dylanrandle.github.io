import { existsSync, readFileSync } from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { PREVIEW_WIDTHS } from '../config.ts';
import type { ContentData, ContentImage } from '../data/content-schema.ts';
import { PUBLIC_DIRECTORY } from './paths.ts';

const assetPath = (src: string, directory: string) => {
  const target = path.resolve(directory, src.slice(1));
  if (!target.startsWith(`${path.resolve(directory)}${path.sep}`)) {
    throw new Error(`Asset must be inside public: ${src}`);
  }
  return target;
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
  imageWidth?: number;
  imageHeight?: number;
  previewImages?: { src: string; width: number }[];
  previewVideo?: string;
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
    result.imageWidth = source.width;
    result.imageHeight = source.height;
    result.previewImages = [];
    const stem = imageSrc.replace(/\.[^.]+$/, '');
    for (const width of PREVIEW_WIDTHS) {
      if (width > source.width) continue;
      const src = `${stem}-${width}w.webp`;
      if (!existsSync(assetPath(src, directory))) {
        if (width === source.width && imageSrc.endsWith('.webp')) continue;
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
      result.previewImages.push({ src: imageSrc, width: source.width });
    }
    if (!result.previewImages.length)
      throw new Error(`No responsive image candidates for ${imageSrc}`);
  }
  if (data.video) {
    if (!existsSync(assetPath(data.video, directory)))
      throw new Error(`Missing video: ${data.video}`);
    const preview = data.video.replace(
      /\.mp4$/,
      `-${PREVIEW_WIDTHS.at(-1)}w.mp4`,
    );
    if (preview !== data.video && existsSync(assetPath(preview, directory)))
      result.previewVideo = preview;
  }
  return result;
};

export const previewImageSrcset = (media: ContentMedia) =>
  media.previewImages?.map(({ src, width }) => `${src} ${width}w`).join(', ');

export const previewPoster = (media: ContentMedia & { image?: ContentImage }) =>
  media.previewImages?.at(-1)?.src ?? media.image?.src;
