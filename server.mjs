#!/usr/bin/env node
/**
 * Zero-dependency static server for the generated site.
 *
 * Heroku needs a process that binds $PORT, so the Procfile runs this file:
 *
 *   web: node server.mjs
 *
 * Locally:
 *
 *   npm start                 -> http://localhost:3000
 *   PORT=5000 npm start       -> http://localhost:5000
 *
 * It serves the repository root exactly as scripts/build-site.mjs leaves it, so
 * run `npm run build` first if you have not generated the pages yet:
 *
 *   /                    -> index.html
 *   /recipes/            -> recipes/index.html
 *   /recipes/<slug>      -> recipes/<slug>.html
 *   anything missing     -> 404.html, served with a 404 status
 *
 * Requests can never escape the site root, and dotfiles, dot-directories and
 * node_modules are never served.
 */
import { createServer } from "node:http";
import { createReadStream } from "node:fs";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, sep } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL(".", import.meta.url));
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0"; // Heroku routes to the dyno over this interface

const CONTENT_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
  ".svg": "image/svg+xml",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".gif": "image/gif",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".eot": "application/vnd.ms-fontobject",
};

/** Dotfiles, dot-directories and node_modules are private. */
const PRIVATE = /(?:^|[/\\])\.|(?:^|[/\\])node_modules(?:[/\\]|$)/;

/** Map a URL path to an existing file inside ROOT, or return null. */
async function findFile(urlPath) {
  let pathname;
  try {
    pathname = decodeURIComponent(urlPath.split(/[?#]/)[0]);
  } catch {
    return null; // malformed percent-encoding
  }
  if (PRIVATE.test(pathname)) return null;

  const relative = normalize(pathname).replace(/^[/\\]+/, "");
  if (relative.startsWith("..") || relative.includes(`..${sep}`)) return null;

  const candidates = pathname.endsWith("/")
    ? [join(ROOT, relative, "index.html")]
    : [join(ROOT, relative)];

  if (!pathname.endsWith("/") && !extname(relative)) {
    // clean URLs: /recipes -> recipes/index.html, /recipes/slug -> recipes/slug.html
    candidates.push(join(ROOT, `${relative}.html`), join(ROOT, relative, "index.html"));
  }

  for (const candidate of candidates) {
    try {
      const info = await stat(candidate);
      if (info.isFile()) return { file: candidate, info };
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

/** Serve the site's own 404 page when one exists. */
async function sendNotFound(res, headOnly) {
  let page = null;
  try {
    page = await readFile(join(ROOT, "404.html"));
  } catch {
    /* no custom page, fall through to plain text */
  }
  const type = page ? "text/html; charset=utf-8" : "text/plain; charset=utf-8";
  const headers = { "content-type": type, "cache-control": "no-cache" };
  if (page) headers["content-length"] = page.length;
  res.writeHead(404, headers);
  res.end(headOnly ? undefined : page || "404 Not Found\n");
}

const server = createServer(async (req, res) => {
  const headOnly = req.method === "HEAD";

  if (req.method !== "GET" && !headOnly) {
    res.writeHead(405, { allow: "GET, HEAD", "content-type": "text/plain; charset=utf-8" });
    res.end("Method Not Allowed\n");
    return;
  }

  const found = await findFile(req.url || "/");
  if (!found) {
    await sendNotFound(res, headOnly);
    return;
  }

  const type = CONTENT_TYPES[extname(found.file).toLowerCase()] || "application/octet-stream";
  const etag = `W/"${found.info.size.toString(16)}-${found.info.mtimeMs.toString(16)}"`;

  if (req.headers["if-none-match"] === etag) {
    res.writeHead(304, { etag });
    res.end();
    return;
  }

  res.writeHead(200, {
    "content-type": type,
    "content-length": found.info.size,
    "last-modified": found.info.mtime.toUTCString(),
    etag,
    "cache-control": type.startsWith("text/html") ? "no-cache" : "public, max-age=3600",
  });

  if (headOnly) {
    res.end();
    return;
  }

  createReadStream(found.file).on("error", () => res.destroy()).pipe(res);
});

server.listen(PORT, HOST, () => {
  console.log(`Serving ${ROOT} on http://localhost:${PORT} (bound ${HOST})`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.on(signal, () => server.close(() => process.exit(0)));
}
