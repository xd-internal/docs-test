---
id: apache-doris
title: Apache Doris Storage
sidebar_label: Apache Doris
sidebar_position: 1
description: How XplurData uses Apache Doris as its primary time-series storage engine.
---

# Apache Doris Storage

Apache Doris is XplurData's primary hot storage layer. It provides a MySQL-compatible SQL interface over a distributed columnar engine, making it ideal for time-series analytics at scale.

## Why Doris?

- **MySQL wire protocol** — works with Grafana's MySQL data source out of the box
- **Columnar storage** — fast aggregations over billions of metric rows
- **HTTP Stream Load** — high-throughput real-time data ingestion without Kafka
- **Vectorized execution** — modern CPU-friendly query engine
- **Open source** — Apache 2.0 license, no licensing fees

## Connection Details

| Parameter | Default |
|-----------|---------|
| Host | `doris-fe` (Docker network) |
| MySQL port | `9030` |
| HTTP port | `8030` |
| Default user | `root` |
| Default password | _(empty)_ |

:::warning Production setup
Set a strong root password and create a dedicated read-only user for Grafana before going to production.
:::

## Key Tables

### `xplurdata.otel_metrics`
Stores all OTLP metrics. Partitioned by day, distributed by `metric_name`.

### `xplurdata.otel_logs`
Stores structured log records. Partitioned by day.

### `xplurdata.otel_traces` _(planned)_
Will store span data. Not yet shipped.

## Stream Load (Ingestion)

The OTEL Agent writes data using Doris's HTTP Stream Load API. This bypasses the need for message queues and enables real-time ingestion:

```bash
# Example Stream Load (used internally by the agent)
curl -X PUT \
  -H "Expect: 100-continue" \
  -H "format: json" \
  -H "strip_outer_array: true" \
  -u root: \
  http://doris-fe:8030/api/xplurdata/otel_metrics/_stream_load \
  -T /tmp/metrics_batch.json
```

## Useful Queries

```sql
-- Recent metric names
SELECT DISTINCT metric_name
FROM xplurdata.otel_metrics
WHERE timestamp > NOW() - INTERVAL 1 HOUR
ORDER BY metric_name;

-- Metric rate over time (5-min buckets)
SELECT
  DATE_FORMAT(timestamp, '%Y-%m-%d %H:%i:00') AS bucket,
  metric_name,
  AVG(value) AS avg_val
FROM xplurdata.otel_metrics
WHERE metric_name = 'http.server.request.duration'
  AND timestamp > NOW() - INTERVAL 6 HOUR
GROUP BY bucket, metric_name
ORDER BY bucket;

-- Row count by namespace (user isolation check)
SELECT namespace, COUNT(*) AS rows
FROM xplurdata.otel_metrics
GROUP BY namespace
ORDER BY rows DESC;
```

## Data Retention

Configure TTL per partition in the table properties:

```sql
ALTER TABLE xplurdata.otel_metrics
  SET ("dynamic_partition.ttl" = "30");   -- keep 30 days
```

For longer retention, configure the [Iceberg cold tier](./iceberg).
