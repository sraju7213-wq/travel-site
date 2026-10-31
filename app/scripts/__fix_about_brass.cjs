// One-off: on the light surfaces of the About page, brass text falls below WCAG AA.
// Switch those specific occurrences to the darker `brass-ink` token.
const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "..", "src", "app", "about", "page.tsx");
let t = fs.readFileSync(file, "utf8");

const swaps = [
  // Section headings on light panels
  ['<p className="subtitle-large mb-4 text-brass">Founders &amp; Visionaries</p>',
   '<p className="subtitle-large mb-4 text-brass-ink">Founders &amp; Visionaries</p>'],
  ['<p className="subtitle-large mb-4 text-brass">Our Standards</p>',
   '<p className="subtitle-large mb-4 text-brass-ink">Our Standards</p>'],
  ['<p className="subtitle-large mb-4 text-brass">Personal Service</p>',
   '<p className="subtitle-large mb-4 text-brass-ink">Personal Service</p>'],
  // Breadcrumb on ivory
  ['<li className="text-brass" aria-current="page">About Us</li>',
   '<li className="text-brass-ink" aria-current="page">About Us</li>'],
  // Stat labels on ivory-soft
  ['<dt className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-brass mb-1">',
   '<dt className="text-xs font-display font-semibold uppercase tracking-[0.25em] text-brass-ink mb-1">'],
  // Founder role captions on white cards
  ['<span className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass mb-1">',
   '<span className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink mb-1">'],
  // Quote attribution on ivory-soft
  ['<p className="mt-4 text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass">',
   '<p className="mt-4 text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink">'],
  // Big numerals on white
  ['<span className="font-serif text-3xl font-bold text-brass">',
   '<span className="font-serif text-3xl font-bold text-brass-ink">'],
  // Standard checkmarks on ivory-soft
  ['rounded-full bg-ivory-soft text-brass font-bold', 'rounded-full bg-ivory-soft text-brass-ink font-bold'],
  // "Our Operating Standard" eyebrow
  ['<p className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass mb-2">',
   '<p className="text-xs font-display font-semibold uppercase tracking-[0.2em] text-brass-ink mb-2">'],
  // Operating-standard shield on white
  ['rounded-full bg-brass/10 text-brass border border-brass/20',
   'rounded-full bg-brass-ink/10 text-brass-ink border border-brass-ink/20'],
];

let applied = 0;
for (const [from, to] of swaps) {
  if (t.includes(from)) {
    t = t.split(from).join(to);
    applied++;
  }
}
fs.writeFileSync(file, t);
console.log("applied", applied, "of", swaps.length);
