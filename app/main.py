from pathlib import Path

from fastapi import FastAPI
from fastapi.responses import FileResponse
from prometheus_fastapi_instrumentator import Instrumentator

app = FastAPI()

# The project folder (one level above the "app" folder)
BASE_DIR = Path(__file__).resolve().parent.parent


@app.get("/")
def home():
    # Show your web page
    return FileResponse(BASE_DIR / "index.html")


@app.get("/health")
def health():
    # A tiny endpoint, handy for testing
    return {"status": "ok"}


# This one line creates the /metrics page for Prometheus
Instrumentator().instrument(app).expose(app)