<div align="center">
<a href="https://stashingit.online/" target="blank">
    <img src="/src/static/favicon-96x96.png" width="96" alt="Logo" />
</a>

<h2> just stash it - a minimalist text sharing </h2>

[![FastAPI](https://img.shields.io/badge/FastAPI-009485.svg?style=for-the-badge&logo=fastapi&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/Redis-%23DD0031.svg?style=for-the-badge&logo=redis&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=fff)](#)

</div>

##  Overview
A minimalist, ephemeral text sharing tool. Paste your content, generate a link, and share it instantly — the paste self-destructs after a configurable TTL.

> Built as a personal homelab utility
---

## Main Features
 
- **Ephemeral by design** — pastes expire automatically via Redis TTL (5min, 10min or 1h)
- **Rate limiting** — 5 requests/minute per IP via slowapi
- **Structured logging** — Loguru with file rotation
- **Interactive Documentation** — documented via Swagger at `/docs`
---

## API
Access the OpenAPI documentation at https://stashingit.online/docs and see all routes.

---

## Running Locally
 
### Requirements
 
- [uv](https://docs.astral.sh/uv/) — Python package manager
- Docker + Docker Compose

### Setup
 
```bash
# Clone the repo
git clone https://github.com/dias-gxstavo/just-stash-it
cd just-stash-it
 
# Install Python dependencies
uv sync
 
# Start the services
docker compose up -d --build
```
The api will be available at `http://localhost:8000` and the app in `http://localhost:80`.

---
## Dev Tasks
 
Task runner powered by [taskipy](https://github.com/taskipy/taskipy). All commands run via `uv run task <name>`. Examples:
 
| Task | Command | Description |
|------|---------|-------------|
| `run_server` | `uv run fastapi dev` | Start dev server with hot reload |
| `test` | `pytest -s -x --cov=src -vv` | Run tests with coverage |
| `lint` | `ruff check` | Lint the codebase |
| `format` | `ruff format` | Format the codebase |
 
```bash
# Running commands
uv run task run_server
uv run task test
uv run task lint
uv run task format
```
---


## License
 
MIT
