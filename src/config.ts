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

export const CARD_IMAGE_SIZES =
  '(max-width: 600px) calc(100vw - 1.5rem), (max-width: 1200px) 30vw, 348px';
export const PREVIEW_WIDTHS = [480, 960] as const;
