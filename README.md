# Shanaya's Driving School — Website

Marketing website for Shanaya's Driving School, an independent B.C. school listed in
ICBC's general directory for Class 5 and 7 driver training in Langford. The directory
listing is not ICBC approval, recommendation, or endorsement.

Production site: https://www.drivingschoolbc.ca/

## Tech stack

- Vite
- TypeScript
- React
- shadcn/ui
- Tailwind CSS

## Local development

Requires Node.js & npm ([install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)).

```sh
# Install dependencies
npm i

# Start the dev server with hot reload
npm run dev
```

The dev server runs on http://localhost:8080.

## Useful scripts

```sh
npm run build      # Production build (runs the static SEO page generator on postbuild)
npm run preview    # Preview the production build locally
npm run lint       # Lint the codebase
npm run test       # Run the test suite (Vitest)
```

## Deployment

The site is deployed via Netlify (see `netlify.toml`). Pushing to the default branch
triggers a build; the `postbuild` step generates static SEO pages.
