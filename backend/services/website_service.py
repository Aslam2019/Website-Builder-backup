from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


# ============================================================
# CREATE (draft)
# ============================================================
def create_website(user_id, payload):
    """
    Create website record (draft).
    payload: { template_id, pricing_plan_id, form_data (dict) }
    """
    db = get_db()

    template_id = payload.get("template_id")
    plan_id = payload.get("pricing_plan_id") or payload.get("plan_id")
    form_data = payload.get("form_data") or {}

    if not template_id:
        return None, "Template is required"
    if not plan_id:
        return None, "Pricing plan is required"
    if not isinstance(form_data, dict):
        return None, "Form data must be an object"

    user = db.users.find_one({"_id": ObjectId(user_id)})
    if not user:
        return None, "User not found"

    try:
        tpl = db.templates.find_one({"_id": ObjectId(template_id), "is_active": True})
    except Exception:
        return None, "Invalid template"
    if not tpl:
        return None, "Template not found or inactive"

    try:
        plan = db.pricing_plans.find_one({"_id": ObjectId(plan_id), "is_active": True})
    except Exception:
        return None, "Invalid pricing plan"
    if not plan:
        return None, "Pricing plan not found or inactive"

    # ---- Category info ----
    category = None
    if user.get("category_id"):
        try:
            category = db.categories.find_one({"_id": user["category_id"]})
        except Exception:
            category = None

    # Website name
    website_name = (
        form_data.get("full_name")
        or form_data.get("company_name")
        or form_data.get("salon_name")
        or form_data.get("photographer_name")
        or user["username"]
    )
        # ✅ Template Name Auto-Fix (Ithu inga add pannunga)
    clean_tpl_name = tpl["name"].lower()
    if "medical" in clean_tpl_name:
        clean_tpl_name = "medical-01"
    elif "salon" in clean_tpl_name:
        clean_tpl_name = "salon-01"
    elif "photography" in clean_tpl_name:
        clean_tpl_name = "photography-01"
    elif "real estate" in clean_tpl_name:
        clean_tpl_name = "real-estate-01"
    elif "gym" in clean_tpl_name:
        clean_tpl_name = "gym-01"
    elif "education" in clean_tpl_name:
        clean_tpl_name = "education-01"
    elif "portfolio" in clean_tpl_name:
        clean_tpl_name = "portfolio-01"
    else:
        clean_tpl_name = clean_tpl_name.replace(" ", "-")

    doc = {
        "user_id": user["_id"],
        "username": user["username"],
        "category_id": user.get("category_id"),
        "category_slug": category["slug"] if category else None,
        "category_name": category["name"] if category else None,
        "template_id": tpl["_id"],
        "template_name": clean_tpl_name,
        "pricing_plan_id": plan["_id"],
        "plan_name": plan["name"],
        "plan_price": plan["price"],
        "name": website_name,
        "form_data": form_data,
        "status": "draft",              # draft | published
        "payment_status": "pending",
        "live_url": None,               # ← set on publish
        "published_at": None,           # ← set on publish
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.websites.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


# ============================================================
# LIST
# ============================================================
def get_user_websites(user_id):
    db = get_db()
    return list(db.websites.find({"user_id": ObjectId(user_id)}).sort("created_at", -1))


# ============================================================
# ✅ GET MY PUBLISHED WEBSITE (for QR code)
# ============================================================
def get_my_published_website(user_id):
    """
    Latest published website for this user.
    Returns None if no published website exists.
    """
    db = get_db()
    return db.websites.find_one(
        {
            "user_id": ObjectId(user_id),
            "status": "published",
            "live_url": {"$exists": True, "$ne": None, "$ne": ""},
        },
        sort=[("published_at", -1), ("updated_at", -1)],
    )


# ============================================================
# ✅ PUBLISH (sets live_url + status + published_at)
# ============================================================
def publish_website(website_id, user_id, live_url):
    """
    Mark a website as published.
    Called from publish flow after CloudFront URL is generated.
    
    live_url example: 
      'https://d18roj0r3oz2ym.cloudfront.net/aslam/salon/index.html'
    """
    db = get_db()

    try:
        website = db.websites.find_one({"_id": ObjectId(website_id)})
    except Exception:
        return None, "Invalid website id"

    if not website:
        return None, "Website not found"
    if str(website["user_id"]) != str(user_id):
        return None, "Access denied"

    db.websites.update_one(
        {"_id": ObjectId(website_id)},
        {"$set": {
            "status": "published",
            "live_url": live_url,
            "published_at": _now(),
            "updated_at": _now(),
        }}
    )
    return db.websites.find_one({"_id": ObjectId(website_id)}), None


# ============================================================
# GET BY ID
# ============================================================
def get_website_by_id(website_id):
    db = get_db()
    try:
        return db.websites.find_one({"_id": ObjectId(website_id)})
    except Exception:
        return None


# ============================================================
# UPDATE
# ============================================================
def update_website(website_id, user_id, payload, is_admin=False):
    db = get_db()
    try:
        doc = db.websites.find_one({"_id": ObjectId(website_id)})
    except Exception:
        return None, "Invalid website id"
    if not doc:
        return None, "Website not found"

    if not is_admin and str(doc["user_id"]) != str(user_id):
        return None, "You do not have access to this website"

    patch = {}
    if "form_data" in payload and isinstance(payload["form_data"], dict):
        patch["form_data"] = payload["form_data"]
    if "name" in payload:
        patch["name"] = str(payload["name"]).strip()
    if is_admin and "status" in payload:
        patch["status"] = payload["status"]

    patch["updated_at"] = _now()
    db.websites.update_one({"_id": ObjectId(website_id)}, {"$set": patch})
    return db.websites.find_one({"_id": ObjectId(website_id)}), None


# ============================================================
# DELETE
# ============================================================
def delete_website(website_id, user_id, is_admin=False):
    db = get_db()
    try:
        doc = db.websites.find_one({"_id": ObjectId(website_id)})
    except Exception:
        return False, "Invalid website id"
    if not doc:
        return False, "Website not found"
    if not is_admin and str(doc["user_id"]) != str(user_id):
        return False, "Access denied"
    db.websites.delete_one({"_id": ObjectId(website_id)})
    return True, None
