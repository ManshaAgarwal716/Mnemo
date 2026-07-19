from backend.src.db import redis
from redis.asyncio import redis

from src.core.config import settings


redis_client = redis.from_url(settings.REDIS_URL)