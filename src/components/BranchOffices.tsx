import { Link } from "react-router-dom";
import { branchLocations, BRAND_NAME, BRANCH_EMAIL, BRANCH_HOURS, BRANCH_PHONE, BRANCH_TEL } from "@/data/branchLocations";

export default function BranchOffices() {
  return (
    <nav aria-label="Our Greater Victoria offices" className="branch-offices grid gap-8 sm:grid-cols-2 xl:col-span-2">
      {branchLocations.map(branch => (
        <section key={branch.id} aria-labelledby={`footer-${branch.id}`}>
          <h2 id={`footer-${branch.id}`} className="mb-4 text-xl font-bold text-white">
            <Link to={branch.path} className="underline underline-offset-4">{branch.footerLabel}</Link>
          </h2>
          <address className="space-y-3 text-sm not-italic leading-relaxed">
            <p><strong>{BRAND_NAME}</strong><br />{branch.label}</p>
            <p>{branch.street}<br />{branch.city}, BC {branch.postalCode}<br />Canada</p>
            <p><a href={BRANCH_TEL} className="underline underline-offset-4">{BRANCH_PHONE}</a><br />
              <a href={`mailto:${BRANCH_EMAIL}`} className="break-words underline underline-offset-4">{BRANCH_EMAIL}</a></p>
          </address>
          <p className="mt-3 text-sm leading-relaxed">{BRANCH_HOURS}</p>
          <a href={branch.mapUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-sm font-bold underline underline-offset-4">Directions to {branch.city === "Langford" ? "Langford" : "James Bay"}</a>
        </section>
      ))}
    </nav>
  );
}
