FROM python:3.14-slim

COPY --from=ghcr.io/astral-sh/uv:latest /uv /uvx /bin/

COPY . /app

WORKDIR /app
RUN uv sync --frozen --no-cache 

USER nginx
COPY nginx/default.conf /etc/nginx/conf.d/default.conf
COPY . /var/www/html/
USER root

CMD ["/app/.venv/bin/fastapi", "run", "src/main.py"]