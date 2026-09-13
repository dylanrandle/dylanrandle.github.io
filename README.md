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
- FFmpeg (`ffprobe` reads video dimensions during rendering; `ffmpeg` creates video variants)
- TeX Live with `latexmk` when regenerating the résumé PDF

Packages used to build and render the website belong in `dependencies`,
following [Astro's dependency guidance](https://docs.astro.build/en/basics/project-structure/#packagejson).
This includes Markdown, math, HTML, and image processing. Type-checking,
formatting, browser testing, and the test preview server belong in
`devDependencies`. Local development and CI validation install both groups;
deployment publishes only the generated `dist/` files.

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
The image supplies the video's responsive poster and accessible description.
Paths and dimensions are derived from the assets.

`src/lib/media.ts` derives responsive metadata from the files at render time.
It discovers `example-480w.webp`, `example-720w.webp`, and `example-960w.webp`,
checks their dimensions, aspect ratios, and animation metadata, and reuses a
smaller original without upscaling. A same-size WebP beside a JPEG/PNG is used
for the website; the authored source stays available for uses such as the TeX
résumé and social metadata.

`src/lib/render-media.ts` supplies shared markup for cards, detail heroes, and
local images and autoplay videos in article bodies. Detail images can select
the original as well as the derived sizes. Lazy card images use their actual
display width via `sizes="auto"`; detail images use predictable layout hints
from `src/config.ts`, which also supplies fallbacks for cards.
Contained images are sized to their visible area, including the hero height cap.
Video posters use a responsive image overlay until the first video frame is
available. Frames reserve the video's actual aspect ratio before either asset
loads, preventing the poster-to-video transition from shifting the article.

A matching set of `demo-480w.mp4`, `demo-720w.mp4`, and `demo-960w.mp4` is
discovered for cards, heroes, and inline videos. Native `<source media>` rules
select a version for the layout width and display density before downloading;
selection needs no JavaScript. Cover videos also account for the video's aspect
ratio and the card's minimum height, including the mobile card aspect ratio.
Cards cap at the largest derived version, and
details retain the original as a fallback. Videos retain eager preload, muted looping playback, viewport
awareness, reduced-motion support, and disabled native controls.

Do not author `previewImages`, `previewVideos`, or dimensions in frontmatter.
Generate the image variants and any missing video variants explicitly:

```sh
npm run media:generate
npm run media:generate -- --videos
```

Builds inspect assets without re-encoding them. Both the detail hero and rendered
article slot resolve media on every render. Metadata stays out of Astro's
Markdown cache and cached `getStaticPaths()` props, so replacing an asset does
not leave stale dimensions. Math styles are included only on articles containing
rendered equations, keeping them out of the homepage and non-math articles.

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
