/**
 * Aggregate content source for the whole site.
 *
 * Every recipe lives in its own module under ./recipes/<slug>.mjs so that a
 * single recipe can be edited without touching the others. This file simply
 * collects them, sorts them newest-first, and derives a few convenience
 * lookups used by scripts/build-site.mjs.
 *
 * Usage:
 *   import { recipes, bySlug, categories, SITE } from "../data/recipes.mjs";
 */
import friedGreenTomatoes from "./recipes/fried-green-tomatoes.mjs";
import threeSistersSuccotash from "./recipes/three-sisters-succotash.mjs";
import sweetCornChowder from "./recipes/sweet-corn-chowder.mjs";
import charredCornSalsa from "./recipes/charred-corn-salsa.mjs";
import eggplantCaponata from "./recipes/eggplant-caponata.mjs";
import stuffedPeppers from "./recipes/stuffed-peppers.mjs";
import zucchiniFritters from "./recipes/zucchini-fritters.mjs";
import whiteGazpacho from "./recipes/white-gazpacho.mjs";
import freshTomatoSalsa from "./recipes/fresh-tomato-salsa.mjs";
import charredCabbage from "./recipes/charred-cabbage.mjs";
import whitePumpkinPie from "./recipes/white-pumpkin-pie.mjs";
import grilledOkra from "./recipes/grilled-okra.mjs";
import sourDillYellowBeans from "./recipes/sour-dill-yellow-beans.mjs";
import groundCherryJam from "./recipes/ground-cherry-jam.mjs";
import roastedBeetsMintYogurt from "./recipes/roasted-beets-mint-yogurt.mjs";
import huckleberryJam from "./recipes/huckleberry-jam.mjs";
import grilledEggplantHunan from "./recipes/grilled-eggplant-hunan.mjs";
import tomatoBruschetta from "./recipes/tomato-bruschetta.mjs";

export const SITE = {
  name: "Heirloom Table",
  tagline: "Heirloom vegetable recipes from the kitchen garden",
  url: "https://www.heirloomtable.com",
  author: "The Heirloom Table Kitchen",
  email: "hello@heirloomtable.com",
  locale: "en-US",
  country: "USA",
  founded: 2023,
  description:
    "Heirloom Table is an independent American recipe collection devoted to open-pollinated vegetables, fruit and herbs: how to grow them, when to pick them, and how to cook them without losing their flavour.",
  social: {
    pinterest: "https://www.pinterest.com/",
    instagram: "https://www.instagram.com/",
    facebook: "https://www.facebook.com/",
  },
};

/** Field order here is only cosmetic; recipes are sorted by date below. */
export const recipes = [
  friedGreenTomatoes,
  threeSistersSuccotash,
  sweetCornChowder,
  charredCornSalsa,
  eggplantCaponata,
  stuffedPeppers,
  zucchiniFritters,
  whiteGazpacho,
  freshTomatoSalsa,
  charredCabbage,
  whitePumpkinPie,
  grilledOkra,
  sourDillYellowBeans,
  groundCherryJam,
  roastedBeetsMintYogurt,
  huckleberryJam,
  grilledEggplantHunan,
  tomatoBruschetta,
].sort((a, b) => (a.datePublished < b.datePublished ? 1 : -1));

export const bySlug = new Map(recipes.map((r) => [r.slug, r]));

/** ["Beans & Legumes", ...] in alphabetical order. */
export const categories = [...new Set(recipes.map((r) => r.category))].sort();

/** Featured recipes for the home page (newest four, hand-ordered). */
export const featured = [
  "tomato-bruschetta",
  "grilled-eggplant-hunan",
  "white-pumpkin-pie",
  "huckleberry-jam",
]
  .map((slug) => bySlug.get(slug))
  .filter(Boolean);

export function recipesInCategory(category) {
  return recipes.filter((r) => r.category === category);
}

/** Rough sanity check so a typo in a recipe module fails the build loudly. */
export function validate() {
  const problems = [];
  const seen = new Set();
  for (const r of recipes) {
    const need = ["slug", "title", "category", "image", "creditKey", "imageAlt", "description"];
    for (const key of need) {
      if (!r[key]) problems.push(`${r.slug || "(missing slug)"}: missing "${key}"`);
    }
    if (seen.has(r.slug)) problems.push(`${r.slug}: duplicate slug`);
    seen.add(r.slug);
    for (const key of ["ingredients", "instructions", "equipment"]) {
      if (!Array.isArray(r[key]) || r[key].length === 0) problems.push(`${r.slug}: "${key}" is empty`);
    }
  }
  return problems;
}
