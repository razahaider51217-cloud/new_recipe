/**
 * Resolves one freely-licensed (Wikimedia Commons / public domain) photo per
 * recipe, downloads it into /images, and records attribution data in
 * /images/credits.json so the site can show proper image credits.
 *
 * Every recipe points at a hand-picked Commons file (or a Wikipedia article
 * whose lead photo depicts the dish) so the photo genuinely matches the recipe.
 *
 * Usage:
 *   node scripts/fetch-images.mjs                 # all recipes
 *   node scripts/fetch-images.mjs slug-a slug-b   # only these slugs (rebuild)
 */
import { mkdir, writeFile, readFile, readdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const OUT_DIR = join(ROOT, "images");
const CREDITS = join(OUT_DIR, "credits.json");
const UA = { "user-agent": "HeirloomRecipeSite/1.0 (build script; contact: site owner)" };
const SIZE = 900;
const API = "https://en.wikipedia.org/w/api.php";
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// slug -> the dish photo we want. `file` = exact Commons file title.
// `wiki` = Wikipedia article whose lead image depicts the dish.
const TARGETS = [
  { slug: "fried-green-tomatoes", file: "Fried green tomatoes.jpg" },
  { slug: "three-sisters-succotash", file: "Succotash.jpg" },
  { slug: "sweet-corn-chowder", wiki: "Corn chowder" },
  { slug: "charred-corn-salsa", file: "Corn Relish (3997173234).jpg" },
  { slug: "eggplant-caponata", file: "Sicilian caponata.jpg" },
  { slug: "stuffed-peppers", wiki: "Stuffed peppers" },
  { slug: "zucchini-fritters", file: "Zucchini & feta fritters (7804257920).jpg" },
  { slug: "roasted-beets-mint-yogurt", file: "Roasted Beets (3426015484).jpg" },
  { slug: "white-gazpacho", file: "Ajoblanco.jpg" },
  { slug: "fresh-tomato-salsa", wiki: "Salsa (sauce)" },
  { slug: "charred-cabbage", file: "Charred Hispi Cabbage - Bill's, Lewes 2026-07-03.jpg" },
  { slug: "white-pumpkin-pie", wiki: "Pumpkin pie" },
  { slug: "grilled-okra", file: "Okra Fry.jpg" },
  { slug: "sour-dill-yellow-beans", file: "Pickles de chauchas, pepinos y morrones rojos.jpg" },
  { slug: "ground-cherry-jam", file: "Physalis peruviana fruits close-up.jpg" },
  { slug: "huckleberry-jam", file: "Huckleberry (Vaccinium membranaceum) (43741431161).jpg" },
  { slug: "grilled-eggplant-hunan", file: "Sichuan signature eggplant with garlic sauce.jpg" },
  { slug: "tomato-bruschetta", wiki: "Bruschetta" },
];

function extOf(buf) {
  if (buf[0] === 0xff && buf[1] === 0xd8) return "jpg";
  if (buf[0] === 0x89 && buf[1] === 0x50) return "png";
  if (buf[0] === 0x47 && buf[1] === 0x49) return "gif";
  if (buf.slice(8, 12).toString() === "WEBP") return "webp";
  return "jpg";
}

async function getJson(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(20000) });
      if (res.status === 429) {
        await sleep(1200 * i);
        continue;
      }
      if (!res.ok) throw new Error(`API ${res.status}`);
      return await res.json();
    } catch (err) {
      if (i === tries) throw err;
      await sleep(1200 * i);
    }
  }
  throw new Error("rate limited");
}

async function download(url, tries = 4) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(30000) });
      if (res.status === 429) {
        await sleep(1500 * i);
        continue;
      }
      if (!res.ok) throw new Error(`GET ${res.status}`);
      return Buffer.from(await res.arrayBuffer());
    } catch (err) {
      if (i === tries) throw err;
      await sleep(1500 * i);
    }
  }
  throw new Error("download rate limited");
}

const stripHtml = (s) =>
  String(s || "")
    .replace(/<[^>]*>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/\s+/g, " ")
    .trim();

