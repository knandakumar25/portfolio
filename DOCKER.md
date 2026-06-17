# Docker Setup for Portfolio

This document describes how to build and run the portfolio application using Docker.

## Quick Start

### Production (Nginx)
```bash
# Build and run production container
docker compose up --build -d

# Access at http://localhost:8080
```

### Development (Vite Dev Server with HMR)
```bash
# Build and run development container
docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build

# Access at http://localhost:5173
# Hot Module Replacement (HMR) enabled
```

## Docker Files

| File | Purpose |
|------|---------|
| `Dockerfile` | Multi-stage production build (Node build → Nginx serve) |
| `Dockerfile.dev` | Development build with Vite dev server |
| `nginx.conf` | Nginx configuration for SPA routing and caching |
| `docker-compose.yml` | Base compose file with both services |
| `docker-compose.dev.yml` | Development override |
| `.dockerignore` | Files excluded from Docker context |

## Production Details

The production build uses a **multi-stage Dockerfile**:

1. **Builder Stage** (`node:24-alpine`):
   - Installs all dependencies (including devDependencies)
   - Runs `npm run build` to create optimized production bundle in `/app/dist`

2. **Runner Stage** (`nginx:alpine`):
   - Copies built assets from builder
   - Uses custom `nginx.conf` for:
     - SPA routing (fallback to `index.html`)
     - Static asset caching (1 year for hashed assets)
     - Security headers
     - Gzip compression
     - Health check endpoint (`/health`)

## Development Details

The development setup:
- Uses `node:24-alpine` with Vite dev server
- Mounts source code as volume for live editing
- Excludes `node_modules` from volume mount (uses container's)
- Enables polling for file watching (works in Docker/WSL)
- Runs on port 5173 with `--host 0.0.0.0` for external access

## Useful Commands

```bash
# View logs
docker compose logs -f portfolio        # Production
docker compose -f docker-compose.yml -f docker-compose.dev.yml logs -f portfolio-dev  # Dev

# Stop containers
docker compose down
docker compose -f docker-compose.yml -f docker-compose.dev.yml down

# Rebuild without cache
docker compose build --no-cache

# Shell into running container
docker exec -it portfolio-prod sh
docker exec -it portfolio-dev sh

# Run build manually in container
docker run --rm -v $(pwd):/app -w /app node:24-alpine npm run build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | `production` | Node environment |
| `CHOKIDAR_USEPOLLING` | `true` (dev) | Enable file polling for HMR |
| `WATCHPACK_POLLING` | `true` (dev) | Enable webpack polling |

## Ports

| Service | Container Port | Host Port |
|---------|---------------|-----------|
| Production (nginx) | 80 | 8080 |
| Development (Vite) | 5173 | 5173 |

## Troubleshooting

### Port already in use
```bash
# Change host port in docker-compose.yml
ports:
  - "3000:80"  # Use port 3000 instead of 8080
```

### Permission issues (Linux/macOS)
```bash
# Fix ownership of node_modules
sudo chown -R $USER:$USER node_modules
```

### HMR not working in development
- Ensure `CHOKIDAR_USEPOLLING=true` is set
- Check that volumes are mounted correctly
- Try: `docker compose -f docker-compose.yml -f docker-compose.dev.yml up --build --force-recreate`

## Building for Production Deployment

To create a standalone production image for deployment:

```bash
# Build the image
docker build -t portfolio:latest .

# Run locally to test
docker run -d -p 8080:80 --name portfolio portfolio:latest

# Push to registry
docker tag portfolio:latest your-registry/portfolio:latest
docker push your-registry/portfolio:latest
```