from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


def _now():
    return datetime.now(timezone.utc)


def create_enquiry(data):
    """Public: submit custom plan enquiry."""
    db = get_db()

    name = (data.get("name") or "").strip()
    email = (data.get("email") or "").strip().lower()
    mobile = (data.get("mobile") or "").strip()
    business_type = (data.get("business_type") or "").strip()
    budget = (data.get("budget") or "").strip()
    message = (data.get("message") or "").strip()

    if not name:
        return None, "Name is required"
    if not mobile:
        return None, "Mobile number is required"
    if len(mobile) < 10:
        return None, "Enter a valid 10-digit mobile number"
    if not message:
        return None, "Please tell us what you need"

    doc = {
        "name": name,
        "email": email,
        "mobile": mobile,
        "business_type": business_type,
        "budget": budget,
        "message": message,
        "plan_interest": "Custom Plan",
        "status": "new",              # new | contacted | closed
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.custom_enquiries.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


def list_enquiries(status=None):
    db = get_db()
    q = {}
    if status and status != "all":
        q["status"] = status
    return list(db.custom_enquiries.find(q).sort("created_at", -1))


def update_enquiry_status(enquiry_id, status, admin_id=None, admin_username=None):
    db = get_db()
    try:
        doc = db.custom_enquiries.find_one({"_id": ObjectId(enquiry_id)})
    except Exception:
        return None, "Invalid enquiry id"
    if not doc:
        return None, "Enquiry not found"

    if status not in ("new", "contacted", "closed"):
        return None, "Invalid status"

    db.custom_enquiries.update_one(
        {"_id": ObjectId(enquiry_id)},
        {"$set": {"status": status, "updated_at": _now()}}
    )
    return db.custom_enquiries.find_one({"_id": ObjectId(enquiry_id)}), None


def delete_enquiry(enquiry_id):
    db = get_db()
    try:
        r = db.custom_enquiries.delete_one({"_id": ObjectId(enquiry_id)})
    except Exception:
        return False, "Invalid id"
    if r.deleted_count == 0:
        return False, "Enquiry not found"
    return True, None