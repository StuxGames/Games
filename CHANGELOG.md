# Changelog

All notable changes to Stux.Games Games are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Date Versioning](https://datevers.ing) since v26.10.23 (`YY.MM.DD`, the UTC release date, with `-1`, `-2`… for later releases the same day); earlier releases used [Semantic Versioning](https://semver.org/).

## v26.11.13

### Changed

- The imprint gives Stux Group Ltd's new registered office, 124 City Road, London, EC1V 2NX, England, United Kingdom. The company
  number (13160574) and "registered in England and Wales" are unchanged

## v26.11.08

### Changed

- **Status checks are described as "checked regularly", not "every 5 minutes".** GitHub runs the status schedule
  best-effort, often much less often, so the hero stat now shows the 90 days of uptime history instead of "5 min
  between status checks", and the status card, status band, live band text and Discord embed say "checked regularly"

## v26.11.07

### Changed

- **The hero eyebrow is a live status badge.** It links to status.stux.games and, once the status loads, shows only
  the overall status (All operational, Degraded, Partial outage or Major outage) in the status badge colours, with a
  dot that pulses when everything is up (not with reduced motion). It reuses the card badges' `summary.json` fetch,
  and stays the plain "Stux.Games" eyebrow if the status can't load. README and CONTRIBUTING describe it
- The live status code parses `data-monitor` and `data-status-eyebrow` with one shared helper

## v26.11.06-1

### Added

- A `test` branch: work happens on `test` (or a branch off it), and reaches `main` only through a pull request from
  `test` that Leo reviews and merges. Release commits and tags are made on `test`. CONTRIBUTING has a Branches section
  and the README's Versioning section says so

### Changed

- CI runs on pushes to `test` as well as `main`
- `commit.sh` and `commit.bat` suggest `git push origin test --tags`

## v26.11.06

### Added

- `scripts/badge-icons.py` (copied from StuxGroup/Services, originally TheRidgwells/Projects) builds badge-style icons in
  Stux.Games' amber: the Stux.Games mark on a round avatar, with a badge in the corner saying what the game or tool is

### Changed

- **Every card uses its full name, with its own icon.** "Status" is now Stux.Games Status, with a heartbeat badge, and
  "Gamepage" is now Stux.Games Gamepage, with a handheld console badge. Flappie Race (race flag), MultiPong (paddles and
  ball), GameServerList (list), GameServerManager (server rack) and FlappieRaceBackend (stack) each get their own badge
  instead of the shared Stux.Games icon. Each icon's alt text uses the same full name
- `CONTRIBUTING.md` and the README table describe the full-name and badge-icon rules

### Removed

- `assets/img/games/status.svg`, replaced by the Stux.Games Status badge icon

## v26.10.23

### Added

- A Discord link preview: every page except the 404 and the old `/changelog/` redirect carries a `discord:component-embed` block in its `<head>` (the Open Graph fallback is unchanged), with the home page showing what the site is, the key facts and links to the games and live status
- A full favicon set at the site root: `favicon.ico` (16, 32 and 48 px), an opaque `apple-touch-icon.png`, and `site.webmanifest` with 192 px, 512 px and maskable icons, linked from every page's `<head>`
- `scripts/build-head.js` writes and checks those `<head>` blocks (`node scripts/build-head.js`, or `--check` in CI)
- `tests/changelog.test.js` and `tests/discord-embed.test.js`, run by CI: the changelog page reads Date Version headings in the fixed section order, and every embed is valid, under 3,000 bytes and safely escaped
- `tests/version.sh`, which checks that `VERSION.md` is a valid Date Version, a real calendar date not in the future, and the same as the newest entry in this changelog

### Changed

- Switched from Semantic Versioning to [Date Versioning](https://datevers.ing): releases are numbered by their UTC release date as `YY.MM.DD`, with `-1`, `-2`… for later releases the same day. This release follows v1.2.0
- `commit.sh` and `commit.bat` refuse a `VERSION.md` that isn't a valid Date Version or is dated in the future (UTC), and warn when it's dated before today
- `README.md` and `CONTRIBUTING.md` describe Date Versioning and the release steps
- CI checks `VERSION.md` as a Date Version and runs the new tests; the dev server serves `.webmanifest` with the right type

## v1.2.0

### Added

- A light/dark toggle at the end of the header on every page, like the brand pages': it shows the theme it switches to (a sun on dark, a moon on light). Until it's used the site follows the system theme; after that the choice is remembered in this browser

## v1.1.2

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## v1.1.1

### Changed

- The favicon follows the browser's light or dark theme: the deep icon (`icon-dark.png`) on light and the bright one (`icon-light.png`) on dark, straight from the brand's media host instead of a local copy, so a brand colour change is just a new file there
- The logos and icons in the Markdown docs (README and the like) follow GitHub's light or dark theme, using each brand's `logo-light`/`logo-dark` and `icon-light`/`icon-dark` files

### Fixed

- The changelog page's section badges switch to their deeper light-theme colours when the light theme comes from the system preference, not only when it's set explicitly

## v1.1.0

### Added

- Stux.Games itself is listed first under Featured, ahead of Status, with a live status badge and links to stux.games and a way to get in touch

### Fixed

- The dark theme showed the deep gold Stux.Games icon (made for light backgrounds), which looked muddy; it now shows the bright icon on dark and the deep one on light, in the header and on every card

## v1.0.1

### Fixed

- The footer's copyright line names Stux.Games instead of Stux.Group ("© 2026 Stux.Games. All rights reserved."), matching the brand the site belongs to. The legal pages' statement that the names and logos belong to Stux.Group is unchanged

## v1.0.0

### Added

- Stux.Games Games (games.stux.games): the directory of Stux.Games' games and the open-source server tools behind them, built like the other Stux.Group listing sites in Stux.Games gold (`#ffba1a` on dark, `#855d00` on light), with Oxanium headings
- Cards for the Status page (live overall status), Flappie Race and MultiPong (Coming soon), the Gamepage template, and the GameServerList, GameServerManager and FlappieRaceBackend server tools, each with its stack and repository
- The Stux.Games twist: a pixel-dot grid and CRT scanlines behind the page, a blinking PRESS START in the "in one lobby" hero, a cartridge notch along each card's top edge, and a player tag on every game card
- Live status badges and the status band, read from status.stux.games (`StuxGames/Status`), and seasonal overlays from SeasonalOverlaysLibrary (StuxAPIs)
- The Boring Legal Stuff hub (`/legal/`) with its six pages, a changelogs page that renders this file (sections sorted Added, Changed, Fixed, Removed, Security, Deprecated), a 404 page, and `/sitemap/` + `sitemap.xml` + `robots.txt`
- `dev-server.sh` / `dev-server.bat` / `dev-server.js` with DEV_MODE forced on (dev banner) and `--no-dev-mode`; GitHub Actions for Pages deployment, CI checks and GitHub Releases
- `README.md`, `CONTRIBUTING.md`, `VERSION.md`, `LICENSE` and `commit.sh` / `commit.bat`
