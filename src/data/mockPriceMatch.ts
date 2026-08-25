// Placeholder price-match data, same idea as mockDeals.ts: lets Scan & Price
// Match be fully testable before real data sources are wired up.
//
// - "online" prices need the same affiliate APIs as the FYP/Flixnder feed
//   (ShopStyle/Rakuten/Amazon Associates) — Phase 2 dependency, not yet live.
// - "nearby" (in-store) prices need retailer inventory partnerships, which
//   the roadmap calls out as a Phase 5 stretch goal — there's no real data
//   source for this yet at all, mocked or otherwise.
export type PriceOption = { retailer: string; price: number };
export type NearbyOption = { store: string; distanceMiles: number; price: number };

const ONLINE_RETAILERS = ['ASOS', 'Amazon', 'Zara', 'H&M', 'Nordstrom'];
const NEARBY_STORES = ['Downtown Mall', 'Westfield Outlet', 'Main St. Boutique'];

// Deterministic-ish fake pricing so the same scanned item doesn't reshuffle
// prices every render — seeded off the item description.
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

export function getMockNearbyPrices(description: string): NearbyOption[] {
  const rand = seededRandom(description + 'nearby');
  const base = 25 + rand() * 120;
  return NEARBY_STORES.map((store) => ({
    store,
    distanceMiles: Math.round(rand() * 8 * 10) / 10,
    price: Math.round((base + (rand() - 0.5) * 40) * 100) / 100,
  })).sort((a, b) => a.price - b.price);
}
