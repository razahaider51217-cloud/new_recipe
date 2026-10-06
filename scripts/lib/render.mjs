/** HTML builders for recipe cards, the home page, the index and recipe pages. */
import { esc, formatDate, humanMinutes, isoDuration, slugify } from "./util.mjs";

export function categorySlug(name) {
  return slugify(name);
}

/**
 * A labelled advertising slot. The visible "Advertisement" label keeps the
 * placement honest; the empty body is collapsed by js/site.js unless an ad
 * network (AdSense, Ezoic, etc.) actually fills it, so readers never see an
 * empty box. Ads are never placed inside the ingredient list, the method
 * steps or anything that could be mistaken for editorial content.
 */
export function adSlot(name, label = "Advertisement") {
  return `<aside class="spot" data-ad-slot="${esc(name)}" aria-label="${esc(label)}">
      <p class="spot-label">${esc(label)}</p>
      <div class="spot-body" data-ad-unit="${esc(name)}"><!-- paste your ad network tag here --></div>
    </aside>`;
}
/** A single recipe card. */
export function card(r, root = "") {
  return `<article class="card" data-category="${esc(categorySlug(r.category))}">
        <a class="thumb" href="${esc(root)}recipes/${esc(r.slug)}.html" tabindex="-1" aria-hidden="true">
          <img src="${esc(root + r.image)}" alt="${esc(r.imageAlt)}" width="900" height="675" loading="lazy" decoding="async">
        </a>
        <div class="card-body">
          <p class="kicker">${esc(r.category)}</p>
          <h3><a href="${esc(root)}recipes/${esc(r.slug)}.html">${esc(r.title)}</a></h3>
          <p>${esc(r.description)}</p>
          <p class="meta">
            <span>Total ${esc(humanMinutes(r.totalMinutes))}</span>
            <span>${esc(r.course)}</span>
          </p>
        </div>
      </article>`;
}

export function cardGrid(list, root = "") {
  return `<div class="grid">
      ${list.map((r) => card(r, root)).join("\n      ")}
    </div>`;
}

/** Recipe structured data, plus a breadcrumb trail for the same page. */
export function recipeStructuredData(r, site) {
  const url = `${site.url}/recipes/${r.slug}.html`;
  const recipe = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: r.title,
    description: r.description,
    image: [`${site.url}/${r.image}`],
    author: { "@type": "Organization", name: site.author, url: site.url },
    publisher: { "@type": "Organization", name: site.name, url: site.url },
    datePublished: r.datePublished,
    dateModified: r.datePublished,
    recipeCategory: r.category,
    recipeCuisine: r.cuisine,
    keywords: r.keywords.join(", "),
    prepTime: isoDuration(r.prepMinutes),
    cookTime: isoDuration(r.cookMinutes),
    totalTime: isoDuration(r.totalMinutes),
    recipeYield: r.yield,
    isAccessibleForFree: true,
    tool: r.equipment,
    recipeIngredient: r.ingredients,
    recipeInstructions: r.instructions.map((step, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: step.name,
      text: step.text,
      url: `${url}#step-${i + 1}`,
    })),
  };

  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: `${site.url}/` },
      { "@type": "ListItem", position: 2, name: "Recipes", item: `${site.url}/recipes/` },
      { "@type": "ListItem", position: 3, name: r.title, item: url },
    ],
  };

  return [recipe, crumbs];
}

/** Image credit line shown under every photograph (CC BY / CC BY-SA compliance). */
export function creditLine(r, credits, root = "../") {
  const c = credits[r.creditKey];
  if (!c) return "";
  const artist = c.artist || "Unknown author";
  const license = c.license || "See source";
  const lic = c.licenseUrl
    ? `<a href="${esc(c.licenseUrl)}" rel="license nofollow noopener" target="_blank">${esc(license)}</a>`
    : esc(license);
  return `<p class="credit-line">Photo: ${esc(artist)} &middot; ${lic} &middot; via <a href="${esc(c.page)}" rel="nofollow noopener" target="_blank">Wikimedia Commons</a> &middot; <a href="${esc(root)}image-credits.html">all image credits</a></p>`;
}

