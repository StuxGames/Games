<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.games/logo-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.games/logo-dark.png"><img src="https://global.media.stux.games/logo-dark.png" height="80" alt="Stux.Games Logo"></picture>
</p>

# Contributing to Stux.Games Games

Stux.Games Games is a Stux.Games project, part of the Stux.Group Brand of Companies. The repository isn't open to public pull requests,
and per the [License](README.md#license) section it isn't licensed for redistribution or reuse.
This document exists for anyone with write access working on it consistently.

Questions: [hello@stux.games](mailto:hello@stux.games).

## Local setup

```
git clone https://github.com/StuxGames/Games.git
cd Games
./dev-server.sh
```

No install step: there's no `package.json`, no dependencies, nothing to build. `dev-server.js` is
a single dependency-free Node script; the only requirement is having Node itself installed. Pass
`--no-dev-mode` to test the site as it behaves in production (no dev banner).

## Project conventions

- **Plain HTML/CSS/JS, no framework, no build step.** Every page is a real `.html` file: no
  templating engine, no client-side router. The layout follows
  the other Stux.Group listing sites, recoloured in Stux.Games gold. Colours are CSS custom
  properties in `assets/css/style.css`: dark (`--bg #0e0b04`, `--bg-card #1b1608`,
  `--accent #ffba1a`) by default, and light (`--bg #fbf8ef`, `--bg-card #fff`, `--accent #855d00`)
  from the system preference or `<html data-theme="light">`. Headings are Oxanium, body copy Lato.
- **The Stux.Games twist** lives at the end of `style.css`: the pixel-dot grid and CRT scanlines
  behind the page, the blinking PRESS START in the hero, the cartridge notch along each card's top
  edge, and the `.player-tag` line on game cards. Keep animations behind `prefers-reduced-motion`.
- The sitemap (`sitemap.xml`, `sitemap/index.html`, `robots.txt`) is generated: after adding or removing a page, edit the `PAGES` list in `scripts/build-sitemap.py` and run `python scripts/build-sitemap.py`, then commit the result. Add new root files to the copy step in `.github/workflows/pages.yml`.
- Clean URLs use a folder-per-page layout (`legal/privacy/index.html` → `/legal/privacy/`).
- Shared styles live in `assets/css/style.css`; shared behaviour in `assets/js/main.js`. Copy the
  existing header/footer block when adding a page rather than introducing a templating system.
- `assets/js/dev-mode.js` is the production default (`DEV_MODE = false`), committed as-is.
  `dev-server.js` intercepts that one path locally and serves a generated version instead.
- **Game icons** go in `assets/img/games/` (resized to 128 × 128). Until a game has its own icon,
  its card uses the Stux.Games icon (`assets/img/icon.png`).
- **Only a few things load from elsewhere**, all Stux.Games' own: live status from
  `raw.githubusercontent.com/StuxGames/Status`, and the logo from `global.media.stux.games`. SeasonalOverlaysLibrary loads from
  `https://seasonaloverlayslibrary.stuxapis.net` (StuxAPIs), and the hero credits it. If you add another external
  load, update the Privacy Policy.

## Adding or retiring a game card

The list has three sections, in this order: **Featured**, **Games** and **Server tools**; add a
**Discontinued** section after them when a game is retired. The Gamepage template card sits under
Games with `data-state="template"`. Each game or tool card carries a `.player-tag` line (e.g.
"Multiplayer racing", "Open source") above its description, and its stack as `.pill`s.

1. Add/update the entry in the README's games table
2. Add/update the matching `<article class="project-card">` block in `index.html`. For a game
   that belongs to another brand, add `<div class="owner">Brand</div>` above the name
3. **One badge per card**, above the description (`<span class="badge-status ...">` before
   `<p class="desc">`). Declare the state on the `<article>` with `data-state="discontinued"`,
   `"template"`, `"maintenance"` or `"soon"` and render the matching badge in the HTML (e.g.
   `<span class="badge-status soon"><i class="badge-ico" aria-hidden="true"></i>Coming soon</span>`;
   Maintenance uses the `maintenance` class and the same icon element). If several states are
   listed, the first that applies wins: Discontinued, Template, Maintenance, Coming soon
4. **Live status:** with no `data-state`, a card with `data-monitor="<slug>"` (`stux-games:<slug>`, a slug monitored by
   `StuxGames/Status`; the bare form defaults to the `stux-games` source) gets one live badge from `main.js`: Online, Degraded or Offline. Add
   `<span class="badge-status live" hidden></span>` above the description; don't hard-code a
   "Live" badge, because it can't be kept accurate. No monitor, or status unavailable: no badge
5. When a game is discontinued, move its card into "Discontinued", add the `discontinued`
   class and `data-state="discontinued"`, drop any dead Website link, and add a one-line `<p class="discontinued-note">` saying why
6. Update the hero's game and tool counts if they changed

## Seasonal overlays

`main.js` asks SeasonalOverlaysLibrary for today's preset from its calendar. It plays once per
browser session (a `sessionStorage` flag), never on its own for people with
`prefers-reduced-motion`, and the hero button (labelled with today's preset) replays it. If the
library can't load, the button stays hidden and nothing else changes.

## Legal pages

All six live under `legal/` (`privacy`, `terms`, `cookies`, `imprint`, `disclaimer`, `opt-out`),
each its own folder with an `index.html`, linked from the **Boring Legal Stuff** hub at
`legal/index.html`. Keep them in sync with what the site actually does.

## Versioning and changelog

- The version lives in `VERSION.md` (a bare version string); bump it on every release
- Every release gets a `CHANGELOG.md` entry using `###` subsections in this order: Added,
  Changed, Fixed, Removed, Security, Deprecated. Never a bare bullet list under a version
- `commit.sh` (bash) and `commit.bat` (Windows) read `VERSION.md` and handle the commit and
  `git tag`; the release workflow publishes a GitHub Release when the tag is pushed

## Before committing

- Open changed pages via `./dev-server.sh` and click through: CI checks files and local links,
  but a live look is the only real check of how it renders
- Check both the dev-mode banner (default) and `--no-dev-mode` if you touched `dev-server.js` or
  `assets/js/dev-mode.js`
- Only link a repository if it is public: no "Repository" link on a card for a private or missing repo. Run `scripts/check-repo-links.sh` (needs `gh`) to list linked repos that are not public
