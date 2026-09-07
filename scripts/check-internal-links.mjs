import fs from 'node:fs/promises';
import path from 'node:path';

const root = path.resolve(process.argv[2] ?? 'dist');
const htmlFiles = [];

async function walk(directory) {
  for (const entry of await fs.readdir(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) await walk(fullPath);
    else if (entry.name.endsWith('.html')) htmlFiles.push(fullPath);
  }
}

const resolveTarget = (href) => {
  const clean = decodeURI(href.split('#')[0].split('?')[0]);
  if (!clean || /^(?:https?:|mailto:|tel:|data:)/.test(clean)) return null;
  const relative = clean.startsWith('/') ? clean.slice(1) : clean;
  if (path.extname(relative)) return path.join(root, relative);
  return path.join(root, relative, 'index.html');
};

await walk(root);
const missing = [];
for (const file of htmlFiles) {
  const html = await fs.readFile(file, 'utf8');
  for (const match of html.matchAll(/(?:href|src)=["']([^"']+)["']/g)) {
    const target = resolveTarget(match[1]);
    if (!target) continue;
    try {
      await fs.access(target);
    } catch {
      missing.push(`${path.relative(root, file)} -> ${match[1]}`);
    }
  }
}

if (missing.length) {
  console.error(`Broken internal links:\n${missing.join('\n')}`);
  process.exit(1);
}
console.log(
  `Checked ${htmlFiles.length} HTML files; no broken internal links.`,
);
