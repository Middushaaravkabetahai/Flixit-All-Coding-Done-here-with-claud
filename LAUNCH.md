# Getting Flixit onto the App Store and Google Play

Written 11 Oct 2026. Work top to bottom — later steps are blocked by earlier
ones. **S/M** = Shaarav or Maahit can do it. **Parent** = legally cannot be
done by a 16-year-old.

---

## Read this before anything else

**Both stores require the account holder to be 18.** This is contract law, not
a guideline, and there is no way around it:

- **Apple Developer Program** — $99/year. Requires the legal age of majority
  (18 in California, where Apple is based).
- **Google Play Console** — $25 one time. States 18+ outright, and verifies
  with a government ID and a card **in the account holder's own name**.
  Prepaid cards are rejected.

So a parent registers, owns and is legally responsible for both accounts, the
same as with Awin. Nothing below starts until that is done.

**Android cannot launch on 20 Oct.** A personal Play account created after
13 Nov 2023 cannot publish to production until a closed test has run with
**12 testers opted in for 14 continuous days**. The 14 days only begin once the
closed-test build has cleared Google's review. Starting today that lands in
early November at the earliest.

There is one way out: **organization accounts with a D-U-N-S number are exempt
from the 12-tester rule.** A D-U-N-S number is free from Dun & Bradstreet but
takes days to weeks to issue. Decide this in the next day or two — it is the
difference between Android in October and Android in November.

**iOS has no equivalent rule.** App Review is usually 24–48 hours, so iOS can
still make 20 Oct. The recommendation is to ship iOS on time and let Android
follow rather than slipping both.

---

## 1. Accounts — do these first, they start clocks

- [ ] **Parent** — Apple Developer Program at developer.apple.com/programs.
      $99/yr, needs their Apple ID, legal name and payment. Approval is
      usually 24–48h but can take longer if Apple asks for ID.
- [ ] **Parent** — decide **personal or organization** for Google Play.
      Organization skips the 12-tester rule but needs a D-U-N-S number first.
- [ ] **Parent** — Google Play Console at play.google.com/console/signup.
      $25 once, government ID and a non-prepaid card in their name.
- [ ] **S/M** — free Expo account at expo.dev (this one has no age limit).

## 2. Make the app actually work — do while accounts are pending

- [ ] **S/M** — deploy the edge functions and set the key:
      ```
      supabase functions deploy identify-clothing-items
      supabase functions deploy delete-account
      supabase secrets set ANTHROPIC_API_KEY=sk-ant-...
      ```
      **Not optional.** Until this is done, both scan flows and account
      deletion show an error, and a reviewer will tap Scan.
- [ ] **S/M** — create the **review demo account** and put 10–15 real clothes
      in it, covering every slot. Paste the email and password into the review
      notes in `store-listing.md`. An account-gated app a reviewer cannot sign
      into is one of the most common rejections there is.
- [ ] **S/M** — take the four screenshots on a real phone with real clothes,
      in the order listed in `store-listing.md`. The ones in
      `website/screenshots/` are grey placeholder boxes and cannot be used.

## 3. Build

- [ ] **S/M** — `npm install -g eas-cli` then `eas login`
- [ ] **S/M** — `eas build --platform ios --profile production`
- [ ] **S/M** — `eas build --platform android --profile production`

`eas.json` is already configured: production emits an Android app-bundle
because Play requires AAB for new apps, and EAS owns the build number so an
upload never fails for a duplicate. The free tier covers 30 builds a month.

The first iOS build asks to create signing credentials — let EAS manage them.
It needs the parent's Apple ID at that point.

## 4. App Store (iOS)

- [ ] **Parent** — create the app in App Store Connect using bundle ID
      `info.flixit.app`. **This is permanent once used.** Changing it later
      means starting a new listing.
- [ ] **S/M** — `eas submit --platform ios`
- [ ] **S/M** — fill the listing from `store-listing.md`: name, subtitle,
      description, keywords, category, age rating.
- [ ] **S/M** — privacy policy URL: `https://flixit.info/privacy/`
- [ ] **S/M** — fill the privacy nutrition labels from the table in
      `store-listing.md`. **They must match the policy exactly** — a mismatch
      is a rejection.
- [ ] **S/M** — paste the demo account into review notes, then submit.

## 5. Google Play (Android)

- [ ] **Parent** — create the app in Play Console, package `info.flixit.app`.
- [ ] **S/M** — `eas submit --platform android` into **closed testing**, not
      production.
- [ ] **S/M** — recruit **12 testers** and get each one to accept the opt-in
      link. Friends and family count; they each need a Google account and have
      to actually opt in.
- [ ] **S/M** — leave them opted in **14 continuous days**. Play Console shows
      the rolling count. If someone drops out the counter suffers.
- [ ] **S/M** — complete the Data safety form, matching the privacy policy.
- [ ] **S/M** — apply for production access and answer the questionnaire:
      how testers were recruited, what feedback came back, what changed.
      Vague answers get bounced.
- [ ] **S/M** — promote to production.

*(Organization account with a D-U-N-S number: skip the three testing steps.)*

## 6. Still outstanding, unrelated to the stores

- [ ] **Parent** — open the Awin account (18+, small refundable deposit).
- [ ] **S/M** — delete the GoDaddy WebsiteBuilder site, or GoDaddy may re-add
      its own A record and knock flixit.info offline.

---

## Realistic dates

| | |
|---|---|
| iOS submitted | 20 Oct is achievable if the Apple account is opened now |
| Android closed test live | a few days after the Play account exists |
| Android production | early-to-mid November on a personal account |

The thing most likely to cost you the iOS date is the Apple account, because
it is the one step with a queue you do not control. Open it first.
