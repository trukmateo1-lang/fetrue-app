// Local-only streak system, persisted in localStorage.
// Counts consecutive days the user has marked "completado".

const KEY = "fetrue.streak.v1";
const NAME_KEY = "fetrue.user.v1";

export type StreakState = {
  count: number;
  lastDate: string | null; // YYYY-MM-DD
  history: string[]; // last 30 dates
};

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string) {
  return Math.round((+new Date(b) - +new Date(a)) / 86400000);
}

export function readStreak(): StreakState {
  if (typeof window === "undefined") return { count: 0, lastDate: null, history: [] };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { count: 0, lastDate: null, history: [] };
    const parsed = JSON.parse(raw) as StreakState;
    // If the user skipped more than 1 day, reset.
    if (parsed.lastDate && daysBetween(parsed.lastDate, todayStr()) > 1) {
      return { count: 0, lastDate: null, history: parsed.history ?? [] };
    }
    return parsed;
  } catch {
    return { count: 0, lastDate: null, history: [] };
  }
}

export function markToday(): StreakState {
  const today = todayStr();
  const cur = readStreak();
  if (cur.lastDate === today) return cur;
  const newCount = cur.lastDate && daysBetween(cur.lastDate, today) === 1 ? cur.count + 1 : 1;
  const next: StreakState = {
    count: newCount,
    lastDate: today,
    history: [...(cur.history ?? []).slice(-29), today],
  };
  localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function readName(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(NAME_KEY);
}
export function writeName(name: string) {
  localStorage.setItem(NAME_KEY, name.trim());
}
export function clearName() {
  localStorage.removeItem(NAME_KEY);
}
