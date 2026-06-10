---
id: overview
title: Architecture Overview
sidebar_label: Overview
sidebar_position: 1
description: High-level architecture of the XplurData observability platform.
---

# Architecture Overview

XplurData is built around three layers: **Collect → Store → Visualize**. Every component is open-source and replaceable.

```
┌─────────────────────────────────────────────────────────────────┐
│                        Your Applications                        │
│           (any language, any framework, any infra)              │
└────────────────────────┬────────────────────────────────────────┘
                         │  OTLP (gRPC / HTTP)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                   XplurData OTEL Agent                          │
│   • Receives OTLP metrics / logs / traces                       │
│   • Per-user isolation & auth (SQLite)                          │
│   • Batches and writes to Doris via HTTP Stream Load            │
└────────┬────────────────────────────────────────────────────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐      ┌──────────────────────┐
│  Apache Doris   │      │  Apache Iceberg       │
│  (hot storage)  │      │  (cold / long-term)   │
│  columnar OLAP  │      │  Parquet on S3/MinIO  │
└────────┬────────┘      └──────────┬────────────┘
         │                          │
         └──────────┬───────────────┘
                    ▼
         ┌──────────────────┐
         │     Grafana      │
         │  (visualization) │
         │  ClickHouse DS   │
         │  Doris DS plugin │
         └──────────────────┘
```

## Component Summary

### XplurData OTEL Agent

A lightweight Go service that implements the OTLP receiver protocol. Key responsibilities:

- Accept telemetry from any OTLP-compatible SDK or Collector
- Validate and route signals by type (metrics / logs / traces)
- Write to Apache Doris using **HTTP Stream Load** for low-latency ingestion
- Multi-user auth backed by SQLite — each user's data is namespace-isolated

### Apache Doris

The primary time-series storage engine. XplurData uses Doris's **Duplicate Key** model for raw signal storage and **Aggregate Key** model for pre-rolled metrics. Doris provides:

- Sub-second query latency on billions of rows
- Native SQL interface (MySQL-compatible)
- Automatic data compaction and TTL

### Apache Iceberg (optional)

For long-term retention beyond Doris's hot tier, XplurData can write to Iceberg tables backed by S3-compatible object storage (MinIO, AWS S3, GCS). This enables:

- Cost-effective storage of historical telemetry
- Query federation via Trino or Spark
- Schema evolution without data migration

### Grafana

Pre-provisioned with XplurData data sources and dashboards. Uses the **Doris / MySQL-compatible** data source plugin. Dashboards are version-controlled and shipped as part of the XplurData repository.

## Data Flow (Metrics)

1. SDK emits metrics over OTLP every N seconds
2. OTEL Agent receives, validates, and maps to Doris schema
3. Agent HTTP Stream Loads the batch into `xplurdata.otel_metrics`
4. Doris compacts and serves queries
5. Grafana queries Doris via the MySQL wire protocol
6. Dashboard renders time-series panels

## Port Reference

| Port | Protocol | Component | Purpose |
|------|----------|-----------|---------|
| 4317 | gRPC | OTEL Agent | OTLP gRPC receiver |
| 4318 | HTTP | OTEL Agent | OTLP HTTP/JSON receiver |
| 9030 | MySQL | Doris FE | SQL query interface |
| 8030 | HTTP | Doris FE | HTTP API + Web UI |
| 9050 | HTTP | Doris BE | Backend service |
| 3000 | HTTP | Grafana | Dashboard UI |
