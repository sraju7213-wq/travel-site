import json, os
from PIL import Image
ROOT="app"
MAN="app/public/images/manifest.json"
manifest=json.load(open(MAN,encoding="utf-8"))
lines=[]
lines.append("# Asset inventory - India Nepal Travel Organisation")
lines.append("")
lines.append("Generated from `app/public/images/manifest.json` and `Brochure.pdf` (organisation's own published brochure).")
lines.append("Source/permission status: all raster assets are cropped from the organisation's own brochure; no third-party or reference-site imagery is used.")
lines.append("")
lines.append("## Summary")
lines.append(f"- Total generated raster assets: {len(manifest)}")
lines.append("- Source: `Brochure.pdf` (8 pages, 2379x3366 rasters).")
lines.append("- Regenerate: `python app/scripts/extract_brochure_photos.py`.")
lines.append("")
lines.append("## Quality review flags")
flags=[]
for m in manifest:
    w,h=m["output_size"]
    if w < 600 or h < 300:
        flags.append((m["file"],w,h,"low resolution / small crop"))
    ratio=w/h
    if ratio > 4 or ratio < 0.35:
        flags.append((m["file"],w,h,"extreme aspect ratio"))
# known low-quality
for m in manifest:
    if "gateway-of-india" in m["file"]:
        flags.append((m["file"],m["output_size"][0],m["output_size"][1],"published in brochure as low-opacity card background; contrast-corrected"))
if flags:
    for f,w,h,msg in sorted(set(flags)):
        lines.append(f"- `{f}` ({w}x{h}): {msg}")
else:
    lines.append("- None.")
lines.append("")
lines.append("## Asset table")
lines.append("| File | Group | Intended page | Dimensions | Brochure page | Subject / alt text (recommended) | Source / permission |")
lines.append("|---|---|---|---|---|---|---|")

def intended(m):
    f=m["file"]
    if f.startswith("images/hero/"):
        return "Home hero / CTA band"
    if f.startswith("images/packages/"):
        return "Package cards and package detail"
    if "founder" in f or "baktoo" in f:
        return "About"
    if f.startswith("images/destinations/"):
        return "Home destination carousel; Explore; About"
    return "Marketing surface"

for m in manifest:
    f=m["file"]
    dims=f"{m['output_size'][0]}x{m['output_size'][1]}"
    subject=os.path.splitext(os.path.basename(f))[0].replace("-"," ").title()
    alt=f"Photograph of {subject.lower()} from the India Nepal Travel brochure"
    lines.append(f"| `{f}` | {m['group']} | {intended(m)} | {dims} | p{m['brochure_page']} | {subject} - {alt} | Brochure.pdf (own asset) |")

lines.append("")
lines.append("## Missing / not yet inventoried")
lines.append("- `public/images/services/kashmir-houseboat.jpg` referenced by houseboat feature but not generated; use a Kashmir/Dal Lake crop or a dedicated houseboat photograph.")
lines.append("- Favicons and social share images are not defined.")
lines.append("- No verified photography outside the brochure; any new imagery requires owner approval/licensing.")
lines.append("")
os.makedirs("docs",exist_ok=True)
open("docs/asset-inventory.md","w",encoding="utf-8").write("\n".join(lines))
print("done")
