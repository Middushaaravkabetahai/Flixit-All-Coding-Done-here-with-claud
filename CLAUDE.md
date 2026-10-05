# Flixit

A closet app, not a shopping app. Photograph your wardrobe once, get a daily
outfit built from clothes you already own, and check prices before you buy
anything new. See "How to describe Flixit" below for the wording that works;
do not open with "fashion app".

**Demoing before launch: see `DEMO.md`.** Running on a real phone via Expo Go
needs no store submission at all, so a family or buyer demo is available weeks
before the stores are. The two tracks are independent; do not let store review
hold up a pitch.

Team: Shaarav + Maahit lead, Claude Code assists. Read this file at the start
of every session — it's the durable plan so no context is lost between
sessions/environments.

**Before writing any Expo code, also read `AGENTS.md`** — Expo's scaffold
flags that the SDK has changed recently and the versioned docs at
docs.expo.dev must be checked before writing code.

## Features

**Shipping in v1 (Oct 2026): 3, 5 and the Profile tab. Features 1, 2 and 4
are built but hidden behind `SHOW_DEAL_FEEDS=false` — see Status.**

| # | Feature | v1? | Description |
|---|---------|-----|-------------|
| 1 | Style FYP | hidden | Pinterest-style discovery feed showing curated deals matching personal style, based on wardrobe scan + activity. |
| 2 | Flixnder | hidden | Tinder-style swipe on clothes. Swipe right on items you like; surfaces best prices and retailer options. |
| 3 | Scan & Price Match | YES | Scan an item in person to compare prices online and at nearby stores in real time. |
| 4 | Unified Personalization | hidden | Everything scanned/swiped/saved feeds back into the FYP for continuous tailoring. |
| 5 | Flixit Wardrobe Scan | YES | Flagship feature. Photograph your closet, get a daily outfit planner from clothes you own. "Switch it up" button for alternatives. |

## MVP Roadmap

- **Phase 1 — Foundation**: user accounts, profile setup, manual wardrobe upload (photograph + tag items: type, color, brand). No AI scanning yet.
- **Phase 2 — Flixnder + Deals Feed**: swipe interface pulling from an affiliate network. Swipes train a preference profile. Simple FYP feed. Revenue starts here (affiliate links). **The networks originally named here are obsolete — see Tech Stack. Hidden in v1.**
- **Phase 3 — Outfit Planner**: daily outfit suggestions from uploaded closet, rule-based first (color/weather/occasion), "switch it up" button.
- **Phase 4 — Smart Scanning**: computer vision for whole-closet scan and in-store item scan/price-match.
- **Phase 5 — Local Price Matching**: in-mall/in-store comparison. Needs retailer data partnerships — stretch goal.

**Current status (1 Oct 2026): Phases 1-4 built and pushed; Phase 5 is a seam
only. v1 ships four tabs (Closet, Planner, Scan, Profile), each backed by real
data. The build window is NOW: Oct 5-10, launch Oct 20.**

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
  - **Awin signup, when a parent does it:** awin.com > Publishers > Sign up.
    Requires 18+, a card for the small refundable deposit (identity check, not
    a fee; refunded at first payout), and tax plus bank details. Promotional
    URLs are flixit.info and the Instagram handle. Approval usually inside 24
    hours on a weekday. The application asks how you promote products; vague
    answers get rejected. Say that Flixit is a mobile app launching Oct 2026,
    users build a digital closet and get daily outfits, products are surfaced
    in-app with affiliate links clearly disclosed, traffic comes from the app
    and flixit.info, and explicitly that **we are not a coupon or cashback site
    and do not bid on advertiser brand terms** — those two are the most common
    rejection reasons.
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
- **Sub-marks — redrawn to match the Flowing F (Oct 2026).** The five feature
  icons were geometric, from the old mark's era. They now borrow the parent's
  traits: scan-bracket corners turn on a radius-4 arc instead of folding at a
  right angle, the FYP tiles carry the same forward `skewX(-6)` as the parent's
  stem, the Planner's rail and tick lift to the right the way both arms do, and
  the Wardrobe hanger uses the parent's own hook. Verified legible at 26px and
  18px, and on dark.
  Two things were tried and rejected, recorded in `brand/icons/_family-rules.md`
  so they are not re-opened: a hook on the price tag (it collided with the tag
  body and blobbed at 26px, breaking the parent's own rule that the hook must
  curl away), and redrawing the set as single flowing strokes to match the
  parent literally — wrong goal, since these are pictograms read at 26px next
  to a word, not a monogram seen large and alone. They are siblings of the F,
  not copies of it.
  **The same geometry lives in three files and drifts silently**
  (`brand/icons/*.svg`, `src/components/icons.tsx`, `website/index.html`).
  `npm run icons:check` compares all three and fails if they disagree; it is
  part of `npm run check`.
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
  (`src/data/mockDeals.ts`) is 5 hardcoded items, not live listings. Needs an
  approved affiliate network account, which only a parent can open (18+). See
  Tech Stack for why the three originally planned networks no longer work, and
  `src/lib/deals.ts` for the seam that is already in place.
