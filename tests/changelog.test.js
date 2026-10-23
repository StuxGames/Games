#!/usr/bin/env node
// Runs assets/js/changelogs.js against stubbed DOM/fetch and checks it renders Date Version
// headings (## vYY.MM.DD and ## vYY.MM.DD-N) with the sections in the fixed order.
// Run with: node tests/changelog.test.js
const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.join(__dirname, "..");
const src = fs.readFileSync(path.join(root, "assets/js/changelogs.js"), "utf8");
const sample = [
  "# Changelog", "", "intro text", "",
  "## v26.10.23-1", "", "### Deprecated", "", "- old", "",
  "### Security", "", "- sec", "", "### Removed", "", "- rem", "",
  "### Fixed", "", "- fix", "", "### Changed", "", "- chg", "", "### Added", "", "- add", "",
  "## v26.10.23", "", "### Added", "", "- first", "",
].join("\n");

let failed = 0;
function check(name, ok) { console.log((ok ? "ok   - " : "FAIL - ") + name); if (!ok) failed++; }

const els = { "cl-body": { innerHTML: "" }, "cl-version": { textContent: "" } };
const responses = { "/CHANGELOG.md": sample, "/VERSION.md": "26.10.23-1\n" };
const ctx = {
  document: { getElementById: (id) => els[id] },
  fetch: (u) => Promise.resolve({ ok: true, text: () => Promise.resolve(responses[u]) }),
};
vm.runInNewContext(src, ctx);

setTimeout(() => {
  const html = els["cl-body"].innerHTML;
  check("renders a ## v26.10.23-1 heading", html.includes("<h2>v26.10.23-1</h2>"));
  check("renders a ## v26.10.23 heading", html.includes("<h2>v26.10.23</h2>"));
  const first = html.split("</article>")[0];
  const order = ["added", "changed", "fixed", "removed", "security", "deprecated"]
    .map((t) => first.indexOf("cl-label-" + t));
  check("all six sections present", order.every((i) => i >= 0));
  check("sections sorted Added, Changed, Fixed, Removed, Security, Deprecated",
    order.every((v, i) => i === 0 || v > order[i - 1]));
  check("version badge accepts a Date Version with -N", els["cl-version"].textContent === "v26.10.23-1");
  process.exit(failed ? 1 : 0);
}, 50);
