from datetime import datetime, timezone
from database.mongo import get_db


def _now():
    return datetime.now(timezone.utc)


# ============================================================
# SITE SETTINGS (Logo + Name)
# ============================================================
def get_site_settings():
    db = get_db()
    doc = db.settings.find_one({"_id": "site"}) or {}
    return {
        "logo_url": doc.get("logo_url", ""),
        "site_name": doc.get("site_name", "WebsiteBuilder"),
    }


def update_site_settings(data, admin_id=None, admin_username=None):
    db = get_db()
    allowed = {}
    if "logo_url" in data:
        allowed["logo_url"] = str(data.get("logo_url") or "").strip()
    if "site_name" in data:
        name = str(data.get("site_name") or "").strip()
        allowed["site_name"] = name or "WebsiteBuilder"

    if not allowed:
        return None, "No valid fields to update"

    allowed["updated_at"] = _now()
    db.settings.update_one({"_id": "site"}, {"$set": allowed}, upsert=True)
    return get_site_settings(), None


# ============================================================
# ✅ TERMS & CONDITIONS (NEW)
# ============================================================
def list_terms(include_inactive=False):
    """Return all terms documents sorted by updated_at desc."""
    db = get_db()
    query = {} if include_inactive else {"is_active": {"$ne": False}}
    docs = list(db.terms.find(query).sort("updated_at", -1))
    return [
        {
            "id": str(d["_id"]),
            "title": d.get("title", ""),
            "slug": d.get("slug", ""),
            "content": d.get("content", ""),
            "is_active": d.get("is_active", True),
            "updated_at": d.get("updated_at").isoformat() if d.get("updated_at") else None,
        }
        for d in docs
    ]


def get_term_by_slug(slug):
    """Get a single term by slug (public)."""
    db = get_db()
    d = db.terms.find_one({"slug": slug, "is_active": {"$ne": False}})
    if not d:
        return None, "Not found"
    return {
        "id": str(d["_id"]),
        "title": d.get("title", ""),
        "slug": d.get("slug", ""),
        "content": d.get("content", ""),
        "updated_at": d.get("updated_at").isoformat() if d.get("updated_at") else None,
    }, None


def create_term(data, admin_id=None, admin_username=None):
    db = get_db()
    title = str(data.get("title") or "").strip()
    slug = str(data.get("slug") or "").strip().lower()
    content = str(data.get("content") or "")

    if not title:
        return None, "Title is required"
    if not slug:
        return None, "Slug is required"
    # sanitize slug
    import re
    slug = re.sub(r"[^a-z0-9-]+", "-", slug).strip("-")
    if not slug:
        return None, "Invalid slug"

    if db.terms.find_one({"slug": slug}):
        return None, "Slug already exists"

    doc = {
        "title": title,
        "slug": slug,
        "content": content,
        "is_active": True,
        "created_at": _now(),
        "updated_at": _now(),
    }
    result = db.terms.insert_one(doc)
    doc["_id"] = result.inserted_id
    return {"id": str(doc["_id"]), "title": title, "slug": slug}, None


def update_term(term_id, data, admin_id=None, admin_username=None):
    from bson import ObjectId
    db = get_db()
    try:
        obj_id = ObjectId(term_id)
    except Exception:
        return None, "Invalid id"

    existing = db.terms.find_one({"_id": obj_id})
    if not existing:
        return None, "Term not found"

    updates = {}
    if "title" in data:
        updates["title"] = str(data["title"]).strip()
    if "slug" in data:
        import re
        slug = re.sub(r"[^a-z0-9-]+", "-", str(data["slug"]).strip().lower()).strip("-")
        if slug != existing["slug"] and db.terms.find_one({"slug": slug}):
            return None, "Slug already exists"
        updates["slug"] = slug
    if "content" in data:
        updates["content"] = str(data["content"])
    if "is_active" in data:
        updates["is_active"] = bool(data["is_active"])

    if not updates:
        return None, "No valid fields"

    updates["updated_at"] = _now()
    db.terms.update_one({"_id": obj_id}, {"$set": updates})
    return {"id": term_id}, None


def delete_term(term_id, admin_id=None, admin_username=None):
    from bson import ObjectId
    db = get_db()
    try:
        obj_id = ObjectId(term_id)
    except Exception:
        return None, "Invalid id"

    result = db.terms.delete_one({"_id": obj_id})
    if result.deleted_count == 0:
        return None, "Term not found"
    return {"id": term_id}, None