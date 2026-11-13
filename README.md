# portfolio

Static React 19 + Vite portfolio site.

## Run with Docker

This workspace is Docker-only. The only host requirement is Docker Desktop (or Docker Engine + Compose v2).

```bash
docker compose --profile dev up --build              # dev server with HMR -> http://localhost:5173
docker compose --profile prod up --build -d          # production nginx   -> http://localhost:8080
docker compose --profile test run --rm --build e2e   # Playwright smoke tests
```

The base images track the latest official releases (`node:current-alpine`, `nginx:mainline-alpine`). Add `--pull` to a build to refresh them.

See [DOCKER.md](DOCKER.md) for details.

## Deployment

Pushes to `main` build the site and deploy it to GitHub Pages through `.github/workflows/deploy.yml`.
