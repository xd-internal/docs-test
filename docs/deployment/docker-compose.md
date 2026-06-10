---
id: docker-compose
title: Docker Compose Deployment
sidebar_label: Docker Compose
sidebar_position: 1
description: Deploy XplurData using Docker Compose for development and production.
---

# Docker Compose Deployment

XplurData ships a `docker-compose.yml` that brings up the full platform. This page covers both local development and hardened production deployments.

## Services Overview

```yaml title="docker-compose.yml (annotated)"
services:
  doris-fe:          # Apache Doris Frontend (SQL + metadata)
  doris-be:          # Apache Doris Backend (storage + compute)
  otel-agent:        # XplurData OTEL ingestion agent
  grafana:           # Grafana with pre-provisioned dashboards
```

## Development Setup

```bash
# Clone and start
git clone https://github.com/xplurdata/xplurdata.git
cd xplurdata
cp .env.example .env
docker compose up -d

# Tail logs
docker compose logs -f otel-agent

# Stop everything
docker compose down
```

## Production Hardening Checklist

Before exposing XplurData to production traffic, work through this list:

- [ ] Change `GRAFANA_ADMIN_PASSWORD` in `.env`
- [ ] Set a Doris `root` password via `mysql -h 127.0.0.1 -P 9030 -u root -e "SET PASSWORD FOR 'root' = PASSWORD('strong-password');"`
- [ ] Create a Grafana read-only Doris service account
- [ ] Place a reverse proxy (Nginx/Caddy) in front of Grafana on port 443
- [ ] Bind `otel-agent` ports only to internal network interfaces
- [ ] Enable Doris authentication (`enable_auth_check=true` in `fe.conf`)
- [ ] Set dynamic partition TTL to match your retention policy
- [ ] Configure volume mounts to persistent storage (not ephemeral container storage)

## Volume Configuration

```yaml
volumes:
  doris-fe-meta:     # Doris FE metadata
  doris-be-storage:  # Doris BE column data
  grafana-data:      # Grafana dashboards + config
  otel-agent-data:   # SQLite auth DB
```

Map these to dedicated host paths or named Docker volumes backed by durable storage.

## Health Checks

```bash
# Check all services
docker compose ps

# Doris FE health
curl http://localhost:8030/api/health

# OTEL Agent readiness
curl http://localhost:4318/healthz

# Grafana API
curl http://admin:changeme@localhost:3000/api/health
```

## Upgrading

```bash
# Pull latest images
docker compose pull

# Recreate services with zero-downtime (rolling)
docker compose up -d --no-deps --build otel-agent
docker compose up -d --no-deps grafana

# Doris upgrades require coordination — see upgrade guide
```

See the [Upgrades Guide](./upgrades) for major version Doris upgrades.