/** Wikipedia article title -> lead image file name (without the "File:" prefix). */
async function resolveArticleFiles(titles) {
  const url =
    `${API}?action=query&prop=pageimages&piprop=name&pilimit=50&redirects=1` +
    `&titles=${encodeURIComponent(titles.join("|"))}&format=json&formatversion=2`;
  const json = await getJson(url);
  const map = new Map();
  for (const p of json?.query?.pages || []) {
    if (p.pageimage) map.set(p.title.toLowerCase(), p.pageimage);
  }
  for (const r of json?.query?.redirects || []) {
    const v = map.get(r.to.toLowerCase());
    if (v) map.set(r.from.toLowerCase(), v);
  }
  for (const n of json?.query?.normalized || []) {
    const v = map.get(n.to.toLowerCase());
    if (v) map.set(n.from.toLowerCase(), v);
  }
  return map;
}

/** Batch Commons lookup: file title -> { thumb, meta }. */
async function commonsInfo(files) {
  const url =
    `${COMMONS}?action=query&prop=imageinfo&iiprop=url|mime|extmetadata` +
    `&iiurlwidth=${SIZE}&redirects=1` +
    `&titles=${encodeURIComponent(files.map((f) => `File:${f}`).join("|"))}` +
    `&format=json&formatversion=2`;
  const json = await getJson(url);
  const key = (t) => String(t).replace(/^File:/i, "").toLowerCase();
  const map = new Map();
  for (const p of json?.query?.pages || []) {
    const ii = p.imageinfo?.[0];
    if (ii) map.set(key(p.title), { thumb: ii.thumburl || ii.url, meta: ii.extmetadata || {} });
  }
  const alias = (list) => {
    for (const n of list || []) {
      const v = map.get(key(n.to));
      if (v) map.set(key(n.from), v);
    }
  };
  alias(json?.query?.redirects);
  alias(json?.query?.normalized);
  return map;
}

await mkdir(OUT_DIR, { recursive: true });

const only = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const targets = only.length ? TARGETS.filter((t) => only.includes(t.slug)) : TARGETS;
if (!targets.length) {
  console.error("No matching slugs. Known slugs:\n  " + TARGETS.map((t) => t.slug).join("\n  "));
  process.exit(1);
}

// 1) resolve every target to a concrete Commons file name
const articleTargets = targets.filter((t) => !t.file);
const artMap = articleTargets.length ? await resolveArticleFiles(articleTargets.map((t) => t.wiki)) : new Map();

const resolved = targets.map((t) => ({
  ...t,
  file: t.file || artMap.get(String(t.wiki).toLowerCase()) || null,
}));

const report = [];
const jobs = resolved.filter((r) => {
  if (!r.file) {
    report.push(`MISS   ${r.slug}  (no file resolved for "${r.wiki || r.file}")`);
    return false;
  }
  return true;
});

// 2) one batched Commons info request for all files
const info = await commonsInfo(jobs.map((j) => j.file));

// 3) download sequentially (gentle on the API) and record attribution
let credits = {};
try {
  credits = JSON.parse(await readFile(CREDITS, "utf8"));
} catch {
  /* first run: no credits file yet */
}

for (const job of jobs) {
  const found = info.get(job.file.toLowerCase());
  if (!found?.thumb) {
    report.push(`MISS   ${job.slug}  (Commons has no image for "${job.file}")`);
    continue;
  }
  try {
    const buf = await download(found.thumb);
    const ext = extOf(buf);
    for (const f of await readdir(OUT_DIR)) {
      if (f.startsWith(job.slug + ".")) await rm(join(OUT_DIR, f), { force: true });
    }
    await writeFile(join(OUT_DIR, `${job.slug}.${ext}`), buf);
    const m = found.meta || {};
    credits[job.slug] = {
      file: `File:${job.file}`,
      page: `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(job.file.replace(/ /g, "_"))}`,
      artist: stripHtml(m.Artist?.value) || "Unknown",
      license: stripHtml(m.LicenseShortName?.value) || "See file page",
      licenseUrl: stripHtml(m.LicenseUrl?.value) || "",
      source: stripHtml(m.Credit?.value) || "Wikimedia Commons",
    };
    report.push(
      `OK     ${job.slug}.${ext}  ${(buf.length / 1024).toFixed(0)} KB  <- ${job.file}  [${credits[job.slug].license}]`,
    );
  } catch (err) {
    report.push(`ERROR  ${job.slug}  ${err.message}`);
  }
  await sleep(350);
}

await writeFile(CREDITS, JSON.stringify(credits, null, 2) + "\n");
console.log(report.join("\n"));
console.log(`\n${Object.keys(credits).length} credit entries in images/credits.json`);
