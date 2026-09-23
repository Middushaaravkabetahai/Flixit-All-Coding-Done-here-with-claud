// Phase 2 — the deal catalog behind the FYP and Flixnder.
//
// Status: NO SOURCE CONNECTED. Not a code problem. Every affiliate network
// requires an approved account and credentials that cannot live in this repo,
// and as of September 2026 the three networks named in the original plan have
// each changed in ways that matter:
//
//   ShopStyle Collective (Collective Voice) — SHUT DOWN. The platform wound
//     down through early 2026: links deactivated 31 Mar 2026, final payouts
//     19 Jul 2026. Both dates have passed. This source no longer exists.
//
//   Amazon — the Product Advertising API was deprecated 15 May 2026 and stopped
//     taking new customers. Its replacement, the Creators API, requires the
//     Associates account to have made 10 qualified sales in the trailing 30
//     days BEFORE granting API access. That is circular for us: we need
//     products in the feed to make sales, and sales to get the products.
//     Amazon therefore cannot be the first integration. Plain Associates
//     links (no API) do work and are how the first sales would be earned.
//     Separately: Associates requires the account holder to be 18+, so a
//     parent has to register and own the account.
//
//   Rakuten — still open. Publisher account, then apply per advertiser, each
//     with its own approval criteria. Has a developer portal with OAuth
//     credentials. Approval tends to expect real traffic, which we do not
//     have pre-launch.
//
// Realistically the first workable source is a network with no sales
// threshold: Awin (accepts a website or a social handle, $1 refundable
// deposit) or an aggregator like Skimlinks / Sovrn Commerce, which cover many
// networks through one integration.
//
// This module is the seam, not the feature. Implement DealsProvider against
// whichever network approves first and assign `provider` below. The FYP and
// Flixnder screens read `isDealsAvailable` and need no other change.
//
// Deliberately NOT done here:
//   - No invented products, prices or retailer names. src/data/mockDeals.ts
//     still holds five fabricated items attributed to real brands; that file
//     is what SHOW_DEAL_FEEDS=false exists to keep off the store.
//   - No scraping. Retailer terms forbid it, and affiliate commission has to
//     be attributed through a real tracking link to be paid at all.

/** One purchasable item, as returned by an affiliate network. */
export type Deal = {
  id: string;
  title: string;
  brand: string;
  /** Retailer the link resolves to, e.g. "ASOS". Never invented. */
  retailer: string;
  category: string;
  price: number;
  currency: string;
  /** Was this reduced from a higher price? Only set when the feed says so. */
  wasPrice?: number;
  imageUrl: string;
  /**
   * The affiliate tracking link. Must be the network's link, not the plain
   * retailer URL, or the sale is not attributed and no commission is paid.
   */
  affiliateUrl: string;
};

export type DealQuery = {
  /** Category names as used by the wardrobe, e.g. "Top", "Shoes". */
  categories?: string[];
  /** Free-text, used by the scan flow to match a photographed item. */
  search?: string;
  limit?: number;
};

export interface DealsProvider {
  /** Human-readable source name, shown in the UI for disclosure. */
  readonly networkName: string;
  fetchDeals(query: DealQuery): Promise<Deal[]>;
}

/**
 * Assign a real implementation here once a network approves the account and
 * its credentials are set as Supabase secrets. Everything downstream keys off
 * this being non-null, exactly as localPricing.ts does for Phase 5.
 */
export const provider: DealsProvider | null = null;

export const isDealsAvailable = provider !== null;

export async function fetchDeals(query: DealQuery = {}): Promise<Deal[]> {
  if (!provider) return [];
  return provider.fetchDeals(query);
}

/**
 * The FTC requires affiliate relationships to be disclosed, and every network
 * above makes it a condition of its terms. Any screen showing deals has to
 * render this somewhere visible, not bury it in a settings page.
 */
export const AFFILIATE_DISCLOSURE =
  'Flixit earns a commission on some purchases made through these links. ' +
  'It does not change the price you pay.';