- **Phase 3 (Outfit Planner) — built**: rule-based daily outfit planner
  (`app/(tabs)/planner.tsx`) groups your wardrobe by category and picks one
  item per slot, with a "switch it up" re-roll. No AI yet, per plan.
  Two bugs here were found and fixed by running it, and both would have shown
  up in a demo:
  - **"Switch it up" used to deal the same outfit back.** Each slot was picked
    with `Math.random()` and no memory of the last pick, so on an 8-item closet
    12.7% of taps changed nothing at all and any individual slot stuck half the
    time. `buildOutfit(items, { avoid })` now excludes the current item from
    every slot that owns more than one, so a tap always visibly changes
    something. Where no slot can change, the button is replaced with a line
    telling you to add a second top or bottom, rather than sitting there doing
    nothing.
  - **"Today's Fit" was not daily.** It rebuilt at random on every tab focus,
    so the outfit changed each time you looked away. It is now seeded from
    `dailySeed(userId)` — the user id plus the **local** date, since a UTC day
    boundary falls mid-evening in California — so it is stable all day and
    rolls over at local midnight. A re-roll survives navigating away;
    `builtFrom` tracks the closet contents so it only rebuilds when the day or
    the closet actually changes.
  - Both are covered by `src/lib/outfitPlanner.test.ts`.
- **Phase 4 (Smart Scanning) — built, needs one manual setup step**:
  - Whole-closet scan: "Scan Closet" button in Wardrobe (`app/scan-closet.tsx`)
    takes one photo, Claude vision identifies each item, you review/edit
    category/color/brand per item, then bulk-save. All detected items from
    one photo share that source image (no per-item cropping yet).
  - Scan & Price Match tab (`app/(tabs)/scan.tsx`): photograph a single item,
    Claude vision identifies it, then offers a real Google Shopping search for
    what it found. The invented prices that used to sit here are gone, replaced
    under `SHOW_DEAL_FEEDS=false`. Nearby-store pricing shows an honest "coming
    soon" block: that is the Phase 5 stretch goal and no data source exists for
    it yet.
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
- **App icons — replaced (was a guaranteed rejection).** `assets/icon.png` was
  still the Expo scaffold artwork: a blue chevron on pale blue with the
  construction guides visible, and the Android adaptive background was Expo's
  `#E6F4FE`. All six assets are now generated from the Flowing F. Three traps
  worth remembering if they are ever regenerated:
  - **iOS rejects icons with an alpha channel.** `icon.png` must be flattened
    to RGB or the build fails with an unhelpful error.
  - **Android crops adaptive icons.** The launcher applies its own mask and
    only the centre ~66% is guaranteed visible, so the mark sits at 50% of the
    canvas. Verified by compositing a circular mask, not by assuming.
  - **A monochrome layer is required** for Android themed icons, or Android
    generates a poor one from the foreground.
- **Bundle identifiers set:** `info.flixit.app` for both iOS `bundleIdentifier`
  and Android `package`, with scheme `flixit`. Both stores need these before a
  build can be submitted, and **the bundle ID is permanently tied to the App
  Store listing once used** — changing it later means a new listing.
- **Error boundary — added.** `app/_layout.tsx` exports `ErrorBoundary`, which
  Expo Router picks up by name; being on the root layout it catches anything
  thrown anywhere in the app. Without it one unhandled error leaves a release
  build on a blank screen with no way out but force-quitting. `retry` re-renders
  the route that threw, so a dropped request recovers without a restart. The raw
  error message is shown on purpose: it turns "it broke" into a screenshot that
  can be acted on.
- **Store listing copy — written, see `store-listing.md`.** App name, subtitle,
  short and full descriptions, keywords, category, age rating, the data-safety
  table and reviewer notes, all inside the character caps (verified by counting,
  not estimating). Two things still have to be filled in by hand before
  submitting: **a real demo account with items already in it**, and the four
  screenshots. An account-gated app the reviewer cannot sign into is one of the
  most common rejections.
