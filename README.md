# Gus-the-trex

A public stewardship campaign to keep **Gus**—one of the most complete *Tyrannosaurus rex* specimens ever prepared—in museum trust, not a private collection.

## Develop

```bash
npm install
npm run dev
```

Open [http://localhost:4321](http://localhost:4321).

## Build

```bash
npm run build
npm run preview
```

## Assets

- Skeleton photography: `public/images/gus-skeleton-*.jpeg`
- Alive layer: `public/images/gus-alive.png` (life reconstruction; source file also kept as `ChatGPT Image Jun 3, 2026 at 02_18_42 PM.png`)

## Real pledge & coalition data

**Without Supabase** (default): totals come from `public/pledge.json` and `public/waitlist.json`. Tier signups on the site only save on that browser. For a coffee-shop $25 pledge, run:

```bash
cp .env.example .env   # after filling Supabase keys (see below)
npm run add-pledge -- 25 Trace "Alex"
```

Then redeploy so everyone sees the updated JSON — or connect Supabase so you never redeploy for each signup.

**With Supabase** (recommended for live totals):

1. Create a project at [supabase.com](https://supabase.com).
2. In the SQL editor, run `supabase/migrations/20260603160000_campaign.sql`.
3. Copy `.env.example` → `.env` with `PUBLIC_SUPABASE_URL`, `PUBLIC_SUPABASE_ANON_KEY`, and `SUPABASE_SERVICE_ROLE_KEY` (Settings → API).
4. Add the same `PUBLIC_*` vars in Vercel/Netlify environment settings and redeploy.
5. On the site: tap **$25 Trace**, optional name, **Add to campaign** — the total updates for everyone.

CLI (in-person or if the phone browser fails):

```bash
npm run add-pledge -- 25 Trace "Coffee shop guest"
```

## Email (Resend)

Transactional emails send after a successful coalition signup or tier pledge (when Resend is configured on Vercel).

### Quick test (Hello World)

1. Create an API key at [resend.com/api-keys](https://resend.com/api-keys).
2. In `.env.local`, set `RESEND_API_KEY=re_xxxxxxxxx` — **replace `re_xxxxxxxxx` with your real API key**.
3. Run:

   ```bash
   npm run test-email
   ```

   Sends to `keepguspublic@gmail.com` from `onboarding@resend.dev` (Resend’s sandbox sender). Override recipient: `npm run test-email -- you@example.com`.

### Production campaign emails

1. Verify your sending domain in Resend → **Domains**.
2. Add to `.env.local` and **Vercel** (server-only, not `PUBLIC_`):

   - `RESEND_API_KEY` — your real key (not `re_xxxxxxxxx`)
   - `RESEND_FROM_EMAIL` — e.g. `Gus Campaign <campaign@yourdomain.com>`
   - `SUPABASE_SERVICE_ROLE_KEY` — confirms the signup/pledge exists before sending (anti-abuse)
   - `CAMPAIGN_SITE_URL` — optional; production URL for links in emails

3. Redeploy. API route: `POST /api/campaign-email` (see `api/campaign-email.mjs`).

Local testing with the API route: `npm run dev:vercel` (requires [Vercel CLI](https://vercel.com/docs/cli)). Plain `npm run dev` does not run `/api` routes.

## Deploy

Static output works on Vercel (`dist/` after build). Vercel also runs `/api/*` serverless functions for Resend. Supabase uses the browser anon key only; never expose `SUPABASE_SERVICE_ROLE_KEY` or `RESEND_API_KEY` to the client.

### Link previews (Twitter / iMessage / Slack)

OG and Twitter Card tags are baked in at **build** time. On Vercel, `VERCEL_PROJECT_PRODUCTION_URL` supplies your production domain automatically; override with `CAMPAIGN_SITE_URL` if needed. The share image is `public/images/og-image.jpg` (1200×630). After deploy, refresh the cache with [Twitter’s Card Validator](https://cards-dev.twitter.com/validator) or similar tools—previews can lag until the crawler re-fetches the page.
