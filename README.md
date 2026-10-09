<p align="center">
  <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.games/logo-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.games/logo-dark.png"><img src="https://global.media.stux.games/logo-dark.png" height="100" alt="Stux.Games Logo"></picture>
</p>

# Stux.Games Games

### *Every Stux.Games game, in one lobby.*

[Stux.Games Games](https://games.stux.games) is a small, static, no-build-step website that
lists every Stux.Games game and the open-source server tools behind them, and links out to each
one's repository and page. It's built the same way as the other Stux.Group listing sites, in
Stux.Games gold, with a games twist: a pixel-dot grid and CRT scanlines behind the page, a blinking
PRESS START, and cartridge-notched cards.

- Plain HTML, CSS and JavaScript: no framework, no bundler, no dependencies to install
- Dark and light themes, following your system preference, with the matching Stux.Games logo for each
- **Live status** on cards, read from [status.stux.games](https://status.stux.games)
  (`StuxGames/Status`, powered by [GitHup](https://githup.stux.group))
- **Seasonal overlays** from [SeasonalOverlaysLibrary](https://seasonaloverlayslibrary.stuxapis.net)
  (StuxAPIs): today's preset plays once per visit (never with reduced motion), and the hero button replays it
- Deployed to [GitHub Pages](https://pages.github.com/) by `.github/workflows/pages.yml`
- No accounts, no ads, no cookies, no tracking scripts

---

## Games listed here

| Game or tool | What it is | Page | Repo |
|---|---|---|---|
| Stux.Games | The studio itself: games and the open-source tools behind them | [stux.games](https://stux.games) | private |
| Stux.Games Status | Live status and uptime history of Stux.Games and its sites | [status.stux.games](https://status.stux.games) | [StuxGames/Status](https://github.com/StuxGames/Status) |
| Flappie Race | Multiplayer flappy-style racing game, built in Godot (Coming soon) | [gamepage.stux.games](https://gamepage.stux.games) | [StuxGames/FlappieRace](https://github.com/StuxGames/FlappieRace) |
| MultiPong | Pong rebuilt for playing other people online (Coming soon) | [gamepage.stux.games](https://gamepage.stux.games) | [StuxGames/MultiPong](https://github.com/StuxGames/MultiPong) |
| Gamepage | The placeholder page a game shows until its own page is built (Template) | [gamepage.stux.games](https://gamepage.stux.games) | [StuxGames/gamepage](https://github.com/StuxGames/gamepage) |
| GameServerList | Game server list API for in-game server browsers (Rust, Axum) | - | [StuxGames/GameServerList](https://github.com/StuxGames/GameServerList) |
| GameServerManager | Game server manager API, one Docker container per server (Python, FastAPI) | - | [StuxGames/GameServerManager](https://github.com/StuxGames/GameServerManager) |
| FlappieRaceBackend | Flappie Race's server list, server manager, Watchtower and Nginx proxy, via Docker Compose | - | [StuxGames/FlappieRaceBackend](https://github.com/StuxGames/FlappieRaceBackend) |

This table (and the matching cards on the site) is the source of truth for what's listed. Update
both together when a game or tool is added, retired or renamed. Each card shows one badge above its
description: Discontinued, Template, Maintenance or Coming soon (from `data-state`, in that order
of precedence), otherwise a live Online / Degraded / Offline badge when it has a `data-monitor`
(`stux-games:<slug>`) matching a monitor slug in `StuxGames/Status`'s `.githup.yml`.

## Local development

```
./dev-server.sh          # http://127.0.0.1:8080, DEV_MODE forced on
./dev-server.sh 3000 --no-dev-mode
```

On Windows, use `dev-server.bat` instead. No `npm install` needed: the dev server is a single
dependency-free Node script (`dev-server.js`); Node just needs to be installed. See
[CONTRIBUTING.md](CONTRIBUTING.md) for more.

## Releasing

1. Update `CHANGELOG.md`
2. Bump `VERSION.md`
3. Update this README if relevant
4. Run `./commit.sh` (or `commit.bat`): it reads `VERSION.md`, commits, and tags `vX.Y.Z`
5. `git push origin main --tags`; the release workflow then publishes a GitHub Release from the
   matching `CHANGELOG.md` section

## License

&copy; 2026 Stux.Group. All rights reserved. This repository is not licensed for reuse or
redistribution. Lato and Oxanium (`assets/fonts/`) are under the SIL Open Font License.

---

*Built & Maintained by <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.games/icon-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.games/icon-dark.png"><img src="https://global.media.stux.games/icon-dark.png" height="14" alt="Stux.Games" valign="middle"></picture> [Stux.Games](https://github.com/StuxGames), Hosted by <img src="https://github.com/Stuxedo.png" height="14" alt="Stuxedo" valign="middle"> [Stuxedo](https://stuxedo.com).
Stux.Games is a part of the <picture><source media="(prefers-color-scheme: dark)" srcset="https://global.media.stux.group/icon-light.png"><source media="(prefers-color-scheme: light)" srcset="https://global.media.stux.group/icon-dark.png"><img src="https://global.media.stux.group/icon-dark.png" height="14" alt="Stux.Group" valign="middle"></picture> Stux.Group brand of businesses.*
