const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const APP = path.resolve(__dirname, "..");
const BROWSER = "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe";

fs.writeFileSync(
  path.join(APP, "public", "__t.html"),
  `<!doctype html><html><head><title>h</title></head><body>
<iframe id="f" style="width:320px;height:900px;border:0"></iframe>
<pre id="o">PENDING</pre>
<script>
var f = document.getElementById("f");
f.addEventListener("load", function () {
  var d = f.contentDocument;
  document.getElementById("o").textContent = "LOADED scrollWidth=" + d.documentElement.scrollWidth + " clientWidth=" + d.documentElement.clientWidth;
});
f.src = "/";
<\/script>
</body></html>`
);

const r = spawnSync(
  BROWSER,
  [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--virtual-time-budget=20000",
    "--dump-dom",
    "http://localhost:3000/__t.html",
  ],
  { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 }
);
console.log("STATUS", r.status, "err", r.error && r.error.message);
console.log("DOM:", (r.stdout || "").slice(0, 1500));
