const PLEDGE_KEY = "gus-demo-pledges";
const COALITION_KEY = "gus-coalition-emails";

type LocalPledge = { cents: number; tierName: string; email: string; displayName?: string };

export function getLocalPledgeBonus(): { cents: number; count: number } {
  try {
    const raw = localStorage.getItem(PLEDGE_KEY);
    if (!raw) return { cents: 0, count: 0 };
    const list = JSON.parse(raw) as LocalPledge[];
    if (!Array.isArray(list)) return { cents: 0, count: 0 };
    return {
      cents: list.reduce((sum, p) => sum + (p.cents ?? 0), 0),
      count: list.length,
    };
  } catch {
    return { cents: 0, count: 0 };
  }
}

export function addLocalPledge(
  amountDollars: number,
  tierName: string,
  email: string,
  displayName?: string,
) {
  const list = JSON.parse(localStorage.getItem(PLEDGE_KEY) ?? "[]") as LocalPledge[];
  list.push({
    cents: Math.round(amountDollars * 100),
    tierName,
    email: email.trim().toLowerCase(),
    displayName: displayName?.trim() || undefined,
  });
  localStorage.setItem(PLEDGE_KEY, JSON.stringify(list));
  addLocalCoalitionEmail(email);
}

function readLocalCoalitionEmails(): string[] {
  try {
    const raw = localStorage.getItem(COALITION_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) ? list.map((e) => e.trim().toLowerCase()).filter(Boolean) : [];
  } catch {
    return [];
  }
}

function readLocalPledgeEmails(): string[] {
  try {
    const raw = localStorage.getItem(PLEDGE_KEY);
    if (!raw) return [];
    const list = JSON.parse(raw) as LocalPledge[];
    if (!Array.isArray(list)) return [];
    return list.map((p) => p.email?.trim().toLowerCase()).filter(Boolean) as string[];
  } catch {
    return [];
  }
}

/** Unique supporter emails saved only on this device (coalition form + tier pledges). */
export function getLocalSupporterBonus(): number {
  return new Set([...readLocalCoalitionEmails(), ...readLocalPledgeEmails()]).size;
}

/** @deprecated Use getLocalSupporterBonus — coalition-only signups on this device. */
export function getLocalCoalitionBonus(): number {
  return readLocalCoalitionEmails().length;
}

export function addLocalCoalitionEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  const list = JSON.parse(localStorage.getItem(COALITION_KEY) ?? "[]") as string[];
  if (!Array.isArray(list)) return false;
  if (list.includes(normalized)) return false;
  list.push(normalized);
  localStorage.setItem(COALITION_KEY, JSON.stringify(list));
  return true;
}
