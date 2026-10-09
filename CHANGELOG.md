# Changelog

All notable changes to Stux.Games Games are documented here.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/) (MAJOR.MINOR.PATCH).

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
