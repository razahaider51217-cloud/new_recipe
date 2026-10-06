/**
 * Text pages that keep the site compliant with Google Ads policies and with
 * the licence terms of the photographs: About, Contact, Privacy, Terms,
 * Disclaimer and the image-credit register.
 */
import { esc, formatDate } from "./util.mjs";

const UPDATED = "2026-09-30";

function pageHead(title, sub, updated = UPDATED) {
  return `    <div class="wrap narrow prose">
      <h1>${esc(title)}</h1>
      <p class="lede">${esc(sub)}</p>
      <p class="updated">Last updated ${esc(formatDate(updated))}</p>`;
}

export function aboutPage(site) {
  return `${pageHead(
    "About Heirloom Table",
    "Who writes these recipes, how they are tested, and what we will not publish."
  )}
      <h2>What this site is</h2>
      <p>Heirloom Table is a small, independent recipe collection run from a home kitchen in the United States. We write about open-pollinated vegetables, fruit and herbs from a cook's point of view: which varieties are worth the garden space, when they are ready to pick, and how to cook them so that what made them special on the vine survives the pan.</p>
      <p>The site launched in ${esc(String(site.founded))}. There is no staff, no sponsored recipe programme and no ghostwritten content. One person grows, cooks, photographs and writes, and every page carries a publication date so you can see how current it is.</p>

      <h2 id="editorial">Editorial standards</h2>
      <p>These are the rules we hold ourselves to. If you find a page that breaks one of them, write to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and we will correct it.</p>
      <ul>
        <li><strong>We cook everything first.</strong> A recipe is only published after it has been made at least twice, at home, with ordinary equipment, and written up from notes rather than from memory.</li>
        <li><strong>We describe what actually happens.</strong> If a technique is fussy, we say so. If a shortcut works as well, we give it.</li>
        <li><strong>We name our sources.</strong> Variety and growing information comes from seed catalogues, university extension publications and growers. We do not take payment to recommend a variety, a brand or a product.</li>
        <li><strong>We separate facts from opinion.</strong> Where food safety is involved &mdash; canning, preserving, foraging &mdash; we follow published USDA and Cooperative Extension guidance and link to it rather than inventing our own numbers.</li>
        <li><strong>We correct errors in the open.</strong> A corrected page gets a new date and a short note describing what changed.</li>
        <li><strong>We write for American kitchens.</strong> Measurements are given in US cups, tablespoons, ounces and degrees Fahrenheit, with metric equivalents for readers elsewhere.</li>
      </ul>

      <h2>How the photography works</h2>
      <p>We cannot photograph every dish ourselves, so the finished-dish photographs on this site are freely licensed images from Wikimedia Commons, used under the terms of their licences. Every photograph carries its author, licence and source link directly beneath it, and the full register is on the <a href="image-credits.html">image credits page</a>. If you are a rights holder and want a photograph removed or re-credited, email us and we will act the same day.</p>

      <h2 id="funding">How the site is funded</h2>
      <p>Heirloom Table is supported by display advertising. Ads are served by third-party networks, may be personalized using cookies, and are never placed inside recipe instructions or made to look like editorial content. We do not accept sponsored recipes, paid product reviews or affiliate links. See our <a href="privacy.html">privacy policy</a> for how advertising affects your data and how to opt out of personalized advertising.</p>

      <h2>Talk to us</h2>
      <p>Questions, corrections, a variety we should be growing: see the <a href="contact.html">contact page</a> or write to <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>. We read everything and reply to most messages within two business days.</p>
    </div>`;
}

export function contactPage(site) {
  return `${pageHead(
    "Contact Heirloom Table",
    "Corrections, questions, and requests about our photographs and content."
  )}
      <h2>Email</h2>
      <p><strong><a href="mailto:${esc(site.email)}">${esc(site.email)}</a></strong></p>
      <p>This is the fastest and most reliable way to reach us. We are a small operation in the United States and normally reply within two business days. We do not offer telephone support.</p>

      <h2>What we can help with</h2>
      <table>
        <tr><th>Topic</th><th>What to include</th></tr>
        <tr><td>A recipe did not work</td><td>The page URL, the variety you used, your pan size and your oven (gas, electric or convection). Please tell us what happened rather than only that it failed &mdash; that is how a page gets fixed.</td></tr>
        <tr><td>A correction or factual error</td><td>The page URL and the specific sentence you are questioning, plus a source if you have one.</td></tr>
        <tr><td>Photograph credit or removal</td><td>The image URL and the rights you hold. We act on these requests immediately.</td></tr>
        <tr><td>Permissions and republishing</td><td>Which recipe, where it would appear, and whether the use is commercial. Include a link to the publication.</td></tr>
        <tr><td>Advertising and cookies</td><td>The country you are browsing from and, if relevant, your browser, so we can help with opt-out settings.</td></tr>
      </table>

      <h2>What we cannot help with</h2>
      <ul>
        <li>Identifying seed varieties from a photograph or a description alone. Try your state's Cooperative Extension office or a regional seed savers group.</li>
        <li>Diagnosing a plant disease or pest. Your county extension agent is the right person for that.</li>
        <li>Medical or nutritional advice. If you have a food allergy or a medical condition, speak to a qualified professional before using any recipe on this site.</li>
        <li>Guest posts, link insertions or sponsored recipe placements. We do not accept them.</li>
      </ul>

      <h2>Privacy of your email</h2>
      <p>We use the address you write from only to answer you. We do not add it to a mailing list, sell it, or share it. Full details are in the <a href="privacy.html">privacy policy</a>.</p>
    </div>`;
}
