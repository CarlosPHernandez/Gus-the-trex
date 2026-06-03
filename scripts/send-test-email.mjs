#!/usr/bin/env node
/**
 * Send a one-off Resend "Hello World" test email.
 * Usage: npm run test-email
 *
 * Requires RESEND_API_KEY in .env.local or .env — replace re_xxxxxxxxx with your real key.
 */
import { Resend } from "resend";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";

function loadEnv() {
  for (const name of [".env.local", ".env"]) {
    const path = resolve(process.cwd(), name);
    if (!existsSync(path)) continue;
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
}

loadEnv();

const apiKey = process.env.RESEND_API_KEY;
if (!apiKey || apiKey === "re_xxxxxxxxx" || apiKey === "re_xxxxxxxx") {
  console.error(
    "Missing RESEND_API_KEY. Add it to .env.local:\n\n  RESEND_API_KEY=re_xxxxxxxxx\n\nReplace re_xxxxxxxxx with your real key from https://resend.com/api-keys",
  );
  process.exit(1);
}

const from = process.env.RESEND_TEST_FROM || "onboarding@resend.dev";
const to = process.argv[2] || process.env.RESEND_TEST_TO || "keepguspublic@gmail.com";

const resend = new Resend(apiKey);

const { data, error } = await resend.emails.send({
  from,
  to,
  subject: "Hello World",
  html: "<p>Congrats on sending your <strong>first email</strong>!</p>",
});

if (error) {
  console.error("Resend error:", error);
  process.exit(1);
}

console.log("Email sent:", data?.id ?? data);
