from redis.asyncio import Redis, from_url
from motor.motor_asyncio import AsyncIOMotorClient
from redis.asyncio.client import Redis as RedisClient
from app.utils.config import MONGODB_DB_NAME, MONGODB_URI, REDIS_URI

class AsyncMongoDbManager:
    """Singleton-style async MongoDB manager for efficient connection handling."""

    _client = None  # Class-level client to be reused across instances

    def __init__(self, mongo_uri=MONGODB_URI, database_name=MONGODB_DB_NAME):
        self.mongo_uri = mongo_uri
        self.db_name = database_name

        # Only create client if it does not exist
        if AsyncMongoDbManager._client is None:
            AsyncMongoDbManager._client = AsyncIOMotorClient(self.mongo_uri)

        self.client = AsyncMongoDbManager._client
        self.db = self.client[self.db_name]

    async def __aenter__(self):
        """
        Return the database connection for use inside an 'async with' block.
        """
        return self.db

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        """
        Keep the client open for efficiency; close only when explicitly needed.
        """
        pass  # We do not close the client here to maintain efficiency

    @classmethod
    async def close(cls):
        """
        Explicitly close the MongoDB connection if needed.
        """
        if cls._client:
            cls._client.close()
            cls._client = None
            
class AsyncRedisManager:
    """Singleton-style async Redis manager for efficient connection handling."""
    
    _client: RedisClient = None
    
    def __init__(self, redis_url=REDIS_URI):
        self.redis_url = redis_url

        if AsyncRedisManager._client is None:
            AsyncRedisManager._client = from_url(self.redis_url, decode_responses=True)

        self.client = AsyncRedisManager._client

    async def __aenter__(self) -> Redis:
        return self.client

    async def __aexit__(self, exc_type, exc_val, exc_tb):
        # Keep connection alive; don't close here
        pass

    @classmethod
    async def close(cls):
        """Explicitly close Redis connection."""
        if cls._client:
            await cls._client.close()
            cls._client = None