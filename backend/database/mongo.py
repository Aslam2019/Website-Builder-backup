from pymongo import MongoClient
from config import Config

_client = None
_db = None


def init_mongo():
    """Initialize MongoDB connection (singleton)."""
    global _client, _db
    if _client is None:
        _client = MongoClient(Config.MONGO_URI, serverSelectionTimeoutMS=5000)
        _db = _client[Config.MONGO_DB_NAME]
        # Ping to verify connection
        _client.admin.command("ping")
        print(f"[MongoDB] Connected to database: {Config.MONGO_DB_NAME}")
    return _db


def get_db():
    """Return the database instance."""
    global _db
    if _db is None:
        init_mongo()
    return _db


def close_mongo():
    global _client, _db
    if _client:
        _client.close()
        _client = None
        _db = None
        print("[MongoDB] Connection closed")