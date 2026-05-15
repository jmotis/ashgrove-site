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

## Shortcodes available in any Markdown file

- `{{< youtube VIDEO_ID >}}` — privacy-friendly YouTube embed
- `{{< callout type="warn" >}}…{{< /callout >}}` — `warn` or `info`
- `{{< checks >}}- item\n- item{{< /checks >}}` — checked bullet list
- `{{< gcal "calendar@id" >}}` — Google Calendar embed
- `{{< tabs >}}{{< tab "Label" >}}…{{< /tab >}}{{< /tabs >}}` — tabbed sections

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
