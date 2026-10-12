from functools import wraps
from flask import request, g, jsonify
import jwt
from utils.security import decode_jwt
from database.mongo import get_db
from bson import ObjectId


def token_required(f):
    """Decorator: requires valid JWT. Sets g.user_id, g.username, g.role."""
    @wraps(f)
    def decorated(*args, **kwargs):
        # ✅ CRITICAL: Allow OPTIONS preflight (CORS)
        if request.method == "OPTIONS":
            return "", 200

        auth_header = request.headers.get("Authorization", "")
        if not auth_header.startswith("Bearer "):
            return jsonify({"success": False, "message": "Authorization token missing"}), 401

        token = auth_header.split(" ", 1)[1].strip()
        try:
            payload = decode_jwt(token)
        except jwt.ExpiredSignatureError:
            return jsonify({"success": False, "message": "Token expired"}), 401
        except jwt.InvalidTokenError as e:
            return jsonify({"success": False, "message": f"Invalid token: {str(e)}"}), 401

        # Verify user exists + active
        db = get_db()
        try:
            user = db.users.find_one({"_id": ObjectId(payload["sub"])})
        except Exception:
            return jsonify({"success": False, "message": "Invalid user id"}), 401

        if not user:
            return jsonify({"success": False, "message": "User not found"}), 401
        if not user.get("is_active", True):
            return jsonify({"success": False, "message": "Account is deactivated"}), 403

        g.user_id = str(user["_id"])
        g.username = user["username"]
        g.role = user["role"]
        g.user = user

        return f(*args, **kwargs)
    return decorated