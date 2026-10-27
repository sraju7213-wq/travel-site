"""Crop the operator's own brochure photography into named web assets.

Source: Brochure.pdf (the operator's own published brochure). Each brochure page is a
single flat 2379x3366 raster, so photographic panels are recovered by cropping.

Crop rectangles below are expressed in the 848x1200 review coordinate space and scaled
to the true source resolution at run time, so they stay readable and re-editable.

Outputs:
  public/images/destinations/*.jpg   destination + editorial imagery
  public/images/experiences/*.jpg    circular experience-card imagery
  public/images/packages/*.jpg       one image per catalogue package
  public/images/hero/*.jpg           full-bleed hero and CTA imagery
  public/images/SOURCES.md           provenance record for every generated asset
"""

import io
import json
import os

from PIL import Image, ImageEnhance, ImageFilter

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "public", "images", "brochure")
PDF = os.path.join(os.path.dirname(ROOT), "Brochure.pdf")
OUT = os.path.join(ROOT, "public", "images")
REVIEW_W, REVIEW_H = 848, 1200

_PAGE_CACHE: dict[int, Image.Image] = {}

# (page, asset_name, x0, y0, x1, y1) in review coordinates.
# Bounds exclude the brochure's own grade badges and heading overlays so only
# photography lands in the web asset.
DESTINATION_CROPS = [
    (2, "ladakh-monastery", 437, 345, 598, 585),
    (2, "kashmir-shikara", 618, 78, 812, 268),
    (2, "kathmandu-stupa", 22, 948, 212, 1120),
    (2, "pokhara-lake", 225, 948, 418, 1120),
    (2, "gateway-of-india", 225, 532, 418, 600),
    (3, "taj-mahal", 18, 68, 292, 255),
    (3, "goa-beach", 296, 68, 555, 255),
    (3, "kerala-backwaters", 573, 68, 833, 255),
    (3, "amber-fort", 8, 1072, 840, 1198),
    (3, "amber-fort-detail", 8, 1072, 176, 1198),
    (4, "swayambhu-stupa", 296, 68, 560, 355),
    (4, "himalaya-horses", 573, 1005, 836, 1160),
    (5, "jodhpur-fort", 295, 68, 556, 215),
    (5, "buddhist-statue", 27, 68, 288, 215),
    (5, "south-india-backwaters", 573, 68, 836, 215),
    (5, "varanasi-ghat", 573, 1085, 836, 1160),
    (6, "markha-valley", 27, 96, 288, 198),
    (6, "zanskar-river", 296, 96, 556, 198),
    (6, "pangong-lake", 573, 96, 836, 198),
    (6, "green-valley", 573, 780, 836, 980),
    (7, "dal-lake", 25, 100, 400, 233),
    (7, "vale-trek", 455, 100, 830, 232),
    (8, "nepal-collage", 290, 66, 552, 462),
    (8, "rafting", 573, 480, 836, 690),
    (8, "rhino", 293, 1000, 552, 1155),
    (8, "nepal-trek", 22, 1085, 285, 1170),
    (8, "snow-trek", 573, 1052, 838, 1170),
]

# Assets that need tonal repair (the brochure renders them as low-opacity card backgrounds).
BOOSTED = {"gateway-of-india"}

# Founder / operator portraits harvested from the brochure's "Founders and Visionaries".
PORTRAIT_CROPS = [
    (1, "founder-welcome", 22, 20, 108, 108),
    (1, "sultan-baktoo", 503, 166, 600, 250),
    (1, "farook-baktoo", 503, 303, 600, 392),
]

# Wide panoramas used for full-bleed bands.
HERO_CROPS = [
    (6, "hero-pangong", 0, 1010, 848, 1175),
    (3, "hero-amber-fort", 8, 1072, 840, 1198),
]

# Catalogue package id -> brochure asset that best represents it.
PACKAGE_IMAGE = {
    "delhi-stopover": "amber-fort-detail",
    "bombay-stopover": "gateway-of-india",
    "discover-leh": "ladakh-monastery",
    "kathmandu-stopover": "kathmandu-stupa",
    "kathmandu-pokhara": "pokhara-lake",
    "discover-ladakh": "pangong-lake",
    "golden-triangle": "taj-mahal",
    "glorious-goa-stopover": "goa-beach",
    "glimpses-of-kerala": "kerala-backwaters",
    "kashmir-package-7-day": "kashmir-shikara",
    "kashmir-package-4-day": "dal-lake",
    "delhi-to-kathmandu": "swayambhu-stupa",
    "heritage-tour-india": "jodhpur-fort",
    "north-india-highlights": "buddhist-statue",
    "india-nepal-combination": "himalaya-horses",
    "south-india-highlight": "south-india-backwaters",
    "markha-valley": "markha-valley",
    "kashmir-zanskar-ladakh-trek": "zanskar-river",
    "kashmir-combinations-little-tibet": "green-valley",
    "kashmir-mini-adventure": "dal-lake",
    "vale-of-kashmir-trek": "vale-trek",
    "kashmir-ski": "snow-trek",
    "himalayan-combination-nepal": "nepal-collage",
    "trisuli-rafting": "rafting",
    "nepal-mini-trek-4-day": "nepal-trek",
    "nepal-wildlife-safari": "rhino",
    "nepal-mini-trek-7-day": "snow-trek",
}


def scale_box(img, box):
    sx = img.width / REVIEW_W
    sy = img.height / REVIEW_H
    x0, y0, x1, y1 = box
    return (
        int(round(x0 * sx)),
        int(round(y0 * sy)),
        int(round(x1 * sx)),
        int(round(y1 * sy)),
    )


