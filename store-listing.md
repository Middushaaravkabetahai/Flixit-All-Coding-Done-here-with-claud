# Store listing copy

Everything the App Store and Play Store forms ask for, written and within the
character limits. Paste straight in.

Character counts are the hard caps the forms enforce. Where a field is counted
below, it has been checked.

---

## App name

**App Store** (30 characters max):

```
Flixit: Your Closet, Sorted
```
27 characters.

**Play Store** (30 characters max): same.

> Deliberately not "Flixit" alone. Both stores index the app name heavily for
> search, and nobody searches for a brand they have never heard of. The words
> after the colon are what someone types when they have the problem.

---

## Subtitle (App Store only, 30 characters max)

```
Daily outfits from your own
```
27 characters.

Runner-up if the above reads oddly truncated on a narrow phone:

```
Outfits from clothes you own
```
28 characters.

---

## Short description (Play Store only, 80 characters max)

```
Photograph your closet. Get a daily outfit from clothes you already own.
```
72 characters.

---

## Full description

Works for both stores. Play allows 4000 characters, App Store 4000.
This is roughly 1100, which is deliberate: almost nobody taps "more".
The first three lines are what actually gets read.

```
You have a closet full of clothes and still feel like you have nothing to wear.

Flixit fixes that. Photograph your wardrobe once, and every morning it hands you
a finished outfit built from clothes you already own.

HOW IT WORKS

Scan your closet
Photograph your closet or a rack of clothes and Flixit picks out the individual
items, so you are not adding things one at a time. Review what it found, fix
anything it got wrong, and it saves to your wardrobe.

Get a daily outfit
Flixit builds a full outfit from your own clothes: top, bottom, outerwear,
shoes, accessory. Not feeling it? Switch it up and get another.

Check the price before you buy
See something you like in a shop? Scan it and Flixit identifies it, then helps
you check what it costs online before you pay full price.

WHY IT IS DIFFERENT

Most fashion apps exist to sell you more clothes. Flixit is the opposite. It is
about getting more out of the ones you already bought.

Your wardrobe photos are private. They are stored against your account only,
never shown to other users, and never sold.

Built by two students in Fremont, California.

Privacy policy: https://flixit.info/privacy/
Questions: flixitteam@gmail.com
```

---

## Keywords (App Store only, 100 characters max, comma separated, no spaces)

```
closet,wardrobe,outfit,outfits,style,clothes,organizer,planner,capsule,ootd,fashion,what to wear
```
96 characters.

> Rules that shape this list:
> - Do **not** repeat words already in the app name or subtitle. Apple indexes
>   those separately, so repeating wastes characters.
> - No spaces after commas. A space costs a character and buys nothing.
> - Singular and plural are indexed separately, hence both "outfit" and
>   "outfits".
> - Do **not** put competitor or brand names here. Apple rejects for it.

---

## Category

- **Primary:** Lifestyle
- **Secondary (App Store allows one):** Shopping

> Not "Utilities" even though it behaves like one. Lifestyle is where people
> browse for this, and the comparison set is friendlier.

---

## Age rating

**4+ / Everyone.** The app has no user-generated content shown to others, no
chat, no ads, no purchases, and no location.

> If the FYP and Flixnder are ever turned on, the rating questionnaire must be
> retaken: affiliate links pointing at third-party shops change the answers.

---

## Data safety / privacy nutrition labels

Both stores ask what you collect. These must match
`legal/privacy-policy.md` and the live page exactly. A mismatch is a rejection.

| Data | Collected | Linked to identity | Used for tracking | Why |
|---|---|---|---|---|
| Email address | Yes | Yes | No | Account sign-in |
| Name (display name) | Yes | Yes | No | Shown in your profile |
| Photos (wardrobe) | Yes | Yes | No | Your closet and outfit suggestions |
| Product interaction | Yes | Yes | No | Ordering your own feed |
| Location | **No** | — | — | Not requested at all |
| Contacts | **No** | — | — | — |
| Payment info | **No** | — | — | — |
| Device ID / advertising ID | **No** | — | — | No ads, no analytics yet |

> Say **no third-party analytics** only while that stays true. The moment any
> analytics, crash reporting or affiliate click tracking is added, both these
> forms and the privacy policy have to be updated in the same change.

---

## Review notes (the field reviewers actually read)

```
Flixit requires an account because the whole app is a personal wardrobe: there
is nothing to show without one.

Demo account for review:
  email: <create one and paste it here before submitting>
  password: <paste here>

This account already has clothing items saved, so the Closet and Planner tabs
have content on first open.

The Scan tab sends a photo to our own server function, which calls Anthropic's
Claude API to identify the clothing in it. No image is stored by that service.

This version does not contain any shopping feed or affiliate links. Those
screens exist in the codebase but are disabled.
```

> **The demo account is not optional.** An account-gated app with no working
> login is one of the most common rejection reasons, because the reviewer
> simply cannot get in. Create a real account, add four or five items to it,
> and paste the credentials in before submitting.

---

## Screenshots

Required: iPhone 6.7" and 6.5". Play Store wants at least two phone shots.

Take these four, in this order. The first one is the only one most people see.

1. **Planner** showing a complete outfit. This is the product in one picture.
2. **Closet** with 8-12 real items, filled grid.
3. **Scan** mid-result, with an item identified.
4. **Closet scan review**, showing several items found from one photo.

> Shoot on a real phone with real clothes. The current ones in
> `website/screenshots/` are grey placeholder boxes and cannot be used.

---

## Still to fill in before submitting

- [ ] Demo account email and password in the review notes
- [ ] Four screenshots at the required sizes
- [ ] Support URL (https://flixit.info works)
- [ ] Marketing URL (https://flixit.info)
- [ ] Copyright line: `2026 Shaarav Jain and Maahit Anand`
