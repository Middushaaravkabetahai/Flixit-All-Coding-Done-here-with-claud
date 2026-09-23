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

**Current status: Phases 1–4 built and pushed. See Status below for what's real vs. placeholder.**

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
- Affiliate APIs: **the original three are no longer a viable plan.** Checked
  Sep 2026:
  - **ShopStyle Collective (Collective Voice) is shut down.** Links deactivated
    31 Mar 2026, final payouts 19 Jul 2026. Both dates have passed. Gone.
  - **Amazon PA-API was deprecated 15 May 2026** and stopped accepting new
    customers. Its replacement, the **Creators API, requires 10 qualified sales
    in the trailing 30 days before it grants access** — circular for us, since
    we need products to make sales. Amazon cannot be the first integration.
    Plain Associates links (no API) do work and are how the first sales get
    earned. Also: Associates requires the account holder to be **18+**, so a
    parent must register and own it.
  - **Rakuten is still open** but approves per advertiser and expects real
    traffic, which we do not have pre-launch.
  - **Realistic first source: Awin** (accepts a website or social handle, $1
    refundable deposit) or an aggregator like **Skimlinks / Sovrn Commerce**,
    which reach many networks through one integration and impose no sales
    threshold.
  - Seam is built: `src/lib/deals.ts` defines `DealsProvider` and exports
    `provider = null`, mirroring `localPricing.ts`. Implement it against
    whichever network approves first; nothing downstream changes.
- Clothing recognition (Phase 4): Claude API (vision) or Google Cloud Vision
- Outfit planner (Phase 3): rule-based first, then Claude API

**Marketing website — LIVE at https://flixit.info**
- Lives in `website/` — a single self-contained `index.html` (no build step,
  no framework).
- Hosted on **Netlify**, project `magenta-paletas-d3adc9`, deploying from
  `main` with build command EMPTY and publish directory `website`. Every push
  to `main` redeploys the live site automatically — no manual upload.
- DNS at GoDaddy: `A @ 75.2.60.5` and `CNAME www -> magenta-paletas-d3adc9.netlify.app`.
  HTTPS is a free auto-renewing Let's Encrypt cert from Netlify — never buy one.
- Netlify's build installs the mobile app's npm packages (root `package.json`)
  even though the site needs none. Harmless, just adds ~2 min to deploys.
- Was originally planned as Next.js on Vercel; a static page covers the
  pre-launch site fine, so that's deferred until it needs real signups or
  more than one page.

## Branding

- Domain: **`flixit.info` is registered and live.** Bought at GoDaddy,
  renews **Sep 13 2027 at $41.99/yr** (year one was ~$6) — decide before then
  whether to keep it, turn off auto-renew, or transfer somewhere cheaper. `flixit.com` was already taken (since 2003, unrelated business).
  `flixit.app` was the earlier plan for the app itself and is still free, but
  is not bought — don't assume it exists.
  Note on `.info`: the TLD carries some spam association, so if the brand ever
  outgrows it, budget for a move. Nothing about the site depends on the TLD.
- Tagline (from the flyer): "Your closet. Your style. Your next move."
  Hashtag candidates: `#YourNextMove` (recommended — the flyer's own
  payoff line, covers owning + wearing + buying), `#YourStyleYourCall`,
  `#FlixYourFit`. Avoid "closet"-only phrasings — they undersell the
  Flixnder/FYP/price-match half of the product.
- Note: there's an unrelated existing company also called "Flixit"
  (interactive/visual tech studio, Mumbai, founded 2013) — different
  industry, but worth a trademark sanity-check before leaning hard into
  the name commercially.
- Social handles: `flixit` itself is likely squatted — try `getflixit`,
  `useflixit`, or `flixitapp` on Instagram/TikTok instead.
- **Logo (current).** The primary mark is the **Flowing F**: an F with a
  garment-hanger hook curling off the top-left, drawn with a cursive lean and
  curved arms, single stroke weight 10 on a 120 grid. Construction notes and
  the reasons behind each constraint are in `brand/flixit-mark.svg`. A true
  calligraphic F was tried and rejected because at icon size a script capital
  loses its ascender and descender loops and reads as a lowercase t
  (`brand/script-f-study.html`).
- **No colour on the mark.** Ink on light, cream on dark, nothing else. The
  Sunset gradient files remain in `brand/` but are unused: the site has exactly
  one saturated element, the indigo call-to-action, and a coloured logo competes
  with it. White-ground variants exist for anywhere cream is wrong
  (`flixit-avatar-white.svg`, `flixit-mark-black-on-white.png`).
- **Wordmark: Bodoni Moda 600.** The brand name is set in the display serif;
  section headings stay Archivo. High-contrast serif needs near-zero tracking,
  not the negative tracking the grotesque wanted.
