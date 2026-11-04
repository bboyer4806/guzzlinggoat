# Guzzling Goat

The Guzzling Goat website, a SvelteKit 3 app (Svelte 5, TypeScript) with no database. It runs at
https://guzzlinggoat.dev.boyersoftware.com and will replace the WordPress site at
guzzlinggoat.com, which this repo doesn't touch.

## Development

Use Node 24, matching CI and Docker; `package.json` declares a minimum of 22.17.

```sh
npm ci --ignore-scripts   # install
npm run dev               # dev server at http://localhost:5173
npm run build             # production build
```

## Checks before pushing

Run the checks from `.github/workflows/deploy.yml`:

```sh
npm run check      # types
npm run test:e2e   # browser tests (Playwright), including a production build
```

Fix regressions caused by your change; report unrelated baseline failures and blocked checks.
Install browser-test Chromium with `npx playwright install chromium`, or set `PW_CHROMIUM_PATH`
to an existing compatible Chromium (see `playwright.config.ts`).

## Code

- `src/routes/+layout.svelte` holds the header, nav and footer that every page shares. Each page
  is its own route.
- The brand colors are CSS custom properties in `src/app.css`. Use them rather than color values.
- Static files, such as the logo, go in `static/`.
- Site photos are in `static/photos/`: WebP, at most 1600 px wide and under 300 KB, named by number
  and description (for example `25-bag-on-burlap.webp`). Pages pick from them.
- `/healthz` answers 200 for Dokku's health check and the deploy's.

## Tests

Browser tests are `tests/e2e/*.e2e.ts`.

## Workflow

A push to `main` deploys, including documentation-only changes. Pull requests run checks only.
Update this file alongside changes to the commands or conventions it describes. `CLAUDE.md`
imports this shared guidance.