def load_page(page: int) -> Image.Image:
    """Return the full-page raster for a brochure page.

    Prefers a previously extracted raw page under public/images/brochure; otherwise the
    page image is pulled straight out of Brochure.pdf so the script stays self-contained.
    """
    if page in _PAGE_CACHE:
        return _PAGE_CACHE[page]

    raw = os.path.join(RAW, f"p{page:02d}-00-2379x3366.jpeg")
    if os.path.exists(raw):
        img = Image.open(raw).convert("RGB")
    else:
        import pymupdf

        doc = pymupdf.open(PDF)
        page_obj = doc.load_page(page - 1)
        xref = page_obj.get_images(full=True)[0][0]
        img = Image.open(io.BytesIO(doc.extract_image(xref)["image"])).convert("RGB")
        doc.close()

    _PAGE_CACHE[page] = img
    return img


def save_jpg(img, path, max_w, quality=82, boost=False):
    if boost:
        img = ImageEnhance.Contrast(img).enhance(1.55)
        img = ImageEnhance.Color(img).enhance(1.75)
        img = ImageEnhance.Brightness(img).enhance(0.92)
    if img.width > max_w:
        h = round(img.height * max_w / img.width)
        img = img.resize((max_w, h), Image.LANCZOS)
    img = img.filter(ImageFilter.UnsharpMask(radius=1.2, percent=55, threshold=3))
    img.save(path, "JPEG", quality=quality, optimize=True, progressive=True)
    return img.size


def main() -> int:
    manifest = []

    for group, crops, folder, width in (
        ("destination", DESTINATION_CROPS, "destinations", 1400),
        ("portrait", PORTRAIT_CROPS, "destinations", 520),
        ("hero", HERO_CROPS, "hero", 2600),
    ):
        target = os.path.join(OUT, folder)
        os.makedirs(target, exist_ok=True)
        for page, name, x0, y0, x1, y1 in crops:
            box = (x0, y0, x1, y1)
            img = load_page(page)
            cropped = img.crop(scale_box(img, box))
            size = save_jpg(
                cropped,
                os.path.join(target, f"{name}.jpg"),
                width,
                boost=name in BOOSTED,
            )
            manifest.append(
                {
                    "group": group,
                    "file": f"images/{folder}/{name}.jpg",
                    "brochure_page": page,
                    "crop_review_box": list(box),
                    "output_size": list(size),
                }
            )
            print(f"{group:11s} p{page} {name:26s} -> {size[0]}x{size[1]}")

    pkg_dir = os.path.join(OUT, "packages")
    os.makedirs(pkg_dir, exist_ok=True)
    catalogue = json.load(
        open(os.path.join(ROOT, "src", "data", "travel_packages_catalog.json"), encoding="utf-8")
    )
    by_id = {p["id"]: p for p in catalogue["packages"]}
    for pkg_id, asset in PACKAGE_IMAGE.items():
        if pkg_id not in by_id:
            raise SystemExit(f"unknown package id: {pkg_id}")
        src = next(m for m in manifest if m["file"].endswith(f"/{asset}.jpg"))
        page = src["brochure_page"]
        img = load_page(page)
        source_crop = next(c for p, n, *rest in DESTINATION_CROPS if n == asset for c in [tuple(rest)])
        cropped = img.crop(scale_box(img, source_crop))
        size = save_jpg(
            cropped,
            os.path.join(pkg_dir, f"{pkg_id}.jpg"),
            900,
            boost=asset in BOOSTED,
        )
        manifest.append(
            {
                "group": "package",
                "file": f"images/packages/{pkg_id}.jpg",
                "brochure_page": page,
                "source_asset": asset,
                "crop_review_box": list(source_crop),
                "output_size": list(size),
            }
        )
        print(f"{'package':11s} p{page} {pkg_id:28s} -> {size[0]}x{size[1]}")

    with open(os.path.join(OUT, "manifest.json"), "w", encoding="utf-8") as fh:
        json.dump(manifest, fh, indent=2)

    write_sources(manifest)
    print(f"\nassets={len(manifest)}")
    return 0


def write_sources(manifest: list[dict]) -> None:
    """Record where every generated image came from, as required before launch."""
    lines = [
        "# Image sources",
        "",
        "Every raster in this directory was generated by `scripts/extract_brochure_photos.py`",
        "from `Brochure.pdf` at the repository root — the organisation's own published brochure.",
        "No third-party or reference-site imagery is used.",
        "",
        "Re-run the script to regenerate every file after a brochure revision:",
        "",
        "```",
        "python scripts/extract_brochure_photos.py",
        "```",
        "",
        "| File | Brochure page | Source region (review px) | Output |",
        "|---|---|---|---|",
    ]
    for item in manifest:
        box = item["crop_review_box"]
        size = item["output_size"]
        lines.append(
            f"| `{item['file']}` | p{item['brochure_page']} | "
            f"`{box[0]},{box[1]} - {box[2]},{box[3]}` | {size[0]}x{size[1]} |"
        )
    lines += [
        "",
        "## Notes",
        "",
        "- Crop rectangles are expressed in an 848x1200 review space and scaled to the",
        "  2379x3366 source raster at build time.",
        "- `gateway-of-india` is published in the brochure as a low-opacity card background;",
        "  it receives a contrast/saturation correction so the monument stays legible.",
        "- `manifest.json` holds the same table in machine-readable form.",
        "",
    ]
    with open(os.path.join(OUT, "SOURCES.md"), "w", encoding="utf-8") as fh:
        fh.write("\n".join(lines))


if __name__ == "__main__":
    raise SystemExit(main())
