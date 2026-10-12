from datetime import datetime, timezone
from database.mongo import get_db
from utils.security import hash_password, verify_password, generate_jwt
from utils.helpers import to_object_id
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


def register_user(data):
    """Register a new user (role='user'). Returns (user_dict, error)."""
    db = get_db()

    username = data.get("username", "").strip()
    password = data.get("password", "")
    mobile = data.get("mobile", "").strip()
    category_id = data.get("category_id") or data.get("category")
    preferred_plan_id = data.get("preferred_plan_id")

    if not category_id:
        return None, "Category is required"
    try:
        cat = db.categories.find_one({"_id": to_object_id(category_id), "is_active": True})
    except Exception:
        return None, "Invalid category"
    if not cat:
        return None, "Selected category is not available"

    if db.users.find_one({"username": username}):
        return None, "Username already taken"

    plan_doc = None
    if preferred_plan_id:
        try:
            plan_doc = db.pricing_plans.find_one({
                "_id": ObjectId(preferred_plan_id), "is_active": True
            })
        except Exception:
            plan_doc = None

    user_doc = {
        "username": username,
        "password_hash": hash_password(password),
        "mobile": mobile,
        "role": "user",
        "category_id": cat["_id"],
        "preferred_plan_id": plan_doc["_id"] if plan_doc else None,
        "is_active": True,
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = db.users.insert_one(user_doc)
    user_doc["_id"] = result.inserted_id
    return user_doc, None


def authenticate(username, password):
    db = get_db()
    user = db.users.find_one({"username": username})
    if not user:
        return None, "Invalid username or password"
    if not verify_password(password, user.get("password_hash", "")):
        return None, "Invalid username or password"
    if not user.get("is_active", True):
        return None, "Account is deactivated. Contact admin."
    return user, None


def build_token_for(user):
    return generate_jwt(
        user_id=str(user["_id"]),
        username=user["username"],
        role=user["role"],
    )


def get_user_public(user):
    """Return safe fields only. Includes feature_flags from plan."""
    db = get_db()
    category = None
    preferred_plan = None

    # Category
    if user.get("category_id"):
        try:
            cat = db.categories.find_one({"_id": to_object_id(user["category_id"])})
            if cat:
                category = {"id": str(cat["_id"]), "name": cat["name"], "slug": cat["slug"]}
        except Exception:
            category = None

    # Preferred plan — WITH feature_flags (CRITICAL for plan restriction)
    if user.get("preferred_plan_id"):
        try:
            p = db.pricing_plans.find_one({"_id": user["preferred_plan_id"]})
            if p:
                preferred_plan = {
                    "id": str(p["_id"]),
                    "name": p["name"],
                    "price": p["price"],
                    # ✅ This makes Admin toggle → User feature work
                    "feature_flags": p.get("feature_flags", {}) or {},
                }
        except Exception:
            preferred_plan = None

    return {
        "id": str(user["_id"]),
        "username": user["username"],
        "mobile": user.get("mobile"),
        "role": user.get("role"),
        "is_active": user.get("is_active", True),
        "category": category,
        "preferred_plan": preferred_plan,
        "created_at": user.get("created_at").isoformat() if user.get("created_at") else None,
    }