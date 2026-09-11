# Flixit — Privacy Policy

**Last updated: 11 September 2026**

Flixit is built by Shaarav Jain and Maahit Anand. This policy explains what the
app collects, why, and what you can do about it.

> **Before you publish this:** it describes the app as it is actually built
> today. Every time the app starts collecting something new — analytics, crash
> reporting, ads, affiliate click tracking, location — this document has to be
> updated *and* the App Store / Play Store data-safety forms have to be updated
> to match. Stores check that the two agree, and a mismatch is a rejection.
> Items already flagged as "not yet, but coming" are marked below.

## What we collect

**Your account.** When you sign up we store your email address and a securely
hashed password. Authentication is handled by Supabase, our backend provider.

**Your profile.** The display name you choose and the style tags you pick
during setup.

**Your wardrobe.** Photos of clothing you upload or scan, plus the details
attached to each item — category, colour, and brand.

**Your activity in the app.** Which items you swipe left or right on in
Flixnder. We use this to reorder your feed.

We do **not** collect your location, your contacts, your photo library beyond
the specific images you choose, or any payment information.

## How your wardrobe photos are handled

Your photos are stored in private cloud storage, in a folder scoped to your
account. Access is enforced at the database level — every request is checked
against your user ID, so one account cannot read another account's photos.
Images are served through short-lived signed links that expire after one hour.

**Photos are not public, are not shared with other users, and are not sold.**

**AI processing.** When you use Scan Closet or Scan & Price Match, the photo is
sent to Anthropic's Claude API to identify the clothing in it. Anthropic
processes the image to return that result. Per Anthropic's published API terms
at the time of writing, API inputs are not used to train their models. We send
the photo only — never your name, email, or account ID.

## What we don't do

- We don't sell or rent your personal data.
- We don't show third-party advertising.
- We don't track you across other apps or websites.
- We don't use analytics or crash-reporting SDKs. *(If we add one, this policy
  and the store data-safety forms get updated first.)*

## Affiliate links — coming, not live yet

Flixit plans to earn money through affiliate commission: if you buy something
after tapping through from Flixit, the retailer may pay us a small percentage
at no extra cost to you. That means a retailer may be told a purchase came from
Flixit.

**This is not active yet.** Prices shown in the app are currently sample data,
clearly labelled as such. When real affiliate links go live, this section will
be updated to name the specific partners.

## Your rights and choices

- **See your data.** Everything the app holds about you is visible in the app:
  your profile, your wardrobe, your items.
- **Delete individual items.** Remove any wardrobe item from the Wardrobe tab.
  Deleting an item deletes its photo too, unless another item still uses that
  same photo (items added by one closet scan share a source image).
- **Delete your account.** Email us and we'll delete your account and
  everything attached to it. *(Both stores now require in-app account deletion
  for apps with accounts — this needs to be built into the app before
  submission.)*

## Children

Flixit is not directed at children under 13, and we don't knowingly collect
data from them. If you believe a child has created an account, email us and
we'll remove it.

## Where your data lives

Data is stored on Supabase infrastructure. If you're outside the region where
that infrastructure sits, your data is transferred and processed there.

## Changes

If this policy changes materially we'll update the date above and notify you in
the app before the change takes effect.

## Contact

Questions, deletion requests, or anything else:

- shaaravj@gmail.com
- maahit.anand@gmail.com

---

*This document was drafted to describe Flixit's actual behaviour honestly, but
it is not legal advice and has not been reviewed by a lawyer. If Flixit starts
handling payments, operating in the EU or UK (GDPR), or collecting data from
users in California (CCPA), have someone qualified review it.*
