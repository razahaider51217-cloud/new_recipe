#!/usr/bin/env node
/**
 * Builds the whole static site from the content modules in /data.
 *
 *   node scripts/build-site.mjs
 *
 * Writes: index.html, recipes/index.html, recipes/<slug>.html (18 pages),
 * about.html, contact.html, privacy.html, terms.html, disclaimer.html,
 * image-credits.html, 404.html, css/style.css, js/site.js, sitemap.xml,
 * robots.txt. Regenerating is idempotent: edit a recipe module or a template
 * and run the command again.
 */
import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ROOT, esc, writeFileAt } from "./lib/util.mjs";
import { SITE, recipes, categories, bySlug, featured, validate } from "../data/recipes.mjs";
import { layout } from "./lib/layout.mjs";
import { STYLE } from "./lib/style.mjs";
import { CLIENT } from "./lib/client.mjs";
import {
  cardGrid,
  homePage,
  indexPage,
  recipePage,
  recipeStructuredData,
  categorySlug,
} from "./lib/render.mjs";
import { aboutPage, contactPage } from "./lib/legal.mjs";
import { privacyPage } from "./lib/privacy.mjs";
import { termsPage, disclaimerPage, creditsPage } from "./lib/policies.mjs";

/* ---------------------------------------------------------------- setup --- */

const problems = validate();
if (problems.length) {
  console.error("Refusing to build: content problems found.");
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const credits = JSON.parse(await readFile(join(ROOT, "images", "credits.json"), "utf8"));
const footerCats = categories.map((name) => ({ name, slug: categorySlug(name) }));
const counts = new Map(categories.map((c) => [c, recipes.filter((r) => r.category === c).length]));

const written = [];
const emit = async (relPath, contents) => {
  await writeFileAt(ROOT, relPath, contents);
  written.push(relPath);
};

/** Absolute URL for a relative site path. */
const abs = (p) => `${SITE.url}/${p}`;

/* ------------------------------------------------------------ structured --- */

const orgLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE.name,
  url: SITE.url,
  email: SITE.email,
  description: SITE.description,
  foundingDate: String(SITE.founded),
  areaServed: "US",
  knowsAbout: [
    "heirloom vegetables",
    "seed saving",
    "seasonal cooking",
    "home preserving",
  ],
};

const siteLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE.name,
  url: SITE.url,
  inLanguage: "en-US",
  publisher: { "@type": "Organization", name: SITE.name, url: SITE.url },
};

const breadcrumbLd = (trail) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: trail.map((item, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: item.name,
    item: item.url,
  })),
});

/* ------------------------------------------------------------------ home --- */

const homeContent = homePage({
  featured,
  latest: recipes.slice(0, 6),
  categories,
  counts,
});

const homeListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Featured heirloom recipes",
  itemListElement: featured.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: abs(`recipes/${r.slug}.html`),
    name: r.title,
  })),
};

await emit(
  "index.html",
  layout({
    root: "",
    active: "home",
    title: `${SITE.name} — ${SITE.tagline}`,
    description: SITE.description,
    canonical: `${SITE.url}/`,
    content: homeContent,
    footerCats,
    scripts: ["js/site.js"],
    structuredData: [siteLd, orgLd, homeListLd],
    site: SITE,
  })
);

/* --------------------------------------------------------------- recipes --- */

const indexContent = indexPage({ recipes, categories, root: "../" });

const indexListLd = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "All heirloom recipes",
  numberOfItems: recipes.length,
  itemListElement: recipes.map((r, i) => ({
    "@type": "ListItem",
    position: i + 1,
    url: abs(`recipes/${r.slug}.html`),
    name: r.title,
  })),
};

await emit(
  "recipes/index.html",
  layout({
    root: "../",
    active: "recipes",
    title: `All Recipes — ${recipes.length} Heirloom Vegetable Recipes | ${SITE.name}`,
    description: `Browse all ${recipes.length} tested heirloom recipes on ${SITE.name}: tomatoes, corn, shell beans, squash, eggplant, greens, preserves and more, grouped by crop.`,
    canonical: abs("recipes/"),
    content: indexContent,
    footerCats,
    scripts: ["js/site.js"],
    structuredData: [
      indexListLd,
      breadcrumbLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "Recipes", url: abs("recipes/") },
      ]),
    ],
    site: SITE,
  })
);

for (const r of recipes) {
  const related = [
    ...recipes.filter((o) => o.category === r.category && o.slug !== r.slug),
    ...recipes.filter((o) => o.course === r.course && o.category !== r.category),
    ...recipes.filter((o) => o.slug !== r.slug),
  ]
    .filter((o, i, arr) => arr.findIndex((x) => x.slug === o.slug) === i)
    .slice(0, 3);

  // Keep <title> inside the 75-character window Google renders.
  const branded = `${r.title} Recipe | ${SITE.name}`;
  const shortTitle = branded.length <= 75 ? branded : `${r.title} | ${SITE.name}`;

  await emit(
    `recipes/${r.slug}.html`,
    layout({
      root: "../",
      active: "recipes",
      title: shortTitle,
      description: r.description,
      canonical: abs(`recipes/${r.slug}.html`),
      ogImage: abs(r.image),
      content: recipePage(r, { credits, related }),
      footerCats,
      scripts: ["js/site.js"],
      structuredData: recipeStructuredData(r, SITE),
      site: SITE,
    })
  );
}

/* ---------------------------------------------------------- text pages --- */

