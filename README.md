# Ashgrove Adventure

Hugo website for Ashgrove, a Girl Scout day camp at Camp Crowell in Oakton, VA.

## Requirements

- [Hugo extended](https://gohugo.io/installation/) ≥ 0.121 (the extended build is required for SCSS)

## Local preview

```sh
hugo server
```

Open <http://localhost:1313>. Edits to `content/`, `data/`, `layouts/`, and `assets/` hot-reload.

## Where to edit what

| To change… | Edit… |
| --- | --- |
| This year's theme, dates, registration link | `data/theme.yaml` |
| A news post | A file in `content/news/` (date-prefix filename) |
| FAQ tabs | `content/for-parents/faq.md` (paired `{{< tab >}}` shortcodes) |
| The calendar embed | `content/about/calendar.md` (`{{< gcal >}}` shortcode) |
| Site navigation | `[menu]` block in `hugo.toml` |
| Visual design | `assets/scss/main.scss` |

## Front matter reference

Every Markdown file starts with a YAML front matter block delimited by `---`.
These are the fields this site's templates actually read:

```yaml
---
title: "Page title"             # required — used in <title>, H1, breadcrumbs, menus
date: 2026-01-15                # required on news posts (controls sort order)
weight: 20                      # optional — order in section subnav/dropdown (lower = earlier)
intro: "One-paragraph intro"    # optional — page-hero subtitle on inner pages
summary: |                      # optional — overrides the auto-generated excerpt
  Short blurb shown on the news index and homepage news cards.
image: /images/news/foo.jpg     # optional — news-post header image (see "Image handling" below)
author: "Name"                  # optional — shown on news posts
draft: true                     # optional — hides the page from production builds
menu_hidden: true               # optional — keeps the page out of subnav/dropdown

side_cta:                       # optional — green CTA card in the right sidebar
  title: "Heading"
  body: "Short description"
  label: "Button text"
  url: "/internal/path/"        # or "mailto:..." or "https://..."
---
```

Section index files (`content/<section>/_index.md`) take the same fields. A
`side_cta` block on a section's `_index.md` is inherited by every child page in
that section unless the child page sets its own.

## Adding a new page

Drop a `.md` file in the right `content/` subdirectory:

- `content/about/`, `content/for-parents/`, `content/for-campers/`,
  `content/for-staff/` — section pages. New pages auto-appear in the section's
  subnav sidebar and the header dropdown, ordered by `weight`.
- `content/news/YYYY-MM-DD-slug.md` — news posts. Date-prefix the filename and
  set the `date:` field; they sort newest first.

Use `weight: N` (lower = earlier) to order within a section. Use
`menu_hidden: true` to keep a page off the subnav.

### Adding a new top-level section

1. Create `content/<new-section>/` with an `_index.md` inside.
2. Add the section to the primary nav in `hugo.toml`:

   ```toml
   [[menu.main]]
     identifier = "new-section"
     name = "New Section"
     url = "/new-section/"
     weight = 70
   ```

   The header dropdown auto-populates from the new section's child pages.
3. Optional: add it to the relevant footer column in `[params.footer.cols]`.

## Drafts and scheduled posts

- `draft: true` in front matter hides the page from the production build.
  Preview drafts locally with `hugo server -D`.
- A `date:` set in the future excludes the page from the build until that date
  passes. To preview future-dated content too, use `hugo server -DF`.

## Shortcodes available in any Markdown file

- `{{< youtube VIDEO_ID >}}` — privacy-friendly YouTube embed
- `{{< callout type="warn" >}}…{{< /callout >}}` — `warn` (default) or `info`
- `{{< checks >}}- item\n- item{{< /checks >}}` — checked bullet list
- `{{< gcal "calendar@id" >}}` — Google Calendar embed
- `{{< tabs >}}{{< tab "Label" >}}…{{< /tab >}}{{< /tabs >}}` — tabbed sections

### Shortcode notes

- All shortcodes here use `{{<` brackets. Markdown formatting inside
  `{{< tab >}}`, `{{< callout >}}`, etc. works because the shortcodes call
  `markdownify` on their inner content.
- **`{{< checks >}}` is indentation-sensitive.** Start each bullet at column 0
  with `- `. Indenting the items 4+ spaces trips Markdown's indented-code-block
  rule and breaks the list (this was a real bug — don't reintroduce it).
- **Tabs are paired shortcodes in one file**, not separate child Markdown
  files. Tab order follows source order; to reorder a tab, move its block.

## Image handling — current state

The Hugo Blueprint specified a `layouts/partials/picture.html` partial that
auto-generates four widths in WebP + JPG. The partial exists and works, but
**the news templates currently render the `image:` front matter field as a
styled text placeholder, not a real `<img>`.** So adding
`image: /images/news/foo.jpg` to a post today produces a checkerboard card with
the filename as a label — not the actual photo.

To wire real images:

1. Drop the original at `assets/images/news/<slug>.jpg` (≥ 1600 px wide,
   under ~3 MB).
2. Replace the `<div class="img-ph">` blocks in `layouts/index.html`,
   `layouts/news/list.html`, and `layouts/news/single.html` with
   `{{ partial "picture.html" (dict "src" .Params.image "alt" ...) }}`.
3. Same for the homepage theme art (`layouts/index.html`) and any inline
   photo placeholders in section content.

Until that change lands, treat `image:` as "remember to fix this later" — the
front matter accepts the value but the visual placeholder is unchanged.

## Placeholder data to replace

The scaffold ships with example data. Most of it should be swapped before
going live:

| Where | Currently | Replace with |
| --- | --- | --- |
| `data/theme.yaml` `registration_url` | `https://gsnc.org/.../ashgrove-2026` | the real GSNC registration page |
| `data/theme.yaml` `theme_video_id` | `dQw4w9WgXcQ` (yes, that one) | the actual YouTube video ID |
| `data/theme.yaml` `theme_image` | `/images/themes/2026-high-seas-deep-seas.jpg` | a real file path (and add the image) |
| `hugo.toml` `[params.footer]` Contact links | `ashgrove@example.org`, `703-555-0100`, the placeholder mailing-list URL | real address, phone, signup URL |
| `content/about/leadership.md`, `content/for-staff/_index.md` | Belle / Tumble / Daisy / Sparrow / Robin and their `@example.org` emails, 703-501-7291 | real names, emails, phones |
| `content/about/calendar.md` | `ashgrove@group.calendar.google.com` | real Google Calendar ID |
| `content/about/calendar.md` | `https://calendar.google.com/` subscribe link | real subscribe URL |
| `content/for-campers/design-competition.md` | `ashgrove.design.competition@example.org` | real address |
| News post `image:` fields | files that don't exist yet | real images + wire the picture partial (see above) |

Quick grep to spot anything missed:

```sh
grep -rniE 'example\.org|gsnc\.org/\.\.\.|703-555|703-501|dQw4w9WgXcQ' content/ data/ hugo.toml
```

## Build & deploy

```sh
hugo
```

The full static site is written to `public/`. Upload its contents to Reclaim Hosting's `public_html/` via SFTP.

### GitHub Pages (temporary dev preview)

`.github/workflows/pages.yml` builds and deploys to GitHub Pages on every
push to `main` (and the active feature branch). To use it, set
**Settings → Pages → Source = "GitHub Actions"** once.

The workflow asks `actions/configure-pages` for the live deploy URL and
passes it to Hugo via `--baseURL`, so the dev preview always matches
whatever GitHub serves it at.

## Changing the site's URL

URLs in templates and content are produced with Hugo's `relURL` (and a
Markdown render hook for content links), so the only place the URL is
written down is the `baseURL` setting. To move the site to a new home:

1. **Permanent move (e.g. to `ashgroveadventure.org`)** — edit `hugo.toml`:

   ```toml
   baseURL = "https://ashgroveadventure.org/"
   ```

   Then `hugo` and upload `public/` as usual. No template edits required.

2. **Override per-build without editing the file** — pass `--baseURL`:

   ```sh
   hugo --baseURL "https://staging.example.org/"
   ```

3. **Override in the GitHub Actions workflow** — edit
   `.github/workflows/pages.yml`. The build step currently uses the URL
   provided by `actions/configure-pages` (`${{ steps.pages.outputs.base_url }}`).
   To pin it to a custom domain or a different host, replace that
   value, e.g.:

   ```yaml
   - name: Build with Hugo
     env:
       HUGO_ENVIRONMENT: production
     run: hugo --gc --minify --baseURL "https://ashgroveadventure.org/"
   ```

   If you use a GitHub Pages **custom domain**, add the bare domain to
   `static/CNAME` (e.g. `ashgroveadventure.org`) — Pages picks it up at
   deploy time.

**Why this works without source changes:** Hugo's `relURL` only prepends
the baseURL path when an input has no leading slash, so templates use
forms like `{{ "about/" | relURL }}` and `{{ site.Home.RelPermalink }}`.
The render hook at `layouts/_default/_markup/render-link.html` rewrites
any site-absolute Markdown link (`[text](/foo/)`) the same way. If you
add new template links, follow that convention so portability stays
intact.
