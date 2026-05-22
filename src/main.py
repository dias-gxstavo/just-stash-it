import json
import secrets
from datetime import timedelta
from http import HTTPStatus

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles

from src.schemas import EXPIRATION_MAP, Content, Slug

app = FastAPI(title="just stash it")

r = redis.Redis(host='redis', port=6379)

origins = [
    "http://localhost",
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
        if request.url.path.startswith('/api'):
            return JSONResponse(
                status_code=HTTPStatus.NOT_FOUND,
                content={'detail': 'Not Found'},
            )

        return FileResponse("src/static/404.html", status_code=404)
    raise exc


@app.post("/api/paste", status_code=HTTPStatus.CREATED, response_model=Slug)
async def create_paste(content: Content):
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

    return {"slug": slug}


@app.get("/api/{slug}", status_code=HTTPStatus.OK, response_model=Content)
async def get_paste(slug: str):
    data = await r.get(slug)
    if not data:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Content not found"
        )

    return json.loads(data)


app.mount(
    "/",
    StaticFiles(directory="src/static", html=True),
    name="static"
)
