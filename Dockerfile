# =============================================================================
# Portfolio: one multi-stage Dockerfile (static React + Vite site)
# Base images use floating official tags, so `docker compose build --pull`
# always picks up the newest release:
#   node:current-alpine   newest Node.js release
#   nginx:mainline-alpine newest nginx release
#
# Targets (selected via docker-compose.yml):
#   dev   Vite dev server with HMR
#   prod  nginx serving the built SPA
#   e2e   Playwright end-to-end test runner
# =============================================================================

# ---- Shared dependency layer -------------------------------------------------
FROM node:current-alpine AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# ---- Development (Vite + HMR) -----------------------------------------------
FROM deps AS dev
COPY . .
EXPOSE 5173
CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0", "--port", "5173"]

# ---- Production build --------------------------------------------------------
FROM deps AS build
COPY . .
RUN npm run build

# ---- Production serve --------------------------------------------------------
FROM nginx:mainline-alpine AS prod
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

# ---- Playwright E2E ----------------------------------------------------------
# Debian-based Node image (Playwright browsers need glibc). The browser is
# installed by the @playwright/test version pinned in package-lock.json,
# so the two always match.
FROM node:current AS e2e
WORKDIR /app
COPY package*.json ./
RUN npm ci && npx playwright install --with-deps chromium
COPY playwright.config.js ./
COPY tests ./tests
CMD ["npx", "playwright", "test"]
