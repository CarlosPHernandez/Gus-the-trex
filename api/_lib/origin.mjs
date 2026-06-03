function addOrigin(origins, value) {
  if (!value || typeof value !== "string") return;
  const trimmed = value.trim().replace(/\/$/, "");
  if (!trimmed) return;

  try {
    const url = trimmed.startsWith("http") ? trimmed : `https://${trimmed}`;
    origins.add(new URL(url).origin);
  } catch {
    // ignore invalid configured origins
  }
}

export function getAllowedOrigins() {
  const origins = new Set();

  addOrigin(origins, process.env.CAMPAIGN_SITE_URL);
  addOrigin(origins, process.env.VERCEL_URL);

  if (process.env.VERCEL_ENV !== "production") {
    origins.add("http://localhost:4321");
    origins.add("http://127.0.0.1:4321");
    origins.add("http://localhost:3000");
    origins.add("http://127.0.0.1:3000");
  }

  return origins;
}

export function isAllowedRequestOrigin(request) {
  const allowed = getAllowedOrigins();
  if (allowed.size === 0) {
    return { ok: false, reason: "Origin validation not configured." };
  }

  const origin = request.headers.get("origin");
  if (origin) {
    return allowed.has(origin)
      ? { ok: true }
      : { ok: false, reason: "Forbidden origin." };
  }

  const referer = request.headers.get("referer");
  if (referer) {
    try {
      const refererOrigin = new URL(referer).origin;
      return allowed.has(refererOrigin)
        ? { ok: true }
        : { ok: false, reason: "Forbidden origin." };
    } catch {
      return { ok: false, reason: "Invalid referer." };
    }
  }

  return { ok: false, reason: "Missing origin." };
}
