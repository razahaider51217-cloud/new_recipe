/**
 * Helper (dev only): search Wikimedia Commons for candidate photos of a dish and
 * print the top matching file titles + thumbnail URLs, so we can hand-pick an
 * accurate, freely-licensed image for each recipe.
 *
 * Usage: node scripts/find-images.mjs [startIndex] [endIndex]
 */
const UA = { "user-agent": "HeirloomRecipeSite/1.0 (build script; contact: site owner)" };
const COMMONS = "https://commons.wikimedia.org/w/api.php";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function getJson(url, tries = 3) {
  for (let i = 1; i <= tries; i++) {
    try {
      const res = await fetch(url, { headers: UA, signal: AbortSignal.timeout(8000) });
      if (res.status === 429) {
        await sleep(800 * i);
        continue;
      }
      if (!res.ok) throw new Error(`API ${res.status}`);
      return res.json();
    } catch (err) {
      if (i === tries) throw err;
      await sleep(800 * i);
    }
  }
  throw new Error("rate limited");
}

async function search(query, limit = 6) {
  const url =
    `${COMMONS}?action=query&generator=search&gsrnamespace=6&gsrlimit=${limit}` +
    `&gsrsearch=${encodeURIComponent(query)}&prop=imageinfo&iiprop=url` +
    `&iiurlwidth=400&format=json&formatversion=2`;
  const json = await getJson(url);
  return (json?.query?.pages || [])
    .map((p) => p.title)
    .filter((t) => /\.(jpe?g|png)$/i.test(t));
}

const QUERIES = [
  "esquites",
  "elote corn",
  "corn relish",
  "Fried green tomatoes",
  "caponata",
  "gazpacho",
];

const start = Number(process.argv[2] || 0);
const end = Number(process.argv[3] || QUERIES.length);

for (const q of QUERIES.slice(start, end)) {
  console.log(`\n=== ${q} ===`);
  try {
    for (const t of await search(q, 8)) console.log("   " + t);
  } catch (e) {
    console.log("   ERROR " + e.message);
  }
  await sleep(1200);
}
