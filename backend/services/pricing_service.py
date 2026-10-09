from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


def list_plans(active_only=True):
    db = get_db()
    q = {"is_active": True} if active_only else {}
    return list(db.pricing_plans.find(q).sort("price", 1))


def get_plan(plan_id):
    db = get_db()
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)})


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

    doc = {
        "name": name,
        "price": price,
        "description": (payload.get("description") or "").strip(),
        "features": [str(f).strip() for f in features if str(f).strip()],
        "is_active": bool(payload.get("is_active", True)),
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.pricing_plans.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


def update_plan(plan_id, payload):
    db = get_db()
    doc = db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
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

    patch["updated_at"] = _now()
    db.pricing_plans.update_one({"_id": ObjectId(plan_id)}, {"$set": patch})
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)}), None


def delete_plan(plan_id):
    db = get_db()
    db.pricing_plans.delete_one({"_id": ObjectId(plan_id)})