import json
import secrets
from datetime import datetime, timedelta
from http import HTTPStatus

import redis.asyncio as redis
from fastapi import FastAPI, HTTPException

from src.schemas import EXPIRATION_MAP, Content

app = FastAPI(title="textbin")

r = redis.Redis(host='redis', port=6379)


@app.post("/paste", status_code=HTTPStatus.CREATED)
async def create_paste(content: Content):
    slug = secrets.token_urlsafe(10)
    payload = {
        "content_name": content.content_name,
        "content_body": content.content_body,
        "created_at":   datetime.now().isoformat(),
        "expires_in":   content.expires_in.value
    }

    ttl: timedelta = EXPIRATION_MAP[content.expires_in]
    ttl_seconds = int(ttl.total_seconds())

    await r.setex(slug, ttl_seconds, json.dumps(payload))

    return {"slug": slug}


@app.get("/p/{slug}", status_code=HTTPStatus.OK)
async def get_paste(slug: str):
    data = await r.get(slug)
    if not data:
        raise HTTPException(
            status_code=HTTPStatus.NOT_FOUND,
            detail="Content not found"
        )

    return json.loads(data)
