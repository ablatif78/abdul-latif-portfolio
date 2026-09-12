/**
 * Sends one test email straight through the Resend API and prints the raw
 * response, so a rejected send explains itself.
 *
 *   node scripts/mail-check.mjs
 *
 * Reads RESEND_API_KEY, MAIL_FROM and MAIL_TO from .env in this folder.
 */
import { readFileSync } from 'node:fs';

const env = Object.fromEntries(
  readFileSync(new URL('../.env', import.meta.url), 'utf8')
    .split('\n')
    .filter((line) => line.trim() && !line.trim().startsWith('#'))
    .map((line) => {
      const index = line.indexOf('=');
      return [line.slice(0, index).trim(), line.slice(index + 1).trim()];
    }),
);

const from = env.MAIL_FROM || 'Portfolio <onboarding@resend.dev>';
const to = env.MAIL_TO;

if (!env.RESEND_API_KEY) {
  console.error('RESEND_API_KEY is empty in .env — paste the re_… key first.');
  process.exit(1);
}

console.log(`from: ${from}\nto:   ${to}\n`);

const response = await fetch('https://api.resend.com/emails', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${env.RESEND_API_KEY}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: 'Resend configuration test',
    text: 'If this arrived, the portfolio contact form will work too.',
  }),
});

const body = await response.json();
console.log(`HTTP ${response.status}`);
console.log(JSON.stringify(body, null, 2));
console.log(
  response.ok ? '\nDelivered — the contact form will work.' : '\nRejected — the reason is above.',
);
