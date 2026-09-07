# Repository Guide

Read `README.md` for the site structure, setup, content model, and deployment
overview. This file contains contributor constraints that should guide code and
content changes.

## Core invariants

- Use Node.js 22 as specified by `.nvmrc`.
- Keep `package-lock.json` committed so local and CI builds resolve the same
  packages.
- Treat `src/data/profile.ts` as the canonical source for identity,
  introduction, links, and résumé data used by Home, About, TeX, and PDF.
- Keep `src/data/profile-schema.ts` as the reusable runtime contract for the
  canonical profile.
- Edit `src/data/profile.ts` for résumé content or
  `resume/DylanRandleResume.tex.template` for its TeX presentation, then run
  `npm run resume:generate`; do not edit `resume/DylanRandleResume.tex` or the
  published résumé PDF directly.
- Keep blog posts in `src/content/posts/` and project/research entries in
  `src/content/projects/`.

## Important paths

- `src/pages/`: File-based top-level and detail routes, plus `robots.txt` and
  the 404 page.
- `src/content.config.ts`: Shared Zod schema and collection definitions.
- `src/config.ts`: Canonical routes, labels, locale, and website/résumé theme colors.
- `src/data/profile-schema.ts`: Runtime validation for canonical profile data.
- `src/layouts/` and `src/components/`: Shared page structure and presentation.
- `src/styles/global.css`: Site tokens, layout, responsive behavior, and
  article styling.
- `public/assets/`: Published images, videos, PDFs, and icons.
- `resume/DylanRandleResume.tex.template`: Maintained TeX layout template.
- `scripts/generate-resume.mjs`: TeX/PDF generation and freshness validation.
- `scripts/check-internal-links.mjs`: Generated-output link validation.
- `tests/e2e/` and `playwright.config.ts`: Chromium browser smoke tests and
  their local server configuration.

`dist/`, `.astro/`, `node_modules/`, dependency caches, and LaTeX auxiliary files are generated artifacts and must not be committed.

## Required validation

Before handing off changes, run:

```sh
npm run check
git diff --check
```

`npm run check` includes Astro type-checking, résumé validation, a production
build, formatting validation, generated internal-link validation, and Playwright
browser tests. Install the managed Chromium browser once with
`npm run setup:e2e`. After changing the canonical profile, regenerate before
running the checks:

```sh
npm run resume:generate
npm run check:resume
```

## Content conventions

- Name collection files with stable, lowercase, hyphenated IDs. Each ID becomes the route slug.
- Keep frontmatter concise and conform to `src/content.config.ts`; important portfolio metadata belongs in content rather than templates.
- Use `America/New_York` for authored dates unless the historical event requires otherwise.
- Prefer one broad field plus specific method/application tags. Reuse existing vocabulary.
- Use descriptive alt text and root-relative asset paths such as `/assets/img/example.webp`.
- Prefer optimized WebP raster images when quality remains acceptable.
- Ground publication and project claims in the linked paper, report, repository, or existing source post.
- Reuse route, label, locale, and theme values from `src/config.ts` rather than
  repeating them in components, pages, scripts, or tests.
- Put essays and notes in `src/content/posts/`; put project and research
  write-ups in `src/content/projects/`. Both indexes sort published entries
  newest first.

## Deployment and safety

Pushes to `main` or `master` trigger the Pages workflow. Other branches do not
deploy over production automatically.

The worktree may contain unrelated, uncommitted, or partially staged content. Inspect Git status and both staged and unstaged diffs before editing. Preserve unrelated work, do not stage files unless asked, and avoid broad cleanup or destructive Git commands.
