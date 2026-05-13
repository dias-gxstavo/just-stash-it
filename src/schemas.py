from datetime import datetime, timezone, timedelta
from enum import Enum

from pydantic import BaseModel


class ExpirationOption(str, Enum):
    five_minutes = "5m"
    ten_minutes = "10m"
    one_hour = "1h"


EXPIRATION_MAP = {
    ExpirationOption.five_minutes:   timedelta(minutes=5),
    ExpirationOption.ten_minutes:    timedelta(minutes=10),
    ExpirationOption.one_hour:       timedelta(hours=1),
}


class Content(BaseModel):
    content_name: str
    content_body: str
    created_at: datetime = datetime.now(timezone.utc)
    expires_in: ExpirationOption


class Slug(BaseModel):
    slug: str