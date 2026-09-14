# Flixit marketing site

The public info site for Flixit — `index.html` is the whole thing. One
self-contained file: no build step, no dependencies, no framework. Fonts load
from Google Fonts; everything else (styles, logo, icons, countdown) is inline.
Screenshots live in `screenshots/`.

## Live at https://flixit.info

Already set up — you don't need to redo any of this. Recorded here so the
configuration isn't lost:

- **Host:** Netlify, project `magenta-paletas-d3adc9`
- **Deploys from:** `main` branch, build command **empty**, publish directory
  **`website`**
- **DNS (at GoDaddy):** `A @ 75.2.60.5` and
  `CNAME www -> magenta-paletas-d3adc9.netlify.app`
- **HTTPS:** free auto-renewing Let's Encrypt cert from Netlify

**To change the site: edit `index.html`, commit, push to `main`.** Netlify
redeploys on its own within a couple of minutes. No uploading, no dashboards.

If the site ever shows GoDaddy's "Launching Soon" page again, GoDaddy's
WebsiteBuilder has re-added its own `A` record — delete it and restore the two
records above.

## Editing it

Open `index.html`, change it, save, push. That's the whole workflow. Once it's
connected to a host, the live site updates on every push to `main`.

Things that will need updating over time:

- **The launch date** appears in five places: `LAUNCH` in the `<script>` at the
  bottom (which drives the countdown), the launch table, the footer, the FAQ,
  and the two social-preview `<meta>` tags in the head. Change all five.
- **The store badges** say "Coming soon" and don't link anywhere. Once the apps
  are live, wrap each `.store` block in an `<a href="...">` to the real listing.
- **The logo gradient** is defined once in the `<defs>` block near the top of
  the body. Change the three `<stop>` colours there to swap variants —
  see `brand/README.md` for the alternatives.
- **The screenshots** in `screenshots/` were captured in a sandbox, so the
  clothing images inside them are empty grey tiles. Replace them with real
  captures from a phone (same filenames) and the site picks them up.

## Setting this up again from scratch

<details>
<summary>Only needed if you move hosts or start over</summary>

### Step 1 — put it online

**Netlify** is the path of least resistance, and it publishes the `website/`
folder directly.

1. netlify.com → sign in with GitHub
2. Add new site → Import an existing project → pick this repo
3. **Build command:** leave empty. **Publish directory:** `website`
4. Deploy

You immediately get a working URL like `flixit-abc123.netlify.app`. The site is
live at that point — the domain is just a nicer label on top.

<details>
<summary>Alternatives</summary>

**Cloudflare Pages** — same idea, also free, also publishes any folder.
Dashboard → Workers & Pages → Create → Pages → Connect to Git → build command
empty, output directory `website`.

**GitHub Pages** — no third-party account, but it can only serve a branch's
**root** or a folder named **`/docs`**. It cannot serve `/website`, so you'd
have to rename this folder to `docs/` first.
</details>

### Step 2 — connect the domain

In Netlify: **Domain settings → Add custom domain** → enter `flixit.info`.
Netlify then shows the exact DNS records to create.

At whichever registrar you bought the domain from, find **DNS** /
**DNS Management** and add those records — usually one `CNAME`, sometimes a
couple of `A` records. Delete any placeholder "parking" record the registrar
added, or it will fight yours.

Propagation is usually minutes, occasionally a few hours. **HTTPS is issued
automatically and free** once DNS resolves — don't buy an SSL certificate from
a registrar upsell, you don't need one.

</details>

## Notes on `.info`

`.info` behaves like any ordinary TLD — no special requirements. Two things
worth knowing:

- **Renewal price.** `.info` is usually sold cheap for year one and renews
  higher. Check what year two costs so it isn't a surprise, and consider
  turning off auto-renew if you might move the brand to another domain.
- **Reputation.** `.info` has historically been popular with spam, so a small
  number of strict email filters treat it with suspicion. It costs nothing for
  a marketing site, but if Flixit ever sends email from this domain, watch
  deliverability. Nothing in the site depends on the TLD — moving later is a
  DNS change and a search-and-replace.
