# Feature sub-mark family

Five marks, one construction system. They must look like siblings, not five
separate logos — that's what makes them read as "part of Flixit."

Shared rules (do not break these when editing):

- 48 x 48 grid, artwork inside a 40 x 40 live area (4 units clear on all sides)
- stroke weight 3.5, round caps, round joins, `fill="none"`
- `stroke="currentColor"` so each mark inherits the colour of the UI around it
- every coordinate lands on a whole or half unit
- one idea per mark — if it needs a third element to read, it's too complex
- each mark reuses a shape from the parent system: the hanger, the tag,
  the scan bracket, or the card

## Matching the Flowing F

The parent mark (`brand/flixit-mark.svg`) has three traits worth borrowing.
These were added to the set after the geometric originals stopped looking
related to it:

- **Corners turn, they do not fold.** Scan brackets end in a radius-4 arc
  rather than a hard right angle, matching the parent's round joins. The
  Wardrobe and Price Match brackets use the identical arc so the two scan marks
  read as one device.
- **Verticals lean forward.** The FYP tiles carry `skewX(-6)`, the same
  direction as the parent's stem, and the Flixnder card is rotated 10 rather
  than 7.
- **Horizontals lift slightly to the right,** the way both of the parent's arms
  do. The Planner's rail and tick are drawn as shallow curves rather than
  straight lines.
- **The hook opens down-left.** The Wardrobe hanger uses the parent's own hook
  geometry, scaled to the 48 grid.

## What was tried and rejected

**A hook on the price tag.** Semantically right — a garment tag hangs from
something — and it would have put the parent's signature shape in a third mark.
It was rejected because the hook collided with the tag body and closed up into
a blob at 26px, which breaks the parent mark's own rule that the hook must curl
*away* so the counters stay open.

**Redrawing the set as single flowing strokes to match the parent literally.**
This is the wrong goal. The parent is a one-stroke cursive monogram, seen large
and alone. These are pictograms seen at 26px next to a word, where a reader
needs to tell a calendar from a tag at a glance. Making them gestural would
cost legibility and buy nothing. They are siblings of the F, not copies of it:
same drawing hand, different job.

## Three places, one geometry

The same paths are duplicated in three files, and they drift silently:

1. `brand/icons/*.svg` — the source of truth
2. `src/components/icons.tsx` — the app's tab bar
3. `website/index.html` — the feature cards

Change one, change all three. `npm run icons:check` compares them and fails if
they disagree.
