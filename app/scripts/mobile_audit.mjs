/**
 * Mobile audit harness.
 *
 * Loads every route in a real Chromium at phone widths and reports the three
 * things that actually break a mobile site:
 *
 *   1. Horizontal overflow — including `position: fixed` elements, which the
 *      document's own `scrollWidth` does not report, so they are measured
 *      against the viewport directly.
 *   2. Touch targets below 44x44 CSS px (WCAG 2.5.5 / platform guidance).
 *   3. Text that is in the DOM but effectively invisible, because an entrance
 *      animation left it at `opacity: 0`.
 *
 * No new dependencies: the browser is the locally installed Edge or Chrome.
 * Temporary harness files are written into public/ and removed afterwards.
 *
 * Usage:
 *   node app/scripts/mobile_audit.mjs [--base http://localhost:3000]
 *                                     [--widths 320,390,430] [--shots <dir>]
 */

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const APP_ROOT = path.resolve(HERE, "..");
const PUBLIC_DIR = path.join(APP_ROOT, "public");

const BROWSERS = [
  "C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Microsoft/Edge/Application/msedge.exe",
  "C:/Program Files/Google/Chrome/Application/chrome.exe",
  "C:/Program Files (x86)/Google/Chrome/Application/chrome.exe",
];

const ROUTES = [
  "/",
  "/journeys",
  "/journeys?category=Himalayan%20Expeditions",
  "/journeys?activity=trekking",
  "/packages/delhi-stopover",
  "/houseboats",
  "/enquiry",
  "/about",
  "/contact",
  "/privacy",
  "/no-such-page",
];

const args = process.argv.slice(2);
const argValue = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const BASE = argValue("--base", "http://localhost:3000").replace(/\/$/, "");
const SHOT_DIR = argValue("--shots", "");
const WIDTHS = argValue("--widths", "320,390,430")
  .split(",")
  .map((w) => parseInt(w, 10))
  .filter(Boolean);

const MIN_TARGET = 44;

function findBrowser() {
  for (const p of BROWSERS) if (fs.existsSync(p)) return p;
  return null;
}

/** The probe runs inside the target page and reports what it finds. */
function probeScript() {
  return `(function () {
    var vw = document.documentElement.clientWidth;
    var out = { vw: vw, scrollW: document.documentElement.scrollWidth, overflow: [], small: [], invisible: [] };

    // 1. Elements that reach past the viewport edge.
    var all = document.querySelectorAll('body *');
    for (var i = 0; i < all.length && out.overflow.length < 20; i++) {
      var el = all[i];
      var r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      var cs = getComputedStyle(el);
      if (cs.visibility === 'hidden' || cs.display === 'none') continue;
      if (el.closest('[hidden],[aria-hidden="true"]')) continue;
      if (r.right > vw + 1 || r.left < -1) {
        // Ignore anything inside a clipping ancestor — it cannot overflow the page.
        var p = el.parentElement, clipped = false;
        while (p && p !== document.body) {
          var pcs = getComputedStyle(p);
          if (pcs.overflowX !== 'visible' || pcs.overflowY !== 'visible') { clipped = true; break; }
          p = p.parentElement;
        }
        if (clipped) continue;
        out.overflow.push({
          tag: el.tagName.toLowerCase(),
          cls: (el.className && el.className.toString ? el.className.toString() : '').slice(0, 110),
          left: Math.round(r.left),
          right: Math.round(r.right),
          position: cs.position,
          text: (el.textContent || '').trim().slice(0, 50)
        });
      }
    }

    // 2. Touch targets that are too small.
    //    WCAG 2.5.8 exempts targets that sit inline in a sentence and inputs
    //    whose own <label> is the clickable target, so those are skipped.
    var tap = document.querySelectorAll('a[href],button,input,select,textarea,[role="tab"]');
    for (var j = 0; j < tap.length && out.small.length < 25; j++) {
      var t = tap[j];
      var ts = getComputedStyle(t);
      if (ts.display === 'none' || ts.visibility === 'hidden') continue;
      if (t.closest('[hidden],[aria-hidden="true"]')) continue;
      var tr = t.getBoundingClientRect();
      if (tr.width === 0 || tr.height === 0) continue;
      // The skip link is a screen-reader utility that only exists on focus.
      if (tr.width <= 2 && tr.height <= 2) continue;
      // An input wrapped by its own label is targeted through the label.
      if ((t.tagName === 'INPUT' || t.tagName === 'SELECT' || t.tagName === 'TEXTAREA') && t.closest('label')) continue;
      // A link inside a run of text is an inline target and is exempt.
      if (t.tagName === 'A') {
        var host = t.parentElement;
        if (host) {
          var hostText = (host.textContent || '').trim();
          var ownText = (t.textContent || '').trim();
          if (hostText.length > ownText.length + 4) continue;
        }
      }
      if (tr.height < ${MIN_TARGET}) {
        out.small.push({
          tag: t.tagName.toLowerCase(),
          w: Math.round(tr.width),
          h: Math.round(tr.height),
          text: (t.textContent || '').trim().slice(0, 40)
        });
      }
    }

    // 3. Text that is present but invisible.
    var texts = document.querySelectorAll('h1,h2,h3,h4,p,span,a,li,button,label,dt,dd,summary');
    for (var k = 0; k < texts.length && out.invisible.length < 15; k++) {
      var e = texts[k];
      var txt = (e.textContent || '').trim();
      if (txt.length < 4) continue;
      var es = getComputedStyle(e);
      if (es.display === 'none' || es.visibility === 'hidden') continue;
      var er = e.getBoundingClientRect();
      if (er.width === 0 || er.height === 0) continue;
      if (e.closest('[hidden],[inert],[aria-hidden="true"]')) continue;
      var q = e, hidden = false;
      while (q && q !== document.body) {
        if (parseFloat(getComputedStyle(q).opacity) < 0.05) { hidden = true; break; }
        q = q.parentElement;
      }
      if (hidden) out.invisible.push(e.tagName.toLowerCase() + ' "' + txt.slice(0, 45) + '"');
    }

    window.__mobileProbeResult = JSON.stringify(out);
  })();`;
}

