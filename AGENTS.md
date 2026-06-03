# AGENTS.md

## Cursor Cloud specific instructions

### Services

| Service | Command | Port | Notes |
|---------|---------|------|-------|
| Astro (frontend) | `npm run dev` | 4321 | Default local dev; static fallback uses `public/pledge.json` + `public/waitlist.json` |
| Vercel dev (API routes) | `npm run dev:vercel` | ~3000 | Required for `POST /api/campaign-email`; plain `npm run dev` does **not** serve `/api/*` |

### Standard commands

See `README.md` and `package.json`: `npm install`, `npm run dev`, `npm run build`, `npm run preview`, `npm run add-pledge`, `npm run test-email`.

### Supabase (live tallies)

When `PUBLIC_SUPABASE_URL` and `PUBLIC_SUPABASE_ANON_KEY` are set, coalition and pledge data sync globally. Run migrations in `supabase/migrations/` in order in the Supabase SQL editor (or CLI). The public supporter tally (`coalition_count` from `get_campaign_stats`) counts **unique emails** from both `coalition_members` and `pledges`.

### Gotchas

- **Coalition vs pledge tally**: Tier pledges must insert into `pledges` (and ideally `coalition_members` for new signups); stats RPC unions both tables for the supporter headcount.
- **Offline mode**: Browser `localStorage` keys `gus-coalition-emails` and `gus-demo-pledges`; `getLocalSupporterBonus()` unions both for the on-device tally overlay.
- No automated test suite in-repo; verify with `npm run build` and manual browser checks on `:4321`.
- Node **>=22.12.0** (see `package.json` engines).
