# Jeff Personal Blog

TanStack Start site for [jhaynie](https://x.com/jhaynie). Design direction from `../design/04-*`.

Registered on Agentuity as **Jeff Personal Blog**  
(`proj_49c3587e14dd0022c006c54ff15f1a99`, org `org_2u8RgDTwcZWrZrZ3sZh24T5FCtz`).

## Deploy (Agentuity)

This app uses **Nitro** so Agentuity can start `.output/server/index.mjs` (see [Agentuity + TanStack Start](https://agentuity.dev/frameworks/tanstack-start)).

```bash
bun run build
# expect: .output/server/index.mjs and .output/content/bulletins/
agentuity deploy --confirm
```

`package.json` includes `"start": "HOST=0.0.0.0 node .output/server/index.mjs"`.

## Commands

```bash
bun run dev                 # http://localhost:3000
bun run build               # sitemap + Nitro build + content copy
bun run start               # production server from .output
bun run import-medium       # pull posts from Medium RSS
bun run generate-og         # rebuild public/og.png
bun run generate-sitemap    # public/sitemap.xml (uses VITE_SITE_URL)
bun run generate-routes
bun run deploy              # agentuity deploy
```

## Environment

Copy `.env.example` → `.env` and set:

```bash
VITE_SITE_URL=https://jhaynie.dev
```

Used for absolute canonical URLs, Open Graph, and sitemap. Defaults to `https://jhaynie.dev` if unset.

## Content (bulletins)

Markdown files live in `content/bulletins/*.md`. Legacy posts are imported from Medium:

```bash
bun run import-medium
```

That pulls the public [Medium RSS feed](https://medium.com/feed/@jhaynie) (~10 latest/full-content items Medium exposes), converts HTML → Markdown, and writes frontmatter:

```yaml
---
title: Post title
date: 2020-09-01
id: BBS-10
topics:          # one or more of: agents | coding | business
  - coding
excerpt: "…"
hero: "https://cdn-images-1.medium.com/…"
source: medium
canonical: "https://medium.com/@jhaynie/…"
---

Body in Markdown.
```

Posts load on the server via `createServerFn` and render with `react-markdown` + GFM.

## Routes

| Path | Purpose |
|------|---------|
| `/` | Home (hero, latest bulletins, catalog, sysop, contact) |
| `/bulletins` | Full list + filters |
| `/bulletins/$slug` | Detail: large hero + prose |

## Design source

Static explorations remain in `../design/` for reference. The live UI is this app.
