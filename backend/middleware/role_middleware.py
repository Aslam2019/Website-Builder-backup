from functools import wraps
from flask import request, g, jsonify


def role_required(*allowed_roles):
    """Decorator: requires g.role in allowed_roles."""
    def decorator(f):
        @wraps(f)
        def decorated(*args, **kwargs):
            # ✅ CRITICAL FIX: Allow OPTIONS preflight (CORS)
            if request.method == "OPTIONS":
                return "", 200

            if not hasattr(g, "role"):
                return jsonify({"success": False, "message": "Unauthorized"}), 401
            if g.role not in allowed_roles:
                return jsonify({"success": False, "message": "Forbidden: insufficient permissions"}), 403
            return f(*args, **kwargs)
        return decorated
    return decorator


def admin_required(f):
    return role_required("admin", "super_admin")(f)


def user_required(f):
    return role_required("user")(f)