import { createClient } from "@supabase/supabase-js";

const WINDOW_MS = 10 * 60 * 1000;

export async function verifyRecentCoalitionJoin(supabaseConfig, email) {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
  const since = new Date(Date.now() - WINDOW_MS).toISOString();

  const { data, error } = await supabase
    .from("coalition_members")
    .select("id")
    .eq("email", email)
    .gte("created_at", since)
    .limit(1);

  if (error) return { ok: false, message: error.message };
  return { ok: Boolean(data?.length) };
}

export async function verifyRecentPledge(supabaseConfig, email, amountDollars, tierName) {
  const supabase = createClient(supabaseConfig.url, supabaseConfig.key);
  const since = new Date(Date.now() - WINDOW_MS).toISOString();
  const amountCents = Math.round(amountDollars * 100);

  const { data, error } = await supabase
    .from("pledges")
    .select("id")
    .eq("email", email)
    .eq("tier_name", tierName)
    .eq("amount_cents", amountCents)
    .gte("created_at", since)
    .limit(1);

  if (error) return { ok: false, message: error.message };
  return { ok: Boolean(data?.length) };
}
