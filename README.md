# Flixit

Fashion-tech app for everyday fashion lovers and aspiring designers. See
`CLAUDE.md` for the full concept, feature list, and roadmap.

## Setup

1. Install dependencies:
   ```
   npm install
   ```
2. Create a Supabase project at [supabase.com](https://supabase.com), then
   run `supabase/schema.sql` in its SQL editor (Profiles + wardrobe items
   tables, RLS policies, and the `wardrobe-photos` storage bucket).
3. Copy `.env.example` to `.env` and fill in your Supabase project URL and
   anon key (Project Settings > API).
4. Start the app:
   ```
   npm run start   # then press w/i/a for web/iOS/Android
   ```

## Current status: Phase 1 (Foundation)

- Email/password auth (sign up, sign in)
- Profile setup (display name, style tags) on first login
- Manual wardrobe upload: photograph an item, tag it (category/color/brand),
  view your closet as a grid

See `CLAUDE.md` for what's next (Phase 2: Flixnder + deals feed).
