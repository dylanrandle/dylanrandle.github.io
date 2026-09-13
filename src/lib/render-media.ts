import {
  defaultTreeAdapter as adapter,
  html as namespaces,
  parseFragment,
  serializeOuter,
  type DefaultTreeAdapterMap,
} from 'parse5';
import {
  CARD_ASPECT_RATIO,
  MEDIA_IMAGE_SIZES,
  HERO_MAX_HEIGHT_REM,
  videoSourceMedia,
} from '../config.ts';
import type { ContentImage } from '../data/content-schema.ts';
import {
  imageSrcset,
  resolveContentMedia,
  type ContentMedia,
} from './media.ts';
import { PUBLIC_DIRECTORY } from './paths.ts';

type Element = DefaultTreeAdapterMap['element'];
type Node = DefaultTreeAdapterMap['node'];
export type MediaContext = 'card' | 'hero' | 'article';

const element = (
  name: string,
  attributes: Record<string, string | number | boolean | undefined>,
  children: Element[] = [],
) => {
  const node = adapter.createElement(
    name,
    namespaces.NS.HTML,
    Object.entries(attributes)
      .filter(([, value]) => value !== undefined && value !== false)
      .map(([name, value]) => ({
        name,
        value: value === true ? '' : String(value),
      })),
  );
  children.forEach((child) => adapter.appendChild(node, child));
  return node;
};

// Card image widths also depend on the text-driven row height. Use their
// laid-out size with a fallback; detail layouts have predictable width hints.
export const mediaImageSizes = (
  media: ContentMedia,
  context: MediaContext,
  fit: ContentImage['fit'],
) => {
  const ratio = media.imageWidth! / media.imageHeight!;
  const sizes = MEDIA_IMAGE_SIZES[context]
    .map(([condition, slot], index) => {
      let width: string = slot;
      if (context === 'hero' && fit === 'contain') {
        width = `min(${width}, ${((HERO_MAX_HEIGHT_REM - 0.125) * ratio).toFixed(4)}rem)`;
        if (media.videoAspectRatio && ratio < media.videoAspectRatio)
          width = `min(${width}, calc(${slot} * ${(ratio / media.videoAspectRatio).toFixed(5)}))`;
      } else if (context === 'card' && index === 0) {
        width = `${fit === 'cover' ? 'max' : 'min'}(${width}, calc(${width} * ${(ratio / CARD_ASPECT_RATIO).toFixed(5)}))`;
      } else if (context === 'article') {
        width = `min(${width}, ${media.imageWidth}px)`;
      }
      return `${condition ? `${condition} ` : ''}${width}`;
    })
    .join(', ');
  return context === 'card' ? `auto, ${sizes}` : sizes;
};

