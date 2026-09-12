# Repository Guide

Read `README.md` for the site structure, setup, content model, and deployment
overview. This file contains contributor constraints that should guide code and
content changes.

## Core invariants

- Use Node.js 26 as specified by `.nvmrc`.
- Keep `package-lock.json` committed so local and CI builds resolve the same
  packages.
- Treat project Markdown as the canonical source for project and publication
  facts, resource links, website descriptions, and optional résumé wording. Keep
  identity, introduction, professional links, employment, education, skills, and résumé selection in
  `src/data/profile.ts`. Both `resumeSelection` lists contain project Markdown
  IDs in display order; `getProfile()` in `src/lib/resume.ts` resolves them.
- Keep `src/data/profile-schema.ts` as the reusable runtime contract for the
  canonical profile.
- Edit the appropriate project Markdown or `src/data/profile.ts` for résumé content, or
  `resume/DylanRandleResume.tex.template` for its TeX presentation, then run
  `npm run resume:generate`; do not edit `resume/DylanRandleResume.tex` or the
  published résumé PDF directly.
- Keep blog posts in `src/content/posts/` and project/research entries in
  `src/content/projects/`.

## Important paths

- `src/pages/`: File-based top-level and detail routes, plus `robots.txt` and
  the 404 page.
- `src/content.config.ts`: Astro collection definitions using the shared content schema.
- `src/data/profile.ts`: Authored profile data and ordered résumé selections.
- `src/data/content-schema.ts`: Shared frontmatter contract and content types.
- `src/lib/content.ts` and `src/lib/read-content.ts`: Astro collection queries and the Node Markdown reader.
- `src/config.ts`: Profile-independent routes, labels, locale, media sizing, and theme colors.
- `src/lib/site.ts`: Site identity and professional links derived directly from authored profile data.
- `src/lib/resume.ts`: Validated content lookup and résumé assembly for HTML and PDF.
- `src/lib/publications.ts`: Shared publication titles, author citations, and venue formatting.
- `src/lib/media.ts`: Asset-derived preview metadata and dimensions.
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
- Keep frontmatter concise and conform to `src/data/content-schema.ts`; important portfolio metadata belongs in content rather than templates.
- Both `resumeSelection.projects` and `resumeSelection.publications` in
  `src/data/profile.ts` select project Markdown IDs in the exact display order.
  Each selected publications entry contributes its publications in frontmatter
  order. Keep the two selections independent; reject unknown, draft, or duplicate
  references and publication selections without papers. Do not add unselected
  posts automatically or sort résumé entries by date.
- Dates are display metadata on the résumé. Distinguish article dates from
  publication years, and use `resume.date` when the completion date differs
  from the article date. Individual publication IDs remain available for
  references such as `thesisPublicationId` in education.
- Use the top-level project `description` for personal website wording. An
  optional, nonempty `resume.description` supplies formal wording for both the
  HTML résumé and PDF; omit it to reuse the top-level description. Keep both
  versions in the project's Markdown.
- Render short research collaborator credits and inline resource links from
  structured frontmatter at the end of articles. Keep full publication citations
  on the résumé; do not duplicate the bibliography or resource URLs in prose.
- Keep all article resources in the top-level `links` array, in display order.
  Publications contain citation and author metadata, without nested `links`.
- Use `America/New_York` for authored dates unless the historical event requires otherwise.
- Prefer one broad field plus specific method/application tags. Reuse existing vocabulary.
- Group cover-image metadata as `image: { src, alt, fit? }`. Require descriptive
  `image.alt`, use root-relative `image.src` paths such as
  `/assets/images/example.webp`, and default `image.fit` to `contain`.
- Prefer optimized WebP raster images when quality remains acceptable.
- Ground publication and project claims in the linked paper, report, repository, or existing source post.
- Reuse route, label, locale, and theme values from `src/config.ts` rather than
  repeating them in components, pages, scripts, or tests.
- Put essays and notes in `src/content/posts/`; put project and research
  write-ups in `src/content/projects/`. Both indexes sort published entries
  newest first.

## Image and video conventions

- Keep the full-detail asset at an unsuffixed path such as `example.webp` or
  `demo.mp4`. Name derived card media with its actual pixel width, such as
  `example-480w.webp`, `example-960w.webp`, or `demo-960w.mp4`; the `w` makes
  explicit that the number is the pixel width. Do not use generic
  suffixes such as `-preview`.
- Preview paths and width descriptors are derived from the assets; do not define
  `previewImages`, `previewVideo`, or image dimensions in frontmatter. Generate a
  480-pixel-wide WebP and, when the source is large enough, a 960-pixel-wide
  WebP. Never upscale; reuse an already-small optimized source as the upper
  candidate when appropriate.
- Preserve animation frame count, timing, transparency, and looping when
  deriving previews from animated WebP sources.
- Keep `video` pointed at the full-resolution detail asset. Its matching
  `-960w.mp4` encode is discovered automatically for cards. Card video posters
  use the largest derived image candidate.
- Encode published MP4 files as H.264 High Profile with `yuv420p` pixel format
  and fast-start metadata. Preserve source frame rate, aspect ratio, and color
  tags; omit audio when the source is silent. The current balanced encode uses
  a slow preset and CRF 25.
- Video preload is intentionally eager so playback is ready before a visitor
  scrolls it into view. Keep autoplay muted and viewport-aware, remove posters
  only after the first frame is decoded, respect reduced-motion preferences,
  and leave native controls disabled.

## Deployment and safety

Pushes to `main` or `master` trigger the Pages workflow. Other branches do not
deploy over production automatically.

The worktree may contain unrelated, uncommitted, or partially staged content. Inspect Git status and both staged and unstaged diffs before editing. Preserve unrelated work, do not stage files unless asked, and avoid broad cleanup or destructive Git commands.
