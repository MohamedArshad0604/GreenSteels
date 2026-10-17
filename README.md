# GreenSteels

A web application served by a FastAPI backend, monitored with Prometheus and Grafana, and built and tested automatically by Jenkins. Everything runs in Docker.

## What is inside

| Part | What it does | Address |
|---|---|---|
| FastAPI app | Serves the web page and exposes metrics | http://localhost:8000 |
| Prometheus | Collects metrics from the app every 5 seconds | http://localhost:9090 |
| Grafana | Shows the metrics as a dashboard | http://localhost:3000 |
| Jenkins | Builds the Docker image and tests `/health` on every push | http://localhost:8081 |

## Requirements

- Docker Desktop (with WSL 2 on Windows)
- Git

## How to run the app, Prometheus and Grafana

```
git clone https://github.com/MohamedArshad0604/GreenSteels.git
cd GreenSteels
docker compose up --build
```

Then open:

- App: http://localhost:8000
- Health check: http://localhost:8000/health
- Raw metrics: http://localhost:8000/metrics
- Prometheus targets: http://localhost:9090/targets
- Grafana: http://localhost:3000 (login: admin / admin)

The Prometheus data source and the **GreenSteels Monitoring** dashboard are loaded into Grafana automatically.

To stop everything:

```
docker compose down
```

## CI with Jenkins

Jenkins runs in its own container and uses the `Jenkinsfile` in the root of this repository.

### Start Jenkins

```
cd jenkins
docker compose up -d --build
cd ..
```

If Docker Desktop shows an "additional privileges requested" error, run this first in the same PowerShell window:

```
$env:BUILDX_BAKE_ENTITLEMENTS_FS = "0"
```

Jenkins is then available at http://localhost:8081. Port 8081 is used because port 8080 is often taken by other programs on Windows.

### First-time setup

1. Get the unlock password:

```
docker compose -f jenkins\docker-compose.yml exec jenkins cat /var/jenkins_home/secrets/initialAdminPassword
```

2. Open http://localhost:8081, paste the password and choose **Install suggested plugins**.
3. Create your admin user.
4. Create a job named `GreenSteels-pipeline` of type **Pipeline** with:
   - Definition: `Pipeline script from SCM`
   - SCM: `Git`
   - Repository URL: `https://github.com/MohamedArshad0604/GreenSteels.git`
   - Branch: `*/main`
   - Script Path: `Jenkinsfile`
5. Under **Build Triggers**, tick **Poll SCM** and use the schedule `H/2 * * * *`.

### What the pipeline does

1. **Build image:** builds the Docker image from the `Dockerfile`.
2. **Test:** starts a temporary container, waits until `/health` answers (up to 60 seconds), and fails the build if it never does.
3. **Cleanup:** always removes the temporary container.

Jenkins checks GitHub every 2 minutes and starts a build when it finds a new commit. It only builds and tests; it does not deploy. To run the latest code yourself, use `docker compose up -d --build`.

Jenkins only works while your computer and Docker Desktop are running.

### Stop Jenkins

```
docker compose -f jenkins\docker-compose.yml down
```

## Project structure

```
app/main.py                          FastAPI application
index.html                           Web page
Dockerfile                           Builds the app image
docker-compose.yml                   Starts app, Prometheus and Grafana
prometheus.yml                       Tells Prometheus where to read metrics
grafana/provisioning/                Auto-setup of Grafana data source and dashboards
grafana/greensteels-dashboard.json   The dashboard definition
Jenkinsfile                          The CI pipeline (build and test)
jenkins/Dockerfile                   Jenkins image with the Docker CLI
jenkins/docker-compose.yml           Starts Jenkins on port 8081
```
