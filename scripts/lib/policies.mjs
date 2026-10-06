/** Terms of use, disclaimer and the image-credit register. */
import { esc, formatDate } from "./util.mjs";

const UPDATED = "2026-09-30";

export function termsPage(site) {
  return `    <div class="wrap narrow prose">
      <h1>Terms of Use</h1>
      <p class="lede">The rules for using this website, in plain English.</p>
      <p class="updated">Last updated ${esc(formatDate(UPDATED))}</p>

      <h2>1. Agreement</h2>
      <p>By visiting ${esc(site.url)} (the "site") you agree to these terms. If you do not agree with them, please do not use the site. These terms apply alongside our <a href="privacy.html">privacy policy</a> and <a href="disclaimer.html">disclaimer</a>.</p>

      <h2>2. Who you are dealing with</h2>
      <p>The site is published by Heirloom Table, an independent publisher based in the United States. You can reach us at <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> or through our <a href="contact.html">contact page</a>.</p>

      <h2>3. What you may do with our content</h2>
      <p>All recipe text, articles, page design, code and original graphics on this site are protected by copyright and owned by Heirloom Table unless stated otherwise.</p>
      <ul>
        <li><strong>You may:</strong> read, print or save single recipes for your own personal, non-commercial cooking; link to any page; quote a short extract (a sentence or two, or an ingredient list) with a visible link back to the page you took it from.</li>
        <li><strong>You may not:</strong> republish a recipe or article in full on another website, blog, app or newsletter; reproduce our content in bulk or by automated scraping; resell or license our content; use our content or images to train machine-learning models without written permission; remove or obscure our authorship, credits or advertising.</li>
        <li><strong>Printing.</strong> A print-friendly view is built into every recipe page, intended for your own kitchen binder or a gift to a friend.</li>
        <li><strong>Permissions.</strong> For anything beyond the above, ask first. We often say yes, and sometimes free.</li>
      </ul>

      <h2>4. Not professional advice</h2>
      <p>The content on this site is general culinary information written for home cooks. It is not medical, nutritional, dietary, allergenic, agricultural, veterinary or legal advice. Always read our <a href="disclaimer.html">disclaimer</a> before following a preserving, canning or foraging recipe, and speak to a qualified professional about your own circumstances.</p>

      <h2>5. Accuracy and your responsibility</h2>
      <p>We test every recipe and correct errors when we find them, but ovens, pans, ingredients and varieties vary enormously. You are responsible for the food you prepare, for checking ingredients against any allergy or dietary restriction, and for following safe food-handling practice. See the <a href="disclaimer.html">disclaimer</a> for details.</p>

      <h2>6. Advertising and links to other sites</h2>
      <p>This site displays third-party advertising and links to third-party websites, including seed suppliers, extension services and licence sources. Ads are labelled as advertising and are not endorsements. We do not control and are not responsible for the content, products, accuracy or privacy practices of any third-party site, and a link is not an endorsement. Read our <a href="privacy.html">privacy policy</a> to understand how advertising uses cookies.</p>

      <h2>7. Messages you send us</h2>
      <p>If you email us a suggestion, correction, variation or photograph, you keep ownership of it but grant us a worldwide, royalty-free licence to use, edit and publish it on the site and in related promotional material, with credit where we can. Do not send us anything you do not have the right to share.</p>

      <h2>8. Copyright complaints</h2>
      <p>If you believe material on this site infringes your copyright, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> with the subject line <em>Copyright notice</em> and include: identification of the work, the exact URL of the allegedly infringing material, your contact details, a statement of good-faith belief, a statement under penalty of perjury that the information is accurate and that you are the owner or authorised agent, and your physical or electronic signature. We remove or re-credit material promptly while a claim is investigated.</p>

      <h2>9. Limitation of liability</h2>
      <p>The site is provided "as is" and "as available", without warranties of any kind, express or implied, including merchantability, fitness for a particular purpose and non-infringement. To the fullest extent permitted by law, Heirloom Table is not liable for any indirect, incidental, special, consequential or punitive damages, or for any loss of data, profits or goodwill, arising from your use of the site or reliance on its content. Where liability cannot be excluded, it is limited to one hundred US dollars (US$100).</p>

      <h2>10. Indemnity</h2>
      <p>You agree to indemnify and hold harmless Heirloom Table from any claim, loss or expense, including reasonable legal fees, arising from your misuse of the site or breach of these terms.</p>

      <h2>11. Governing law and changes</h2>
      <p>These terms are governed by the laws of the State of Oregon, United States, without regard to conflict-of-law rules, and the state and federal courts located in Oregon have exclusive jurisdiction over any dispute. If a provision is found unenforceable, the rest remains in force. We may update these terms; the date at the top of the page always shows the current version, and continued use after a change means you accept it.</p>

      <h2>12. Contact</h2>
      <p>Questions about these terms: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    </div>`;
}