/** Full recipe page body (everything inside <main>). */
export function recipePage(r, { credits, related }) {
  const root = "../";
  const published = formatDate(r.datePublished);

  const badges = [r.category, r.course, r.cuisine, ...r.tags]
    .map((b) => `<li>${esc(b)}</li>`)
    .join("\n            ");

  const facts = [
    ["Prep time", humanMinutes(r.prepMinutes)],
    ["Cook time", humanMinutes(r.cookMinutes)],
    ["Total time", humanMinutes(r.totalMinutes)],
    ["Yield", r.yield],
  ]
    .map(([k, v]) => `<div class="fact"><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`)
    .join("\n          ");

  const ingredients = r.ingredients.map((i) => `<li>${esc(i)}</li>`).join("\n                ");
  const equipment = r.equipment.map((e) => `<li>${esc(e)}</li>`).join("\n                ");
  const steps = r.instructions
    .map((s, i) => `<li id="step-${i + 1}"><h3>${esc(s.name)}</h3><p>${esc(s.text)}</p></li>`)
    .join("\n                ");
  const tips = r.tips.map((t) => `<li>${esc(t)}</li>`).join("\n                  ");
  const variations = r.variations.map((v) => `<li>${esc(v)}</li>`).join("\n                  ");
  const intro = r.intro.map((p) => `<p>${esc(p)}</p>`).join("\n              ");

  const relatedHtml = related.length
    ? `
    <div class="wrap">
      <section class="section">
        <div class="section-head">
          <h2>Keep cooking</h2>
          <a class="more" href="${root}recipes/index.html">Browse all recipes &rarr;</a>
        </div>
        ${cardGrid(related, root)}
      </section>
    </div>`
    : "";

  return `    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="${root}index.html">Home</a> &rsaquo;
        <a href="${root}recipes/index.html">Recipes</a> &rsaquo;
        <a href="${root}recipes/index.html#cat-${esc(categorySlug(r.category))}">${esc(r.category)}</a> &rsaquo;
        <span>${esc(r.title)}</span>
      </nav>

      <article>
        <header class="recipe-head">
          <p class="updated" style="margin-bottom:6px">Published ${esc(published)}</p>
          <h1>${esc(r.title)}</h1>
          <p class="sub">${esc(r.subtitle)}</p>
          <ul class="badges">
            ${badges}
          </ul>
          <p>${esc(r.description)}</p>
          <dl class="factbar">
          ${facts}
          </dl>
          <figure class="hero-shot" style="margin-bottom:0">
            <img src="${esc(root + r.image)}" alt="${esc(r.imageAlt)}" width="900" height="675" decoding="async">
          </figure>
          ${creditLine(r, credits, root)}
        </header>

        <div class="recipe-body">
          <div class="col-side">
            <section class="panel" aria-labelledby="ingredients-h">
              <h2 id="ingredients-h">Ingredients</h2>
              <ul class="ingredients">
                ${ingredients}
              </ul>
              <p style="padding:6px 0 16px"><button class="btn ghost" type="button" data-print>Print this recipe</button></p>
            </section>

            <section class="panel" style="margin-top:24px" aria-labelledby="equipment-h">
              <h2 id="equipment-h">Equipment</h2>
              <ul>
                ${equipment}
              </ul>
            </section>

            ${adSlot("recipe-side")}
          </div>

          <div class="col-main">
            <section>
              <h2>Why this recipe works</h2>
              ${intro}
              <div class="note">
                <h3>Heirloom varieties to look for</h3>
                <p>${esc(r.heirloom)}</p>
              </div>
            </section>

            <section aria-labelledby="method-h">
              <h2 id="method-h">Method</h2>
              <ol class="steps">
                ${steps}
              </ol>
            </section>

            <section class="two-col">
              <div>
                <h2>Cook's notes</h2>
                <ul class="tip-list">
                  ${tips}
                </ul>
              </div>
              <div>
                <h2>Variations</h2>
                <ul>
                  ${variations}
                </ul>
                <h2>Storage</h2>
                <p>${esc(r.storage)}</p>
                <h2>How to serve it</h2>
                <p>${esc(r.servingNote)}. Serve it within the time noted above for the best texture, because heirloom produce is far less forgiving than supermarket vegetables.</p>
              </div>
            </section>
          </div>
        </div>
      </article>
    </div>
${relatedHtml}`;
}

