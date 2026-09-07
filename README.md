# Dylan Randle — Portfolio

Dylan Randle's personal portfolio is a static TypeScript site deployed to
GitHub Pages. Its primary pages are:

- Home introduces Dylan and highlights all projects and research.
- Projects provides a dedicated index of the same project collection.
- Blog contains essays and notes.
- About renders the full résumé as HTML.

Project and Blog cards are sorted newest first and link to their respective
detail pages.

## Requirements

- Node.js 26 (see `.nvmrc`)
- npm 11+
- TeX Live with `latexmk` when regenerating the résumé PDF

## Local development

```sh
npm install
npm run dev
```

The development server is available at `http://localhost:4321` by default.
Install Playwright's managed Chromium browser once before running the complete
validation suite:

```sh
npm run setup:e2e
```

## Validation

```sh
npm run check
git diff --check
```

`npm run check` type-checks the site, verifies the generated résumé artifacts,
checks formatting, builds `dist`, checks every generated internal link and
asset, and runs the Playwright smoke tests in Chromium. The browser tests cover
top-level routes, card routing, active navigation, theme persistence, the résumé
download, and mobile overflow. They make behavioral assertions and do not
maintain screenshot baselines. External links are intentionally not fetched.

Every individual validation command follows the `check:<area>` convention:
`check:astro`, `check:resume`, `check:format`, `check:e2e`, and `check:links`.

## Content

Content placement determines where an entry is listed and routed:

- `src/content/projects/` contains project and research entries. They appear on
  Home and Projects at `/projects/<slug>/`.
- `src/content/posts/` contains the essays and notes shown on Blog at
  `/posts/<slug>/`.

Each Markdown filename is its route slug. Frontmatter supplies the card title,
description, date, category, tags, and optional image. An entry can also set a
`video` path; its image then serves as the poster and non-video fallback. Both
collections share the schema in `src/content.config.ts`.

Identity, introduction, links, and structured résumé content have one source of
truth: `src/data/profile.ts`. The reusable schema in
`src/data/profile-schema.ts` validates that data at runtime wherever the profile
is imported. Home and About render directly from the validated profile. After
changing it, regenerate and validate the TeX and PDF:

```sh
npm run resume:generate
npm run check:resume
```

`resume/DylanRandleResume.tex.template` owns the résumé's TeX layout.
`resume/DylanRandleResume.tex` and `public/assets/docs/DylanRandleResume.pdf`
are generated artifacts stamped with a fingerprint of the canonical profile,
generator, template, and portrait. Edit the profile for content or the template
for presentation; do not edit the generated files directly. Published images,
videos, documents, and icons live beneath `public/assets/` and use root-relative
URLs such as `/assets/img/example.webp`.

## Routes and project structure

Astro creates routes from `src/pages/`. Shared layout and presentation belong
in `src/layouts/` and `src/components/`; site-wide tokens and responsive styles
live in `src/styles/global.css`. Shared route metadata, UI labels, date settings,
and theme colors live in `src/config.ts`; use those values in application code
and tests instead of repeating literals. The generated site also includes
`404.html`, `robots.txt`, and sitemap files.

## Deployment

`.github/workflows/pages-deploy.yml` runs the complete validation command and
deploys `dist/` using GitHub's Pages actions. Pushes to `main` or `master`
deploy to `https://dylanrandle.github.io`; other branches do not change
production.
