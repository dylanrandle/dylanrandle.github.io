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

`npm run check` tests the content model and media resolution, type-checks the site, verifies the generated résumé artifacts,
checks formatting, builds `dist`, checks every generated internal link and
asset, and runs the Playwright smoke tests in Chromium. The browser tests cover
top-level routes, card routing, active navigation, theme persistence, the résumé
download, and mobile overflow. They make behavioral assertions and do not
maintain screenshot baselines. External links are intentionally not fetched.

Every individual validation command follows the `check:<area>` convention:
`check:unit`, `check:astro`, `check:resume`, `check:format`, `check:e2e`, and `check:links`.

## Content

Content placement determines where an entry is listed and routed:

- `src/content/projects/` contains project and research entries. They appear on
  Home and Projects at `/projects/<slug>/`.
- `src/content/posts/` contains the essays and notes shown on Blog at
  `/posts/<slug>/`.

Each Markdown filename is its stable ID and route slug. Frontmatter supplies
the title, card description, date, category, tags, optional media, and resource
`links` (`label` and `href`). Both collections use the reusable runtime schema
in `src/data/content-schema.ts`; `src/content.config.ts` connects it to Astro.
`src/lib/read-content.ts` reads and validates the same frontmatter directly in Node
for the résumé generator and tests, using Astro's Markdown parser.

Project Markdown is the source of truth for project and publication metadata.
The required top-level `description` uses a personal voice for website cards,
article headers, and page metadata. An optional `resume` block can override the
`title`, `description`, or `date`. Use `resume.description` for concise, formal
wording in both the HTML résumé and PDF, and `resume.date` when the project's
completion differs from the article date. Each omitted field inherits its
top-level value. Description overrides must be nonempty; omit the field to
reuse the website wording. Dates are formatted as month/year in the site's
authored time zone. Keep long explanations in the body.

```yaml
description: I built a Rubik's Cube robot to beat my childhood solving times.
resume:
  description: Built a cube-solving robot with camera-based perception and custom motor hardware.
```

Both descriptions stay in the same Markdown file. Keep their underlying facts
consistent while adapting the voice and emphasis to each audience.

Research entries contain a `publications` array. Each publication has a globally
unique `id`, formal `title` (defaults to the project title), `authors`, `kind`
(`conference`, `preprint`, or `thesis`), `venue`, `year`, and optional `track`.
Each author defines a full `name` and abbreviated `citation`,
with optional `role` (`lead` or `advisor`) and `equalContribution`. Article
endings use these records for a short collaborator sentence, preserving lead,
advisor, and equal-contribution credits. Full publication citations appear on
the résumé. A project can contain multiple publications, as in the
differential-equations project; shared authors are credited once. Publication
IDs support references such as `thesisPublicationId` in education.

Keep all resource URLs in the article's top-level `links` array, including
papers, repositories, documentation, slides, and videos. Each link has a `label`
and `href`, and the array order is the order shown in the closing blockquote.
The array defaults to empty when omitted. Publications do not define their own
links or link anchors. Keep facts and resource URLs in frontmatter rather than
repeating them in the body. Team credits for projects without publications can
remain in their Markdown prose.

`category` and `tags` are display metadata:

- `category` is an optional, free-form label shown above card titles and detail
  page titles. It also labels cards without images. When omitted, the label
  falls back to the collection's singular label (`Project` or `Post`).
- `tags` is a list of topic labels shown as plain, non-clickable pills in the
  detail-page header. It defaults to an empty list and is not shown on cards.

Neither field controls routes, index membership, ordering, résumé selection,
filtering, or social metadata. Collection folders control routes and index
membership; article dates control index order.

## Profile and résumé

`src/data/profile.ts` is the editing surface for personal information. Its
`profileData` contains identity, introduction, professional links, employment,
education, and skills. It contains no file loading or résumé assembly logic.
An education entry can use `thesisPublicationId` to draw its thesis title from
Markdown instead of repeating that title.

The same file's `resumeSelection` controls both inclusion and order:

- `projects`: Markdown project IDs, in the order shown in the résumé's Projects section.
- `publications`: Markdown project IDs, in the order shown in Publications. Each
  selected post contributes all its publications, in their frontmatter order.

Both lists use filenames from `src/content/projects/` without `.md`, such as
`rubiks-cube-robot` or `differential-equation-nn`. The lists are independent: a
research post can supply publications without appearing in Projects. Adding an
unselected post does not change the résumé. Dates and years are displayed but
never used to sort the résumé; reorder the IDs to change the order. The site's
Project and Blog indexes still sort newest first.

