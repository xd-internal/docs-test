---
id: quick-start
title: Quick Start
sidebar_label: Quick Start
sidebar_position: 2
description: Get XplurData running in under 5 minutes with Docker Compose.
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Quick Start

Get XplurData running locally in under 5 minutes.

## Prerequisites

| Requirement | Minimum version |
|---|---|
| Docker | 24.x |
| Docker Compose | v2.20+ |
| RAM | 8 GB recommended |
| Disk | 20 GB free |

## 1. Clone the Repository

```bash
git clone https://github.com/xplurdata/xplurdata.git
cd xplurdata
```

## 2. Configure Environment

Copy the example environment file and edit as needed:

```bash
cp .env.example .env
```

Key variables to review:

```dotenv
# Storage
DORIS_FE_PORT=9030
DORIS_HTTP_PORT=8030

# OTEL Agent
OTEL_AGENT_PORT=4317      # gRPC
OTEL_AGENT_HTTP_PORT=4318 # HTTP/JSON

# Grafana
GRAFANA_PORT=3000
GRAFANA_ADMIN_PASSWORD=changeme
```

:::warning
Change `GRAFANA_ADMIN_PASSWORD` before deploying to any shared environment.
:::

## 3. Start the Stack

```bash
docker compose up -d
```

This brings up:
- **Apache Doris** (FE + BE)
- **XplurData OTEL Agent**
- **Grafana** with pre-provisioned dashboards

Check that all services are healthy:

```bash
docker compose ps
```

All services should show `healthy` or `running`.

## 4. Access the UI

| Service | URL | Default credentials |
|---|---|---|
| Grafana | http://localhost:3000 | `admin` / `changeme` |
| Doris FE Web UI | http://localhost:8030 | `root` / _(empty)_ |
| OTEL Agent (gRPC) | grpc://localhost:4317 | — |

## 5. Send Your First Signal

<Tabs>
<TabItem value="otlp" label="OTLP (any language)">

Point your existing OpenTelemetry SDK or Collector to:

```
endpoint: http://localhost:4318    # HTTP/JSON
# or
endpoint: grpc://localhost:4317    # gRPC
```

</TabItem>
<TabItem value="curl" label="cURL (HTTP)">

Send a test metric via OTLP/HTTP:

```bash
curl -X POST http://localhost:4318/v1/metrics \
  -H "Content-Type: application/json" \
  -d @examples/test-metric.json
```

</TabItem>
<TabItem value="python" label="Python SDK">

```python
from opentelemetry import metrics
from opentelemetry.sdk.metrics import MeterProvider
from opentelemetry.exporter.otlp.proto.http.metric_exporter import OTLPMetricExporter
from opentelemetry.sdk.metrics.export import PeriodicExportingMetricReader

exporter = OTLPMetricExporter(endpoint="http://localhost:4318/v1/metrics")
reader = PeriodicExportingMetricReader(exporter, export_interval_millis=5000)
provider = MeterProvider(metric_readers=[reader])
metrics.set_meter_provider(provider)

meter = metrics.get_meter("my-app")
counter = meter.create_counter("requests.total")
counter.add(1, {"service": "api", "env": "local"})
```

</TabItem>
</Tabs>

## 6. View in Grafana

Open [http://localhost:3000](http://localhost:3000), navigate to **Dashboards → XplurData → Metrics Overview** to see your data flowing in.

---

## What's Next?

- [Full Installation Guide](./installation) — production-grade configuration
- [Architecture Overview](../architecture/overview) — understand the data flow
- [OTEL Agent Configuration](../collectors/otel-agent) — advanced collector setup
