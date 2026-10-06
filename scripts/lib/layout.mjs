/** Page shell: header, navigation, footer and the shared HTML skeleton. */
import { esc, jsonLd } from "./util.mjs";

/** Inline SVG brand mark: a sprouting seed, drawn to match the clay/leaf palette. */
const BRAND_MARK = `<svg class="brand-mark" viewBox="0 0 64 64" role="img" aria-hidden="true" focusable="false">
<circle cx="32" cy="32" r="30" fill="#f4ecdd" stroke="#e2d6bf"/>
<path d="M32 50V27" stroke="#3f6b3a" stroke-width="3.4" stroke-linecap="round"/>
<path d="M32 31c0-9 6-15 15-15 0 9-6 15-15 15z" fill="#3f6b3a"/>
<path d="M32 39c0-7-4.6-11.6-11.6-11.6C20.4 34.4 25 39 32 39z" fill="#b0522a"/>
<circle cx="32" cy="52" r="2.6" fill="#d9a441"/>
</svg>`;

const NAV = [
  { href: "index.html", label: "Home", key: "home" },
  { href: "recipes/index.html", label: "Recipes", key: "recipes" },
  { href: "about.html", label: "About", key: "about" },
  { href: "contact.html", label: "Contact", key: "contact" },
];

/** @param {{root?: string, active?: string, footerCats?: Array<{name:string,slug:string}>}} opts */
export function header({ root = "", active = "", footerCats = [] } = {}) {
  const links = NAV.map((item) => {
    const current = item.key === active ? ' aria-current="page"' : "";
    return `<a href="${esc(root + item.href)}"${current}>${esc(item.label)}</a>`;
  }).join("\n          ");

  return `<header class="site-head">
    <div class="wrap head-in">
      <a class="brand" href="${esc(root)}index.html">
        ${BRAND_MARK}
        <span>
          <span class="brand-name">Heirloom Table</span>
          <span class="brand-tag">Garden recipes &amp; seed lore</span>
        </span>
      </a>
      <button class="nav-toggle" type="button" aria-expanded="false" aria-controls="primary-nav">Menu</button>
      <nav class="nav" id="primary-nav" aria-label="Primary">
          ${links}
      </nav>
    </div>
  </header>`;
}

export function footer({ root = "", footerCats = [], site }) {
  const catLinks = footerCats
    .slice(0, 6)
    .map((c) => `<li><a href="${esc(root)}recipes/index.html#cat-${esc(c.slug)}">${esc(c.name)}</a></li>`)
    .join("\n            ");

  return `<footer class="site-foot">
    <div class="wrap">
      <div class="foot-grid">
        <div>
          <h3>Heirloom Table</h3>
          <p>An independent American recipe collection for open-pollinated vegetables, fruit and herbs &mdash; how to grow them, when to pick them, and how to cook them so their flavour survives the pan.</p>
          <p><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></p>
        </div>
        <div>
          <h3>Browse</h3>
          <ul>
            <li><a href="${esc(root)}recipes/index.html">All recipes</a></li>
            ${catLinks}
          </ul>
        </div>
        <div>
          <h3>About</h3>
          <ul>
            <li><a href="${esc(root)}about.html">Our kitchen &amp; method</a></li>
            <li><a href="${esc(root)}about.html#editorial">Editorial standards</a></li>
            <li><a href="${esc(root)}about.html#funding">How ads work</a></li>
            <li><a href="${esc(root)}image-credits.html">Image credits</a></li>
            <li><a href="${esc(root)}contact.html">Contact us</a></li>
          </ul>
        </div>
        <div>
          <h3>Policies</h3>
          <ul>
            <li><a href="${esc(root)}privacy.html">Privacy policy</a></li>
            <li><a href="${esc(root)}privacy.html#cookies">Cookie notice</a></li>
            <li><a href="${esc(root)}terms.html">Terms of use</a></li>
            <li><a href="${esc(root)}disclaimer.html">Disclaimer</a></li>
          </ul>
        </div>
      </div>
      <div class="foot-note">
        <span>&copy; ${new Date().getUTCFullYear()} Heirloom Table. All rights reserved.</span>
        <span>Made by hand in the United States. Recipes tested in a home kitchen.</span>
      </div>
    </div>
  </footer>`;
}

/**
 * Full document.
 * @param {{root?:string, active?:string, title:string, description:string,
 *   canonical:string, content:string, bodyClass?:string, scripts?:string[],
 *   extraHead?:string, structuredData?:object[], footerCats?:Array, site:object}} o
 */
export function layout(o) {
  const {
    root = "",
    active = "",
    title,
    description,
    canonical,
    content,
    bodyClass = "",
    scripts = [],
    extraHead = "",
    structuredData = [],
    footerCats = [],
    ogImage = "",
    site,
  } = o;

  const ld = structuredData.map(jsonLd).join("\n    ");
  const scriptTags = scripts
    .map((src) => `    <script src="${esc(root + src)}" defer></script>`)
    .join("\n");
  const ogImageTags = ogImage
    ? `    <meta property="og:image" content="${esc(ogImage)}">
    <meta property="og:image:width" content="900">
    <meta property="og:image:height" content="675">
    <meta name="twitter:image" content="${esc(ogImage)}">
`
    : "";

  return `<!DOCTYPE html>
<html lang="en-US">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${esc(canonical)}">
    <meta name="robots" content="index, follow, max-image-preview:large">
    <meta name="author" content="${esc(site.author)}">
    <meta name="theme-color" content="#3f6b3a">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${esc(site.name)}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:url" content="${esc(canonical)}">
    <meta property="og:locale" content="en_US">
    <meta name="twitter:card" content="summary_large_image">
${ogImageTags}    <link rel="icon" href="${esc(root)}images/favicon.svg" type="image/svg+xml">
    <link rel="stylesheet" href="${esc(root)}css/style.css">
${extraHead}    ${ld}
${scriptTags}
</head>
<body${bodyClass ? ` class="${esc(bodyClass)}"` : ""}>
    <a class="skip" href="#main">Skip to content</a>
${header({ root, active, footerCats })}
    <main id="main">
${content}
    </main>
${footer({ root, footerCats, site })}
</body>
</html>
`;
}
