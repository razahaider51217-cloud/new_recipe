/**
 * Small shared helpers for the site generator.
 * No dependencies; plain Node built-ins only.
 */
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

/** Absolute path to the project root, decoded so spaces in it stay spaces. */
export const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/** Escape text for use inside HTML text nodes and quoted attributes. */
export function esc(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Escape a JSON-LD payload so it can never break out of its script tag. */
export function jsonLd(obj) {
  const body = JSON.stringify(obj).replace(/</g, "\\u003c").replace(/&/g, "\\u0026");
  return `<script type="application/ld+json">${body}</script>`;
}

/** Slugify a category name: "Soups & Stews" -> "soups-stews". */
export function slugify(text) {
  return String(text)
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/** "2024-08-12" -> "August 12, 2024" (UTC, so the date never shifts). */
export function formatDate(iso) {
  const d = new Date(`${iso}T00:00:00Z`);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: "UTC",
  });
}

/** Minutes -> ISO 8601 duration for schema.org, e.g. PT1H15M. */
export function isoDuration(minutes) {
  const m = Math.max(1, Math.round(minutes));
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return `PT${h ? `${h}H` : ""}${rest ? `${rest}M` : h ? "" : "0M"}`;
}

/** 75 -> "1 hr 15 min" */
export function humanMinutes(minutes) {
  const m = Math.round(minutes);
  if (m < 60) return `${m} min`;
  const h = Math.floor(m / 60);
  const rest = m % 60;
  return rest ? `${h} hr ${rest} min` : `${h} hr`;
}

/** Write a UTF-8 text file, creating parent folders as needed. */
export async function writeFileAt(root, relPath, contents) {
  const abs = join(root, relPath);
  await mkdir(dirname(abs), { recursive: true });
  await writeFile(abs, contents, "utf8");
  return relPath;
}

export function titleCase(text) {
  return String(text).replace(/\b([a-z])/g, (m) => m.toUpperCase());
}
