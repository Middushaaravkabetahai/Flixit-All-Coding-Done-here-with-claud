// Phase 5 — Local Price Matching.
//
// The pitch: you're standing in a mall, you scan a jacket, and Flixit tells
// you the store two doors down has it for $20 less.
//
// Status: NOT AVAILABLE, and not because the code isn't written. Real-time
// in-store inventory and pricing is not something you can buy off an API —
// it requires data-sharing agreements with the retailers themselves. Until
// Shaarav/Maahit land at least one retailer partnership (or a distributor
// feed that carries in-store stock levels), there is no source to plug in.
//
// So this module is the seam, not the feature. When a real source exists,
// implement LocalPricingProvider against it and assign `provider` below —
// the Scan tab picks it up with no other changes.
//
// Deliberately NOT done here:
//   - No device location request. Asking for location permission for a
//     feature that can't return anything is both bad UX and an App Store
//     review risk (permissions must be justified by working functionality).
//     Add expo-location at the same time as a real provider, not before.
//   - No invented store names or prices. Fabricated local pricing shown to
//     real users is misleading, and placeholder content gets apps rejected
//     under App Store guideline 2.1.

export type NearbyOffer = {
  /** Store name as the retailer reports it, e.g. "Zara — Westfield". */
  store: string;
  /** Distance from the user, miles. Requires real device location. */
  distanceMiles: number;
  price: number;
  /** Whether the retailer reports this item as in stock right now. */
  inStock: boolean;
};

export type NearbyQuery = {
  description: string;
  category: string;
  /** Only set once a real provider exists and location permission is granted. */
  latitude?: number;
  longitude?: number;
};

export interface LocalPricingProvider {
  findNearby(query: NearbyQuery): Promise<NearbyOffer[]>;
}

/**
 * Assign a real implementation here once a retailer data partnership exists.
 * Everything downstream keys off this being non-null.
 */
export const provider: LocalPricingProvider | null = null;

export const isLocalPricingAvailable = provider !== null;

export async function findNearbyOffers(query: NearbyQuery): Promise<NearbyOffer[]> {
  if (!provider) return [];
  return provider.findNearby(query);
}
