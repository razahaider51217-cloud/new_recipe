/**
 * Single source of truth for site-wide metadata.
 * Consumed by scripts/build-site.mjs when generating every page.
 *
 * NOTE FOR THE SITE OWNER: `url` and `email` below are placeholders. Replace
 * them with the real production domain and a working mailbox before submitting
 * the site to any ad network (Google Ads review expects a reachable contact).
 */
export const site = {
  name: "Heirloom Harvest Kitchen",
  shortName: "Heirloom Harvest",
  tagline: "Seed-to-table recipes for the heirloom kitchen garden",
  description:
    "Heirloom Harvest Kitchen is an independent recipe publication devoted to " +
    "open-pollinated vegetables, fruits and herbs: how to grow them, how to cook " +
    "them, and how to keep the varieties alive for the next generation.",
  url: "https://www.heirloomharvestkitchen.com",
  email: "hello@heirloomharvestkitchen.com",
  locale: "en-US",
  language: "en",
  founded: 2019,
  publisher: "Heirloom Harvest Kitchen",
  authorName: "Dana Whitfield",
  authorRole: "Founding editor & recipe developer",
  adsensePublisherId: "", // e.g. "ca-pub-0000000000000000"
  themeColor: "#2f5d3a",
  nav: [
    { href: "index.html", label: "Home" },
    { href: "recipes/index.html", label: "Recipes" },
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" },
  ],
  footerLegal: [
    { href: "about.html", label: "About" },
    { href: "contact.html", label: "Contact" },
    { href: "privacy.html", label: "Privacy Policy" },
    { href: "terms.html", label: "Terms of Use" },
    { href: "credits.html", label: "Image Credits" },
  ],
};

/** Absolute URL helper used by the sitemap and structured data. */
export function abs(path) {
  return site.url.replace(/\/+$/, "") + "/" + String(path).replace(/^\/+/, "");
}