`getProfile()` in `src/lib/resume.ts` reads Markdown, resolves the selections and
thesis references, and validates the result with `src/data/profile-schema.ts`.
Unknown, draft, or repeated references fail validation, as do publication
selections that contain no papers. Duplicate project and publication IDs also
fail validation. The HTML résumé and TeX/PDF generator consume this same result.
Regenerate after edits that affect the résumé:

```sh
npm run resume:generate
npm run check:resume
```

`resume/DylanRandleResume.tex.template` owns the résumé's TeX layout.
`resume/DylanRandleResume.tex` and `public/assets/docs/DylanRandleResume.pdf`
are generated artifacts stamped with a fingerprint of the resolved profile,
contact-link presentation, résumé theme, generator, template, and portrait.
Changes to the resolved résumé data, including selection order, invalidate the
artifacts; article prose and metadata unused by the résumé do not. Edit the
maintained data or template, not the generated files.

## Media

Published assets live beneath `public/assets/` and use root-relative URLs such as
`/assets/images/example.webp`. Image metadata belongs together in an object:

```yaml
image:
  src: /assets/images/example.webp
  alt: A descriptive explanation of the image
  fit: cover # Optional; defaults to contain.
```

`image.src` points to the full-detail asset, and `image.alt` is required.
An optional `video` still points directly to the full-resolution video file.
The image serves as the video's detail-page poster and supplies its accessible
description. Preview paths and dimensions are derived from the assets.

`src/lib/media.ts` derives responsive metadata from the files at render time.
It discovers `example-480w.webp` and `example-960w.webp`, reads their actual
dimensions, checks aspect ratios and animation metadata, and reuses a smaller
original as the upper candidate without upscaling. A matching `demo-960w.mp4`
is used on cards when present; otherwise the full video is used. Card posters
use the largest image candidate. Do not author `previewImages`, `previewVideo`,
or dimensions in frontmatter. Generate the required image variants when adding
an image. Existing media files are inspected, never re-encoded during builds.
Cards and detail layouts resolve media during each render. Derived metadata is
kept out of Astro's Markdown cache and cached `getStaticPaths()` props, so replacing
an asset does not leave stale dimensions in a later build or development render.

## Routes and project structure

Astro creates routes from `src/pages/`. Shared layout and presentation belong
in `src/layouts/` and `src/components/`; site-wide tokens and responsive styles
live in `src/styles/global.css`. Shared route metadata, UI and professional-link
labels, date settings, media sizing, and theme colors live in `src/config.ts`.
It has no dependency on the profile. `src/lib/site.ts` derives site identity and
professional-link presentation directly from `profileData`, so rendering a
footer, portrait, or introduction does not need to load project Markdown.
`ContentDetail` and `ContentIndexLayout` share project/blog page wiring;
`ContentFooter` renders the compact collaborator-and-links ending, and
`ProfileLinks` shares the home/footer link rendering. Tests derive the expected
content inventory from Markdown and independently check rendered routes, media
behavior, citations, and links. The generated site also includes
`404.html`, `robots.txt`, and sitemap files.

The data flow is organized by responsibility:

| Responsibility                                     | Location                                         |
| -------------------------------------------------- | ------------------------------------------------ |
| Authored personal information and résumé order     | `src/data/profile.ts`                            |
| Authored articles, project facts, and publications | `src/content/`                                   |
| Shared validation contracts                        | `src/data/*-schema.ts`, `src/data/validation.ts` |
| Published Astro collection queries                 | `src/lib/content.ts`                             |
| Direct Markdown reading for Node scripts           | `src/lib/read-content.ts`                        |
| Résumé assembly and publication formatting         | `src/lib/resume.ts`, `src/lib/publications.ts`   |
| Site identity and link presentation                | `src/lib/site.ts`                                |
| Page structure and rendering                       | `src/pages/`, `src/layouts/`, `src/components/`  |

Only the résumé page and generator call `getProfile()`. Identity-only consumers
import `profileData` or the derived helpers in `src/lib/site.ts`.

## Deployment

`.github/workflows/pages-deploy.yml` runs the complete validation command and
deploys `dist/` using GitHub's Pages actions. Pushes to `main` or `master`
deploy to `https://dylanrandle.github.io`; other branches do not change
production.
