import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { parseFrontmatter } from '@astrojs/markdown-remark';
import type { ContentCollection } from '../config.ts';
import { contentSchema, type ContentRecord } from '../data/content-schema.ts';
import { contentId } from '../data/validation.ts';
import { PROJECT_ROOT } from './paths.ts';

// Node entry point for résumé generation and tests; Astro pages use content.ts.
export const readContentEntries = (
  collection: ContentCollection,
  directory = pathToFileURL(
    `${path.join(PROJECT_ROOT, 'src', 'content', collection)}/`,
  ),
): ContentRecord[] => {
  return readdirSync(directory)
    .filter((name) => name.endsWith('.md'))
    .sort()
    .map((name) => {
      const source = new URL(name, directory);
      try {
        return {
          id: contentId.parse(name.slice(0, -3)),
          data: contentSchema.parse(
            parseFrontmatter(readFileSync(source, 'utf8')).frontmatter,
          ),
        };
      } catch (cause) {
        throw new Error(`Invalid content: ${fileURLToPath(source)}`, { cause });
      }
    });
};
