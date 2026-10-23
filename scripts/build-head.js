#!/usr/bin/env node
// Writes the shared <head> blocks into every HTML page of this static site:
//   - the favicon set tags (all pages), and
//   - the Discord component embed (<script id="discord:component-embed">), on every page
//     except 404 and the /changelog/ redirect stub.
// Each block sits between marker comments, so re-running replaces it in place.
//
// Usage: node scripts/build-head.js          (rewrite the pages)
//        node scripts/build-head.js --check  (exit 1 if any page is out of date)
"use strict";
const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "..");
const SITE = "https://games.stux.games";
const SITE_NAME = "Stux.Games Games";
const ACCENT = "#ffba1a";
const MAX_BYTES = 3000;

const FAVICON = [
  '<link rel="icon" href="/favicon.ico" sizes="48x48">',
  '<link rel="icon" type="image/png" sizes="512x512" href="/assets/img/icon-512.png">',
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png">',
  '<link rel="manifest" href="/site.webmanifest">',
].join("\n  ");

/** Escapes Discord markdown so data shows as plain text ('\\$1' = backslash, then the character). */
function md(s) {
  s = String(s).replace(/([\\*_~`|\[\]])/g, "\\$1");
  return s.replace(/^([#>-])/gm, "\\$1");
}
const text = (content) => ({ type: 10, content });
function buttons(links) {
  return { type: 1, components: Object.keys(links).map((label) => ({ type: 2, style: 5, label: label.slice(0, 80), url: links[label] })) };
}
function section(markdown) {
  return { type: 9, components: [text(markdown)], accessory: { type: 11, media: { url: SITE + "/assets/img/icon-512.png" } } };
}
const siteLabel = () => "-# [" + md(SITE_NAME) + "](" + SITE + "/)\n";

function payload(components) {
  const json = JSON.stringify({ component: { type: 17, accent_color: parseInt(ACCENT.slice(1), 16), components } })
    .replace(/</g, "\\u003c"); // can't close the <script> early
  return Buffer.byteLength(json) > MAX_BYTES ? null : json;
}
function embed(components) {
  const json = payload(components);
  return json === null
    ? "<!-- discord:component-embed left out: over " + MAX_BYTES + " bytes -->"
    : '<script id="discord:component-embed" type="application/json">' + json + "</script>";
}

/** A page's embed: `route` is its URL path, `title`/`desc` come from its <title> and meta description. */
function pageEmbed(route, title, desc) {
  const url = SITE + route;
  if (route === "/") {
    return embed([
      section("# [" + md(SITE_NAME) + "](" + url + ")\n**Made to be played.**\n" +
        "Every Stux.Games game and the open-source server tools behind them, each with its own repository and live status."),
      { type: 14 },
      text("2 games · 3 open-source server tools · status checked every 5 minutes"),
      buttons({ "Browse games": url + "#games", "Live status": "https://status.stux.games", "Stux.Games": "https://stux.games" }),
    ]);
  }
  const links = route.indexOf("/legal/") === 0 && route !== "/legal/"
    ? { Open: url, "Boring Legal Stuff": SITE + "/legal/", "All games": SITE + "/" }
    : { Open: url, "All games": SITE + "/" };
  return embed([section(siteLabel() + "## [" + md(title) + "](" + url + ")\n" + md(desc)), buttons(links)]);
}

const unescapeHtml = (s) => s.replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&amp;/g, "&");
function pages() {
  const out = [];
  (function walk(dir) {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      if (e.name === ".git" || e.name === "node_modules" || e.name === ".github") continue;
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p); else if (e.name.endsWith(".html")) out.push(p);
    }
  })(ROOT);
  return out.sort();
}
function routeOf(file) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  if (rel === "index.html") return "/";
  return rel.endsWith("/index.html") ? "/" + rel.slice(0, -"index.html".length) : "/" + rel;
}
const hasEmbed = (rel) => rel !== "404.html" && rel !== "changelog/index.html";

function build(html, rel) {
  const title = unescapeHtml((html.match(/<title>([^<]*)<\/title>/) || [])[1] || SITE_NAME).replace(/\s+[—-]\s+Stux\.Games Games$/, "").replace(/^Stux\.Games Games$/, SITE_NAME);
  const desc = unescapeHtml((html.match(/<meta name="description" content="([^"]*)"/) || [])[1] || "");
  html = html.replace(/[ \t]*<!-- head-icons -->[\s\S]*?<!-- \/head-icons -->\r?\n?/g, "")
             .replace(/[ \t]*<!-- head-discord -->[\s\S]*?<!-- \/head-discord -->\r?\n?/g, "");
  let block = "  <!-- head-icons -->\n  " + FAVICON + "\n  <!-- /head-icons -->\n";
  if (hasEmbed(rel)) {
    block += "  <!-- head-discord -->\n  " + pageEmbed(routeOf(path.join(ROOT, rel)), title, desc) + "\n  <!-- /head-discord -->\n";
  }
  // Before the first existing <link rel="icon">, else before </head>.
  const anchor = /^[ \t]*<link rel="icon"/m.exec(html) || /^[ \t]*<\/head>/m.exec(html) || /<\/head>/.exec(html);
  if (!anchor) throw new Error(rel + ": no <head> to write into");
  return html.slice(0, anchor.index) + block + html.slice(anchor.index);
}

if (require.main === module) {
  const check = process.argv.includes("--check");
  let stale = 0;
  for (const file of pages()) {
    const rel = path.relative(ROOT, file).split(path.sep).join("/");
    const old = fs.readFileSync(file, "utf8");
    const next = build(old, rel);
    if (next !== old) {
      stale++;
      if (check) console.log("out of date: " + rel); else fs.writeFileSync(file, next);
    }
  }
  if (check && stale) { console.log("Run: node scripts/build-head.js"); process.exit(1); }
  console.log(check ? "All pages up to date" : stale + " page(s) updated");
}
module.exports = { md, pageEmbed, payload, FAVICON, MAX_BYTES, pages, routeOf, hasEmbed, build };
