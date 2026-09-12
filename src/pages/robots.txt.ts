import type { APIRoute } from 'astro';
import { SITE } from '../lib/site';

export const GET: APIRoute = () =>
  new Response(
    `User-agent: *\nAllow: /\nSitemap: ${SITE.url}/sitemap-index.xml\n`,
  );
