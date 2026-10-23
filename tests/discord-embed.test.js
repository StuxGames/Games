#!/usr/bin/env node
// Checks the Discord component embed and favicon tags written by scripts/build-head.js.
// Run with: node tests/discord-embed.test.js
"use strict";
const fs = require("fs");
const path = require("path");
const H = require("../scripts/build-head.js");

const ROOT = path.join(__dirname, "..");
let failed = 0;
function check(name, ok) { console.log((ok ? "ok   - " : "FAIL - ") + name); if (!ok) failed++; }

const ALLOWED = new Set([1, 2, 9, 10, 11, 12, 14, 17]);
const BUTTON_KEYS = new Set(["id", "type", "url", "style", "label", "emoji", "disabled"]);
function walk(c, depth, st) {
  st.count++;
  if (!ALLOWED.has(c.type)) st.bad.push("type " + c.type);
  if (c.type === 17 && depth > 0) st.bad.push("nested container");
  if (c.type === 2) {
    if (c.style !== 5) st.bad.push("button style " + c.style);
    if (!/^https?:\/\//.test(c.url || "")) st.bad.push("button url " + c.url);
    Object.keys(c).forEach((k) => { if (!BUTTON_KEYS.has(k)) st.bad.push("button key " + k); });
  }
  (c.components || []).forEach((x) => walk(x, depth + 1, st));
  if (c.accessory) walk(c.accessory, depth + 1, st);
}

let embeds = 0;
for (const file of H.pages()) {
  const rel = path.relative(ROOT, file).split(path.sep).join("/");
  const html = fs.readFileSync(file, "utf8");
  const head = html.slice(0, html.indexOf("</head>"));
  const m = head.match(/<script id="discord:component-embed" type="application\/json">([\s\S]*?)<\/script>/);
  if (!H.hasEmbed(rel)) { check(rel + " has no Discord embed", !m); }
  else {
    embeds++;
    check(rel + " has a Discord embed", !!m);
    if (m) {
      let doc = null;
      try { doc = JSON.parse(m[1]); } catch (e) { /* reported below */ }
      check(rel + " embed is valid JSON under " + H.MAX_BYTES + " bytes", doc !== null && Buffer.byteLength(m[1]) <= H.MAX_BYTES);
      const st = { count: 0, bad: [] };
      if (doc) walk(doc.component, 0, st);
      check(rel + " embed is one root Container, allowed types, link buttons only, <= 40 components", doc && doc.component.type === 17 && !st.bad.length && st.count <= 40);
      check(rel + " embed never prints a literal $1", m[1].indexOf("$1") < 0);
    }
  }
  for (const t of ['href="/favicon.ico"', 'sizes="512x512"', 'rel="apple-touch-icon"', 'rel="manifest" href="/site.webmanifest"']) {
    if (head.indexOf(t) < 0) { check(rel + " <head> has " + t, false); }
  }
  check(rel + " <head> has the favicon set", head.indexOf("<!-- head-icons -->") >= 0);
}
check("embeds were found", embeds >= 10);

check("md escapes Discord markdown", H.md("a*b_c~d`e|f[g]h\\i") === "a\\*b\\_c\\~d\\`e\\|f\\[g\\]h\\\\i");
check("md escapes a leading heading/quote/list marker", H.md("# x\n> y\n- z") === "\\# x\n\\> y\n\\- z");
check("md never produces a literal $1", H.md("*").indexOf("$1") < 0);
const evil = H.pageEmbed("/x/", "</script><b>*hi*", "# </SCRIPT>\n> [a](b)");
check("'</script>' can't close the tag early", evil.indexOf("</script>") === evil.lastIndexOf("</script>") && !/<\/script>[\s\S]*<\/script>/.test(evil) );
check("an oversized embed is left out for a comment", H.pageEmbed("/x/", "t", "x".repeat(4000)).startsWith("<!-- discord:component-embed left out"));

for (const f of ["favicon.ico", "apple-touch-icon.png", "site.webmanifest", "assets/img/icon-192.png", "assets/img/icon-512.png", "assets/img/icon-maskable-512.png"]) {
  check(f + " exists", fs.existsSync(path.join(ROOT, f)));
}
const man = JSON.parse(fs.readFileSync(path.join(ROOT, "site.webmanifest"), "utf8"));
check("manifest has name, short_name, start_url, display, colours, 192/512/maskable icons",
  man.name && man.short_name && man.start_url === "/" && man.display === "browser" && man.theme_color && man.background_color &&
  man.icons.some((i) => i.sizes === "192x192") && man.icons.some((i) => i.sizes === "512x512" && !i.purpose) &&
  man.icons.some((i) => i.sizes === "512x512" && i.purpose === "maskable"));
process.exit(failed ? 1 : 0);
