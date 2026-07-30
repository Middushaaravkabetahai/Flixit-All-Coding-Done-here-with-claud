import type { WardrobeItem } from './wardrobe';

export const OUTFIT_SLOTS = ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory'] as const;
export type OutfitSlot = (typeof OUTFIT_SLOTS)[number];

export type Outfit = Partial<Record<OutfitSlot, WardrobeItem>>;

// Rule-based (no AI): group the closet by category, pick one item per slot at
// random. Outerwear/Accessory are optional since not everyone owns them;
// Top/Bottom/Shoes are the core of an outfit.
export function buildOutfit(items: WardrobeItem[]): Outfit {
  const byCategory = new Map<string, WardrobeItem[]>();
  for (const item of items) {
    const bucket = byCategory.get(item.category) ?? [];
    bucket.push(item);
    byCategory.set(item.category, bucket);
  }

  const outfit: Outfit = {};
  for (const slot of OUTFIT_SLOTS) {
    const candidates = byCategory.get(slot);
    if (candidates && candidates.length > 0) {
      outfit[slot] = candidates[Math.floor(Math.random() * candidates.length)];
    }
  }
  return outfit;
}

export function hasEnoughForOutfit(items: WardrobeItem[]): boolean {
  const categories = new Set(items.map((item) => item.category));
  return categories.has('Top') && categories.has('Bottom');
}
