export function normalizeEmail(email) {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  if (!normalized || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) return null;
  return normalized;
}

export function parseCampaignEmailBody(body) {
  if (!body || typeof body !== "object") return { error: "Invalid request body." };

  const type = body.type;
  if (type !== "coalition_welcome" && type !== "pledge_confirmation") {
    return { error: "Unknown email type." };
  }

  const email = normalizeEmail(body.email);
  if (!email) return { error: "A valid email is required." };

  if (type === "pledge_confirmation") {
    const amountDollars = Number(body.amountDollars);
    const tierName = typeof body.tierName === "string" ? body.tierName.trim() : "";
    if (!Number.isFinite(amountDollars) || amountDollars <= 0) {
      return { error: "A valid pledge amount is required." };
    }
    if (!tierName) return { error: "Tier name is required." };

    const displayName =
      typeof body.displayName === "string" ? body.displayName.trim() : "";

    return {
      type,
      email,
      amountDollars,
      tierName,
      displayName: displayName || undefined,
    };
  }

  return { type, email };
}
