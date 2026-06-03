// @ts-check
import { defineConfig } from 'astro/config';

/** Production/preview origin for absolute OG/Twitter image URLs (baked in at build). */
function resolveSiteUrl() {
  const explicit = process.env.CAMPAIGN_SITE_URL?.replace(/\/$/, '');
  if (explicit) return explicit;

  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL?.replace(/\/$/, '');
  if (productionHost) return `https://${productionHost}`;

  const previewHost = process.env.VERCEL_URL?.replace(/\/$/, '');
  if (previewHost) return `https://${previewHost}`;

  return undefined;
}

const site = resolveSiteUrl();

// https://astro.build/config
export default defineConfig({
  site,
});
