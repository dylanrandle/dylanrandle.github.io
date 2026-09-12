import { PROFILE_LINK_GROUPS, PROFILE_LINK_LABELS } from '../config.ts';
import { profileData } from '../data/profile.ts';

export const SITE = {
  title: profileData.displayName,
  tagline: 'AI & Robotics',
  description: profileData.intro.headline,
  url: profileData.links.website.replace(/\/$/, ''),
  email: profileData.email,
  image: profileData.portrait.src,
  links: profileData.links,
} as const;

export const getProfileLinks = (group: keyof typeof PROFILE_LINK_GROUPS) =>
  PROFILE_LINK_GROUPS[group].map((key) => ({
    ...PROFILE_LINK_LABELS[key],
    href: profileData.links[key],
  }));
