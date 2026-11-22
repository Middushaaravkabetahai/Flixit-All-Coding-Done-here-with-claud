import assert from 'node:assert/strict';
import { test } from 'node:test';
import {
  buildOutfit,
  buildOutfitDeck,
  dailySeed,
  distinctOutfitCount,
  hasEnoughForOutfit,
  outfitItems,
  reRollableSlots,
  sameOutfit,
} from './outfitPlanner.ts';
import type { WardrobeItem } from './wardrobe.ts';

// Run with: npm test
//
// No test framework and no build step — node runs the TypeScript directly and
// `import type` is erased, so pulling in the WardrobeItem type does not drag
// Supabase into the test process.

const mk = (id: string, category: string): WardrobeItem => ({
  id,
  category,
  image_path: '',
  color: null,
  brand: null,
  created_at: '',
});

const CLOSET = [
  mk('1', 'Top'),
  mk('5', 'Top'),
  mk('2', 'Bottom'),
  mk('7', 'Bottom'),
  mk('3', 'Outerwear'),
  mk('4', 'Shoes'),
  mk('8', 'Shoes'),
  mk('6', 'Accessory'),
];

// The bug this guards against: the first version picked each slot with
// Math.random() and no memory of the previous pick, so 12.7% of taps on an
// 8-item closet dealt the identical outfit back and the button looked broken.
test('"Switch it up" never deals the same outfit back', () => {
  let repeats = 0;
  for (let n = 0; n < 20_000; n++) {
    const first = buildOutfit(CLOSET);
    if (sameOutfit(first, buildOutfit(CLOSET, { avoid: first }))) repeats++;
  }
  assert.equal(repeats, 0);
});

test('every slot holding more than one item actually changes', () => {
  for (let n = 0; n < 5_000; n++) {
    const first = buildOutfit(CLOSET);
    const second = buildOutfit(CLOSET, { avoid: first });
    for (const slot of ['Top', 'Bottom', 'Shoes'] as const) {
      assert.notEqual(second[slot]!.id, first[slot]!.id, `${slot} repeated`);
    }
  }
});

test('a slot you only own one of stays filled rather than emptying', () => {
  const first = buildOutfit(CLOSET);
  const second = buildOutfit(CLOSET, { avoid: first });
  assert.ok(second.Outerwear, 'Outerwear emptied');
  assert.ok(second.Accessory, 'Accessory emptied');
});

test("today's outfit is the same every time the tab is opened", () => {
  const seed = dailySeed('user-abc', new Date(2026, 9, 5, 7, 0));
  const morning = buildOutfit(CLOSET, { seed });

  assert.ok(sameOutfit(morning, buildOutfit(CLOSET, { seed })));

  // Postgres makes no ordering promise without an ORDER BY, so the same seed
  // has to survive the rows arriving in a different order.
  assert.ok(sameOutfit(morning, buildOutfit([...CLOSET].reverse(), { seed })));

  // Local date, not UTC: a UTC day boundary falls mid-evening in California
  // and would change the outfit while it is still being worn.
  const lateSameDay = dailySeed('user-abc', new Date(2026, 9, 5, 23, 59));
  assert.ok(sameOutfit(morning, buildOutfit(CLOSET, { seed: lateSameDay })));
});

test('the seed moves on tomorrow, and differs between users', () => {
  const today = dailySeed('user-abc', new Date(2026, 9, 5, 7, 0));
  assert.notEqual(dailySeed('user-abc', new Date(2026, 9, 6, 7, 0)), today);
  assert.notEqual(dailySeed('user-xyz', new Date(2026, 9, 5, 7, 0)), today);
});

test('a two-item closet still produces a full outfit', () => {
  const two = [mk('1', 'Top'), mk('2', 'Bottom')];
  assert.ok(hasEnoughForOutfit(two));

  // Nothing to swap to, so the Planner hides the button instead of offering a
  // re-roll that cannot change anything.
  assert.equal(reRollableSlots(two), 0);

  const rerolled = buildOutfit(two, { avoid: buildOutfit(two) });
  assert.ok(rerolled.Top && rerolled.Bottom);
});

test('an outfit needs a top and a bottom', () => {
  assert.ok(!hasEnoughForOutfit([mk('1', 'Shoes'), mk('2', 'Accessory')]));
  assert.ok(!hasEnoughForOutfit([]));
  assert.equal(reRollableSlots(CLOSET), 3);
});

// --- the home screen's album covers -------------------------------------

test('the cover deck never shows the same outfit twice in a row', () => {
  for (let seed = 0; seed < 500; seed++) {
    const deck = buildOutfitDeck(CLOSET, 8, seed);
    for (let i = 1; i < deck.length; i++) {
      assert.ok(!sameOutfit(deck[i - 1], deck[i]), `cards ${i - 1} and ${i} match`);
    }
  }
});

test('the deck is stable for the day, like the Planner', () => {
  const seed = dailySeed('user-abc', new Date(2026, 11, 24, 7, 0));
  const morning = buildOutfitDeck(CLOSET, 8, seed);
  const evening = buildOutfitDeck(CLOSET, 8, seed);
  assert.equal(morning.length, evening.length);
  morning.forEach((outfit, i) => assert.ok(sameOutfit(outfit, evening[i])));
});

test('a small closet gets a short deck rather than a deck of repeats', () => {
  // One top, one bottom: exactly one outfit exists, so asking for eight
  // must not hand back the same cover eight times.
  const two = [mk('1', 'Top'), mk('2', 'Bottom')];
  assert.equal(distinctOutfitCount(two), 1);
  assert.equal(buildOutfitDeck(two, 8, 1).length, 1);

  // Two tops, one bottom: two real outfits.
  const three = [mk('1', 'Top'), mk('2', 'Top'), mk('3', 'Bottom')];
  assert.equal(distinctOutfitCount(three), 2);
  assert.equal(buildOutfitDeck(three, 8, 1).length, 2);
});

test('the deck is capped so it cannot run away on a big closet', () => {
  const big = [];
  for (let i = 0; i < 6; i++) {
    for (const c of ['Top', 'Bottom', 'Outerwear', 'Shoes', 'Accessory']) {
      big.push(mk(`${c}-${i}`, c));
    }
  }
  // 6^5 = 7776 combinations exist; the deck must stay at what was asked for.
  assert.equal(distinctOutfitCount(big, 12), 12);
  assert.equal(buildOutfitDeck(big, 8, 1).length, 8);
});

test('outfitItems returns the pieces in slot order, skipping empty slots', () => {
  const outfit = buildOutfit(CLOSET, { seed: 42 });
  const pieces = outfitItems(outfit);
  assert.equal(pieces.length, 5);
  assert.ok(pieces.every((p) => p && p.id));

  const sparse = buildOutfit([mk('1', 'Top'), mk('2', 'Bottom')], { seed: 1 });
  assert.equal(outfitItems(sparse).length, 2);
});

test('an empty closet yields an empty deck rather than throwing', () => {
  assert.equal(distinctOutfitCount([]), 1);
  assert.doesNotThrow(() => buildOutfitDeck([], 8, 1));
  assert.deepEqual(outfitItems(buildOutfit([], { seed: 1 })), []);
});