- **Sub-marks still need redrawing.** The five feature icons in
  `src/components/icons.tsx` and on the site are still geometric, from the old
  mark's era. Next to the flowing parent they no longer read as one family.
- **Sub-branding (future, not started)**: eventually each major feature —
  Planner, Scan & Price Match ("Scanner"), Flixnder, FYP, Wardrobe Scan —
  should get its own small logo/icon, the way big apps give sub-features
  their own mark (e.g. iMessage's individual app icons). Revisit once the
  main Flixit logo/identity is locked in — sub-marks should clearly read
  as "part of Flixit," not standalone brands.

## How to describe Flixit

Do not open with "it's a fashion app". It makes people picture shopping or
influencers, and the next minute goes on correcting them. Lead with the
problem, which everyone recognises instantly.

**One-liner (memorise this one):**
> You know how you have a closet full of clothes and still feel like you have
> nothing to wear? Flixit fixes that.

**The follow-up, when they ask how:**
> You photograph your closet once and it works out what you own. Then every
> day it puts an outfit together from things already in there. And when you
> are out shopping you can scan something and it tells you whether it is
> cheaper online.

**The line that settles the "is it fashion or not" confusion:**
> It's a closet app, not a shopping app. Most fashion apps exist to sell you
> more clothes. Flixit is the opposite: it's about getting more out of the
> ones you already bought.

**Thirty seconds, for a judge, an investor or the agency:**
> The average person wears about twenty percent of what they own. The rest
> sits there because getting dressed is a decision you make in three minutes
> while half asleep, and it is easier to reach for the same thing again.
> Flixit scans your closet, learns what is in it, and hands you a finished
> outfit every morning from clothes you already paid for. When you do buy
> something new, you scan it in the shop and we check the price online first.
> Two founders, built it ourselves, launching on iOS and Android in October.

**Instagram bio length:**
> Your closet, sorted. Daily outfits from clothes you already own.

Never say "AI-powered wardrobe intelligence" or "personalised fashion
discovery". Those are four buzzwords doing the job of one sentence, and they
make a real product sound generated. Say what it does in the words a person
would use.

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
- **Phase 4 (Smart Scanning) — built, needs one manual setup step**:
  - Whole-closet scan: "Scan Closet" button in Wardrobe (`app/scan-closet.tsx`)
    takes one photo, Claude vision identifies each item, you review/edit
    category/color/brand per item, then bulk-save. All detected items from
    one photo share that source image (no per-item cropping yet).
  - Scan & Price Match tab (`app/(tabs)/scan.tsx`): photograph a single item,
    Claude vision identifies it, shows mock online prices (placeholder, same
    affiliate-API dependency as Phase 2) and mock nearby-store prices
    (placeholder — real in-store pricing is the Phase 5 stretch goal, no data
    source exists for it yet at all).
  - Both scan flows call a Supabase Edge Function
    (`supabase/functions/identify-clothing-items`) that does the actual
    Claude vision call server-side, so the API key never ships in the app.
    **Needs a one-time setup step before scanning works**: deploy the
    function (`supabase functions deploy identify-clothing-items`) and set
    `supabase secrets set ANTHROPIC_API_KEY=sk-ant-...` (get a key at
    console.anthropic.com — separate from the Supabase keys). Until that's
    done, both scan flows show a clear error instead of crashing.
- **Phase 5 (Local Price Matching) — blocked on partnerships, seam built**:
  `src/lib/localPricing.ts` defines the `LocalPricingProvider` interface and
  exports `provider = null`. The Scan tab reads `isLocalPricingAvailable`
  and shows an honest "Coming soon" block instead of nearby prices. When a
  retailer data deal exists, implement the interface, assign `provider`, and
  the UI lights up with no other changes. Deliberately NOT added yet: device
  location (asking for location permission for a feature that returns
  nothing is an App Store review risk — add `expo-location` together with a
  real provider).
- **Account deletion — built (store requirement cleared).** Profile tab has a
  "Delete account" link behind a type-DELETE-to-confirm modal. It calls the
  `delete-account` Edge Function, which identifies the caller from their JWT
  (never from the request body), clears `wardrobe-photos/<userId>/` in Storage,
  then deletes the `auth.users` row — which cascades to `profiles`,
  `wardrobe_items` and `swipes`. Storage goes first on purpose: if it fails the
  account is still intact and the user can retry, rather than being left with
  orphaned files nobody can reach. **Needs the same one-time deploy step as the
  scan function**: `supabase functions deploy delete-account` (no secrets to
  set — `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are injected
  automatically).
- **Placeholder content — WAS the submission blocker, now flagged off.**
  `src/data/mockDeals.ts` is 5 invented products with real brand names
  (Nike/Zara/ASOS/H&M) and made-up prices. Apple rejects placeholder content
  under guideline 2.1, and attributing invented prices to real retailers is its
  own problem. Since that can only be fixed by affiliate approval we don't
  control, **v1 ships without it**: `src/config/features.ts` exports
  `SHOW_DEAL_FEEDS = false`, which
  - drops the FYP and Flixnder tabs from the tab bar (`href: null`, routes stay
    registered) and redirects both routes to the Closet, and
  - replaces the Scan tab's fake online prices with a real Google Shopping
    search for whatever the scan identified — honest, and actually useful.
  Nothing is deleted; both screens still work. **To restore: put live listings
  in `mockDeals.ts`, flip `SHOW_DEAL_FEEDS` to `true`.** That's the whole change.
  So v1 = Closet, Planner, Scan, Profile — four tabs, every one backed by real
  data.
- **Privacy policy — now hosted, which unblocks submission.** Both stores
  require a publicly reachable privacy policy URL before you can submit, and it
  previously existed only as `legal/privacy-policy.md` in the repo. It is now
  published at **https://flixit.info/privacy/** (`website/privacy/index.html`),
  linked from the site footer and from the Profile tab in the app. When the
  policy changes, edit the markdown and regenerate the page; the two must not
  drift, and the store data-safety forms have to match both.
- **Password reset — built.** `app/(auth)/forgot-password.tsx` sends a Supabase
  recovery email; `app/(auth)/reset-password.tsx` is where the deep link lands
  (`flixit://reset-password`, via the `scheme` in app.json). Without it a
  forgotten password locked someone out of their closet permanently. The
  confirmation wording is identical whether or not the address exists, so the
  screen cannot be used to discover which emails are registered.
- **Cleanup pending:** GoDaddy auto-created a WebsiteBuilder "Launching Soon"
  site on this domain. It's been overridden by the DNS change but still exists
  under GoDaddy > Website. Delete it, or GoDaddy may re-add its own `A` record
  later and knock the site offline.
- The website screenshots in `website/screenshots/` were captured in a sandbox
  where the image host was unreachable, so the clothing tiles are empty grey
  boxes. Retake them on a real device with real clothes — they're also needed
  for the App Store listing.
- Git push: earlier sessions hit `403` on the git proxy and worked around it
  with a personal access token remote. That has since resolved — pushing to
  `origin` works normally now.

## Dates, team, and outside interest

- **Build complete: Oct 5–10 2026.** **Launch: Oct 20 2026 or later.** Oct 5 is
  NOT launch day — it's the start of the finish-the-build window, deliberately
  ahead of launch to leave room for review and fixes. The launch date can move
  if needed; as of Sep 2026 it isn't expected to.
- Founders are both **16** as of Sep 2026 (Maahit turns 17 first). Two
  consequences: every youth competition worth entering caps at 18, so they're
  eligible for the Jan/Feb 2027 round *and* the 2028 one — this year isn't
  all-or-nothing. And they are minors, which is why the contract caution below
  matters rather than being boilerplate.
- Founders are in **Fremont, CA** (Alameda County, East Bay). Relevant because
  the free mentoring networks there — SCORE San Francisco & East Bay, SCORE
  Silicon Valley — are staffed by actual tech operators, not just retired local
  retailers.
- **An agency found through personal connections has expressed interest** in
  buying and/or scaling the app internationally, conditional on judging it
  worth it. Nothing agreed, no terms seen. Standing guidance recorded here so
  no session loses it:
  - **Both fathers are involved in the conversation** — the signatory problem is
    handled. Both founders are 16 and a contract with a minor is generally
    voidable in California, so parent involvement is what makes any agreement
    enforceable rather than theoretical. Nothing gets signed, NDA included,
    without them reading it.
  - Parents cover "can we sign / are we protected". They don't automatically
    cover "is this a good number" — if a written offer appears, budget an hour
    with a startup/IP attorney and a second read from a SCORE mentor who has
    sold a company.
  - **Do not hand over repo, Supabase, or domain access before written terms.**
    Those accounts *are* the company right now.
  - Establish which of these is actually on the table — acquisition,
    investment, or a paid/equity build partnership. They are very different.
  - Launching first raises the price: pre-launch with zero users is the weakest
    possible negotiating position, so the Oct 20 date serves this too.

## Workflow

- Branch: `claude/flixit-features-overview-mxin9i` (or whatever the active
  session's designated branch is) — all work happens there, PR into `main`.
- Shaarav and Maahit each run Claude Code (desktop or web) pointed at this
  same GitHub repo. Work on different features, merge via GitHub as normal.
- This file is the single source of truth for scope — update it when the
  plan changes so every session (and teammate) stays in sync.
