---
id: introduction
title: Introduction
sidebar_label: Introduction
sidebar_position: 1
description: What is XplurData and why does it exist?
---

# XplurData — Unified Observability Platform

**XplurData** is a self-hosted, open-source observability platform built on the OpenTelemetry standard and Apache Doris. It gives you full control over your metrics, logs, and traces — without cloud lock-in, per-seat pricing, or data leaving your infrastructure.

## Why XplurData?

| Problem | XplurData's Answer |
|---|---|
| Cloud observability costs spiral at scale | 100% self-hosted, fixed infrastructure cost |
| Vendor lock-in from proprietary agents | OpenTelemetry-native — standard protocol |
| Fragmented tools for metrics/logs/traces | Single platform, unified storage |
| Complex setup and maintenance | Docker Compose single-command deployment |
| Limited data ownership | Your data stays in your cluster |

## Core Capabilities

- **OpenTelemetry native** — drop in the OTEL Collector or XplurData's lightweight agent
- **Apache Doris storage** — columnar OLAP engine purpose-built for time-series analytics
- **Apache Iceberg support** — open table format for long-term metric retention
- **Grafana dashboards** — pre-built dashboards for all collected signals
- **Multi-user isolation** — per-user data access with SQLite-backed auth

## License

XplurData is dual-licensed under **Apache 2.0** (platform core) and **MIT** (client libraries). See the [GitHub repository](https://github.com/xplurdata/xplurdata) for full details.

## Next Steps

- **New here?** Start with the [Quick Start →](./quick-start)
- **Want to understand the internals?** See [Architecture Overview →](../architecture/overview)
- **Ready to go production?** Jump to [Deployment →](../deployment/docker-compose)
