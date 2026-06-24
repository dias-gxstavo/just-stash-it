from unittest.mock import patch

import fakeredis.aioredis
import pytest_asyncio
from fastapi.testclient import TestClient

from src.main import app


@pytest_asyncio.fixture
async def client():
    fake_redis = fakeredis.aioredis.FakeRedis()

    with patch("src.main.r", fake_redis), \
         patch("src.main.limiter.enabled", False):
        yield TestClient(app)