export const renderMedia = async (
  { image, video }: { image: ContentImage; video?: string },
  context: MediaContext,
  directory = PUBLIC_DIRECTORY,
) => {
  const media = await resolveContentMedia({ image, video }, directory);
  const ratio =
    media.videoAspectRatio ?? media.imageWidth! / media.imageHeight!;
  const fit = video && context !== 'card' ? 'contain' : image.fit;
  const children: Element[] = [];
  if (video) {
    const sources = [];
    for (const [index, candidate] of (media.previewVideos ?? []).entries()) {
      sources.push(
        element('source', {
          src: candidate.src,
          type: 'video/mp4',
          media:
            candidate.src === video ||
            (context === 'card' && index === media.previewVideos!.length - 1)
              ? undefined
              : videoSourceMedia(candidate.width, context, ratio, fit),
        }),
      );
    }
    if (
      (context !== 'card' || !media.previewVideos?.length) &&
      !media.previewVideos?.some(({ src }) => src === video)
    )
      sources.push(element('source', { src: video, type: 'video/mp4' }));
    children.push(
      element(
        'video',
        {
          width: media.videoWidth,
          height: media.videoHeight,
          muted: true,
          loop: true,
          playsinline: true,
          preload: 'auto',
          'aria-hidden': context === 'card' ? 'true' : undefined,
          'aria-label': context === 'card' ? undefined : image.alt,
          tabindex: context === 'card' ? '-1' : undefined,
          'data-autoplay-video': true,
        },
        sources,
      ),
    );
  }
  children.push(
    element('img', {
      src: media.imageSrc,
      srcset: imageSrcset(media, context !== 'card'),
      sizes: mediaImageSizes(media, context, fit),
      alt: video ? '' : image.alt,
      width: media.imageWidth,
      height: media.imageHeight,
      loading: context === 'hero' ? 'eager' : 'lazy',
      decoding: 'async',
      fetchpriority: context === 'hero' ? 'high' : undefined,
      'aria-hidden': video ? 'true' : undefined,
      'data-video-poster': video ? true : undefined,
    }),
  );
  return serializeOuter(
    element(
      'span',
      {
        class: `media-frame ${context === 'card' ? 'content-card-media' : context === 'hero' ? 'article-hero' : 'article-media'}${fit === 'cover' ? ' cover' : ''}`,
        style: `--media-ratio:${ratio};--image-ratio:${media.imageWidth! / media.imageHeight!};--media-width:${media.videoWidth ?? media.imageWidth}px`,
      },
      [element('span', { class: 'media-content' }, children)],
    ),
  );
};

// Transform the rendered slot, not cached Markdown: replacement assets must
// supply fresh dimensions on every render. Preserve all other HTML verbatim.
export const renderArticleMedia = async (
  markup: string,
  directory = PUBLIC_DIRECTORY,
) => {
  const tree = parseFragment(markup, { sourceCodeLocationInfo: true });
  const replacements: {
    start: number;
    end: number;
    markup: Promise<string>;
  }[] = [];
  const visit = (node: Node) => {
    if (!('tagName' in node)) {
      if ('childNodes' in node) node.childNodes.forEach(visit);
      return;
    }
    const attributes = Object.fromEntries(
      node.attrs.map(({ name, value }) => [name, value]),
    );
    if (node.tagName === 'picture' || attributes.class?.includes('media-frame'))
      return;
    const localImage = (src?: string) =>
      src?.startsWith('/assets/') && /\.(webp|png|jpe?g)$/.test(src);
    let data: { image: ContentImage; video?: string } | undefined;
    if (
      node.tagName === 'img' &&
      localImage(attributes.src) &&
      !attributes.srcset
    ) {
      data = {
        image: {
          src: attributes.src,
          alt: attributes.alt ?? '',
          fit: 'contain',
        },
      };
    } else if (
      node.tagName === 'video' &&
      'data-autoplay-video' in attributes &&
      localImage(attributes.poster)
    ) {
      const source = node.childNodes.find(
        (child) => 'tagName' in child && child.tagName === 'source',
      ) as Element | undefined;
      const video =
        attributes.src ??
        source?.attrs.find(({ name }) => name === 'src')?.value;
      if (video?.startsWith('/assets/') && video.endsWith('.mp4')) {
        data = {
          image: {
            src: attributes.poster,
            alt: attributes['aria-label'] ?? '',
            fit: 'contain',
          },
          video,
        };
      }
    }
    if (data && node.sourceCodeLocation) {
      replacements.push({
        start: node.sourceCodeLocation.startOffset,
        end: node.sourceCodeLocation.endOffset,
        markup: renderMedia(data, 'article', directory),
      });
    } else node.childNodes.forEach(visit);
  };
  visit(tree);
  const rendered = await Promise.all(
    replacements.map(async (replacement) => ({
      ...replacement,
      markup: await replacement.markup,
    })),
  );
  for (const replacement of rendered.toSorted((a, b) => b.start - a.start))
    markup =
      markup.slice(0, replacement.start) +
      replacement.markup +
      markup.slice(replacement.end);
  return markup;
};
