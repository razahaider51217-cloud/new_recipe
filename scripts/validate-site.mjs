#!/usr/bin/env node
/**
 * Post-build sanity check: node scripts/validate-site.mjs
 *
 * Verifies the generated HTML rather than the source content: broken internal
 * links, missing images, unparseable JSON-LD, missing SEO tags, accidental
 * "undefined" strings, and that every recipe module produced a page.
 */
import { readFileSync, existsSync, readdirSync } from "node:fs";
import { join, dirname, resolve, relative } from "node:path";
import { ROOT } from "./lib/util.mjs";

const pages = [
  ...readdirSync(ROOT).filter((f) => f.endsWith(".html")).map((f) => f),
  ...readdirSync(join(ROOT, "recipes"))
    .filter((f) => f.endsWith(".html"))
    .map((f) => `recipes/${f}`),
];

const problems = [];
const note = (page, msg) => problems.push(`${page}: ${msg}`);

const attr = (html, re) => {
  const out = [];
  let m;
  while ((m = re.exec(html))) out.push(m[1]);
  return out;
};

let linkCount = 0;
let imgCount = 0;
let jsonLdCount = 0;

for (const page of pages) {
  const html = readFileSync(join(ROOT, page), "utf8");
  const dir = dirname(join(ROOT, page));

  // --- internal links and assets -----------------------------------------
  const refs = [
    ...attr(html, /\shref="([^"]+)"/g).map((v) => ["href", v]),
    ...attr(html, /\ssrc="([^"]+)"/g).map((v) => ["src", v]),
  ];
  for (const [kind, value] of refs) {
    if (/^(https?:|mailto:|tel:|data:|#)/i.test(value)) continue;
    const clean = value.split("#")[0].split("?")[0];
    if (!clean) continue;
    const target = resolve(dir, clean);
    const rel = relative(ROOT, target).replace(/\\/g, "/");
    if (kind === "href") linkCount += 1;
    else imgCount += 1;
    if (!existsSync(target)) note(page, `broken ${kind} -> ${value}`);
    if (/^images\/_/.test(rel)) note(page, `scratch image referenced: ${rel}`);
  }

  // --- required head tags ------------------------------------------------
  const title = (html.match(/<title>([^<]*)<\/title>/) || [])[1];
  const desc = (html.match(/<meta name="description" content="([^"]*)"/) || [])[1];
  const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) || [])[1];
  const h1s = attr(html, /<h1[^>]*>([\s\S]*?)<\/h1>/g);

  if (!title) note(page, "no <title>");
  else if (title.length > 75) note(page, `title is ${title.length} chars (>75)`);
  if (!desc) note(page, "no meta description");
  else if (desc.length < 70 || desc.length > 250) note(page, `description is ${desc.length} chars`);
  if (!canonical) note(page, "no canonical link");
  if (h1s.length !== 1) note(page, `expected exactly one <h1>, found ${h1s.length}`);
  if (!/lang="en-US"/.test(html)) note(page, 'html lang is not "en-US"');
  if (!/<main id="main">/.test(html)) note(page, "no <main id=\"main\">");

  // --- structured data ---------------------------------------------------
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
  jsonLdCount += blocks.length;
  for (const [, body] of blocks) {
    try {
      JSON.parse(body);
    } catch (err) {
      note(page, `invalid JSON-LD: ${err.message}`);
    }
  }

  // --- obvious template failures ----------------------------------------
  for (const bad of ["undefined", "NaN", "[object Object]"]) {
    if (html.includes(bad)) note(page, `contains "${bad}"`);
  }
  if (/<(p|h[123]|li|td|dd|button)\b[^>]*>\s*<\/(p|h[123]|li|td|dd|button)>/.test(html)) {
    note(page, "empty element body found");
  }

  // --- recipe pages in particular ----------------------------------------
  if (page.startsWith("recipes/") && page !== "recipes/index.html") {
    if (!/"@type":"Recipe"/.test(html)) note(page, "no Recipe structured data");
    if (!/class="credit-line"/.test(html)) note(page, "no photo credit line");
    if (!/<meta property="og:image"/.test(html)) note(page, "no og:image");
    if (!/class="ingredients"/.test(html)) note(page, "no ingredient list");
    if (!/class="steps"/.test(html)) note(page, "no method steps");
    if (!/id="step-1"/.test(html)) note(page, "no anchored first step");
  }
  // --- advertising, if present, must be clearly labelled -----------------
  if (html.includes('class="spot"')) {
    if (!/class="spot-label">Advertisement</.test(html)) {
      note(page, "advertising slot without an Advertisement label");
    }
    const spots = (html.match(/class="spot"/g) || []).length;
    const labels = (html.match(/class="spot-label">Advertisement</g) || []).length;
    if (spots !== labels) note(page, `${spots} ad slots but ${labels} labels`);
  }
}
const { recipes: all } = await import("../data/recipes.mjs");
const recipesCount = all.length;
const credits = JSON.parse(readFileSync(join(ROOT, "images", "credits.json"), "utf8"));
for (const r of all) {
  if (!existsSync(join(ROOT, "recipes", `${r.slug}.html`))) {
    note("recipes/", `missing page for ${r.slug}`);
  }
  if (!credits[r.creditKey]) note("images/credits.json", `no credit for ${r.creditKey}`);
  if (!existsSync(join(ROOT, r.image))) note("images/", `missing file ${r.image}`);
}

// --- sitemap --------------------------------------------------------------
const sitemap = readFileSync(join(ROOT, "sitemap.xml"), "utf8");
if (!sitemap.startsWith("<?xml")) note("sitemap.xml", "missing XML declaration");
const locs = attr(sitemap, /<loc>([^<]+)<\/loc>/g);
if (locs.length < recipesCount + 6) note("sitemap.xml", `only ${locs.length} urls`);

console.log(`Checked ${pages.length} pages, ${linkCount} links, ${imgCount} assets, ${jsonLdCount} JSON-LD blocks.`);
console.log(`Sitemap lists ${locs.length} URLs.`);
if (problems.length) {
  console.log(`\n${problems.length} problem(s):`);
  for (const p of problems) console.log(`  - ${p}`);
  process.exit(1);
}
console.log("All checks passed.");
