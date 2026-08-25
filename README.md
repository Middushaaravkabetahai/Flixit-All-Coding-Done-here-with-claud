# Flixit

Fashion-tech app for everyday fashion lovers and aspiring designers. See
`CLAUDE.md` for the full concept, feature list, and roadmap.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a Supabase project at [supabase.com](https://supabase.com), then
   run `supabase/schema.sql` in its SQL editor (Profiles, wardrobe items,
   swipes tables, RLS policies, and the `wardrobe-photos` storage bucket).
3. Copy `.env.example` to `.env` and fill in your Supabase project URL and
   anon key (Project Settings > API).
4. Start the app:
   ```
   npm run start   # then press w/i/a for web/iOS/Android
   ```
5. (Optional, for Phase 4 scanning) Deploy the vision edge function and set
   its secret so "Scan Closet" and "Scan & Price Match" work:
   ```
   supabase functions deploy identify-clothing-items
   supabase secrets set ANTHROPIC_API_KEY=sk-ant-...   # console.anthropic.com
   ```
   Everything else works without this step — the two scan flows just show a
   clear error until it's done.

## Current status: Phases 1-4

- **Auth**: email/password sign up/sign in, profile setup (display name,
  style tags) on first login
- **Wardrobe**: photograph a clothing item, tag it (category/color/brand),
  view your closet as a grid
- **Flixnder**: swipe on clothing deals (placeholder catalog for now),
  swipes are saved and feed into the FYP ranking
- **FYP**: re-ranks the deal catalog by your swipe history
- **Planner**: builds a daily outfit from your uploaded wardrobe items,
  with a "switch it up" re-roll
- **Scan Closet**: one photo of your closet → Claude vision detects each
  item → review/edit → bulk-add to your wardrobe (needs the edge function
  setup step above)
- **Scan & Price Match**: photograph a single item → Claude vision IDs it →
  mock price comparison online and nearby (both still placeholder data,
  same as the Flixnder deal catalog — see `CLAUDE.md`)

See `CLAUDE.md` for full status and what's next (Phase 5: real in-store
pricing, needs retailer partnerships).
