from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


DEFAULT_FEATURE_FLAGS = {
    "qr_code": False,
    "whatsapp_button": False,
    "custom_domain": False,
    "priority_support": False,
    "unlimited_pages": False,
}


def _now():
    return datetime.now(timezone.utc)


def _normalize_flags(raw):
    if not isinstance(raw, dict):
        return dict(DEFAULT_FEATURE_FLAGS)
    out = dict(DEFAULT_FEATURE_FLAGS)
    for k, v in raw.items():
        if k in DEFAULT_FEATURE_FLAGS:
            out[k] = bool(v)
    return out


def list_plans(active_only=True):
    db = get_db()
    q = {"is_active": True} if active_only else {}
    return list(db.pricing_plans.find(q).sort("price", 1))


def get_plan(plan_id):
    db = get_db()
    try:
        return db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None


def create_plan(payload):
    db = get_db()
    name = (payload.get("name") or "").strip()
    if not name:
        return None, "Plan name is required"
    if db.pricing_plans.find_one({"name": name}):
        return None, "Plan with this name already exists"

    try:
        price = float(payload.get("price", 0))
    except (TypeError, ValueError):
        return None, "Price must be a number"
    if price < 0:
        return None, "Price cannot be negative"

    features = payload.get("features") or []
    if not isinstance(features, list):
        return None, "Features must be a list"

    feature_flags = _normalize_flags(payload.get("feature_flags"))

    doc = {
        "name": name,
        "price": price,
        "description": (payload.get("description") or "").strip(),
        "features": [str(f).strip() for f in features if str(f).strip()],
        "feature_flags": feature_flags,
        "is_active": bool(payload.get("is_active", True)),
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.pricing_plans.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


def update_plan(plan_id, payload):
    db = get_db()
    try:
        doc = db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None, "Invalid plan id"
    if not doc:
        return None, "Plan not found"

    patch = {}
    for k in ("name", "description", "is_active"):
        if k in payload:
            patch[k] = payload[k]

    if "price" in payload:
        try:
            patch["price"] = float(payload["price"])
        except (TypeError, ValueError):
            return None, "Price must be a number"

    if "features" in payload:
        if not isinstance(payload["features"], list):
            return None, "Features must be a list"
        patch["features"] = [str(f).strip() for f in payload["features"] if str(f).strip()]

    if "feature_flags" in payload:
        patch["feature_flags"] = _normalize_flags(payload["feature_flags"])

    patch["updated_at"] = _now()
    db.pricing_plans.update_one({"_id": ObjectId(plan_id)}, {"$set": patch})
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)}), None


def update_plan_feature_flags(plan_id, feature_flags):
    db = get_db()
    try:
        doc = db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None, "Invalid plan id"
    if not doc:
        return None, "Plan not found"

    if not isinstance(feature_flags, dict):
        return None, "feature_flags must be an object"

    current = _normalize_flags(doc.get("feature_flags"))
    for k, v in feature_flags.items():
        if k in DEFAULT_FEATURE_FLAGS:
            current[k] = bool(v)

    db.pricing_plans.update_one(
        {"_id": ObjectId(plan_id)},
        {"$set": {"feature_flags": current, "updated_at": _now()}}
    )
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)}), None


def delete_plan(plan_id):
    db = get_db()
    db.pricing_plans.delete_one({"_id": ObjectId(plan_id)})