/** Home page body. */
export function homePage({ featured, latest, categories, counts, site }) {
  const root = "";
  const catCards = categories
    .map(
      (c) => `<li><a href="recipes/index.html#cat-${esc(categorySlug(c))}">${esc(c)} <span aria-hidden="true">(${counts.get(c)})</span></a></li>`
    )
    .join("\n            ");

  return `    <section class="hero">
      <div class="wrap">
        <h1>Cook the whole harvest, not just the pretty part</h1>
        <p class="lede">Heirloom Table is an independent American kitchen notebook for open-pollinated vegetables, fruit and herbs. Every recipe here starts with a variety worth growing, tells you when to pick it, and shows you a method that keeps its flavour intact.</p>
        <div class="hero-actions">
          <a class="btn" href="recipes/index.html">Browse all recipes</a>
          <a class="btn ghost" href="about.html">How we test &amp; source</a>
        </div>
      </div>
    </section>

    <div class="wrap">
      <section class="section" aria-labelledby="featured-h">
        <div class="section-head">
          <h2 id="featured-h">Starting points</h2>
          <a class="more" href="recipes/index.html">See every recipe &rarr;</a>
        </div>
        ${cardGrid(featured, root)}
      </section>

      ${adSlot("home-mid")}

      <section class="section" aria-labelledby="cats-h">
        <div class="section-head">
          <h2 id="cats-h">Browse by crop</h2>
        </div>
        <ul class="chip-row">
            ${catCards}
        </ul>
      </section>

      <section class="section" aria-labelledby="latest-h">
        <div class="section-head">
          <h2 id="latest-h">Newest from the kitchen garden</h2>
          <a class="more" href="recipes/index.html">All recipes &rarr;</a>
        </div>
        ${cardGrid(latest, root)}
      </section>

      <section class="section" aria-labelledby="about-h">
        <div class="two-col">
          <div>
            <h2 id="about-h">Why heirloom varieties</h2>
            <p>An heirloom is simply an open-pollinated variety that someone kept growing, season after season, because it tasted good. Those varieties were selected for flavour, texture and aroma rather than for the ability to survive a thousand-mile truck ride, and you can taste the difference in almost every recipe on this site.</p>
            <p>We also write for the moment the harvest arrives all at once. Most of these recipes take under an hour, use equipment you already own, and are written to work with whatever size or shape of vegetable you happened to grow.</p>
          </div>
          <div>
            <h2>How we work</h2>
            <ul>
              <li>Every recipe is cooked at home and rewritten from notes before it is published.</li>
              <li>Times are for a home oven and ordinary pans, not a professional kitchen.</li>
              <li>Variety recommendations come from seed catalogues and growers, not paid placements.</li>
              <li>Photographs of finished dishes are freely licensed and credited on every page.</li>
            </ul>
            <p><a href="about.html">Read our editorial standards &rarr;</a></p>
          </div>
        </div>
      </section>
    </div>`;
}

/** Recipe index page body. */
export function indexPage({ recipes, categories, root = "../" }) {
  const filters = ["All recipes", ...categories]
    .map((label, i) => {
      const value = i === 0 ? "all" : categorySlug(label);
      return `<li><button type="button" data-filter="${esc(value)}" aria-pressed="${i === 0 ? "true" : "false"}">${esc(label)}</button></li>`;
    })
    .join("\n          ");

  const blocks = categories
    .map((c) => {
      const list = recipes.filter((r) => r.category === c);
      return `<section class="cat-block" id="cat-${esc(categorySlug(c))}" data-cat-block="${esc(categorySlug(c))}" aria-labelledby="h-${esc(categorySlug(c))}">
        <h2 id="h-${esc(categorySlug(c))}">${esc(c)} <span style="font-family:var(--sans);font-size:.8rem;color:var(--ink-soft)">${list.length} recipe${list.length === 1 ? "" : "s"}</span></h2>
        ${cardGrid(list, root)}
      </section>`;
    })
    .join("\n      ");

  return `    <div class="wrap narrow" style="padding-top:34px">
      <h1>Every recipe on Heirloom Table</h1>
      <p>${recipes.length} tested recipes for the vegetables, fruit and herbs that fill a home garden between June and November. Filter by crop, or scroll through the whole collection.</p>
      <p class="updated">Recipes are listed newest first inside each crop. Last updated ${esc(formatDate(recipes[0] ? recipes[0].datePublished : "2024-01-01"))}.</p>
      <h2 class="visually-hidden" style="margin-top:24px">Filter recipes</h2>
      <ul class="filters" role="group" aria-label="Filter recipes by crop">
          ${filters}
      </ul>
    </div>
    <div class="wrap">
      ${adSlot("index-top")}
      ${blocks}
    </div>`;
}

