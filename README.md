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

## Deploy

Static output works on Vercel, Netlify, or any static host (`dist/` after build). Supabase uses the browser anon key only; never expose `SUPABASE_SERVICE_ROLE_KEY` to the client.
