"""Extract embedded raster images from Brochure.pdf into app/public/images/brochure."""

import json
import os
import sys

import fitz

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PDF = os.path.join(os.path.dirname(ROOT), "Brochure.pdf")
OUT = os.path.join(ROOT, "public", "images", "brochure")


def main() -> int:
    doc = fitz.open(PDF)
    os.makedirs(OUT, exist_ok=True)
    found = []
    for pno in range(doc.page_count):
        page = doc.load_page(pno)
        for idx, info in enumerate(page.get_images(full=True)):
            xref = info[0]
            try:
                base = doc.extract_image(xref)
            except Exception as exc:  # pragma: no cover - defensive
                print(f"page {pno + 1} xref {xref}: {exc}", file=sys.stderr)
                continue
            w, h = base["width"], base["height"]
            ext = base["ext"]
            if w < 200 or h < 150:
                continue
            name = f"p{pno + 1:02d}-{idx:02d}-{w}x{h}.{ext}"
            path = os.path.join(OUT, name)
            with open(path, "wb") as fh:
                fh.write(base["image"])
            found.append({"file": name, "page": pno + 1, "w": w, "h": h})
    print(json.dumps(found, indent=1))
    print(f"total={len(found)}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
