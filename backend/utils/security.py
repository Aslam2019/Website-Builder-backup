import bcrypt
import jwt
import uuid
from datetime import datetime, timedelta, timezone
from config import Config


# ============ PASSWORD HASHING ============

def hash_password(plain_password: str) -> str:
    """Hash a password using bcrypt."""
    if not plain_password:
        raise ValueError("Password cannot be empty")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(plain_password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash."""
    if not plain_password or not hashed_password:
        return False
    try:
        return bcrypt.checkpw(
            plain_password.encode("utf-8"),
            hashed_password.encode("utf-8")
        )
    except Exception:
        return False


# ============ JWT ============

def generate_jwt(user_id: str, username: str, role: str) -> str:
    """Generate JWT token."""
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user_id),
        "username": username,
        "role": role,
        "iat": now,
        "exp": now + timedelta(hours=Config.JWT_EXPIRES_HOURS),
    }
    return jwt.encode(payload, Config.JWT_SECRET, algorithm="HS256")


def decode_jwt(token: str) -> dict:
    """Decode JWT. Raises jwt exceptions on failure."""
    return jwt.decode(token, Config.JWT_SECRET, algorithms=["HS256"])


# ============ HELPERS ============

def generate_payment_id() -> str:
    """Generate unique dummy payment id."""
    return "PAY-" + uuid.uuid4().hex[:12].upper()


def now_utc():
    return datetime.now(timezone.utc)