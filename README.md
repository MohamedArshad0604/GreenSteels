# GreenSteels

A web application served by a FastAPI backend, monitored with Prometheus and Grafana, all started with Docker Compose.

## What is inside

| Part | What it does | Address |
|---|---|---|
| FastAPI app | Serves the web page and exposes metrics | http://localhost:8000 |
| Prometheus | Collects metrics from the app every 5 seconds | http://localhost:9090 |
| Grafana | Shows the metrics as a dashboard | http://localhost:3000 |

## Requirements

- Docker Desktop (with WSL 2 on Windows)
- Git

## How to run

    git clone https://github.com/MohamedArshad0604/GreenSteels.git
    cd GreenSteels
    docker compose up --build

Then open:

- App: http://localhost:8000
- Health check: http://localhost:8000/health
- Raw metrics: http://localhost:8000/metrics
- Prometheus targets: http://localhost:9090/targets
- Grafana: http://localhost:3000 (login: admin / admin)

The Prometheus data source and the **GreenSteels Monitoring** dashboard are loaded into Grafana automatically.

## How to stop

    docker compose down

## Project structure

    app/main.py                  FastAPI application
    index.html                   Web page
    Dockerfile                   Builds the app image
    docker-compose.yml           Starts app, Prometheus and Grafana
    prometheus.yml               Tells Prometheus where to read metrics
    grafana/provisioning/        Auto-setup of Grafana data source and dashboards
    grafana/greensteels-dashboard.json   The dashboard definition
