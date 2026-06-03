import { Resend } from "resend";
import { getResendConfig, getSupabaseAdmin } from "./_lib/env.mjs";
import {
  coalitionWelcomeEmail,
  pledgeConfirmationEmail,
} from "./_lib/email-templates.mjs";
import { parseCampaignEmailBody } from "./_lib/validate.mjs";
import {
  verifyRecentCoalitionJoin,
  verifyRecentPledge,
} from "./_lib/verify-recent.mjs";

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

export default async function handler(request) {
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed." }, 405);
  }

  const resendConfig = getResendConfig();
  if (!resendConfig) {
    return jsonResponse({ error: "Email service not configured.", configured: false }, 503);
  }

  let body;
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const parsed = parseCampaignEmailBody(body);
  if (parsed.error) return jsonResponse({ error: parsed.error }, 400);

  const supabaseAdmin = getSupabaseAdmin();
  if (supabaseAdmin) {
    if (parsed.type === "coalition_welcome") {
      const verified = await verifyRecentCoalitionJoin(supabaseAdmin, parsed.email);
      if (verified.message) {
        return jsonResponse({ error: verified.message }, 500);
      }
      if (!verified.ok) {
        return jsonResponse({ error: "No recent coalition signup found for this email." }, 403);
      }
    } else {
      const verified = await verifyRecentPledge(
        supabaseAdmin,
        parsed.email,
        parsed.amountDollars,
        parsed.tierName,
      );
      if (verified.message) {
        return jsonResponse({ error: verified.message }, 500);
      }
      if (!verified.ok) {
        return jsonResponse({ error: "No recent pledge found for this email." }, 403);
      }
    }
  }

  const resend = new Resend(resendConfig.apiKey);
  const siteUrl = resendConfig.siteUrl;

  const message =
    parsed.type === "coalition_welcome"
      ? coalitionWelcomeEmail({ siteUrl })
      : pledgeConfirmationEmail({
          siteUrl,
          tierName: parsed.tierName,
          amountDollars: parsed.amountDollars,
          displayName: parsed.displayName,
        });

  const { data, error } = await resend.emails.send({
    from: resendConfig.from,
    to: [parsed.email],
    subject: message.subject,
    html: message.html,
    text: message.text,
    tags: [{ name: "campaign", value: "gus" }, { name: "type", value: parsed.type }],
  });

  if (error) {
    console.error("Resend error:", error);
    return jsonResponse({ error: "Failed to send email." }, 502);
  }

  return jsonResponse({ ok: true, id: data?.id ?? null, configured: true }, 200);
}
