# Flixit

A closet app, not a shopping app. Photograph your wardrobe once, get a daily
outfit built from clothes you already own, and check prices before you buy
anything new.

**To see what it looks like without running it, open
[`preview/flixit-screens.png`](preview/flixit-screens.png)** — every screen on
one sheet, captured from the running app.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a Supabase project at [supabase.com](https://supabase.com), then
   run `supabase/schema.sql` in its SQL editor (profiles, wardrobe items,
   swipes tables, RLS policies, and the `wardrobe-photos` storage bucket).
3. Copy `.env.example` to `.env` and fill in your Supabase project URL and
   anon key (Project Settings > API). Until this is done the app shows a
   setup screen instead of signing in.
4. Start the app:
   ```
   npm run start   # then press w/i/a for web/iOS/Android
   ```
5. Deploy the two edge functions and set the API key, so scanning and account
   deletion work:
   ```
   supabase functions deploy identify-clothing-items
   supabase functions deploy delete-account
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   # console.anthropic.com
   ```
   Everything else works without this step. The two scan flows and the delete
   button show a clear error until it is done.

## What v1 ships

Four tabs, each backed by real data:

- **Closet** — photograph a clothing item, tag it (category/color/brand), see
  your wardrobe as a grid. "Scan Closet" adds several items from one photo via
  Claude vision.
- **Planner** — builds a daily outfit from your own items, with a "switch it
  up" re-roll. Rule-based, no AI yet.
- **Scan** — photograph an item, Claude vision identifies it, then offers a
  real shopping search for it.
- **Profile** — display name, style tags, privacy policy, sign out, and
  account deletion.

Auth is email/password with password reset, and profile setup on first login.

## Built but hidden in v1

**Flixnder** (swipe on clothes) and the **Style FYP** (a feed ranked by your
swipes) both work end to end, but the catalog behind them is placeholder data.
They are switched off by `SHOW_DEAL_FEEDS = false` in `src/config/features.ts`
until a real affiliate feed exists. Flip that one constant to bring them back.

`store-listing.md` has the App Store and Play Store copy.