- **Conventions worth keeping:**
  - **Never write `{someString && <Element/>}` in a React Native screen.** An
    empty string is falsy but still renders, and a text node inside a `View`
    throws on native. Use `Boolean(...)`. Fixed in the Closet and Planner after
    it surfaced while running the app locally.
  - **Blank form fields are stored as `null`, never `''`.** The add-item form
    converts with `|| undefined`. Anything that inserts wardrobe rows must do
    the same or the Closet tab breaks.
  - **Never call `Linking.openURL` directly — use `openExternal`
    (`src/lib/openExternal.ts`).** `openURL` returns a promise that rejects
    when nothing can handle the URL, so called bare the tap does nothing at all
    and the rejection goes unhandled. `openExternal` catches it and tells the
    user. It matters most on the privacy policy link, which App Review taps,
    and on the Scan tab's price search, which is that tab's whole payoff.
    `Alert.alert` is a no-op on react-native-web, so the helper falls back to
    `window.alert` there.

- **Tests — `npm test`, no framework and no build step.** Node runs the
  TypeScript directly (`node --test "src/**/*.test.ts"`), and `import type` is
  erased, so a test can use the `WardrobeItem` type without dragging Supabase
  into the test process. `npm run check` is typecheck plus tests, and is what to
  run before pushing. This needs `allowImportingTsExtensions` and
  `types: ["node", "react"]` in tsconfig: Expo's base config sets
  `customConditions: ["react-native"]`, under which TypeScript silently skips
  `node:`-prefixed imports and reports the unhelpful "looks like an absolute
  URI". Adding the explicit `types` array was verified not to weaken the app's
  own typechecking — a deliberate type error still fails `tsc`.

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

## Gotchas when working in this sandbox

Each of these cost time once. None is obvious from the code.

- **Google Fonts do not render in headless Chrome here.** The CSS and the woff2
  files fetch fine with curl, but Chrome silently ignores the `<link>`, so
  everything falls back to DejaVu. Several brand exports were rendered in the
  wrong typefaces before this was caught. **Verify by measuring**, not by eye:
  render the same string in the intended family and in a deliberately
  nonexistent one and compare widths. If they match, the font did not load. The
  fix is to base64-inline the latin subsets as `@font-face` rules; the flyer and
  story sources already do.
- **`--window-size` includes window chrome.** A screenshot at `--window-size=
  850,1100` captures a 1013px-tall viewport and silently crops the bottom 87px.
  This looked exactly like a broken CSS layout and was chased as one for three
  rounds. Probe `window.innerHeight` before concluding anything about layout.
- **The live site is unaffected by both of the above.** Real browsers load fonts
  normally. Only locally rendered assets were ever wrong.
- **`currentColor` inherits link colour.** The mark uses `currentColor` so it
  flips ink/cream automatically, but inside an `<a>` it picks up the link
  colour and turned indigo on the privacy page. Any nav wrapping the mark in a
  link needs an explicit colour.
- **Running the app locally needs Supabase stubs.** There are no credentials in
  the sandbox, so the app shows its "Almost there" setup gate. Stub
  `isSupabaseConfigured`, and for populated screens also `AuthContext` and
  `listWardrobeItems`. **Back the files up first and restore from the backup,
  and verify with a search that no stub survived** — `git checkout --` discards
  any real edit made in the same file since.

## Workflow

- Branch: `claude/flixit-features-overview-5q0oah` (or whatever the active
  session's designated branch is) — all work happens there, PR into `main`.
- Shaarav and Maahit each run Claude Code (desktop or web) pointed at this
  same GitHub repo. Work on different features, merge via GitHub as normal.
- This file is the single source of truth for scope. Update it when the plan
  changes so every session, and every teammate, stays in sync.

## Left before launch

**Needs Shaarav or Maahit (cannot be done from here):**
- Retake app screenshots on a real phone with real clothes. Needed for the
  store listings and for `website/screenshots/`, which are still grey boxes.
- `supabase functions deploy identify-clothing-items` and
  `supabase functions deploy delete-account`, plus
  `supabase secrets set ANTHROPIC_API_KEY=...`. Until then scanning and account
  deletion show an error instead of working.
- Open the Awin account (a parent, 18+). Starts a clock that cannot be shortened.
- Delete the GoDaddy WebsiteBuilder site.
- Apple Developer and Google Play accounts. **Google Play requires 12 testers
  for 14 days** for new personal developer accounts, so this has to start well
  before Oct 20.

**Still to do in the repo:**
- Nothing blocking. The sub-marks are redrawn, the planner bugs are fixed, and
  `npm run check` (typecheck + tests + icon drift) passes clean.
