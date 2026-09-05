// SAMPLE online pricing, so Scan & Price Match is testable before the
// affiliate APIs (ShopStyle / Rakuten / Amazon Associates) are wired up.
//
// These numbers are generated, not real listings. Anywhere they're shown in
// the app they must be labelled as sample data — showing invented prices as
// if they were real retailer quotes misleads users, and placeholder content
// is an App Store guideline 2.1 rejection risk. Delete this file once the
// affiliate integration lands.
//
// Local/in-store pricing used to live here too. It's gone: there's no data
// source for it at all yet, so the app now says "coming soon" instead of
// inventing store names and distances. See src/lib/localPricing.ts.
export type PriceOption = { retailer: string; price: number };

const ONLINE_RETAILERS = ['ASOS', 'Amazon', 'Zara', 'H&M', 'Nordstrom'];

// Seeded off the item description so the same scanned item doesn't reshuffle
// its prices on every render.
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return () => {
    h = (h * 1103515245 + 12345) >>> 0;
    return h / 0xffffffff;
  };
}

export function getMockOnlinePrices(description: string): PriceOption[] {
  const rand = seededRandom(description);
  const base = 25 + rand() * 120;
  return ONLINE_RETAILERS.slice(0, 3 + Math.floor(rand() * 2))
    .map((retailer) => ({ retailer, price: Math.round((base + (rand() - 0.5) * 30) * 100) / 100 }))
    .sort((a, b) => a.price - b.price);
}
