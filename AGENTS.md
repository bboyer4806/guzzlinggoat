# Guzzling Goat

The Guzzling Goat website, a SvelteKit 3 app (Svelte 5, TypeScript) with no database. It runs at
https://guzzlinggoat.dev.boyersoftware.com and will replace the WordPress site at
guzzlinggoat.com, which this repo doesn't touch.

## Development

Use Node 24, matching CI and Docker; `package.json` declares a minimum of 22.17.

```sh
npm ci --ignore-scripts   # install
npm run dev               # dev server at http://localhost:5173
npm run stub              # the Resend stub that npm run dev sends form email to (see Email)
npm run build             # production build
```

## Checks before pushing

Run the checks from `.github/workflows/deploy.yml`:

```sh
npm run check      # types
npm run test:e2e   # Playwright tests, including a production build
```

Fix regressions caused by your change; report unrelated baseline failures and blocked checks.
Install browser-test Chromium with `npx playwright install chromium`, or set `PW_CHROMIUM_PATH`
to an existing compatible Chromium (see `playwright.config.ts`).

## Code

- `src/routes/+layout.svelte` holds the header, nav and footer that every page shares. Each page
  is its own route.
- The brand colors are CSS custom properties in `src/app.css`. Use them rather than color values.
- Static files, such as the logo, go in `static/`.
- `/healthz` answers 200 for Dokku's health check and the deploy's.

## Email

Forms email their submissions with `sendSubmission` from `src/lib/server/email.ts`: one email to
bboyer@webpyro.com from forms@guzzlinggoat.com through [Resend](https://resend.com), with reply-to
set to the submitter.

- A form includes `src/lib/Honeypot.svelte` and passes the value of its `HONEYPOT_FIELD`. A
  submission with it filled in sends nothing but still succeeds.
- `sendSubmission` throws if Resend refuses the email. Log the error and tell the visitor.
- The Dockerfile sets `RESEND_BASE_URL` to Resend's API, and `RESEND_API_KEY` is set on the server
  (`sudo dokku config:set guzzlinggoat RESEND_API_KEY=...`). The built app won't start without them.
- Tests and local development never send real email: they send to `scripts/resend-stub.mjs`.
  Playwright starts it. For `npm run dev`, run `npm run stub` alongside it, and it prints each
  email. Tests read what it accepted from `GET /emails`. It refuses email whose reply-to is
  `rejected@example.com`, to test a failed send.

## Tests

Tests are `tests/e2e/*.e2e.ts`, run by Playwright: browser tests, plus `email.e2e.ts`, which calls
the email path directly.

## Workflow

A push to `main` deploys, including documentation-only changes. Pull requests run checks only.
Update this file alongside changes to the commands or conventions it describes. `CLAUDE.md`
imports this shared guidance.
