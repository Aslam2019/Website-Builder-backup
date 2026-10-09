from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


def list_templates(category_id=None, active_only=True):
    db = get_db()
    q = {}
    if active_only:
        q["is_active"] = True
    if category_id:
        try:
            q["category_id"] = ObjectId(category_id)
        except Exception:
            return []
    return list(db.templates.find(q).sort([("created_at", 1), ("name", 1)]))


def get_template(tpl_id):
    db = get_db()
    try:
        return db.templates.find_one({"_id": ObjectId(tpl_id)})
    except Exception:
        return None


def create_template(payload):
    db = get_db()
    name = (payload.get("name") or "").strip()
    category_id = payload.get("category_id")
    if not name:
        return None, "Template name is required"
    if not category_id:
        return None, "Category is required"

    try:
        cat = db.categories.find_one({"_id": ObjectId(category_id)})
    except Exception:
        return None, "Invalid category"
    if not cat:
        return None, "Category not found"

    if db.templates.find_one({"name": name, "category_id": cat["_id"]}):
        return None, "Template with this name already exists in this category"

    doc = {
        "name": name,
        "category_id": cat["_id"],
        "preview_image": payload.get("preview_image", ""),
        "config": payload.get("config") or {},
        "is_active": bool(payload.get("is_active", True)),
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.templates.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


def update_template(tpl_id, payload):
    db = get_db()
    try:
        doc = db.templates.find_one({"_id": ObjectId(tpl_id)})
    except Exception:
        return None, "Invalid template id"
    if not doc:
        return None, "Template not found"

    patch = {}
    if "name" in payload:
        patch["name"] = str(payload["name"]).strip()
    if "preview_image" in payload:
        patch["preview_image"] = payload["preview_image"]
    if "config" in payload:
        patch["config"] = payload["config"] or {}
    if "is_active" in payload:
        patch["is_active"] = bool(payload["is_active"])
    if "category_id" in payload:
        try:
            patch["category_id"] = ObjectId(payload["category_id"])
        except Exception:
            return None, "Invalid category id"

    patch["updated_at"] = _now()
    db.templates.update_one({"_id": ObjectId(tpl_id)}, {"$set": patch})
    return db.templates.find_one({"_id": ObjectId(tpl_id)}), None


def delete_template(tpl_id):
    db = get_db()
    try:
        db.templates.delete_one({"_id": ObjectId(tpl_id)})
        return True, None
    except Exception:
        return False, "Invalid template id"