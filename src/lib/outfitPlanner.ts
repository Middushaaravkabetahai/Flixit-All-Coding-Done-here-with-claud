import type { Occasion, WardrobeItem } from './wardrobe';

export const OUTFIT_SLOTS = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'] as const;
export type OutfitSlot = (typeof OUTFIT_SLOTS)[number];

export type Outfit = Partial<Record<OutfitSlot, WardrobeItem>>;

const NEUTRAL_COLORS = new Set([
  'black',
  'white',
  'gray',
  'grey',
  'navy',
  'beige',
  'tan',
  'cream',
  'denim',
  'brown',
]);

// Neutrals pair with anything; an exact color match is an even safer bet.
// This is a simple heuristic, not real color theory — good enough for a
// rule-based first pass per the roadmap.
function colorScore(a: string | null, b: string | null): number {
  if (!a || !b) return 0;
  const av = a.trim().toLowerCase();
  const bv = b.trim().toLowerCase();
  if (av === bv) return 2;
  if (NEUTRAL_COLORS.has(av) || NEUTRAL_COLORS.has(bv)) return 1;
  return 0;
}

function scoreOutfit(outfit: Outfit): number {
  const colors = OUTFIT_SLOTS.map((slot) => outfit[slot]?.color ?? null).filter(
    (c): c is string => c !== null
  );
  let score = 0;
  for (let i = 0; i < colors.length; i++) {
    for (let j = i + 1; j < colors.length; j++) {
      score += colorScore(colors[i], colors[j]);
    }
  }
  return score;
}

function groupByCategory(items: WardrobeItem[]): Map<string, WardrobeItem[]> {
  const byCategory = new Map<string, WardrobeItem[]>();
  for (const item of items) {
    const bucket = byCategory.get(item.category) ?? [];
    bucket.push(item);
    byCategory.set(item.category, bucket);
  }
  return byCategory;
}

function randomOutfit(byCategory: Map<string, WardrobeItem[]>): Outfit {
  const outfit: Outfit = {};
  for (const slot of OUTFIT_SLOTS) {
    const candidates = byCategory.get(slot);
    if (candidates && candidates.length > 0) {
      outfit[slot] = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return outfit;
}

// Filters to the requested occasion when there's enough tagged for it;
// otherwise falls back to the full closet rather than coming up empty.
function poolForOccasion(items: WardrobeItem[], occasion?: Occasion): WardrobeItem[] {
  if (!occasion) return items;
  const filtered = items.filter((item) => item.occasion === occasion);
  return filtered.length > 0 ? filtered : items;
}

// Rule-based (no AI): generate a handful of random candidate outfits from
// the closet, filtered by occasion, and keep the one with the best color
// coordination score.
export function buildOutfit(items: WardrobeItem[], occasion?: Occasion): Outfit {
  const byCategory = groupByCategory(poolForOccasion(items, occasion));
  const candidates = Array.from({ length: 8 }, () => randomOutfit(byCategory));
  candidates.sort((a, b) => scoreOutfit(b) - scoreOutfit(a));
  return candidates[0] ?? {};
}

export function hasEnoughForOutfit(items: WardrobeItem[], occasion?: Occasion): boolean {
  const categories = new Set(poolForOccasion(items, occasion).map((item) => item.category));
  return categories.has('Top') && categories.has('Bottom');
}
