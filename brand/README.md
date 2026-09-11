# Flixit brand kit

Every file here is an editable SVG. Open them in Figma, Illustrator, Inkscape,
Affinity Designer — anything that reads vectors. Each one carries a comment at
the top explaining how it's constructed and which relationships to preserve if
you redraw it.

## Files

| File | What it's for |
|---|---|
| `flixit-mark.svg` | **Primary mark.** The "Hook F". Use anywhere you need Flixit in one shape. |
| `flixit-wordmark.svg` | FLIXIT set in Archivo Black, converted to outlines. No font needed to edit. |
| `flixit-lockup.svg` | Mark + wordmark locked at fixed proportions. The default for the website header, decks, letterheads. |
| `flixit-app-icon.svg` | 1024×1024 App Store / Play Store icon. |
| `flixit-mark-alt-hanger.svg` | Alternate A — a plain hanger. |
| `flixit-mark-alt-tag.svg` | Alternate B — a hang tag, solid. |
| `icons/*.svg` | The five feature sub-marks. |
| `icons/_family-rules.md` | The construction rules the sub-marks share. Read before adding a sixth. |

## The mark

An **F with a garment-hanger hook** curling off its top-left corner. It's a
monogram first and a hanger second — that order matters. Fashion apps default
to drawing a hanger or a shopping bag; leading with the letter means the mark
belongs to Flixit specifically rather than to the category.

Two relationships hold it together. Keep both if you redraw it:

1. **The hook curls left, away from the arms.** Earlier drafts curled it right,
   into the F's counters — the shapes collided and the whole thing turned to
   mush below about 24px.
2. **Hook radius (10) is slightly less than the stroke weight (12).** Equal or
   larger and the curl reads as a closed loop instead of a hook.

### Alternates

Both alternates are finished, not sketches — take one if you prefer it.

- **Hanger** — the most instantly readable option, and the safest at tiny sizes.
  The trade-off is that it's generic: any closet app could use it.
- **Tag** — solid rather than stroked, with the eyelet punched as a real hole
  (`fill-rule="evenodd"`), so it drops onto any background without a knockout.
  It's also the motif the marketing site already runs on.

## Colour

| Token | Hex | Use |
|---|---|---|
| Ink | `#18181b` | The mark on light grounds; app icon background |
| Paper | `#f3ede3` | The mark on dark grounds; app icon foreground |
| Indigo | `#3346e0` | Accent — feature sub-marks, links, primary buttons |
| Brass | `#b8863b` | Secondary accent, used sparingly for labels |

The neutrals are deliberately warm — `#18181b` over pure black, `#f3ede3` over
pure white. Pure black/white on a fashion brand reads cheap and screen-default.

**Never** render the mark in a gradient, add a drop shadow, or set it in any
colour outside this table.

## Clear space and minimum sizes

- **Clear space:** one hook-width (10 units at the mark's native 120 grid) on
  every side. Nothing enters that zone — not text, not a photo edge.
- **Minimum size:** 24px for the mark alone. 110px wide for the lockup — below
  that the wordmark's counters close up; use the mark on its own instead.
- **Don't** re-space the lockup by eye. The gap is 30 units (25% of the mark's
  width) and the wordmark's cap height is 62 units. Those are locked.

## Feature sub-marks

Five marks — Wardrobe Scan, Planner, Price Match, Flixnder, Style FYP — built
on one system so they read as a family rather than five separate logos. That
family resemblance is the whole point: it's what makes them feel like parts of
Flixit instead of unrelated apps.

They're drawn on a 48×48 grid at stroke weight 3.5 with `stroke="currentColor"`,
so dropping one into the app inherits whatever colour the surrounding UI uses.
Full rules in `icons/_family-rules.md` — read it before drawing a sixth.

## Exporting for the app stores

From `flixit-app-icon.svg`:

| Size | Where |
|---|---|
| 1024×1024 | App Store listing |
| 512×512 | Play Store listing |
| 180×180, 120×120 | iOS home screen |
| 192×192, 512×512 | Android |

The icon is **square with no rounded corners and no transparency** on purpose —
iOS and Android apply their own corner mask, and a pre-rounded icon gets
double-rounded into a visibly wrong shape.

To replace the icons currently shipping in the app, export PNGs over
`assets/icon.png`, `assets/favicon.png`, and the three
`assets/android-icon-*.png` files, then check `app.json` still points at them.

## The wordmark

Archivo Black (Google Fonts, Open Font License — free for commercial use) at
**-3% tracking**, converted to outlines. Each letter is its own `<path>` with an
id, so you can pull one letter out and redraw it without disturbing the rest.

To re-set it live instead: install Archivo, type FLIXIT at weight 900, set
tracking to -3%, convert to outlines.

## A note before you commit to the name

There's an unrelated company also called Flixit — an interactive/visual tech
studio in Mumbai, founded 2013. Different industry, so a conflict is unlikely,
but worth a proper trademark search before you spend money on packaging,
merchandise, or paid advertising under the name.
