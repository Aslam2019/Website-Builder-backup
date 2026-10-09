import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    # Flask
    SECRET_KEY = os.getenv("SECRET_KEY", "fallback_secret")
    ENV = os.getenv("FLASK_ENV", "development")
    PORT = int(os.getenv("FLASK_PORT", 5000))

    # JWT
    JWT_SECRET = os.getenv("JWT_SECRET", "fallback_jwt_secret")
    JWT_EXPIRES_HOURS = int(os.getenv("JWT_EXPIRES_HOURS", 24))

    # MongoDB
    MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
    MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "website_builder_db")

    # CORS
    CORS_ORIGINS = [
        o.strip() for o in os.getenv(
            "CORS_ORIGINS", "http://localhost:5173"
        ).split(",") if o.strip()
    ]

    # Uploads
    UPLOAD_FOLDER = os.getenv("UPLOAD_FOLDER", "uploads")
    MAX_CONTENT_LENGTH = int(os.getenv("MAX_CONTENT_LENGTH_MB", 5)) * 1024 * 1024
    ALLOWED_IMAGE_EXT = {"png", "jpg", "jpeg", "gif", "webp"}
    ALLOWED_DOC_EXT = {"pdf", "doc", "docx"}

    # Admin seed
    ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
    ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin123")
    ADMIN_MOBILE = os.getenv("ADMIN_MOBILE", "9999999999")