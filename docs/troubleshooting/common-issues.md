---
id: common-issues
title: Common Issues
sidebar_label: Common Issues
sidebar_position: 1
description: Solutions to the most frequently encountered XplurData problems.
---

# Common Issues

## Metrics Not Appearing in Grafana

**Symptom:** OTEL agent starts and accepts data, but Grafana shows no rows.

**Diagnosis steps:**

```bash
# 1. Check agent logs for Stream Load errors
docker compose logs otel-agent | grep -i "stream_load\|error\|fail"

# 2. Check Doris FE is reachable from agent
docker compose exec otel-agent curl -s http://doris-fe:8030/api/health

# 3. Query Doris directly
mysql -h 127.0.0.1 -P 9030 -u root -e "SELECT COUNT(*) FROM xplurdata.otel_metrics;"
```

**Common causes:**

| Symptom in logs | Fix |
|---|---|
| `connection refused doris-fe:8030` | Doris FE not healthy — check `docker compose ps` |
| `HTTP 401` from Stream Load | Wrong Doris credentials in `otel-agent/config.yaml` |
| `table not found` | Run the schema init script: `scripts/init-doris.sh` |

---

## Timestamps Show as 1970-01-01

**Cause:** Known issue in OTEL Agent versions < 0.2.1. The nanosecond OTLP timestamp was not converted correctly before writing to Doris `DATETIME(6)`.

**Fix:** Upgrade the agent image to `xplurdata/otel-agent:0.2.1` or later:

```bash
docker compose pull otel-agent
docker compose up -d --no-deps otel-agent
```

---

## Doris FE Exits on Startup

**Symptom:** `doris-fe` container exits immediately with `OOM` or `JVM heap` errors.

**Fix:** Increase the JVM heap in your environment or `fe.conf`:

```bash
# In .env
DORIS_FE_JVM_HEAP=4g
```

Doris FE requires at least 2 GB heap; 4–8 GB recommended for production.

---

## Grafana Shows "Data source not found"

The Grafana provisioning config references the Doris data source plugin. If the plugin is not installed:

```bash
# Install from Grafana CLI inside the container
docker compose exec grafana grafana-cli plugins install doris-datasource
docker compose restart grafana
```

---

## OTEL Agent Auth Errors (403 Forbidden)

After enabling multi-user mode, all requests require a `Bearer` token.

```bash
# Generate a new token for a user
curl -X POST http://localhost:4319/admin/users \
  -H "Authorization: Bearer <admin-token>" \
  -d '{"username": "myteam"}'
```

Pass the returned token in all SDK/Collector OTLP configurations as an HTTP header.

---

## Iceberg / Trino `extra_properties` Errors

When querying Iceberg tables from Trino, illegal property keys in the `WITH` clause will cause:

```
IllegalArgumentException: Unrecognized table property: 'extra_properties'
```

**Fix:** Remove non-standard keys from `CREATE TABLE ... WITH (...)`. Only Iceberg-native properties are valid. See [Iceberg Storage docs](../storage/iceberg) for the supported property list.
