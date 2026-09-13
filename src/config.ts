const brandBlue = '#0000aa';
const withoutTrailingSlash = (path: string) =>
  path === '/' ? path : path.replace(/\/$/, '');

export const ROUTES = {
  home: { href: '/', label: 'Home' },
  projects: { href: '/projects/', label: 'Projects' },
  blog: { href: '/blog/', label: 'Blog' },
  about: { href: '/about/', label: 'About' },
} as const;

export const CONTENT_SECTIONS = {
  projects: {
    collection: 'projects',
    indexPath: ROUTES.projects.href,
    detailBase: withoutTrailingSlash(ROUTES.projects.href),
    label: ROUTES.projects.label,
    singularLabel: 'Project',
  },
  posts: {
    collection: 'posts',
    indexPath: ROUTES.blog.href,
    detailBase: '/posts',
    label: ROUTES.blog.label,
    singularLabel: 'Post',
  },
} as const;

export type ContentSection =
  (typeof CONTENT_SECTIONS)[keyof typeof CONTENT_SECTIONS];
export type ContentCollection = keyof typeof CONTENT_SECTIONS;

export const contentDetailPath = (section: ContentSection, id: string) =>
  `${section.detailBase}/${id}/`;

export const CONTENT_DATE_FORMAT = {
  locale: 'en',
  timeZone: 'America/New_York',
} as const;

export const THEME = {
  light: {
    accent: brandBlue,
    accentStrong: '#000077',
    accentSoft: '#e6e6ff',
  },
  dark: {
    accent: '#7d7dff',
    accentStrong: '#aaaaff',
    accentSoft: '#1b1b4d',
  },
  resume: {
    accent: brandBlue,
    link: '#666666',
  },
} as const;

export const UI_LABELS = {
  projectsAndResearch: 'Projects & Research',
  themeToggle: 'Toggle color theme',
} as const;

export const NAV_ITEMS = [ROUTES.projects, ROUTES.blog, ROUTES.about] as const;

export const PROFILE_LINK_LABELS = {
  website: { label: 'Website', compactLabel: 'Website' },
  github: { label: 'GitHub', compactLabel: 'GitHub' },
  linkedin: { label: 'LinkedIn', compactLabel: 'LinkedIn' },
  scholar: { label: 'Google Scholar', compactLabel: 'Scholar' },
} as const;

export const PROFILE_LINK_GROUPS = {
  social: ['github', 'linkedin', 'scholar'],
  resume: ['website', 'linkedin', 'github', 'scholar'],
} as const;

export const MEDIA_IMAGE_SIZES = {
  card: [
    ['(max-width: 600px)', 'calc(100vw - 1.5rem - 2px)'],
    ['(max-width: 1200px)', 'max(12rem, calc((100vw - 2.5rem - 2px) * 0.3))'],
    ['', '347.4px'],
  ],
  hero: [
    ['(max-width: 600px)', 'calc(100vw - 1.5rem - 2px)'],
    ['', 'min(1158px, calc(100vw - 2.5rem - 2px))'],
  ],
  article: [
    ['(max-width: 600px)', 'calc(100vw - 1.5rem - 2px)'],
    ['(max-width: 820px)', 'calc(100vw - 2.5rem - 2px)'],
    [
      '',
      'min(758px, calc(100vw - 2.5rem - 11rem - clamp(2.5rem, 6vw, 6rem) - 2px))',
    ],
  ],
} as const;
export const HERO_MAX_HEIGHT_REM = 38;
export const CARD_ASPECT_RATIO = 16 / 9;
export const CARD_MIN_HEIGHT_REM = 13;
export const PREVIEW_WIDTHS = [480, 720, 960] as const;

// Video sources have no srcset. Match the layout's available width at common
// pixel densities, rounding density up so intermediate displays stay sharp.
export const videoSourceMedia = (
  width: number,
  context: keyof typeof MEDIA_IMAGE_SIZES,
  aspectRatio: number,
  fit: 'contain' | 'cover',
) =>
  [1, 1.5, 1.75, 2, 3]
    .flatMap((density) => {
      const slot = width / density;
      const resolution = `(max-resolution: ${density}dppx)`;
      const mobileSlot =
        context === 'card' && fit === 'cover'
          ? slot / Math.max(1, aspectRatio / CARD_ASPECT_RATIO)
          : slot;
      const mobile = `(max-width: 600px) and (max-width: calc(${mobileSlot}px + 1.5rem + 2px))`;
      const desktop = `(min-width: 600.01px) and (max-width: calc(${slot}px + 2.5rem + 2px))`;
      const layouts = [mobile];
      if (context === 'card') {
        // Desktop cards occupy 30% of the capped page width, at least 12rem.
        // Cover can scale past that width to fill the 13rem minimum height.
        // Use the same height as the layout (with the default 16px rem).
        const minimumWidth =
          fit === 'cover' ? CARD_MIN_HEIGHT_REM * 16 * aspectRatio : 0;
        if (slot >= minimumWidth)
          layouts.push(
            slot >= 347.4
              ? '(min-width: 600.01px)'
              : `(min-width: 600.01px) and (max-width: calc(${slot / 0.3}px + 2.5rem + 2px))`,
          );
      } else if (context === 'article') {
        layouts.push(`${desktop} and (max-width: 820px)`);
        layouts.push(
          slot >= 758
            ? '(min-width: 820.01px)'
            : `(min-width: 820.01px) and (max-width: calc(${slot}px + 2.5rem + 11rem + clamp(2.5rem, 6vw, 6rem) + 2px))`,
        );
      } else {
        layouts.push(slot >= 1158 ? '(min-width: 600.01px)' : desktop);
      }
      return layouts.map((layout) => `${resolution} and ${layout}`);
    })
    .join(', ');
