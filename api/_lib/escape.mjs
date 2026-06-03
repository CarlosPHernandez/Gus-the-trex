/** Escape user-controlled strings before HTML interpolation. */
export function escapeHtml(value) {
  if (value == null) return "";
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/** Use in href attributes; only http(s) URLs from trusted config. */
export function safeSiteHref(siteUrl) {
  if (!siteUrl || typeof siteUrl !== "string") return "#";
  try {
    const parsed = new URL(siteUrl);
    if (parsed.protocol !== "http:" && parsed.protocol !== "https:") return "#";
    return escapeHtml(parsed.href);
  } catch {
    return "#";
  }
}
