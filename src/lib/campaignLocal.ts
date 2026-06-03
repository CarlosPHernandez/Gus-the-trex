const PLEDGE_KEY = "gus-demo-pledges";
const COALITION_KEY = "gus-coalition-emails";

type LocalPledge = { cents: number; tierName: string; displayName?: string };

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

export function addLocalPledge(amountDollars: number, tierName: string, displayName?: string) {
  const list = JSON.parse(localStorage.getItem(PLEDGE_KEY) ?? "[]") as LocalPledge[];
  list.push({
    cents: Math.round(amountDollars * 100),
    tierName,
    displayName: displayName?.trim() || undefined,
  });
  localStorage.setItem(PLEDGE_KEY, JSON.stringify(list));
}

export function getLocalCoalitionBonus(): number {
  try {
    const raw = localStorage.getItem(COALITION_KEY);
    if (!raw) return 0;
    const list = JSON.parse(raw) as string[];
    return Array.isArray(list) ? list.length : 0;
  } catch {
    return 0;
  }
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
