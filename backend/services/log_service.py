from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


# Actions allowed to log (never log passwords or tokens)
VALID_ACTIONS = {
    "admin_login", "admin_logout",
    "category_create", "category_update", "category_delete",
    "template_create", "template_update", "template_delete",
    "pricing_create", "pricing_update", "pricing_delete",
    "user_activate", "user_deactivate",
    "website_update", "website_delete",
    "payment_success",
}


def log_action(admin_id, admin_username, action, target_type=None,
               target_id=None, metadata=None):
    """Store admin activity. Never store sensitive data."""
    if action not in VALID_ACTIONS:
        return
    db = get_db()
    try:
        db.admin_logs.insert_one({
            "admin_id": ObjectId(admin_id) if admin_id else None,
            "admin_username": admin_username,
            "action": action,
            "target_type": target_type,
            "target_id": str(target_id) if target_id else None,
            "metadata": metadata or {},
            "created_at": _now(),
        })
    except Exception as e:
        print(f"[log_action] failed: {e}")


def list_logs(limit=100):
    db = get_db()
    return list(db.admin_logs.find({}).sort("created_at", -1).limit(limit))