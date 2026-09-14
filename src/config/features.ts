/**
 * Feature flags for what ships in v1.
 *
 * These exist for one reason: App Store Review Guideline 2.1 rejects apps
 * containing placeholder or demo content, and separately, showing invented
 * prices next to real retailer names (Nike, Zara, ASOS, H&M) is its own
 * problem regardless of Apple. See src/data/mockDeals.ts.
 *
 * Nothing is deleted. The FYP and Flixnder screens are finished and working —
 * swipe persistence and preference re-ranking both run end to end. They are
 * only hidden, because the deal catalog behind them is fake and we can't fix
 * that by writing code: it needs affiliate API approval (ShopStyle, Rakuten,
 * Amazon Associates), which is somebody else's queue and not on our schedule.
 *
 * TO TURN THEM BACK ON, once real affiliate listings are wired up:
 *   1. Replace MOCK_DEALS in src/data/mockDeals.ts with live listings.
 *   2. Flip SHOW_DEAL_FEEDS to true here.
 * That's the whole change — the screens, tabs and routing come back on their own.
 */

export const SHOW_DEAL_FEEDS = false;