const textPages = [
  {
    file: "about.html",
    title: `About ${SITE.name} — Our Kitchen, Methods and Standards`,
    description: `Who writes ${SITE.name}, how recipes are tested, how the photographs are licensed and how the site is funded.`,
    content: aboutPage(SITE),
    ld: [orgLd],
  },
  {
    file: "contact.html",
    title: `Contact ${SITE.name}`,
    description: `Email ${SITE.name} about corrections, questions, republishing requests and photograph credits. We reply within two business days.`,
    content: contactPage(SITE),
    ld: [],
  },
  {
    file: "privacy.html",
    title: `Privacy Policy | ${SITE.name}`,
    description: `What data ${SITE.name} collects, the cookies our advertising partners use, and your GDPR and CCPA privacy rights and opt-out choices.`,
    content: privacyPage(SITE),
    ld: [],
  },
  {
    file: "terms.html",
    title: `Terms of Use | ${SITE.name}`,
    description: `The rules for using ${SITE.name}: what you may print, quote and share, and what needs written permission.`,
    content: termsPage(SITE),
    ld: [],
  },
  {
    file: "disclaimer.html",
    title: `Disclaimer | ${SITE.name}`,
    description: `Food safety, allergens, canning, foraging and gardening disclaimers for the recipes published on ${SITE.name}.`,
    content: disclaimerPage(SITE),
    ld: [],
  },
  {
    file: "image-credits.html",
    title: `Image Credits | ${SITE.name}`,
    description: `The full photo credit register for ${SITE.name}: photographer, licence and source for every image used on the site.`,
    content: creditsPage({ credits, recipes, site: SITE }),
    ld: [
      breadcrumbLd([
        { name: "Home", url: `${SITE.url}/` },
        { name: "Image credits", url: abs("image-credits.html") },
      ]),
    ],
  },
];

for (const p of textPages) {
  await emit(
    p.file,
    layout({
      root: "",
      active: p.file === "about.html" ? "about" : p.file === "contact.html" ? "contact" : "",
      title: p.title,
      description: p.description,
      canonical: abs(p.file),
      content: p.content,
      footerCats,
      scripts: ["js/site.js"],
      structuredData: p.ld,
      site: SITE,
    })
  );
}

/* ----------------------------------------------------------------- 404 --- */

const notFound = `    <div class="wrap narrow prose">
      <h1>We could not find that page</h1>
      <p>The link may be old, or the recipe may have been renamed. Everything we publish is listed on the recipe index.</p>
      <p><a class="btn" href="recipes/index.html">Browse all ${recipes.length} recipes</a></p>
      <h2>Popular right now</h2>
      ${cardGrid(featured.slice(0, 3), "")}
    </div>`;

await emit(
  "404.html",
  layout({
    root: "",
    title: `Page not found | ${SITE.name}`,
    description: "That page could not be found. Browse the full heirloom recipe index instead.",
    canonical: `${SITE.url}/`,
    content: notFound,
    footerCats,
    scripts: ["js/site.js"],
    structuredData: [],
    site: SITE,
  })
);

/* -------------------------------------------------------- assets & feeds --- */

await emit("css/style.css", STYLE);
await emit("js/site.js", CLIENT);

const today = new Date().toISOString().slice(0, 10);
const sitemapEntries = [
  { loc: `${SITE.url}/`, lastmod: today, changefreq: "weekly", priority: "1.0" },
  { loc: abs("recipes/"), lastmod: recipes[0].datePublished, changefreq: "weekly", priority: "0.9" },
  ...recipes.map((r) => ({
    loc: abs(`recipes/${r.slug}.html`),
    lastmod: r.datePublished,
    changefreq: "monthly",
    priority: "0.8",
  })),
  { loc: abs("about.html"), lastmod: today, changefreq: "yearly", priority: "0.5" },
  { loc: abs("contact.html"), lastmod: today, changefreq: "yearly", priority: "0.4" },
  { loc: abs("image-credits.html"), lastmod: today, changefreq: "yearly", priority: "0.3" },
  { loc: abs("privacy.html"), lastmod: today, changefreq: "yearly", priority: "0.3" },
  { loc: abs("terms.html"), lastmod: today, changefreq: "yearly", priority: "0.3" },
  { loc: abs("disclaimer.html"), lastmod: today, changefreq: "yearly", priority: "0.3" },
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemapEntries
  .map(
    (u) => `  <url>
    <loc>${esc(u.loc)}</loc>
    <lastmod>${u.lastmod}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;
await emit("sitemap.xml", sitemap);

await emit(
  "robots.txt",
  `# ${SITE.name}
User-agent: *
Allow: /

Sitemap: ${SITE.url}/sitemap.xml
`
);

/* --------------------------------------------------------------- report --- */

const missingCredits = recipes.filter((r) => !credits[r.creditKey]);
const byBook = written.reduce((acc, f) => {
  const key = f.includes("/") ? f.slice(0, f.indexOf("/")) : "(root)";
  acc[key] = (acc[key] || 0) + 1;
  return acc;
}, {});

console.log(`Built ${written.length} files for ${recipes.length} recipes.`);
console.log(
  Object.entries(byBook)
    .map(([k, v]) => `  ${k}: ${v}`)
    .join("\n")
);
if (missingCredits.length) {
  console.warn(`Warning: no credit entry for ${missingCredits.map((r) => r.slug).join(", ")}`);
}
console.log(`Done. Open ${join(ROOT, "index.html")}`);
