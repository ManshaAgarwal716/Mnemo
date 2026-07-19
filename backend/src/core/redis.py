from redis.asyncio import Redis
from src.core.config import settings

redis_client = Redis.from_url(settings.REDIS_URL)