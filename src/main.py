import json
import os
import secrets
from contextlib import asynccontextmanager
from datetime import timedelta
from http import HTTPStatus

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
from loguru import logger
from slowapi import Limiter, _rate_limit_exceeded_handler  # noqa: PLC2701
from slowapi.errors import RateLimitExceeded
from slowapi.util import get_remote_address

from src.schemas import EXPIRATION_MAP, Content, Slug

REDIS_URL = os.getenv("REDIS_URL", "redis://redis:6379")
r = redis.from_url(REDIS_URL)


def setup_logging():
    os.makedirs("logs", exist_ok=True)
    logger.add("logs/app.log", rotation="10 MB", retention=10)


@asynccontextmanager
async def lifespan(app: FastAPI):
    setup_logging()
    yield


limiter = Limiter(
    key_func=get_remote_address,
    storage_uri=REDIS_URL
)

app = FastAPI(title="just stash it", lifespan=lifespan)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

origins = [
    "http://localhost",
    "stashingit.online"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["GET", "POST"],
    allow_headers=["*"]
)


@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if exc.status_code == HTTPStatus.NOT_FOUND:
        return FileResponse("src/static/404.html", status_code=404)
    raise exc


@app.get("/ping")
async def ping():
    return {"ping": "pong"}


@app.post("/api/paste", status_code=HTTPStatus.CREATED, response_model=Slug)
@limiter.limit("5/minute")
async def create_paste(request: Request, content: Content):
    try:
        slug = secrets.token_urlsafe(10)
        payload = {
            "content_name": content.content_name,
            "content_body": content.content_body,
            "created_at":   content.created_at.isoformat(),
            "expires_in":   content.expires_in.value
        }

        ttl: timedelta = EXPIRATION_MAP[content.expires_in]
        ttl_seconds = int(ttl.total_seconds())

        await r.setex(slug, ttl_seconds, json.dumps(payload))

        logger.info(
            f"""
            Created paste | {slug}
            expires_in={content.expires_in.value}
            """
        )

        return {"slug": slug}
    except redis.ConnectionError as err:
        logger.error(f"Redis Connection Error: {err}")
        raise HTTPException(status_code=500, detail="Server Error")

    except redis.ResponseError as err:
        logger.error(f"Redis Response Error: {err}")
        raise HTTPException(status_code=500, detail="Server Error")


@app.get("/api/{slug}", status_code=HTTPStatus.OK, response_model=Content)
async def get_paste(slug: str):
    try:
        data = await r.get(slug)
        if not data:
            raise HTTPException(
                status_code=HTTPStatus.NOT_FOUND,
                detail="Content not found"
            )

        return json.loads(data)
    except redis.RedisError as err:
        logger.error(f"Redis operation failed: {err} | slug={slug}")
        raise HTTPException(status_code=500, detail="Server Error")


app.mount(
    "/",
    StaticFiles(directory="src/static", html=True),
    name="static"
)
