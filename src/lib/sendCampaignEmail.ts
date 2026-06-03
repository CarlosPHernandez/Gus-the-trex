export type CampaignEmailType = "coalition_welcome" | "pledge_confirmation";

export type SendCampaignEmailInput =
  | { type: "coalition_welcome"; email: string }
  | {
      type: "pledge_confirmation";
      email: string;
      tierName: string;
      amountDollars: number;
      displayName?: string;
    };

export async function sendCampaignEmail(
  input: SendCampaignEmailInput,
): Promise<{ sent: boolean }> {
  try {
    const res = await fetch("/api/campaign-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });

    if (res.status === 503) return { sent: false };
    if (!res.ok) return { sent: false };

    const data = (await res.json()) as { ok?: boolean };
    return { sent: Boolean(data.ok) };
  } catch {
    return { sent: false };
  }
}
