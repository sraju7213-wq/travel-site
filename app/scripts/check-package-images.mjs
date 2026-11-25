#!/usr/bin/env node
/**
 * Package image guardrails.
 *
 * Enforces the four package-image rules:
 *  1. no image is used by more than one package (primary OR gallery)
 *  2. every package has a primary image and a gallery
 *  3. every served image is landscape
 *  4. visual quality is documented as a manual review step
 *  5. every package carries more than six images
 *
 * Run from the repo root: npm run check:images
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, resolve, extname } from "node:path";
import { fileURLToPath } from "node:url";

const here = fileURLToPath(new URL(".", import.meta.url));
const appDir = resolve(here, "..");
const cataloguePath = join(appDir, "src/data/catalogue.ts");
const jsonPath = join(appDir, "src/data/travel_packages_catalog.json");
const imagesDir = join(appDir, "public/images/packages");

const source = readFileSync(cataloguePath, "utf8").replace(/\r\n/g, "\n");
const catalogue = JSON.parse(readFileSync(jsonPath, "utf8"));
const errors = [];
const fail = (message) => errors.push(message);

// Rule 3a: the shared pexels() helper must request a landscape crop.
if (!/w=1200&h=800&fit=crop/.test(source)) {
  fail("pexels() no longer forces a landscape (w=1200&h=800&fit=crop) crop");
}

// Parse PACKAGE_IMAGES into { packageId: { photos, galleries, locals } }.
const mapStart = source.indexOf("const PACKAGE_IMAGES");
const mapEnd = source.indexOf("/**\n * Returns the gallery images", mapStart);
if (mapStart < 0 || mapEnd < 0) {
  fail("Could not locate PACKAGE_IMAGES in catalogue.ts");
  process.exit(1);
}
const block = source.slice(mapStart, mapEnd);
const entryPattern = /^  "([^"]+)": \{/gm;
const matches = [...block.matchAll(entryPattern)];
const entries = new Map();
matches.forEach((match, index) => {
  const next = matches[index + 1]?.index ?? block.length;
  const chunk = block.slice(match.index, next);
  entries.set(match[1], {
    photos: [...chunk.matchAll(/pexels\("(\d+)"\)/g)].map((m) => m[1]),
    galleries: [...new Set([...chunk.matchAll(/([A-Z_]+_GALLERY)/g)].map((m) => m[1]))],
    locals: [...chunk.matchAll(/"(\/images\/packages\/[^"]+)"/g)].map((m) => m[1]),
    galleryOverrideText: chunk,
  });
});

// Rule 2: every brochure package must have imagery.
for (const pkg of catalogue.packages) {
  const entry = entries.get(pkg.id);
  if (!entry) {
    fail(`Rule 2: no PACKAGE_IMAGES entry for "${pkg.id}"`);
    continue;
  }
  if (entry.photos.length === 0 && entry.galleries.length === 0 && entry.locals.length === 0) {
    fail(`Rule 2: "${pkg.id}" has no image references`);
  }
}

// Rule 1: a Pexels photo ID or a local gallery may belong to one package only.
const photoOwners = new Map();
const galleryOwners = new Map();
for (const [id, entry] of entries) {
  for (const photo of entry.photos) {
    if (photoOwners.has(photo)) {
      fail(`Rule 1: Pexels photo ${photo} is used by "${photoOwners.get(photo)}" and "${id}"`);
    } else {
      photoOwners.set(photo, id);
    }
  }
  for (const gallery of entry.galleries) {
    if (galleryOwners.has(gallery)) {
      fail(`Rule 1: gallery ${gallery} is used by "${galleryOwners.get(gallery)}" and "${id}"`);
    } else {
      galleryOwners.set(gallery, id);
    }
  }
}

// Rule 3b: every local package image must exist and be landscape.
function imageDimensions(file) {
  const buf = readFileSync(file);
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) {
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) };
  }
  let offset = 2;
  while (offset < buf.length - 9) {
    if (buf[offset] !== 0xff) {
      offset += 1;
      continue;
    }
    const marker = buf[offset + 1];
    if (marker === 0xd8 || marker === 0xd9) {
      offset += 2;
      continue;
    }
    const length = buf.readUInt16BE(offset + 2);
    if ([0xc0, 0xc1, 0xc2, 0xc3].includes(marker)) {
      return { height: buf.readUInt16BE(offset + 5), width: buf.readUInt16BE(offset + 7) };
    }
    offset += 2 + length;
  }
  return null;
}

let checkedLocal = 0;
for (const name of readdirSync(imagesDir)) {
  const target = join(imagesDir, name);
  const files = statSync(target).isDirectory()
    ? readdirSync(target).map((file) => join(target, file))
    : [target];
  for (const file of files) {
    if (![".jpg", ".jpeg", ".png"].includes(extname(file).toLowerCase())) continue;
    checkedLocal += 1;
    const dims = imageDimensions(file);
    if (!dims) {
      fail(`Rule 3: cannot read image dimensions for ${file}`);
    } else if (dims.width <= dims.height) {
      fail(`Rule 3: not landscape (${dims.width}x${dims.height}): ${file}`);
    }
  }
}

// Rule 5: every package must carry more than six images. Where a package names
// fewer places, additional photos of the same place from different angles are
// used; each one is still a distinct photo ID.
const gallerySizes = new Map();
for (const m of source.matchAll(
  /const ([A-Z0-9_]+_GALLERY) = localPackageGallery\(\s*"[^"]+",\s*"[^"]*",\s*(\d+),?\s*\);/gs,
)) {
  gallerySizes.set(m[1], Number(m[2]));
}
for (const name of ["DISCOVER_LADAKH_GALLERY", "NEPAL_WILDLIFE_SAFARI_GALLERY", "NEPAL_MINI_TREK_7_DAY_GALLERY"]) {
  const m = source.match(new RegExp(`const ${name}: GalleryImage\\[\\] = \\[([\\s\\S]*?)\\n\\];`));
  if (m) gallerySizes.set(name, [...m[1].matchAll(/\{ src:/g)].length);
}

const imageCounts = [];
for (const [id, entry] of entries) {
  const photos = entry.photos.length;
  const spread = entry.galleryOverrideText?.match(/galleryOverride:\s*\[\.\.\.([A-Z0-9_]+_GALLERY)/);
  const override = entry.galleryOverrideText?.match(/galleryOverride:\s*([A-Z0-9_]+_GALLERY),/);
  let total = photos;
  if (spread) total = (gallerySizes.get(spread[1]) ?? 0) + photos;
  else if (override) total = gallerySizes.get(override[1]) ?? 0;
  imageCounts.push([id, total]);
  if (total <= 6) fail(`Rule 5: "${id}" has only ${total} images (need at least 7)`);
}

if (errors.length) {
  console.error(`Package image check failed with ${errors.length} problem(s):`);
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}
console.log(
  `Package image check passed: ${entries.size} packages, ` +
    `${photoOwners.size} unique Pexels photos, ${galleryOwners.size} unique local galleries, ` +
    `${checkedLocal} landscape local images. Minimum images per package: ` +
    `${Math.min(...imageCounts.map(([, n]) => n))}.`,
);
console.log("Rule 4 (visual quality) still requires a human review of new photography.");
