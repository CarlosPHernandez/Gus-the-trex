export function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.RESEND_FROM_EMAIL;
  const siteUrl = (process.env.CAMPAIGN_SITE_URL || process.env.VERCEL_URL || "")
    .replace(/\/$/, "");

  if (!apiKey || !from) return null;

  const origin = siteUrl.startsWith("http")
    ? siteUrl
    : siteUrl
      ? `https://${siteUrl}`
      : "";

  return { apiKey, from, siteUrl: origin };
}

export function getSupabaseAdmin() {
  const url = process.env.PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return { url, key };
}