export function disclaimerPage(site) {
  return `    <div class="wrap narrow prose">
      <h1>Disclaimer</h1>
      <p class="lede">Food safety, allergens, foraging and gardening &mdash; please read before you cook.</p>
      <p class="updated">Last updated ${esc(formatDate(UPDATED))}</p>

      <h2>General</h2>
      <p>The information on Heirloom Table is published for general informational and educational purposes. While we test every recipe, we cannot know your ingredients, your equipment, your altitude, your water, or your health. You use this information at your own risk, and you are responsible for the results.</p>

      <h2>Food safety and preserving</h2>
      <ul>
        <li>Follow safe food-handling practice at all times: wash hands and surfaces, keep raw meat and eggs away from ready-to-eat food, and refrigerate promptly.</li>
        <li>Cooking temperatures and times are given for food safety as well as flavour. Do not reduce them.</li>
        <li>For canning and preserving, our recipes follow widely published USDA and Cooperative Extension guidance. Only use tested, scientifically validated processing times and current jar and lid standards. Never invent your own processing time, and never reduce the acid or sugar level in a tested preserving recipe.</li>
        <li>Home-canned low-acid foods require a pressure canner. If you are new to preserving, start with the National Center for Home Food Preservation or your state extension office.</li>
        <li>When in doubt, throw it out. Botulism is odourless and invisible.</li>
      </ul>

      <h2>Allergens and nutrition</h2>
      <p>Recipes on this site contain common allergens including dairy, eggs, wheat, tree nuts, peanuts, soy, fish, shellfish and sesame, and jams and preserves contain large amounts of sugar. We do not publish calculated nutrition figures, because ingredient-level analysis of heirloom produce varies too much to be honest to two decimal places. If you have a food allergy or intolerance, a medical condition, are pregnant, or follow a therapeutic diet, check every ingredient yourself and consult a qualified health professional. Nothing here is nutritional or medical advice.</p>

      <h2>Foraging and wild foods</h2>
      <p>Some recipes can be made with foraged fruit, such as huckleberries, or with produce you grow yourself. Never eat a wild plant or mushroom unless you have identified it with certainty, ideally in person with an experienced forager. Edible plants can be confused with toxic lookalikes, roadsides and field edges may carry herbicide or pollution, and some people react badly to foods others eat without trouble. Do not forage on private land without permission, and follow all local rules on harvesting.</p>

      <h2>Gardening and seeds</h2>
      <p>Variety recommendations reflect our own experience and common practice in American gardens, but variety performance depends heavily on your climate, soil, day length and season. Follow local extension guidance for planting dates, and note that seed sold as heirloom and open-pollinated will not always breed true if you save seed from a crop that has cross-pollinated.</p>

      <h2>External links and advertising</h2>
      <p>We link to third-party sites such as seed companies, extension services and licence sources. Those links are provided for convenience; we do not control those sites and are not responsible for their content. Advertising on this site is supplied by third parties, and the appearance of an ad is not a recommendation by Heirloom Table.</p>

      <h2>Limitation of liability</h2>
      <p>To the fullest extent permitted by law, Heirloom Table accepts no liability for any loss, illness, injury or damage arising from the use of, or reliance on, the information on this site. See our <a href="terms.html">terms of use</a> for the full limitation of liability.</p>

      <h2>Questions</h2>
      <p>If something on this site seems unsafe or unclear, tell us at <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> and we will look at it.</p>
    </div>`;
}

/**
 * Photo credit register. Keeps the site compliant with the attribution terms
 * of the CC BY, CC BY-SA and public-domain images used here.
 */
export function creditsPage({ credits, recipes, site }) {
  const rows = recipes
    .map((r) => {
      const c = credits[r.creditKey] || {};
      const license = c.licenseUrl
        ? `<a href="${esc(c.licenseUrl)}" rel="license nofollow noopener" target="_blank">${esc(c.license || "See source")}</a>`
        : esc(c.license || "See source");
      const source = c.page
        ? `<a href="${esc(c.page)}" rel="nofollow noopener" target="_blank">${esc(String(c.file || "").replace(/^File:/, ""))}</a>`
        : esc(c.file || "\u2014");
      return `<tr>
          <td><a href="recipes/${esc(r.slug)}.html">${esc(r.title)}</a></td>
          <td>${esc(c.artist || "Unknown author")}</td>
          <td>${license}</td>
          <td>${source}</td>
        </tr>`;
    })
    .join("\n        ");

  return `    <div class="wrap narrow prose">
      <h1>Image Credits</h1>
      <p class="lede">Every photograph on Heirloom Table, with its author, licence and source.</p>
      <p class="updated">Last updated ${esc(formatDate(UPDATED))}</p>

      <p>The finished-dish photographs on this site are published under free licences that permit commercial use and republication. We credit the author and the licence beneath each photograph, and repeat the full register below, as those licences require. Images have in some cases been resized for the web; no image has been materially altered, and no image is used in a way that suggests the author endorses this site.</p>

      <h2>How to read the licence column</h2>
      <ul>
        <li><strong>Creative Commons Attribution (CC BY)</strong> &mdash; reusable, including commercially, with credit to the author.</li>
        <li><strong>Creative Commons Attribution-ShareAlike (CC BY-SA)</strong> &mdash; reusable with credit; adapted versions must carry the same licence.</li>
        <li><strong>CC0 / Public domain</strong> &mdash; the author has waived their rights; credit is given as a courtesy.</li>
      </ul>

      <h2>The register</h2>
      <table>
        <thead>
          <tr><th>Used on</th><th>Photographer</th><th>Licence</th><th>Source file</th></tr>
        </thead>
        <tbody>
        ${rows}
        </tbody>
      </table>

      <h2>Removal requests</h2>
      <p>If you are a rights holder and believe an image is used here incorrectly, or you would simply prefer that it were not, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> with the image URL and it will be removed or re-credited promptly. See our <a href="terms.html">terms of use</a> for the formal copyright notice procedure.</p>
    </div>`;
}
