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

Any Node host works (Railway, Render, Fly, a VPS behind nginx):

```bash
npm ci && npm run build && npm run start:prod
```

Set the environment variables above, point `SITE_URL` at the real domain, and keep the process
behind HTTPS — `trust proxy` is already enabled so the rate limiter sees real client IPs.
