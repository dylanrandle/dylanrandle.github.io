import { existsSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Astro relocates server modules during prerendering. Find the source checkout
// from either location without depending on the caller's working directory.
const findProjectRoot = () => {
  let directory = path.dirname(fileURLToPath(import.meta.url));
  while (!existsSync(path.join(directory, 'astro.config.mjs'))) {
    const parent = path.dirname(directory);
    if (parent === directory)
      throw new Error('Cannot locate the portfolio source directory');
    directory = parent;
  }
  return directory;
};

export const PROJECT_ROOT = findProjectRoot();
export const PUBLIC_DIRECTORY = path.join(PROJECT_ROOT, 'public');
