/**
 * Accessibility + responsive audit harness.
 *
 * Runs the already-installed axe-core against the running dev server in a real
 * Chromium (Microsoft Edge), at the widths that matter, and reports:
 *   - axe violations (impact + selector)
 *   - horizontal overflow at each width, with the offending elements
 *   - a screenshot per route/width for visual review
 *
 * No new dependencies: axe-core comes from node_modules, the browser is the
 * locally installed Edge. Temporary harness files are written into public/
 * and removed afterwards.
 *
 * Usage:
 *   node app/scripts/a11y_audit.mjs [--base http://localhost:3000] [--shots <dir>]
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const PUBLIC_DIR = path.join(APP_ROOT, "public");
const AXE_SRC = path.join(APP_ROOT, "node_modules", "axe-core", "axe.min.js");

const BROWSERS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const ROUTES = [
  "/",
  "/explore",
  "/explore/Stopovers",
  "/packages/delhi-stopover",
  "/packages/north-india-highlights",
  "/houseboats",
  "/enquiry",
  "/enquiry?package=delhi-stopover",
  "/about",
  "/contact",
  "/no-such-page",
];

const WIDTHS = [320, 375, 390, 768, 1440];

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = argValue("--base", "http://localhost:3000").replace(/\/$/, "");
const SHOT_DIR = argValue("--shots", "");
const ONLY_ROUTES = argValue("--routes", "");

function findBrowser() {
  for (const p of BROWSERS) {
    if (fs.existsSync(p)) return p;
  }
  return null;
}

function harnessHtml() {
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<title>audit harness</title>
<style>
  html, body { margin: 0; padding: 0; background: #fff; }
  #frame { border: 0; display: block; }
  #out { font: 12px monospace; white-space: pre-wrap; }
</style>
</head>
<body>
<iframe id="frame" title="audit target"></iframe>
<pre id="out">PENDING</pre>
<script>
(function () {
  var params = new URLSearchParams(location.search);
  var target = params.get("target") || "/";
  var width = parseInt(params.get("width") || "1280", 10);
  var frame = document.getElementById("frame");
  var out = document.getElementById("out");
  var settled = false;

  frame.style.width = width + "px";
  frame.style.height = "1200px";
  frame.src = target;

  function overflowInfo(doc) {
    var de = doc.documentElement;
    var scrollWidth = Math.max(de.scrollWidth, doc.body ? doc.body.scrollWidth : 0);
    var clientWidth = de.clientWidth;
    var offenders = [];
    if (scrollWidth > clientWidth + 1) {
      var all = doc.querySelectorAll("*");
      for (var i = 0; i < all.length && offenders.length < 12; i++) {
        var el = all[i];
        var r = el.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) continue;
        if (r.right > clientWidth + 1 || r.left < -1) {
          offenders.push({
            tag: el.tagName.toLowerCase(),
            cls: (el.className && el.className.toString ? el.className.toString() : "").slice(0, 140),
            left: Math.round(r.left),
            right: Math.round(r.right),
            text: (el.textContent || "").trim().slice(0, 60)
          });
        }
      }
    }
    return { scrollWidth: scrollWidth, clientWidth: clientWidth, overflow: scrollWidth > clientWidth + 1, offenders: offenders };
  }

  function finish(result) {
    if (settled) return;
    settled = true;
    out.textContent = "RESULT:" + JSON.stringify(result);
  }

  frame.addEventListener("load", function () {
    var doc = frame.contentDocument;
    var win = frame.contentWindow;
    var result = { target: target, width: width, overflow: null, axe: null, axeError: null };
    try {
      result.overflow = overflowInfo(doc);
    } catch (e) {
      result.overflow = { error: String(e) };
    }

    // Inject axe into the frame's own window so it evaluates the target document.
    var s = doc.createElement("script");
    s.src = "/__axe.js";
    s.onload = function () {
      var axe = win.axe;
      if (!axe) { result.axeError = "axe did not load into frame"; finish(result); return; }
      axe.run(doc, { resultTypes: ["violations"] }, function (err, res) {
        if (err) {
          result.axeError = String(err);
        } else {
          result.axe = res.violations.map(function (v) {
            return {
              id: v.id,
              impact: v.impact,
              help: v.help,
              count: v.nodes.length,
              nodes: v.nodes.slice(0, 5).map(function (n) {
                return { target: n.target.join(" "), summary: (n.failureSummary || "").split("\\n")[1] || "" };
              })
            };
          });
        }
        finish(result);
      });
    };
    s.onerror = function () { result.axeError = "axe script failed to load"; finish(result); };
    doc.head.appendChild(s);
  });

  // Safety net: never leave the harness hanging.
  setTimeout(function () {
    finish({ target: target, width: width, overflow: null, axe: null, axeError: "timeout" });
  }, 12000);
})();
<\/script>
</body>
</html>`;
}

function writeHarness() {
  const htmlPath = path.join(PUBLIC_DIR, "__audit.html");
  const axePath = path.join(PUBLIC_DIR, "__axe.js");
  fs.writeFileSync(htmlPath, harnessHtml(), "utf8");
  fs.copyFileSync(AXE_SRC, axePath);
  return { htmlPath, axePath };
}

function removeHarness(files) {
  for (const f of Object.values(files)) {
    try {
      fs.unlinkSync(f);
    } catch {
      /* already gone */
    }
  }
}

