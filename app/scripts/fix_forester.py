import os
root="app/src"
for dp,_,fs in os.walk(root):
    for f in fs:
        if f.endswith((".ts",".tsx",".css",".md")):
            p=os.path.join(dp,f)
            s=open(p,encoding="utf-8").read()
            if "forester" in s:
                open(p,"w",encoding="utf-8").write(s.replace("forester","charcoal"))
print("done")
