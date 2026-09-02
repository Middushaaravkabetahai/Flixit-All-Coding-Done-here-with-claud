# Flixit marketing site

The public info site for Flixit — `index.html` is the whole thing. One
self-contained file: no build step, no dependencies, no framework. Fonts load
from Google Fonts; everything else (styles, icons, countdown) is inline.

Target domain: **flixitinfo.app** (the app itself gets `flixit.app`).

## Editing it

Open `index.html`, change it, save, push. That's the whole workflow. If it's
connected to a host (below), the live site updates on push.

Things that will need updating over time:

- The launch countdown is driven by `LAUNCH` in the `<script>` at the bottom.
  If the launch date moves, change it there **and** in the three places the
  date is written out: the launch section, the footer, and the FAQ.
- The App Store / Google Play badges say "Coming soon" and don't link
  anywhere yet. Once the apps are live, wrap each `.store` block in an
  `<a href="...">` pointing at the real listing.
- "Get early access" opens an email to shaaravj@gmail.com. Swap it for a real
  signup form once there's somewhere to store signups.

## Step 1 — buy the domain

Register **flixitinfo.app** at any registrar. Cloudflare Registrar sells at
cost (no markup) and is worth it if you're also hosting there; Namecheap and
Porkbun are also fine. Expect roughly $15/year for a `.app`.

One thing specific to `.app`: Google requires **HTTPS** on every `.app` domain
(it's HSTS-preloaded), so the site will not load over plain HTTP at all. Every
host below gives free HTTPS automatically, so this costs you nothing — just
don't be surprised if a half-configured setup refuses to load.

## Step 2 — put it online

Pick one. All are free at this size.

**Cloudflare Pages** (recommended if you buy the domain at Cloudflare)
1. Cloudflare dashboard → Workers & Pages → Create → Pages → Connect to Git
2. Pick this repo
3. Build command: leave empty. Build output directory: `website`
4. Deploy, then Custom domains → add `flixitinfo.app` (DNS is automatic when
   the domain is in the same Cloudflare account)

**Netlify**
1. netlify.com → Add new site → Import an existing project → pick this repo
2. Build command: leave empty. Publish directory: `website`
3. Domain settings → Add custom domain → follow its DNS instructions

**GitHub Pages** (no third party, one extra setting)
1. Repo → Settings → Pages
2. Source: Deploy from a branch → `main` → folder `/website` → Save
3. Add `flixitinfo.app` under Custom domain, then point DNS at GitHub's IPs as
   its docs instruct

## Step 3 — DNS

Whichever host you choose tells you exactly which records to add — usually
either a `CNAME` pointing at their subdomain, or a few `A` records. Add them at
your registrar. Propagation is usually minutes, occasionally a few hours.

Once it resolves, HTTPS is issued automatically by all three hosts.
