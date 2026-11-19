# Docker Workspace

This project runs **only** through Docker. The only host requirement is Docker Desktop (or Docker Engine + Compose v2). You don't need Node.js installed locally.

The site is a static React + Vite app. Everything is defined in `Dockerfile` (one multi-stage file) and `docker-compose.yml` (one file with profiles).

## Quick start

```bash
docker compose --profile dev up --build      # http://localhost:5173 (hot reload)
```

## Profiles

| Command | What runs | URL |
|---|---|---|
| `docker compose --profile dev up --build` | `web-dev`: Vite dev server with HMR; source is bind-mounted | http://localhost:5173 |
| `docker compose --profile prod up --build -d` | `web`: nginx serving the built `dist` | http://localhost:8080 |
| `docker compose --profile test run --rm --build e2e` | `web-dev` + Playwright smoke tests (`tests/e2e`) | results in `./test-results` |

To stop everything: `docker compose --profile dev --profile prod --profile test down`

## Images (always latest official releases)

| Dockerfile target | Base image | Used by |
|---|---|---|
| `deps` / `dev` / `build` | `node:current-alpine` (newest Node.js) | `web-dev`, production build |
| `prod` | `nginx:mainline-alpine` (newest nginx) | `web` |
| `e2e` | `node:current` (Debian, needed for Playwright browsers) | `e2e` |

These tags float. To pick up new releases, rebuild with `--pull`:

```bash
docker compose --profile dev --profile prod --profile test build --pull
```

`package.json` sets `engines.node` to `>=24`, so newer Node versions are accepted.

## Common tasks

```bash
# Logs / shell
docker compose --profile dev logs -f web-dev
docker compose --profile dev exec web-dev sh

# Add or update an npm dependency (writes package.json + package-lock.json on the host)
docker compose --profile dev run --rm web-dev npm install <pkg>
docker compose --profile dev up --build -V   # -V recreates the node_modules volume

# One-off production build into ./dist
docker compose --profile dev run --rm web-dev npm run build
```

`express` is installed as a dependency for future use. No server uses it yet.

## Troubleshooting

- **HMR doesn't pick up changes (Windows/macOS):** polling is turned on with `VITE_USE_POLLING=true` (see `vite.config.mjs`). Check that the project folder is shared with Docker Desktop.
- **"Blocked request. This host is not allowed":** a new hostname needs to be added to `server.allowedHosts` in `vite.config.mjs`.
- **Port already in use:** stop whatever on the host is using 5173 or 8080, or change the left side of the `ports:` mapping.
