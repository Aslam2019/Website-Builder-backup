from datetime import datetime, timezone
from database.mongo import get_db
from utils.helpers import slugify


def _now():
    return datetime.now(timezone.utc)


def list_categories(active_only=True):
    db = get_db()
    q = {"is_active": True} if active_only else {}
    return list(db.categories.find(q).sort("name", 1))


def create_category(name, description=""):
    db = get_db()
    name = name.strip()
    slug = slugify(name)
    if db.categories.find_one({"$or": [{"name": name}, {"slug": slug}]}):
        return None, "Category already exists"
    doc = {
        "name": name,
        "slug": slug,
        "description": description.strip(),
        "is_active": True,
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = db.categories.insert_one(doc)
    doc["_id"] = result.inserted_id
    return doc, None


def update_category(cat_id, updates):
    db = get_db()
    from bson import ObjectId
    doc = db.categories.find_one({"_id": ObjectId(cat_id)})
    if not doc:
        return None, "Category not found"

    allowed = {"name", "description", "is_active"}
    patch = {k: v for k, v in updates.items() if k in allowed}
    if "name" in patch:
        patch["name"] = patch["name"].strip()
        patch["slug"] = slugify(patch["name"])
        dup = db.categories.find_one({"slug": patch["slug"], "_id": {"$ne": ObjectId(cat_id)}})
        if dup:
            return None, "Category name already in use"

    patch["updated_at"] = _now()
    db.categories.update_one({"_id": ObjectId(cat_id)}, {"$set": patch})
    return db.categories.find_one({"_id": ObjectId(cat_id)}), None


def toggle_category(cat_id, is_active):
    return update_category(cat_id, {"is_active": bool(is_active)})