function harnessHtml() {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>mobile audit</title>
<style>html,body{margin:0;padding:0;background:#fff}#frame{border:0;display:block}#out{font:11px monospace;white-space:pre-wrap}</style>
</head>
<body>
<iframe id="frame" title="audit target"></iframe>
<pre id="out">PENDING</pre>
<script>
(function () {
  var params = new URLSearchParams(location.search);
  var target = params.get("target") || "/";
  var width = parseInt(params.get("width") || "390", 10);
  var frame = document.getElementById("frame");
  var out = document.getElementById("out");
  var settled = false;

  frame.style.width = width + "px";
  frame.style.height = "900px";
  frame.src = target;

  function finish(result) {
    if (settled) return;
    settled = true;
    out.textContent = "RESULT:" + JSON.stringify(result);
  }

  frame.addEventListener("load", function () {
    var d = frame.contentDocument;
    // Give the entrance animations a moment, then probe the settled layout.
    window.setTimeout(function () {
      try {
        d.documentElement.style.overflow = "hidden";
      } catch (e) { /* ignore */ }
      try {
        var s = d.createElement("script");
        s.textContent = ${JSON.stringify(probeScript())};
        d.head.appendChild(s);
        var raw = frame.contentWindow.__mobileProbeResult;
        if (!raw) { finish({ error: "probe did not report" }); return; }
        finish(JSON.parse(raw));
      } catch (e) {
        finish({ error: String(e) });
      }
    }, 1500);
  });

  window.setTimeout(function () { finish({ error: "timeout" }); }, 20000);
})();
<\/script>
</body>
</html>`;
}

function writeHarness() {
  const htmlPath = path.join(PUBLIC_DIR, "__mobile_audit.html");
  fs.writeFileSync(htmlPath, harnessHtml(), "utf8");
  return htmlPath;
}

function removeHarness(file) {
  try {
    fs.unlinkSync(file);
  } catch {
    /* already gone */
  }
}

function runHeadless(browser, url, extraArgs = []) {
  const res = spawnSync(
    browser,
    [
      "--headless=new",
      "--disable-gpu",
      "--no-sandbox",
      "--disable-dev-shm-usage",
      "--hide-scrollbars",
      "--virtual-time-budget=25000",
      ...extraArgs,
      "--dump-dom",
      url,
    ],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024, timeout: 120000 },
  );
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

  const harness = writeHarness();
  const results = [];
  const shots = [];

  try {
    for (const route of ROUTES) {
      for (const width of WIDTHS) {
        const url = `${BASE}/__mobile_audit.html?target=${encodeURIComponent(route)}&width=${width}`;
        const result = extractResult(runHeadless(browser, url));
        if (!result) {
          results.push({ route, width, error: "no result parsed from DOM" });
          continue;
        }
        results.push({ route, width, ...result });

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
    removeHarness(harness);
  }

  const report = { base: BASE, browser, widths: WIDTHS, results, shots };
  const outPath = path.join(APP_ROOT, "..", "docs", "audits", "mobile-audit.json");
  fs.writeFileSync(outPath, JSON.stringify(report, null, 2), "utf8");

  let problems = 0;
  for (const r of results) {
    const label = `${r.route} @${r.width}`;
    if (r.error) {
      console.log(`${label}  ERROR ${r.error}`);
      problems++;
      continue;
    }
    const overflowCount = r.overflow?.length ?? 0;
    const smallCount = r.small?.length ?? 0;
    const invisibleCount = r.invisible?.length ?? 0;
    problems += overflowCount + smallCount + invisibleCount;
    console.log(
      `${label}  overflow=${overflowCount} smallTargets=${smallCount} invisibleText=${invisibleCount}`,
    );
    for (const o of r.overflow ?? []) {
      console.log(`    OVERFLOW <${o.tag}> ${o.cls} [${o.left}..${o.right}] pos=${o.position} "${o.text}"`);
    }
    for (const s of r.small ?? []) {
      console.log(`    SMALL <${s.tag}> ${s.w}x${s.h} "${s.text}"`);
    }
    for (const s of r.invisible ?? []) {
      console.log(`    INVISIBLE ${s}`);
    }
  }
  console.log(`\nTOTAL mobile problems: ${problems}`);
  console.log(`Report written to ${outPath}`);
  if (shots.length) console.log(`Screenshots (${shots.length}) in ${SHOT_DIR}`);
}

main();