function runHeadless(browser, url, extraArgs = []) {
  const browserArgs = [
    "--headless=new",
    "--disable-gpu",
    "--no-sandbox",
    "--disable-dev-shm-usage",
    "--hide-scrollbars",
    "--virtual-time-budget=25000",
    ...extraArgs,
    "--dump-dom",
    url,
  ];
  const res = spawnSync(browser, browserArgs, {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
    timeout: 120000,
  });
  return res.stdout ?? "";
}

function extractResult(dom) {
  const marker = "RESULT:";
  const idx = dom.indexOf(marker);
  if (idx === -1) return null;
  const rest = dom.slice(idx + marker.length);
  const end = rest.indexOf("</pre>");
  const json = (end === -1 ? rest : rest.slice(0, end)).trim();
  try {
    return JSON.parse(json);
  } catch {
    return null;
  }
}

function main() {
  const browser = findBrowser();
  if (!browser) {
    console.error("No Chromium-based browser found. Install Edge or Chrome.");
    process.exit(2);
  }
  if (!fs.existsSync(AXE_SRC)) {
    console.error("axe-core not found in node_modules. Run npm install first.");
    process.exit(2);
  }

  const routes = ONLY_ROUTES ? ONLY_ROUTES.split(",").map((r) => r.trim()) : ROUTES;
  const files = writeHarness();
  const shots = [];
  const results = [];

  try {
    for (const route of routes) {
      for (const width of WIDTHS) {
        const url = `${BASE}/__audit.html?target=${encodeURIComponent(route)}&width=${width}`;
        const dom = runHeadless(browser, url);
        const result = extractResult(dom);
        if (!result) {
          results.push({ route, width, error: "no result parsed from DOM" });
          continue;
        }
        results.push(result);

        if (SHOT_DIR) {
          fs.mkdirSync(SHOT_DIR, { recursive: true });
          const shotPath = path.join(
            SHOT_DIR,
            `${route.replace(/[/?=&]/g, "_") || "home"}-${width}.png`,
          );
          runHeadless(browser, `${BASE}${route}`, [
            `--window-size=${width},900`,
            `--screenshot=${shotPath}`,
          ]);
          shots.push(shotPath);
        }
      }
    }
  } finally {
    removeHarness(files);
  }

  const report = { base: BASE, browser, results, shots };
  const outPath = path.join(APP_ROOT, "..", "docs", "a11y-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  let violations = 0;
  for (const r of results) {
    const label = r.route ?? r.target ?? "?";
    if (r.error) {
      console.log(`\n${label} @${r.width}  ERROR ${r.error}`);
      continue;
    }
    const ov = r.overflow;
    const axeCount = r.axe ? r.axe.length : 0;
    violations += axeCount;
    console.log(
      `\n${label} @${r.width}px  overflow=${ov && ov.overflow ? "YES" : "no"}` +
        `  scrollWidth=${ov ? ov.scrollWidth : "?"} clientWidth=${ov ? ov.clientWidth : "?"}  axeViolations=${axeCount}`,
    );
    if (ov && ov.overflow && ov.offenders && ov.offenders.length) {
      for (const o of ov.offenders) {
        console.log(`    OVERFLOW <${o.tag}> ${o.cls} [${o.left}..${o.right}] "${o.text}"`);
      }
    }
    if (r.axeError) console.log(`    axe error: ${r.axeError}`);
    if (r.axe) {
      for (const v of r.axe) {
        console.log(`    [${v.impact}] ${v.id} (${v.count}) ${v.help}`);
        for (const n of v.nodes) console.log(`        ${n.target}  ${n.summary}`);
      }
    }
  }
  console.log(`\nTOTAL axe violation entries: ${violations}`);
  console.log(`Report written to ${outPath}`);
  if (shots.length) console.log(`Screenshots (${shots.length}) in ${SHOT_DIR}`);
}

main();
