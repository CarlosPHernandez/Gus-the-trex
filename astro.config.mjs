// @ts-check
import { defineConfig } from 'astro/config';

/** Production/preview origin for absolute OG URLs and sitemap (set on Vercel build). */
const site =
  process.env.CAMPAIGN_SITE_URL?.replace(/\/$/, '') ||
  (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

// https://astro.build/config
export default defineConfig({
  site,
});
