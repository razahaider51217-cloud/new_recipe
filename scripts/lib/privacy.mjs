/** Privacy policy text, kept in its own module because it is the longest page. */
import { esc, formatDate } from "./util.mjs";

const UPDATED = "2026-09-30";

export function privacyPage(site) {
  return `    <div class="wrap narrow prose">
      <h1>Privacy Policy</h1>
      <p class="lede">What data this site collects, why, and how you can control it.</p>
      <p class="updated">Last updated ${esc(formatDate(UPDATED))}</p>

      <p>Heirloom Table (${esc(site.url)}) is an American recipe website funded by display advertising. This policy explains, in plain language, what information is collected when you visit, who receives it, and the choices available to you. It applies to this site only and not to any third-party site we link to.</p>

      <h2>1. Information we collect</h2>
      <ul>
        <li><strong>Information you send us.</strong> If you email us, we receive your address and whatever you write. We use it to reply, and we keep it only long enough to handle the request.</li>
        <li><strong>Technical information collected automatically.</strong> Like nearly every website, our hosting provider records standard server log data such as IP address, browser type and version, device type, referring page, the pages you request, and the date and time of the request. This is used for security, diagnosing faults, and understanding overall traffic levels.</li>
        <li><strong>Cookies and similar technologies.</strong> Small files set by our advertising and content-delivery partners, described in section 3.</li>
        <li><strong>What we do not collect.</strong> We have no user accounts, no comment system, no newsletter and no contact form. We do not ask for your name, postal address, telephone number or payment details, and we do not knowingly collect information from children under 13.</li>
      </ul>

      <h2>2. How we use information</h2>
      <ul>
        <li>To operate, secure and troubleshoot the website.</li>
        <li>To understand in aggregate which recipes and pages are useful, so we can write better ones.</li>
        <li>To display the advertising that pays for the site, including personalized advertising where the law and your consent allow it.</li>
        <li>To answer messages you send us and, where necessary, to enforce our <a href="terms.html">terms of use</a>.</li>
      </ul>

      <h2 id="cookies">3. Cookies, web beacons and similar technologies</h2>
      <p>A cookie is a small text file stored on your device by a website. This site, and the third parties listed below, use cookies, pixels and similar technologies. Cookies do not identify you by name, but they can recognise a browser over time.</p>
      <table>
        <tr><th>Category</th><th>Purpose</th><th>Set by</th></tr>
        <tr><td>Strictly necessary</td><td>Delivering pages and files, keeping the site secure, and remembering a consent choice you have made.</td><td>Heirloom Table and its hosting provider</td></tr>
        <tr><td>Advertising</td><td>Measuring ad performance and, where permitted, showing ads based on inferred interests and previous browsing.</td><td>Google and other advertising vendors</td></tr>
        <tr><td>Analytics</td><td>Aggregate counts of visits and page views. We do not currently run a third-party analytics service; if that changes we will name the provider here before it goes live.</td><td>&mdash;</td></tr>
      </table>
      <h2>4. Advertising and third-party vendors</h2>
      <p>We use third-party advertising companies, including Google AdSense, to serve ads when you visit this site. These vendors may use cookies and web beacons to serve ads based on your visits to this and other websites.</p>
      <ul>
        <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visit to this site and other sites you have visited. See <a href="https://policies.google.com/technologies/ads" rel="nofollow noopener" target="_blank">How Google uses information from sites that use our services</a>.</li>
        <li>You can opt out of personalized advertising by visiting <a href="https://adssettings.google.com" rel="nofollow noopener" target="_blank">Google Ads Settings</a>.</li>
        <li>You can also opt out of many third-party vendors' use of cookies for personalized advertising at <a href="https://www.aboutads.info/choices/" rel="nofollow noopener" target="_blank">aboutads.info</a> or the <a href="https://optout.networkadvertising.org/" rel="nofollow noopener" target="_blank">Network Advertising Initiative</a> opt-out page.</li>
        <li>Visitors in the European Economic Area, the United Kingdom and Switzerland: our advertising partner's Google-certified consent management tool asks for permission before any non-essential cookie is set, in line with Google's EU user consent policy. You can withdraw that permission at any time by clearing this site's cookies and site data in your browser settings, which removes any non-essential cookie already stored, or by using the personalized-advertising opt-out links above.</li>
      </ul>
      <p>We do not sell your personal information, and we never share email addresses with advertisers. Third-party vendors operate under their own privacy policies, which we encourage you to read.</p>

      <h2>5. Legal bases for processing (EEA, UK and Switzerland)</h2>
      <ul>
        <li><strong>Consent</strong> for advertising, personalized advertising and any non-essential cookies.</li>
        <li><strong>Legitimate interests</strong> for security, fraud prevention, server logs and keeping the site working.</li>
        <li><strong>Contract or legal obligation</strong> where we must comply with a lawful request.</li>
      </ul>

      <h2>6. Your privacy rights</h2>
      <p><strong>If you are in the European Economic Area, the United Kingdom or Switzerland</strong>, you have the right to access the personal data we hold about you, to have it corrected or erased, to restrict or object to processing, to receive it in a portable format, to withdraw consent at any time, and to lodge a complaint with your national supervisory authority. We respond to verified requests within 30 days.</p>
      <p><strong>If you are a California resident</strong>, the CCPA and CPRA give you the right to know what personal information is collected, used or disclosed; to request deletion or correction; to opt out of the sale or sharing of personal information; to limit the use of sensitive personal information; and to be free from discrimination for exercising those rights. We do not sell personal information. To exercise any of these rights, email <a href="mailto:${esc(site.email)}">${esc(site.email)}</a> with the subject line <em>Privacy request</em>.</p>
      <p>Because we do not have accounts, we may need to ask a question or two to verify that a request is genuine, but we will never ask for more information than necessary.</p>

      <h2>7. Do Not Track and Global Privacy Control</h2>
      <p>We honour the Global Privacy Control signal as an opt-out of the sale or sharing of personal information where our advertising partners support it. Browser "Do Not Track" headers are not yet interpreted consistently across the industry, so we do not rely on them; the opt-out links in section 4 are the reliable method.</p>

      <h2>8. Children's privacy</h2>
      <p>This site is written for adults and is not directed at children under 13. We do not knowingly collect personal information from children. If you believe a child has sent us personal information, contact us and we will delete it.</p>

      <h2>9. Data retention and security</h2>
      <p>Server logs are kept by our hosting provider for a short period, typically no more than 30 days, and are then rotated. Emails you send us are kept only as long as needed to resolve your request. We use HTTPS across the whole site and keep our software current, but no website can promise absolute security; please do not send sensitive personal information by email.</p>

      <h2>10. International transfers</h2>
      <p>Our hosting and advertising partners may process data in the United States. Where personal data from the EEA or UK is transferred to the United States, the transfer relies on the European Commission's Standard Contractual Clauses or an equivalent safeguard put in place by the vendor.</p>

      <h2>11. Changes to this policy</h2>
      <p>When this policy changes we update the date at the top of the page. Material changes will also be noted on the home page for 30 days. Continued use of the site after a change means you accept the revised policy.</p>

      <h2>12. Contact</h2>
      <p>Questions about privacy, data, or advertising on this site: <a href="mailto:${esc(site.email)}">${esc(site.email)}</a>.</p>
    </div>`;
}
