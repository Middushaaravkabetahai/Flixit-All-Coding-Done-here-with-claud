# Flixit

Fashion-tech app for everyday fashion lovers and aspiring designers. Scans your
wardrobe, learns your style, and connects you to the best deals — online and
in person.

Team: Shaarav + Maahit lead, Claude Code assists. Read this file at the start
of every session — it's the durable plan so no context is lost between
sessions/environments.

**Before writing any Expo code, also read `AGENTS.md`** — Expo's scaffold
flags that the SDK has changed recently and the versioned docs at
docs.expo.dev must be checked before writing code.

## Features

| # | Feature | Description |
|---|---------|-------------|
| 1 | Style FYP | Pinterest-style discovery feed showing curated deals matching personal style, based on wardrobe scan + activity. |
| 2 | Flixnder | Tinder-style swipe on clothes. Swipe right on items you like; surfaces best prices and retailer options. |
| 3 | Scan & Price Match | Scan an item in person to compare prices online and at nearby stores in real time. |
| 4 | Unified Personalization | Everything scanned/swiped/saved feeds back into the FYP for continuous tailoring. |
| 5 | Flixit Wardrobe Scan | Flagship feature. Photograph your closet, get a daily outfit planner from clothes you own. "Switch it up" button for alternatives. |

## MVP Roadmap

- **Phase 1 — Foundation**: user accounts, profile setup, manual wardrobe upload (photograph + tag items: type, color, brand). No AI scanning yet.
- **Phase 2 — Flixnder + Deals Feed**: swipe interface pulling from affiliate APIs (Amazon Associates, ASOS, ShopStyle, Rakuten). Swipes train a preference profile. Simple FYP feed. Revenue starts here (affiliate links).
- **Phase 3 — Outfit Planner**: daily outfit suggestions from uploaded closet, rule-based first (color/weather/occasion), "switch it up" button.
- **Phase 4 — Smart Scanning**: computer vision for whole-closet scan and in-store item scan/price-match.
- **Phase 5 — Local Price Matching**: in-mall/in-store comparison. Needs retailer data partnerships — stretch goal.

**Current status: Phases 1–3 built and pushed. See Status below for what's real vs. placeholder.**

## Tech Stack

**Mobile app (iOS + Android + Web)**
- React Native + Expo (single codebase, Expo also exports web)
- TypeScript
- Expo Router (navigation)
- NativeWind (Tailwind for RN) — optional, not yet wired in
- Swipe cards: custom component using core `Animated` + `PanResponder`
  (no extra native deps, works on web too) — `src/components/SwipeCard.tsx`

**Backend**
- Supabase (Postgres + auth + storage) for MVP — no custom server needed yet
- Supabase Edge Functions (TypeScript) for custom logic (deals fetching, outfit planner)
- Supabase Storage for wardrobe photos

**Data & AI**
- Affiliate APIs: ShopStyle Collective, Rakuten, Amazon Associates
- Clothing recognition (Phase 4): Claude API (vision) or Google Cloud Vision
- Outfit planner (Phase 3): rule-based first, then Claude API

**Marketing website**
- Next.js on Vercel, separate simple project for landing page + email signups

## Status / Known Issues

- **Phase 1 (Foundation) — built**: email/password auth, profile setup
  (display name + style tags) on first login, manual wardrobe upload
  (photograph + tag category/color/brand) backed by Supabase Storage +
  Postgres.
- **Phase 2 (Flixnder + Deals Feed) — partially built**: swipe UI, swipe
  persistence (`swipes` table), and FYP re-ranking by category preference
  all work end to end. What's still placeholder: the deal catalog itself
  (`src/data/mockDeals.ts`) is 5 hardcoded items, not live listings — needs
  real affiliate API keys (ShopStyle/Rakuten/Amazon Associates) from
  Shaarav/Maahit before it can be swapped in.
- **Phase 3 (Outfit Planner) — built**: rule-based daily outfit planner
  (`app/(tabs)/planner.tsx`) groups your wardrobe by category and picks one
  item per slot, with a "switch it up" re-roll. No AI yet, per plan.
- **Phase 4/5 — not started.**
- `git push` over the direct git proxy in this environment returns `403`
  (GitHub App installed but without write access). Workaround in use: a
  short-lived personal access token supplied by the user, added as a
  second git remote (`token-origin`) — push there instead of `origin`
  until the underlying GitHub App permission issue is fixed properly.

## Workflow

- Branch: `claude/flixit-features-overview-mxin9i` (or whatever the active
  session's designated branch is) — all work happens there, PR into `main`.
- Shaarav and Maahit each run Claude Code (desktop or web) pointed at this
  same GitHub repo. Work on different features, merge via GitHub as normal.
- This file is the single source of truth for scope — update it when the
  plan changes so every session (and teammate) stays in sync.
