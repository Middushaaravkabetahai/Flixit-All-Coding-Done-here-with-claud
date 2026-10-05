// Guards against the sub-marks drifting apart.
//
// The same five marks are drawn in three places — brand/icons/*.svg (the
// source of truth), src/components/icons.tsx (the app's tab bar) and
// website/index.html (the feature cards). Nothing links them, so editing one
// and forgetting the others is silent and easy. This compares the geometry and
// exits non-zero if they disagree.
//
// Run with: npm run icons:check
import { readFileSync } from 'node:fs';

// \bd=" rather than d=", because `id="bracket-tl"` contains the substring
// `d="bracket-tl"` and an earlier version of this check read ids as geometry.
const D = /(?:^|\s)d="([^"]+)"/g;
const BOX = /x="([^"]*)"\s+y="([^"]*)"\s+width="([^"]*)"\s+height="([^"]*)"\s+rx="([^"]*)"/g;
const TRANSFORM = /transform="([^"]+)"/g;

const shapes = (text) =>
  [
    ...[...text.matchAll(D)].map((m) => `d:${m[1].replace(/\s+/g, ' ').trim()}`),
    ...[...text.matchAll(BOX)].map((m) => `box:${m.slice(1).join(',')}`),
    ...[...text.matchAll(TRANSFORM)].map((m) => `t:${m[1].replace(/\s+/g, ' ').trim()}`),
  ].sort();

const tsx = readFileSync('src/components/icons.tsx', 'utf8');
const web = readFileSync('website/index.html', 'utf8');

// [component name, brand filename, the label above the card on the website]
const MARKS = {
  fyp: ['FypIcon', 'fyp.svg', '05 / STYLE FYP'],
  flixnder: ['FlixnderIcon', 'flixnder.svg', '04 / FLIXNDER'],
  wardrobe: ['WardrobeIcon', 'wardrobe-scan.svg', '01 / WARDROBE SCAN'],
  planner: ['PlannerIcon', 'planner.svg', '02 / OUTFIT PLANNER'],
  price: ['PriceMatchIcon', 'price-match.svg', '03 / PRICE MATCH'],
};

let failed = 0;
for (const [key, [component, svg, webLabel]] of Object.entries(MARKS)) {
  const app = shapes(tsx.split(`export function ${component}`)[1].split('export function')[0]);
  const brand = shapes(readFileSync(`brand/icons/${svg}`, 'utf8'));
  const site = shapes(web.split(webLabel)[1].split('</svg>')[0]);

  const join = (a) => a.join(' | ');
  const matchesBrand = join(app) === join(brand);
  const matchesSite = join(app) === join(site);

  if (matchesBrand && matchesSite) {
    console.log(`  ok    ${key.padEnd(9)} app == brand == website  (${app.length} shapes)`);
    continue;
  }
  failed++;
  console.log(`  DRIFT ${key}`);
  if (!matchesBrand) console.log(`    app  : ${join(app)}\n    brand: ${join(brand)}`);
  if (!matchesSite) console.log(`    app  : ${join(app)}\n    web  : ${join(site)}`);
}

if (failed) {
  console.error(`\n${failed} mark(s) out of sync. See brand/icons/_family-rules.md.`);
  process.exit(1);
}
console.log('\nAll three sources agree.');
