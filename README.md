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

## Current status: Phases 1-3

- **Auth**: email/password sign up/sign in, profile setup (display name,
  style tags) on first login
- **Wardrobe**: photograph a clothing item, tag it (category/color/brand),
  view your closet as a grid
- **Flixnder**: swipe on clothing deals (placeholder catalog for now),
  swipes are saved and feed into the FYP ranking
- **FYP**: re-ranks the deal catalog by your swipe history
- **Planner**: builds a daily outfit from your uploaded wardrobe items,
  with a "switch it up" re-roll

See `CLAUDE.md` for what's next (Phase 4: real affiliate listings + smart
scanning).
