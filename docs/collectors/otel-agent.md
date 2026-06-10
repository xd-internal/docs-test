---
id: otel-agent
title: OTEL Agent
sidebar_label: OTEL Agent
sidebar_position: 1
description: Configure the XplurData OpenTelemetry Agent for metrics, logs, and traces collection.
---

# XplurData OTEL Agent

The XplurData OTEL Agent is the ingestion gateway for all telemetry signals. It is OTLP-compatible, meaning any OpenTelemetry SDK, Collector, or instrumented application can send data to it without modification.

## Configuration

The agent is configured via `otel-agent/config.yaml`:

```yaml title="otel-agent/config.yaml"
server:
  grpc_port: 4317
  http_port: 4318

auth:
  enabled: true
  db_path: /data/auth.db   # SQLite file

doris:
  fe_host: doris-fe
  fe_http_port: 8030
  user: root
  password: ""
  database: xplurdata

batch:
  max_size: 5000           # rows per Stream Load
  flush_interval_ms: 3000  # flush every 3 seconds

signal_routing:
  metrics: true
  logs: true
  traces: false            # enable when trace tables are ready
```

## Multi-User Architecture

As of v0.3, the agent supports per-user isolation. Each API request must include a user token:

```http
POST /v1/metrics HTTP/1.1
Authorization: Bearer <user-token>
Content-Type: application/json
```

Users are managed via the agent's admin API or the SQLite database directly.

### Adding a User

```bash
# Via admin API
curl -X POST http://localhost:4319/admin/users \
  -H "Authorization: Bearer <admin-token>" \
  -H "Content-Type: application/json" \
  -d '{"username": "team-backend", "namespace": "backend"}'
```

The agent creates a namespace prefix in Doris and returns a token for that user.

## Metrics Schema

Metrics are written to `xplurdata.otel_metrics`:

```sql
CREATE TABLE otel_metrics (
  timestamp       DATETIME(6) NOT NULL,
  metric_name     VARCHAR(255) NOT NULL,
  metric_type     TINYINT NOT NULL,   -- 0=gauge, 1=sum, 2=histogram
  value           DOUBLE,
  resource_attrs  JSON,
  scope_name      VARCHAR(255),
  scope_version   VARCHAR(64),
  data_attrs      JSON,
  namespace       VARCHAR(128) NOT NULL   -- user isolation key
)
DUPLICATE KEY(timestamp, metric_name, namespace)
PARTITION BY RANGE(timestamp) (...)
DISTRIBUTED BY HASH(metric_name) BUCKETS 16
PROPERTIES ("replication_num" = "1");
```

:::note Timestamp precision
Timestamps are stored at microsecond precision (`DATETIME(6)`). A known historical issue with 1970 epoch timestamps was resolved in v0.2.1 — ensure you are on a patched version.
:::

## Troubleshooting the Agent

| Symptom | Likely cause | Fix |
|---|---|---|
| `connection refused` on port 4317 | Agent not started | `docker compose up otel-agent` |
| Data arriving but no Grafana rows | Doris Stream Load failure | Check agent logs for HTTP 5xx from Doris FE |
| `epoch 1970` timestamps | Old agent version | Upgrade to ≥ v0.2.1 |
| Auth errors | Token expired or wrong namespace | Re-generate token via admin API |
