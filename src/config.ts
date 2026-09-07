import { profile } from './data/profile.ts';

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

export const SITE = {
  title: profile.displayName,
  tagline: 'AI & Robotics',
  description: profile.intro.headline,
  url: profile.links.website.replace(/\/$/, ''),
  email: profile.email,
  image: profile.portrait.src,
  links: profile.links,
} as const;

export const NAV_ITEMS = [ROUTES.projects, ROUTES.blog, ROUTES.about] as const;
