"""Build a contact sheet of every generated asset so the crops can be eyeballed."""

import os

from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, "public", "images")
SHEET = os.path.join(ROOT, "..", "artifacts")
CELL_W, CELL_H = 260, 190
COLS = 6

folders = ["destinations", "packages", "hero"]
tiles = []
for folder in folders:
    fdir = os.path.join(OUT, folder)
    if not os.path.isdir(fdir):
        continue
    for name in sorted(os.listdir(fdir)):
        if name.lower().endswith((".jpg", ".jpeg", ".png")):
            tiles.append((f"{folder}/{name}", os.path.join(fdir, name)))

rows = (len(tiles) + COLS - 1) // COLS
sheet = Image.new("RGB", (COLS * CELL_W, rows * CELL_H), (18, 18, 18))
draw = ImageDraw.Draw(sheet)

for i, (label, path) in enumerate(tiles):
    img = Image.open(path).convert("RGB")
    img.thumbnail((CELL_W - 12, CELL_H - 34))
    cx = (i % COLS) * CELL_W
    cy = (i // COLS) * CELL_H
    sheet.paste(img, (cx + (CELL_W - img.width) // 2, cy + 4))
    draw.text((cx + 8, cy + CELL_H - 26), label, fill=(255, 200, 120))

os.makedirs(SHEET, exist_ok=True)
target = os.path.abspath(os.path.join(SHEET, "asset-contact-sheet.jpg"))
sheet.save(target, "JPEG", quality=80)
print(f"{len(tiles)} tiles -> {target}  ({sheet.width}x{sheet.height})")
