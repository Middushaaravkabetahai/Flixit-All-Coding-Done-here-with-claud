import type { WardrobeItem } from './wardrobe';

export const OUTFIT_SLOTS = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'] as const;
export type OutfitSlot = (typeof OUTFIT_SLOTS)[number];

export type Outfit = Partial<Record<OutfitSlot, WardrobeItem>>;

/**
 * Small deterministic PRNG (mulberry32). `Math.random()` cannot be seeded, and
 * the daily outfit has to come out the same every time it is rebuilt, so this
 * is the one place the app needs its own generator.
 */
function seededRandom(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hashString(value: string): number {
  let h = 2166136261;
  for (let i = 0; i < value.length; i++) {
    h ^= value.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/**
 * The seed for "today". Built from the LOCAL date, not UTC: a UTC date rolls
 * over mid-evening in California, so the outfit would change while you are
 * still wearing it.
 */
export function dailySeed(userId: string, now: Date = new Date()): number {
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return hashString(`${userId}:${y}-${m}-${d}`);
}

export type BuildOutfitOptions = {
  /** Omit for a random outfit; pass `dailySeed(...)` for a stable daily one. */
  seed?: number;
  /**
   * An outfit to differ from. Any slot with more than one candidate is
   * guaranteed to change, which is what makes "Switch it up" always do
   * something visible.
   */
  avoid?: Outfit;
};

// Rule-based (no AI): group the closet by category, pick one item per slot.
// Outerwear/Accessory are optional since not everyone owns them; Top/Bottom
// are the core of an outfit.
export function buildOutfit(
  items: WardrobeItem[],
  options: BuildOutfitOptions = {}
): Outfit {
  const { seed, avoid } = options;
  const random = seed === undefined ? Math.random : seededRandom(seed);

  const byCategory = new Map<string, WardrobeItem[]>();
  for (const item of items) {
    const bucket = byCategory.get(item.category) ?? [];
    bucket.push(item);
    byCategory.set(item.category, bucket);
  }

  // A stable order inside each bucket, so the same seed gives the same outfit
  // even if the rows come back from Postgres in a different order.
  for (const bucket of byCategory.values()) {
    bucket.sort((a, b) => (a.id < b.id ? -1 : a.id > b.id ? 1 : 0));
  }

  const outfit: Outfit = {};
  for (const slot of OUTFIT_SLOTS) {
    const all = byCategory.get(slot);
    if (!all || all.length === 0) continue;

    // Drop the item currently in this slot, unless it is the only one we own —
    // then it has to stay, and the slot simply does not change.
    const previous = avoid?.[slot];
    const candidates =
      previous && all.length > 1 ? all.filter((item) => item.id !== previous.id) : all;

    outfit[slot] = candidates[Math.floor(random() * candidates.length)];
  }
  return outfit;
}

export function hasEnoughForOutfit(items: WardrobeItem[]): boolean {
  const categories = new Set(items.map((item) => item.category));
  return categories.has('Top') && categories.has('Bottom');
}

/** True when every slot holds the same item — i.e. a re-roll changed nothing. */
export function sameOutfit(a: Outfit, b: Outfit): boolean {
  return OUTFIT_SLOTS.every((slot) => a[slot]?.id === b[slot]?.id);
}

/** How many slots could ever change, used to hide a re-roll that cannot work. */
export function reRollableSlots(items: WardrobeItem[]): number {
  const counts = new Map<string, number>();
  for (const item of items) {
    counts.set(item.category, (counts.get(item.category) ?? 0) + 1);
  }
  return OUTFIT_SLOTS.filter((slot) => (counts.get(slot) ?? 0) > 1).length;
}
