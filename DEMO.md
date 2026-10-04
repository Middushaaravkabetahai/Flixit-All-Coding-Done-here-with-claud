# Getting Flixit on your phone for a demo

**You do not need the App Store for this.** Store submission is a separate,
slower track with review queues and Google Play's 12-testers-for-14-days rule.
Showing the real app to family or to a buyer needs none of it. You can be
running on your own phone in about an hour, most of which is waiting for
Supabase.

---

## Part 1: One-time setup (about an hour)

Do this once. After that, starting the app takes ten seconds.

### 1. Supabase project

Create a free project at [supabase.com](https://supabase.com). Then in its
**SQL editor**, paste the whole of `supabase/schema.sql` and run it. That
creates the tables, the security rules, and the photo bucket.

### 2. Connect the app to it

```
cp .env.example .env
```

Open `.env` and paste in your project URL and anon key, both from
**Project Settings > API** in Supabase.

Until this is done the app shows an "Almost there" setup screen instead of
anything else. That is deliberate, not a bug.

### 3. Turn the scanner on

The scanning features call a server function so the API key never ships inside
the app. Both need deploying once:

```
supabase functions deploy identify-clothing-items
supabase functions deploy delete-account
supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
```

Get the key at [console.anthropic.com](https://console.anthropic.com). It is
separate from your Supabase keys, and it is a paid account: each scan costs a
fraction of a cent.

**Skip this and everything still works except the two scan flows**, which show
a clear error. For a buyer demo, do not skip it. The closet scan is the most
impressive thing the app does.

### 4. Put Expo Go on your phone

Install **Expo Go** from the App Store or Play Store. It is free, and it runs
your app without any of the submission process.

---

## Part 2: Every time you demo

```
npm install        # only after pulling new code
npx expo start
```

A QR code appears in the terminal.

- **iPhone:** open the Camera app, point it at the QR code, tap the banner.
- **Android:** open Expo Go and scan from inside it.

**Your phone and laptop must be on the same wifi.** If they are not, or the
network blocks it (school and some guest wifi do):

```
npx expo start --tunnel
```

Slower, but works from anywhere.

---

## Part 3: Before you show anyone

### Fill your closet with real clothes

This is the single thing that decides whether the demo lands. An empty closet
demos nothing, and a closet with three items looks like a prototype.

**Put 10 to 15 of your actual clothes in**, covering every slot: tops, bottoms,
outerwear, shoes, accessories. The Planner cannot build an outfit without at
least a top and a bottom, and it looks far better with real variety.

Use the closet scan to do it. Photographing one rack adds several items at once,
and it doubles as practice for demoing that feature.

### Have one item ready to scan live

Keep a single item of clothing next to you, something with a visible logo. The
live scan is the moment people react to, far more than any screenshot.

**But have the closet already populated as a fallback**, so if the scan is slow
or misreads the item you can move on without the demo collapsing.

---

## Part 4: The order to show it in

Do not walk through tabs in order. Tell the story.

1. **Say the problem first**, before touching the phone:
   > "You know how you've got a closet full of clothes and still feel like
   > you've got nothing to wear?"

   Everyone nods. Now they want to see the fix.

2. **Open Planner.** A complete outfit, built from clothes you own. Tap
   **Switch it up** so they see it is not a static picture.

3. **Open Closet.** This is where the outfit came from. Shows it is your real
   wardrobe, not stock images.

4. **Scan the item you brought.** The app identifies it. This is the wow moment.

5. **Then stop.** Do not keep tapping. Let them ask a question.

Total: under two minutes.

---

## What not to do

- **Do not show the Supabase dashboard or the code.** They are buying a
  product, not a repo.
- **Do not apologise for what is missing.** Nobody asked about the shopping
  feed. If they do, the honest answer is strong: "That needs affiliate
  approval, which needs a parent's account and a trading history. It is built
  and switched off until then."
- **Do not demo on a cold start.** Open the app once before they arrive so it
  is warm and you are already signed in.
- **Do not scan something with no logo** as your live demo item and then act
  surprised when the brand comes back blank. That is the app working correctly.

---

## If something breaks in front of them

The app has an error screen that offers **Try again**. Tap it. It re-renders
the screen that failed, so a dropped request usually recovers without
restarting anything.

If the whole thing is misbehaving, close Expo Go and re-scan the QR. That is a
fifteen-second recovery and looks like nothing.

---

## For the buyer conversation specifically

Keep the demo to the product. Everything about terms belongs in a separate
conversation with your dads present. See the standing guidance in `CLAUDE.md`:
nothing signed without a parent, no repo or Supabase access before written
terms, and find out whether they are proposing to buy, invest, or partner,
because those are three very different things.
