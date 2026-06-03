#!/usr/bin/env node
/**
 * Record a real pledge in Supabase (e.g. coffee-shop signup).
 * Usage: npm run add-pledge -- 25 Trace "Alex"
 * Requires .env with PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
 */
import { createClient } from "@supabase/supabase-js";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  const path = resolve(process.cwd(), ".env");
  if (!existsSync(path)) return;
  for (const line of readFileSync(path, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const i = trimmed.indexOf("=");
    if (i === -1) continue;
    const key = trimmed.slice(0, i).trim();
    const val = trimmed.slice(i + 1).trim().replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = val;
  }
}

loadEnv();

const amount = Number(process.argv[2]);
const tier = process.argv[3] ?? "Trace";
const name = process.argv[4] ?? null;

if (!Number.isFinite(amount) || amount <= 0) {
  console.error("Usage: npm run add-pledge -- <dollars> [tierName] [displayName]");
  process.exit(1);
}

const url = process.env.PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error("Missing PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

const { error } = await supabase.from("pledges").insert({
  amount_cents: Math.round(amount * 100),
  tier_name: tier,
  display_name: name,
  source: "admin-cli",
});

if (error) {
  console.error("Insert failed:", error.message);
  process.exit(1);
}

const { data: stats } = await supabase.rpc("get_campaign_stats");
console.log(`Recorded $${amount} (${tier})${name ? ` — ${name}` : ""}`);
console.log("Campaign stats:", stats);
