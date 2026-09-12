# Abdul Latif — Portfolio

Personal portfolio for Abdul Latif, server-rendered with **NestJS** (Handlebars views) and wired to
**Resend** for the contact form.

All content lives in one file: [`src/profile/profile.data.ts`](src/profile/profile.data.ts). Edit it
and the whole site — page, JSON API and schema.org markup — updates.

## Run it

```bash
npm install
cp .env.example .env     # then fill in RESEND_API_KEY
npm run dev              # http://localhost:3000
```

Production:

```bash
npm run build
npm run start:prod
```

## Environment

| Variable | Required | What it does |
| --- | --- | --- |
| `PORT` | no | Server port (default `3000`). |
| `NODE_ENV` | no | `production` makes a missing Resend key a hard failure. |
| `SITE_URL` | no | Public URL, used for canonical/OG tags, `robots.txt` and `sitemap.xml`. |
| `RESEND_API_KEY` | yes in production | From <https://resend.com/api-keys>. |
| `MAIL_FROM` | yes | Verified sender, e.g. `Portfolio <hello@yourdomain.com>`. `onboarding@resend.dev` works for testing. |
| `MAIL_TO` | yes | Where contact messages land. |
| `MAIL_SEND_ACK` | no | `true` also sends the visitor a confirmation email. |

Without `RESEND_API_KEY` in development the contact form still works — it logs the message and
returns a dry-run response instead of sending.

### Resend setup

1. Create an account at <https://resend.com> and add an API key.
2. Verify a sending domain (Domains → Add Domain → add the DNS records). Until then, send from
   `onboarding@resend.dev`.
3. Put the key in `.env` as `RESEND_API_KEY` and set `MAIL_FROM` to a verified sender.

## Routes

| Route | Purpose |
| --- | --- |
| `GET /` | The portfolio page (server-rendered Handlebars). |
| `GET /cv` | Downloads the CV PDF, named `Abdul-Latif-CV.pdf`. |
| `GET /api/profile` | The whole CV as JSON. |
| `POST /api/contact` | Contact form → Resend. Validated, rate limited to 5/hour per IP. |
| `GET /api/health` | Health check for uptime monitoring. |
| `GET /robots.txt`, `GET /sitemap.xml` | Generated from `SITE_URL`. |
| `/static/*` | Stylesheet, client script, favicon. |

## Structure

```
src/
  main.ts                 bootstrap: helmet + CSP nonce, compression, hbs views
  app.module.ts           config, rate limiting, static assets
  common/                 per-request CSP nonce
  profile/                CV content, types, service, JSON endpoint
  page/                   server-rendered page, robots.txt, sitemap.xml
  contact/                contact endpoint + DTO validation
  mail/                   Resend client and email templates
  health/                 health check
views/                    index.hbs + partials (nav, hero, about, work, …)
public/                   styles.css, main.js, favicon.svg
```

## Notes

- **Spam handling:** honeypot field plus a 5-per-hour per-IP throttle; all user input is escaped
  before it reaches the email HTML.
- **Security headers:** helmet with a strict CSP; the only inline script is schema.org JSON-LD,
  allowed through a per-request nonce.
- **Design:** the hero carries a live ECG monitor strip — a continuously running trace on chart
  paper, the substrate of Abdul's published research on reading paper-based ECG signals. Archivo for
  structure, Newsreader for prose, one signal-red accent.
- **Themes:** day and night, toggled in the top bar. The choice is stored in `localStorage`; with no
  stored choice the site follows the operating system. The theme is resolved in a small inline
  script (nonce-allowed) before first paint, so there is no flash.
- **Motion:** one page-load sequence, scroll reveals, the running trace, a scroll-progress line and
  hover states. Everything is disabled under `prefers-reduced-motion`.
- **Photo:** `public/abdul-latif.png`, referenced from `profile.photo` in the data file. Drop in a
  replacement at any size (square crops best) and update that entry.
- **CV:** `public/abdul-latif-cv.pdf`, served at `/cv` and linked from the hero, the contact block
  and the footer. Replace the file to publish a new version; `profile.cv` controls the route and the
  filename the visitor saves.
- **Caching:** `styles.css` and `main.js` are served with a content hash in the URL, so a change is
  never served stale from a browser cache.
- The site also prints cleanly as a CV (`Cmd+P`).

## Deploying

### Vercel

`vercel.json` and `src/serverless.ts` are already in the repo, so the app runs as a serverless
function — every request is routed to the Nest app, and `views/` and `public/` are bundled with it.

1. Import the GitHub repo at <https://vercel.com/new>. No build command or output directory is
   needed; `vercel.json` drives the build.
2. Add the environment variables below under **Settings → Environment Variables**, ticking
   *Production* (and *Preview* if you want the preview URLs to send mail too).
3. Deploy, then set `SITE_URL` to the final domain and redeploy so canonical, Open Graph and
   `sitemap.xml` point at the right place.

| Variable | Required | Value |
| --- | --- | --- |
| `RESEND_API_KEY` | yes | The `re_…` key from <https://resend.com/api-keys>. |
| `MAIL_FROM` | yes | A verified sender, e.g. `Abdul Latif <hello@yourdomain.com>`. |
| `MAIL_TO` | yes | `abdullatif.cse@gmail.com`. |
| `SITE_URL` | yes | `https://your-domain.com` — no trailing slash. |
| `MAIL_SEND_ACK` | no | `true` to also confirm receipt to the visitor. |

`NODE_ENV` is set to `production` by Vercel already, and `PORT` is unused on serverless — don't add
either. Environment variables are read at cold start, so **redeploy after changing one**.

One caveat: the 5-per-hour contact throttle is held in memory, so on serverless each instance counts
separately and the limit is softer than it looks. The honeypot and validation still apply. If it
ever matters, swap `ThrottlerModule`'s storage for a Redis-backed one.

### Any Node host

Railway, Render, Fly or a VPS behind nginx run it as a normal long-lived server, which keeps the
rate limiter exact and avoids cold starts:

```bash
npm ci && npm run build && npm run start:prod
```

Set the same variables plus `PORT`, and keep the process behind HTTPS — `trust proxy` is already
enabled so the rate limiter sees real client IPs.
