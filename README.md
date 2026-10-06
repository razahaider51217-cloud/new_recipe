# Heirloom Table

A dependency-free static recipe site about growing, keeping and cooking
heirloom vegetables. Everything is generated from plain `.mjs` modules by a
small Node script, so the published HTML is fully crawlable and needs no
server runtime.

- Live host target: `https://www.heirloomtable.com` (canonical URLs, sitemap and
  JSON-LD are generated with the `www` host).
- Audience: United States. Governing law named in the terms: Oregon, USA.
- No forms, no accounts, no server code. Email links only.

## Build and check

```cmd
node scripts/build-site.mjs      :: generate every page into the repo root
node scripts/validate-site.mjs   :: link, asset, SEO and JSON-LD audit
```

Or, if you prefer npm scripts:

```cmd
npm run build
npm run check
npm run verify
```

Both scripts are plain Node 18+ ESM and use no third-party packages, so
`npm install` is not required.

### What the build writes

| Output | Notes |
| --- | --- |
| `index.html`, `404.html`, `about.html`, `contact.html` | static pages |
| `recipes/index.html` | recipe index, grouped by category |
| `recipes/<slug>.html` (18) | one page per recipe |
| `privacy.html`, `terms.html`, `disclaimer.html`, `image-credits.html` | legal and attribution pages |
| `css/style.css`, `js/site.js` | inlined from `scripts/lib/` |
| `sitemap.xml`, `robots.txt` | crawler files |

Files under the repo root that the build owns are overwritten on every run.
Generated output is intentionally committed so the site can be dropped on any
static host (Netlify, Cloudflare Pages, GitHub Pages, S3, plain Apache) as-is.

## Where the content lives

- `data/recipes.mjs` - aggregate index: site metadata, category ordering,
  garden calendar, journal entries, FAQ.
- `data/recipes/<slug>.mjs` - one module per recipe: front matter, ingredients,
  method steps, notes, nutrition, image and credit key.
- `images/credits.json` - photographer, licence, source URL and modification
  note for every photograph used.
- `scripts/lib/` - `util.mjs` (escaping, dates, paths), `style.mjs` (CSS),
  `client.mjs` (browser JS), `layout.mjs` (head/header/footer), `render.mjs`
  (page bodies, cards, ad slots), `legal.mjs`, `privacy.mjs`, `policies.mjs`.

Add a recipe by dropping a module in `data/recipes/`, registering it in
`data/recipes.mjs`, placing the photo in `images/`, adding its credit to
`images/credits.json`, then re-running the build. The validator fails loudly if
any of those four steps is missing, if a link or image is broken, or if a page
is missing its SEO tags, structured data or image credit line.

## Sourcing photographs

Two dev-only helpers talk to the Wikimedia Commons API (no packages required):

```cmd
node scripts/find-images.mjs 3 6          :: search Commons for candidate photos
node scripts/fetch-images.mjs             :: resolve + download + record credits
node scripts/fetch-images.mjs slug-a      :: re-fetch a single recipe
```

`fetch-images.mjs` writes into `images/` and `images/credits.json`; it never
invents an author or licence, and `validate-site.mjs` refuses to pass if a page
uses a photo with no credit record. Keep any scratch downloads out of `images/`
so the folder holds only published assets.

## Advertising

Ad slots are rendered by `adSlot()` in `scripts/lib/render.mjs` in three
positions: top of the recipe index (`index-top`), mid home page (`home-mid`) and
the sidebar of each recipe (`recipe-side`). Every slot carries a visible
"Advertisement" label, sits outside the ingredient list and method steps, and is
collapsed by `js/site.js` until an ad network fills it, so readers never see an
empty box.

To go live:

1. Paste the network tag (AdSense, Ezoic, etc.) inside the matching
   `<div class="spot-body" data-ad-unit="...">` in `scripts/lib/render.mjs`.
2. Add the network's loader script tag to `scripts/lib/layout.mjs` alongside the
   other scripts, and any `ads.txt` entry the network gives you at the repo root.
3. Enable the network's certified consent message for EEA, UK and Swiss
   visitors; the privacy policy already describes that tool in section 3.

Advertisements are labelled as advertising, recipes stay editorial and free of
advertising inside the ingredient or method blocks, and the pages carry no
interstitials, pop-overs or auto-playing media.

## Licence

Recipe text, page copy and code: all rights reserved, Heirloom Table.
Photographs are used under the licences recorded in `images/credits.json` and
listed for readers on `image-credits.html`.
