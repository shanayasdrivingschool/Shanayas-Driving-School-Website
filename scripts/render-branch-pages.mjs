export const escapeBranchHtml = value => String(value).replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
const e = escapeBranchHtml;
const link = (url, label) => `<a href="${e(url)}">${e(label)}</a>`;
const actions = data => `<p class="actions">${link(data.BRANCH_TEL, `Call ${data.BRANCH_PHONE} to Book`)} ${link(`mailto:${data.BRANCH_EMAIL}`, "Email Us")}</p>`;

export const renderBranchFooter = data => `<footer class="branch-footer"><nav aria-label="Our Greater Victoria offices" class="branch-offices">
${data.branchLocations.map(branch => `<section aria-labelledby="footer-${branch.id}">
<h2 id="footer-${branch.id}">${link(branch.path, branch.footerLabel)}</h2>
<address><strong>${e(data.BRAND_NAME)}</strong><br>${e(branch.label)}<br>
${e(branch.street)}<br>${e(branch.city)}, BC ${e(branch.postalCode)}<br>Canada<br>
${link(data.BRANCH_TEL, data.BRANCH_PHONE)}<br>${link(`mailto:${data.BRANCH_EMAIL}`, data.BRANCH_EMAIL)}</address>
<p>${e(data.BRANCH_HOURS)}</p><p>${link(branch.mapUrl, `Directions to ${branch.city === "Langford" ? "Langford" : "James Bay"}`)}</p>
</section>`).join("\n")}
</nav></footer>`;

export const renderBranchBody = (branch, data) => `<article>
<header><p>${e(branch.label)} · British Columbia, Canada</p><h1>${e(branch.h1)}</h1><p>${e(branch.subheadline)}</p>${actions(data)}<p><a href="#booking-request">Request a lesson on this page</a></p>
<address><strong>${e(data.BRAND_NAME)}</strong><br>${e(branch.label)}<br>${e(data.branchAddress(branch))}<br>${link(data.BRANCH_TEL, data.BRANCH_PHONE)}<br>${link(`mailto:${data.BRANCH_EMAIL}`, data.BRANCH_EMAIL)}</address><p>Hours: ${e(data.BRANCH_HOURS)}</p><p>${link(branch.mapUrl, "Get directions to this campus")}</p></header>
<section><h2>${e(branch.whyTitle)}</h2><ul>${branch.benefits.map(item => `<li><strong>${e(item.title)}.</strong> ${e(item.text)}</li>`).join("")}</ul></section>
<section><h2>${e(branch.pickupTitle)}</h2><p>${e(branch.pickupText)}</p><ul>${branch.areas.map(area => `<li>${e(area)}</li>`).join("")}</ul></section>
<section><h2>Find the right lesson package</h2><p>${e(branch.packagesText)}</p>${branch.packages.map(item => `<h3>${e(item.title)}</h3><p>${e(item.text)}</p>`).join("")}
<p>Confirm your individual licensing path with ${link(data.ICBC_GLP_URL, "ICBC")}. A lesson package does not guarantee a pass or change licensing eligibility.</p>${actions(data)}</section>
<section><h2>Questions about ${branch.city === "Langford" ? "Langford and Westshore" : "James Bay and Victoria"} lessons</h2>${branch.faqs.map(faq => `<h3>${e(faq.question)}</h3><p>${e(faq.answer)}</p>${faq.source ? `<p>${link(faq.source.href, faq.source.label)}</p>` : ""}`).join("")}</section>
<section id="booking-request"><h2>Request a lesson at ${e(branch.label)}</h2><p>Tell us your licence stage, lesson goals, pickup neighbourhood and preferred times. We will contact you to discuss availability and confirm the lesson details and full price before booking.</p>${actions(data)}</section>
</article>`;
