// Contrast checker for the brand palette. Run: node app/scripts/contrast.mjs
const pairs = [
  ["brass #B18A51", "#B18A51", "ivory #FAF7EF", "#FAF7EF"],
  ["brass-ink #7A5420", "#7A5420", "ivory #FAF7EF", "#FAF7EF"],
  ["brass-ink #7A5420", "#7A5420", "white", "#ffffff"],
  ["brass-ink #7A5420", "#7A5420", "ivory #F6F2E9", "#F6F2E9"],
  ["brass-hover #8A5F26", "#8A5F26", "white", "#ffffff"],
  ["brass #B18A51", "#B18A51", "forest #16271A", "#16271A"],
  ["brass #B18A51", "#B18A51", "charcoal #252824", "#252824"],
  ["brass-soft #D9C7A8", "#D9C7A8", "charcoal #252824", "#252824"],
  ["white/80", "#CCCCCC", "charcoal #252824", "#252824"],
  ["white/70", "#B3B3B3", "charcoal #252824", "#252824"],
  ["charcoal-soft #4A4E48", "#4A4E48", "ivory #FAF7EF", "#FAF7EF"],
  ["brass #B18A51", "#B18A51", "ivory-soft bg #FAF7EF", "#FAF7EF"],
];

function lum(hex) {
  const c = hex.replace("#", "");
  const vals = [0, 2, 4].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
  const lin = vals.map((v) => (v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4)));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}
function ratio(a, b) {
  const l1 = lum(a), l2 = lum(b);
  const [hi, lo] = l1 > l2 ? [l1, l2] : [l2, l1];
  return (hi + 0.05) / (lo + 0.05);
}
for (const [an, a, bn, b] of pairs) {
  const r = ratio(a, b);
  console.log(
    `${r.toFixed(2).padStart(6)}  AA-text ${r >= 4.5 ? "PASS" : "FAIL"}  UI ${r >= 3 ? "PASS" : "FAIL"}   ${an} on ${bn}`,
  );
}
