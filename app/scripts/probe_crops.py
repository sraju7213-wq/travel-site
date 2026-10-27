"""Render labelled probe crops of brochure regions so crop bounds can be set precisely."""

import os
import sys

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
RAW = os.path.join(ROOT, "public", "images", "brochure")
REVIEW_W, REVIEW_H = 848, 1200


def load(page):
    return Image.open(os.path.join(RAW, f"p{page:02d}-00-2379x3366.jpeg")).convert("RGB")


def probe(page, box, label):
    img = load(page)
    sx, sy = img.width / REVIEW_W, img.height / REVIEW_H
    x0, y0, x1, y1 = box
    return img.crop((int(x0 * sx), int(y0 * sy), int(x1 * sx), int(y1 * sy))), label


PROBES = [
    (2, (225, 330, 418, 600), "p2 col2 Bombay"),
    (8, (573, 380, 836, 700), "p8 col3 NA24"),
    (8, (293, 820, 552, 1160), "p8 col2 NA26"),
    (8, (22, 940, 285, 1170), "p8 col1 HE25"),
    (8, (573, 940, 838, 1170), "p8 col3 HE27"),
    (6, (20, 60, 848, 210), "p6 top row badges"),
    (7, (20, 60, 848, 300), "p7 top row badges"),
]

out_dir = os.path.join(ROOT, "..", "artifacts")
os.makedirs(out_dir, exist_ok=True)

panels = []
for page, box, label in PROBES:
    crop, lab = probe(page, box, label)
    crop.thumbnail((620, 420))
    panels.append((crop, lab, box))

pad = 26
W = 660
H = sum(p[0].height + pad for p in panels) + 10
sheet = Image.new("RGB", (W, H), (16, 16, 16))
draw = ImageDraw.Draw(sheet)
y = 6
for crop, lab, box in panels:
    sheet.paste(crop, (10, y))
    draw.text((10, y + crop.height + 6), f"{lab}  box={box}", fill=(255, 200, 120))
    y += crop.height + pad

target = os.path.abspath(os.path.join(out_dir, "crop-probes.jpg"))
sheet.save(target, "JPEG", quality=86)
print(target, sheet.size)
