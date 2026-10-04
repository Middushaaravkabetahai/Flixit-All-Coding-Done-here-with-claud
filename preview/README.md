# What the app looks like

Captured 4 October 2026 from the real app running in a browser, at iPhone size
(390x844, 2x). Start with **`flixit-screens.png`** — every screen on one sheet.

| | |
|---|---|
| `sign-in.png` `sign-up.png` | email and password |
| `forgot-password.png` `reset-password.png` | the recovery flow, both halves |
| `profile-setup.png` | first login only: display name + style tags |
| `closet.png` | the wardrobe grid, 8 items |
| `planner.png` `planner-reroll.png` | the same screen before and after "Switch it up" |
| `scan.png` | Scan and Price Match |
| `scan-closet.png` | bulk-add from one photo |
| `profile.png` `delete-account.png` | profile, and the delete confirmation |

## Two things these are not

**The clothes are placeholder colours, not photos.** There are no Supabase
credentials in this environment, so the wardrobe is eight stand-in items and
each tile is a flat colour swatch where your photo would be. Everything else —
the layout, the tags, the counts, the tab bar — is the real app.

**These are not the store screenshots.** Those have to be shot on a real phone
with real clothes in the closet. See `store-listing.md` for which four shots
the stores want and in what order.

## What they do confirm

- Four tabs, exactly as v1 ships: Closet, Planner, Scan, Profile. The FYP and
  Flixnder are gone from the tab bar and `/` and `/flixnder` both redirect to
  the Closet, which is what `SHOW_DEAL_FEEDS = false` is supposed to do.
- "Switch it up" really re-rolls: compare the top and shoes between
  `planner.png` and `planner-reroll.png`.
- Delete account is armed by typing DELETE, not by a single tap.

"+ Add item" has no screenshot because it opens the phone's photo picker
first; the tagging form only appears once an image is chosen, and there is no
camera here.
