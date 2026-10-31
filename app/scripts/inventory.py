import os, json
from PIL import Image
ROOT="app/public/images"
out=[]
for dp,_,fs in os.walk(ROOT):
    for f in fs:
        if f.lower().endswith((".jpg",".jpeg",".png",".webp",".svg",".ico")):
            p=os.path.join(dp,f)
            rel=os.path.relpath(p,ROOT).replace("\\","/")
            try:
                im=Image.open(p)
                dims=f"{im.width}x{im.height}"
            except Exception:
                dims="n/a"
            out.append((rel,dims))
out.sort()
print(len(out))
for r in out[:20]:
    print(r)
