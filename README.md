# Flixit
Flixit is a fashion app that scans your wardrobe and connects you to the best deals on clothes, online and in person.

- **FYP** — a Pinterest-style feed of deals matched to your style
- **Flixnder** — swipe left/right on clothes, then see where to buy the best price
- **Scan & Price Match** — scan an item in a store to compare prices nearby and online
- **Wardrobe Scan** — photograph your closet and get a daily outfit planner from what you already own

This repo is the mobile app (iOS/Android/web), built with Expo + React Native + Supabase. It's a single codebase — `npm run web` runs the same app in a browser.

## Current status: Phase 1 (Foundation)

What's built so far:

- Sign up / sign in (Supabase Auth)
- Profile setup (name + style preferences)
- Manual wardrobe upload — take/pick a photo, tag it (category, color, brand, notes), see it in a grid
- Tab navigation shell for Wardrobe, FYP, Flixnder, Profile (FYP and Flixnder are placeholders — Phase 2)

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Set up Supabase (free tier is fine)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to the SQL Editor and run everything in [`supabase/schema.sql`](./supabase/schema.sql) — this creates the `profiles` and `wardrobe_items` tables, row-level security policies, and the `wardrobe-photos` storage bucket
3. Go to Project Settings -> API, copy the Project URL and `anon` public key
4. Copy `.env.example` to `.env` and paste them in:

```bash
cp .env.example .env
```

### 3. Run the app

```bash
npm start        # opens Expo dev tools, scan the QR code with Expo Go
npm run web       # runs in the browser
npm run ios       # requires macOS + Xcode
npm run android   # requires Android Studio
```

## Project structure

```
src/
  app/                 # expo-router file-based routes
    (auth)/             # sign-in, sign-up, profile-setup (shown when logged out / no profile)
    (tabs)/              # wardrobe, fyp, flixnder, profile (the main app)
    add-item.tsx         # modal for adding a wardrobe item
    _layout.tsx           # auth-gated root navigator
  components/          # shared UI (ThemedText, ThemedView, MainTabs, ...)
  lib/
    supabase.ts          # Supabase client
    auth-context.tsx      # auth state (session, profile) via React context
    wardrobe.ts            # upload photo + save/fetch wardrobe items
  types/                # shared TypeScript types
supabase/
  schema.sql            # DB tables, RLS policies, storage bucket setup
```

## Roadmap

| Phase | What |
|---|---|
| 1 — Foundation | Accounts, profile setup, manual wardrobe upload *(this repo, in progress)* |
| 2 | Flixnder swipe UI + deals feed via affiliate APIs |
| 3 | Rule-based outfit planner from your wardrobe |
| 4 | Computer vision: scan a whole closet, scan in-store items |
| 5 | Real-time local price matching (needs retailer partnerships) |

## Tech stack

- **App**: React Native + Expo, TypeScript, Expo Router
- **Backend**: Supabase (Postgres, Auth, Storage)
- **Deals data (Phase 2+)**: affiliate APIs (ShopStyle Collective, Rakuten, Amazon Associates)
file_path: /home/user/Flixit-/README.md
