const RECENT_KEY = "ks-menu-recent";
const PINS_KEY = "ks-menu-pins";
const MAX_RECENT = 6;
const MAX_PINS = 6;

let memoryRecent: string[] = [];
let memoryPins: string[] = [];

function safeStorage(): Storage | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getRecentSlugs(): string[] {
  const storage = safeStorage();
  if (!storage) return [...memoryRecent];
  try {
    const raw = storage.getItem(RECENT_KEY);
    if (!raw) return [...memoryRecent];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...memoryRecent];
    const list = parsed.filter((x) => typeof x === "string").slice(0, MAX_RECENT);
    memoryRecent = list;
    return list;
  } catch {
    return [...memoryRecent];
  }
}

export function pushRecent(slug: string): void {
  if (!slug) return;
  const current = getRecentSlugs();
  const next = [slug, ...current.filter((s) => s !== slug)].slice(0, MAX_RECENT);
  memoryRecent = next;
  const storage = safeStorage();
  if (storage) {
    try {
      storage.setItem(RECENT_KEY, JSON.stringify(next));
    } catch {
      // memory fallback already set
    }
  }
}

export function getPins(): string[] {
  const storage = safeStorage();
  if (!storage) return [...memoryPins];
  try {
    const raw = storage.getItem(PINS_KEY);
    if (!raw) return [...memoryPins];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [...memoryPins];
    const list = parsed.filter((x) => typeof x === "string").slice(0, MAX_PINS);
    memoryPins = list;
    return list;
  } catch {
    return [...memoryPins];
  }
}

export function togglePin(slug: string): string[] {
  if (!slug) return getPins();
  const current = getPins();
  const next = current.includes(slug)
    ? current.filter((s) => s !== slug)
    : [slug, ...current].slice(0, MAX_PINS);
  memoryPins = next;
  const storage = safeStorage();
  if (storage) {
    try {
      storage.setItem(PINS_KEY, JSON.stringify(next));
    } catch {
      // memory fallback
    }
  }
  return next;
}

export function isPinned(slug: string): boolean {
  return getPins().includes(slug);
}
