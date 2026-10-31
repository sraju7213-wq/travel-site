import os
root="app/src"
repls = [
 ("wild-orange-hover","brass-hover"),
 ("wild-border-light","white/10"),
 ("wild-border-mid","white/25"),
 ("wild-nav-blur","black/40"),
 ("wild-overlay","black/20"),
 ("wild-orange","brass"),
 ("wild-dark","forest"),
 ("wild-darker","charcoal"),
 ("wild-black","charcoal"),
 ("wild-cream","ivory-soft"),
 ("wild-sand","charcoal-soft"),
 ("wild-accent","brass-soft"),
 ("wild-white","white"),
]
files=[]
for dp,_,fs in os.walk(root):
    for f in fs:
        if f.endswith((".ts",".tsx",".css",".md")):
            files.append(os.path.join(dp,f))
for path in files:
    s=open(path,encoding="utf-8").read()
    orig=s
    for a,b in repls:
        s=s.replace(a,b)
    if s!=orig:
        open(path,"w",encoding="utf-8").write(s)
print("done")
