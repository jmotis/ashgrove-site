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
