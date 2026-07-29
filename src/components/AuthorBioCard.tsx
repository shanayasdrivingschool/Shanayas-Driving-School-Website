import { Link } from "react-router-dom";
import { authorProfilePath, type Author } from "@/data/authors";

type AuthorBioCardProps = {
  author: Author;
  /* "Reviewed by" when the person checked the article rather than wrote it. */
  label?: string;
  /* The profile page already is the author's page, so it hides its own link. */
  linkToProfile?: boolean;
};

/* The visible half of the person-level E-E-A-T signals: who wrote this, what they
   do, how long they have been doing it, and where else the reader can find them.
   Renders only what the entry actually carries — an author with no credentials
   shows no credentials line rather than an empty heading. */
const AuthorBioCard = ({ author, label = "About the author", linkToProfile = true }: AuthorBioCardProps) => (
  <section
    aria-label={label}
    className="rounded-2xl border border-slate-200 bg-white p-6 shadow-[0_16px_36px_rgba(15,23,42,0.06)]"
  >
    <p className="text-xs font-bold uppercase tracking-[0.14em] text-slate-500">{label}</p>

    <div className="mt-4 flex flex-wrap items-start gap-4">
      {author.image ? (
        <img
          src={author.image}
          alt={`${author.name}, ${author.jobTitle} at Shanaya's Driving School`}
          width={72}
          height={72}
          loading="lazy"
          className="h-[4.5rem] w-[4.5rem] shrink-0 rounded-full object-cover"
        />
      ) : null}

      <div className="min-w-[14rem] flex-1">
        <h2 className="text-lg font-black leading-snug text-slate-900">
          {linkToProfile ? (
            <Link to={authorProfilePath(author)} className="underline underline-offset-2">
              {author.name}
            </Link>
          ) : (
            author.name
          )}
        </h2>
        <p className="mt-1 text-sm font-semibold text-slate-600">{author.jobTitle}</p>
        {author.instructingSince ? (
          <p className="mt-1 text-sm text-slate-600">Instructing since {author.instructingSince}</p>
        ) : null}
        <p className="mt-3 text-sm leading-relaxed text-slate-600">{author.summary}</p>
      </div>
    </div>

    {author.credentials?.length ? (
      <ul className="mt-4 space-y-1 text-sm text-slate-600">
        {author.credentials.map((credential) => (
          <li key={credential.name}>
            {credential.name}
            {credential.issuedBy ? ` — ${credential.issuedBy}` : null}
          </li>
        ))}
      </ul>
    ) : null}

    {author.specialties?.length ? (
      <div className="mt-4 flex flex-wrap gap-2">
        {author.specialties.map((specialty) => (
          <span
            key={specialty}
            className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-600"
          >
            {specialty}
          </span>
        ))}
      </div>
    ) : null}

    {author.languages?.length ? (
      <p className="mt-4 text-sm text-slate-600">Lessons available in {author.languages.join(", ")}.</p>
    ) : null}

    {author.sameAs?.length ? (
      <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-sm">
        {author.sameAs.map((profileUrl) => (
          <li key={profileUrl}>
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer me"
              className="font-semibold text-[#1d52a1] underline underline-offset-2"
            >
              {new URL(profileUrl).hostname.replace(/^www\./, "")}
            </a>
          </li>
        ))}
      </ul>
    ) : null}
  </section>
);

export default AuthorBioCard;
