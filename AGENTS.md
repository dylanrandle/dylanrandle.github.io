# Repository Guide

## Overview

This repository is Dylan Randle's personal website and portfolio. It is a static
Jekyll site using the `jekyll-theme-chirpy` gem and is deployed to GitHub Pages
with GitHub Actions. There is no JavaScript application or Git submodule-based
theme checkout in this repository.

Use Ruby 3.4 as specified by `.ruby-version` and `Gemfile`. Keep
`Gemfile.lock` committed and preserve its Linux platforms because the production
build runs on Ubuntu.

## Important Paths

- `_posts/`: Blog, project, and publication posts.
- `_tabs/`: Chirpy sidebar pages for About, Archives, Categories, and Tags.
- `_config.yml`: Site metadata, theme settings, post defaults, permalinks, and
  Jekyll exclusions.
- `_data/`: Contact and post-sharing configuration.
- `_plugins/posts-lastmod-hook.rb`: Derives post modification dates from Git
  history. Builds therefore expect Git metadata to be available.
- `assets/img/`: Post images, the headshot, and favicons.
- `assets/videos/`: Locally hosted project videos.
- `assets/docs/`: Published PDFs plus the LaTeX resume source.
- `assets/css/jekyll-theme-chirpy.scss`: Small site-specific Chirpy overrides.
- `.github/workflows/pages-deploy.yml`: Production build, link check, and Pages
  deployment workflow.

`_site/`, `.jekyll-cache/`, LaTeX auxiliary files, and dependency caches are
generated artifacts and must not be committed.

## Local Commands

Install dependencies:

```sh
bundle install
```

Run the development server:

```sh
bundle exec jekyll serve
```

Before handing off website changes, run a clean production build and the same
internal-link validation used in CI:

```sh
bundle exec jekyll clean
JEKYLL_ENV=production bundle exec jekyll build
bundle exec htmlproofer _site --disable-external
git diff --check
```

To rebuild the resume, run the following from `assets/docs/` and inspect the
resulting PDF for layout regressions:

```sh
latexmk -pdf -interaction=nonstopmode DylanRandleResume.tex
```

The compiled `DylanRandleResume.pdf` is published by the site, while
`DylanRandleResume.tex` is excluded from `_site`.

## Content Conventions

- Name posts `YYYY-MM-DD-lowercase-hyphenated-title.md`. Use `git mv` for
  renames, especially case-only renames on macOS.
- Keep front matter concise and valid YAML. Posts normally include `title`,
  `description`, `date`, `categories`, and `tags`; add `image` and `math` only
  where applicable. The post layout and permalink are supplied by `_config.yml`.
- Keep dates in the `America/New_York` timezone unless the historical event
  requires otherwise.
- Use one relevant category and 3-5 lowercase tags per post. Order tags from
  broad field to specific method, application, and affiliation. Reuse existing
  vocabulary instead of introducing synonyms or incidental tool names.
- Use separate `amazon` and `robotics` tags where both apply; do not use the
  compound tag `amazon robotics`. Use `harvard` consistently for Harvard work.
- Prefer descriptive image alt text. Store local media under `assets/` and use
  root-relative paths such as `/assets/img/example.webp` in posts.
- Prefer optimized WebP raster assets when quality remains acceptable. The CSS
  intentionally fits PNG/WebP technical figures inside preview frames, while
  the Rubik's Cube photograph retains a cover crop.
- Keep publication and project claims grounded in the linked paper, report,
  repository, or other source already associated with the post.

## Theme and Deployment

Chirpy is consumed through the `jekyll-theme-chirpy` gem. Do not restore an
`assets/lib` theme submodule or copy generated theme assets into the repository.
Make custom styling changes in `assets/css/jekyll-theme-chirpy.scss` and keep
them as narrow as possible so theme upgrades remain straightforward.

Pushes to `main` or `master` trigger the Pages workflow. CI builds in production
mode, checks internal links with HTML-Proofer, and uploads `_site` as the Pages
artifact. External URLs are intentionally not checked by HTML-Proofer.

## Working Safely

The worktree may contain unrelated, uncommitted, or partially staged content.
Inspect `git status` and both staged and unstaged diffs before editing. Preserve
existing work, do not stage files unless asked, and avoid broad cleanup or
destructive Git commands.
