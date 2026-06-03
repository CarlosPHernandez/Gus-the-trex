import { escapeHtml, safeSiteHref } from "./escape.mjs";

function layout({ siteUrl, title, lede, bodyHtml }) {
  const home = safeSiteHref(siteUrl);
  const safeTitle = escapeHtml(title);
  const safeLede = escapeHtml(lede);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${safeTitle}</title>
</head>
<body style="margin:0;padding:0;background:#e8e2d6;font-family:Georgia,'Times New Roman',serif;color:#1c1916;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#e8e2d6;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#f5f3ee;border:1px solid #c9bfb0;border-radius:4px;">
          <tr>
            <td style="padding:28px 24px 8px;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#8b6f56;">
              Gus · public stewardship campaign
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 12px;font-family:Georgia,'Times New Roman',serif;font-size:26px;line-height:1.15;color:#1c1916;">
              ${safeTitle}
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 20px;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:16px;line-height:1.55;color:#2d3a2e;">
              <p style="margin:0 0 16px;">${safeLede}</p>
              ${bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:0 24px 24px;">
              <a href="${home}" style="display:inline-block;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:14px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;text-decoration:none;color:#f5f3ee;background:#2d3a2e;padding:12px 18px;border-radius:4px;">
                View the campaign
              </a>
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px 24px;border-top:1px solid #d8d0c4;font-family:'Source Sans 3',Helvetica,Arial,sans-serif;font-size:12px;line-height:1.45;color:#8b6f56;">
              Non-binding expressions of interest only. No charge today. Auction · 14 Jul 2026.
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

export function coalitionWelcomeEmail({ siteUrl }) {
  const title = "You're on the coalition";
  const lede =
    "Thanks for joining the public roll for Gus. We'll share auction updates and next steps when payments launch.";
  const bodyHtml = `<p style="margin:0;">Your email is on the coalition tally — a visible headcount showing support for keeping this <em>T. rex</em> in museum trust.</p>`;

  return {
    subject: "You're on the coalition for Gus",
    html: layout({ siteUrl, title, lede, bodyHtml }),
    text: [
      "You're on the coalition for Gus",
      "",
      "Thanks for joining the public roll. We'll share auction updates and next steps when payments launch.",
      "",
      siteUrl ? `Campaign: ${siteUrl}` : "",
      "",
      "Non-binding. No charge today. Auction · 14 Jul 2026.",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}

export function pledgeConfirmationEmail({
  siteUrl,
  tierName,
  amountDollars,
  displayName,
}) {
  const safeTierName = escapeHtml(tierName);
  const amountLabel = amountDollars.toLocaleString("en-US");
  const plainDisplayName = typeof displayName === "string" ? displayName.trim() : "";
  const greeting = plainDisplayName ? `Hi ${plainDisplayName},` : "Hi there,";
  const title = "Pledge recorded";
  const lede = `${greeting} your non-binding pledge is on the public campaign total.`;
  const bodyHtml = `<p style="margin:0 0 12px;"><strong>${safeTierName}</strong> tier · <strong>$${amountLabel}</strong> (non-binding)</p>
<p style="margin:0;">This is not a charge — it records your intent so others can see momentum toward public stewardship before the Sotheby&apos;s auction on 14 July 2026.</p>`;

  const plainTierName = typeof tierName === "string" ? tierName.trim() : "";

  return {
    subject: `Your $${amountLabel} Gus pledge is recorded`,
    html: layout({ siteUrl, title, lede, bodyHtml }),
    text: [
      "Your Gus pledge is recorded",
      "",
      `${greeting} your non-binding pledge is on the public campaign total.`,
      "",
      `${plainTierName} tier · $${amountLabel} (non-binding)`,
      "",
      "This is not a charge.",
      "",
      siteUrl ? `Campaign: ${siteUrl}` : "",
    ]
      .filter(Boolean)
      .join("\n"),
  };
}
