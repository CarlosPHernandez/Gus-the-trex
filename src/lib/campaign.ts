import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type CampaignStats = {
  totalCents: number;
  pledgeCount: number;
  coalitionCount: number;
  live: boolean;
};

export const CAMPAIGN_UPDATED = "gus:campaign-updated";

export function isCampaignLive(): boolean {
  return Boolean(
    import.meta.env.PUBLIC_SUPABASE_URL && import.meta.env.PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function getSupabase(): SupabaseClient | null {
  const url = import.meta.env.PUBLIC_SUPABASE_URL;
  const key = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) return null;
  return createClient(url, key);
}

function parseStatsRow(data: unknown): CampaignStats | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Record<string, unknown>;
  return {
    totalCents: Number(row.total_cents ?? 0),
    pledgeCount: Number(row.pledge_count ?? 0),
    coalitionCount: Number(row.coalition_count ?? 0),
    live: true,
  };
}

export async function fetchCampaignStats(): Promise<CampaignStats> {
  const supabase = getSupabase();
  if (supabase) {
    const { data, error } = await supabase.rpc("get_campaign_stats");
    const parsed = parseStatsRow(data);
    if (!error && parsed) return parsed;
  }

  const [pledgeRes, waitlistRes] = await Promise.all([
    fetch("/pledge.json"),
    fetch("/waitlist.json"),
  ]);

  const pledge = pledgeRes.ok ? await pledgeRes.json() : { totalCents: 0, supporters: 0 };
  const waitlist = waitlistRes.ok ? await waitlistRes.json() : { supporters: 0 };

  return {
    totalCents: Number(pledge.totalCents ?? 0),
    pledgeCount: Number(pledge.supporters ?? 0),
    coalitionCount: Number(waitlist.supporters ?? 0),
    live: false,
  };
}

export function notifyCampaignUpdated() {
  window.dispatchEvent(new CustomEvent(CAMPAIGN_UPDATED));
}

export async function recordPledge(input: {
  amountDollars: number;
  tierName: string;
  displayName?: string;
  email?: string;
  source?: string;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, message: "Live database not configured. Use npm run add-pledge or set Supabase env vars." };
  }

  const { error } = await supabase.from("pledges").insert({
    amount_cents: Math.round(input.amountDollars * 100),
    tier_name: input.tierName,
    display_name: input.displayName?.trim() || null,
    email: input.email?.trim() || null,
    source: input.source ?? "web",
  });

  if (error) return { ok: false, message: error.message };
  notifyCampaignUpdated();
  return { ok: true };
}

export async function recordCoalitionEmail(
  email: string,
): Promise<{ ok: true } | { ok: false; message: string; duplicate?: boolean }> {
  const supabase = getSupabase();
  if (!supabase) {
    return { ok: false, message: "Live database not configured. Set Supabase env vars to sync signups." };
  }

  const normalized = email.trim().toLowerCase();
  const { error } = await supabase.from("coalition_members").insert({ email: normalized });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "That email is already on the coalition roll.", duplicate: true };
    }
    return { ok: false, message: error.message };
  }

  notifyCampaignUpdated();
  return { ok: true };
}
