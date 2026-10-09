from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId
from services.log_service import log_action
from utils.security import hash_password, verify_password   # ✅ SAME AS LOGIN


def _now():
    return datetime.now(timezone.utc)


# ============================================================
# DASHBOARD
# ============================================================
def dashboard_stats():
    db = get_db()

    total_users = db.users.count_documents({"role": "user"})
    active_users = db.users.count_documents({"role": "user", "is_active": True})
    total_websites = db.websites.count_documents({})
    published_websites = db.websites.count_documents({"status": "published"})
    total_payments = db.payments.count_documents({})
    pending_payments = db.payments.count_documents({"status": "pending"})

    r = list(db.payments.aggregate([
        {"$match": {"status": "successful"}},
        {"$group": {"_id": None, "total": {"$sum": "$amount"}}},
    ]))
    revenue = r[0]["total"] if r else 0

    return {
        "total_users": total_users,
        "active_users": active_users,
        "total_websites": total_websites,
        "published_websites": published_websites,
        "total_payments": total_payments,
        "pending_payments": pending_payments,
        "revenue": revenue,
    }


# ============================================================
# USERS
# ============================================================
def list_users(search=None, category_id=None):
    db = get_db()
    q = {"role": "user"}
    if search:
        q["username"] = {"$regex": search, "$options": "i"}
    if category_id:
        try:
            q["category_id"] = ObjectId(category_id)
        except Exception:
            pass

    users = list(db.users.find(q).sort("created_at", -1))

    out = []
    for u in users:
        cat = None
        if u.get("category_id"):
            c = db.categories.find_one({"_id": u["category_id"]})
            if c:
                cat = {"id": str(c["_id"]), "name": c["name"]}

        pref_plan = None
        if u.get("preferred_plan_id"):
            p = db.pricing_plans.find_one({"_id": u["preferred_plan_id"]})
            if p:
                pref_plan = {
                    "id": str(p["_id"]),
                    "name": p["name"],
                    "price": p["price"],
                }

        website = db.websites.find_one({"user_id": u["_id"]})
        web_info = None
        if website:
            web_info = {
                "id": str(website["_id"]),
                "name": website.get("name"),
                "template_name": website.get("template_name"),
                "plan_name": website.get("plan_name"),
                "status": website.get("status"),
                "payment_status": website.get("payment_status"),
            }

        out.append({
            "id": str(u["_id"]),
            "username": u["username"],
            "mobile": u.get("mobile"),
            "role": u.get("role"),
            "is_active": u.get("is_active", True),
            "category": cat,
            "preferred_plan": pref_plan,
            "website": web_info,
            "created_at": u.get("created_at").isoformat() if u.get("created_at") else None,
        })
    return out


def toggle_user_active(user_id, admin_id, admin_username, activate=True):
    db = get_db()
    try:
        user = db.users.find_one({"_id": ObjectId(user_id), "role": "user"})
    except Exception:
        return None, "Invalid user id"
    if not user:
        return None, "User not found"

    db.users.update_one(
        {"_id": ObjectId(user_id)},
        {"$set": {"is_active": bool(activate), "updated_at": _now()}}
    )
    log_action(
        admin_id=admin_id,
        admin_username=admin_username,
        action="user_activate" if activate else "user_deactivate",
        target_type="user",
        target_id=user_id,
        metadata={"username": user["username"]},
    )
    return {"id": str(user["_id"]), "is_active": bool(activate)}, None


def list_all_websites():
    db = get_db()
    websites = list(db.websites.find({}).sort("created_at", -1))
    out = []
    for w in websites:
        out.append({
            "id": str(w["_id"]),
            "name": w.get("name"),
            "username": w.get("username"),
            "user_id": str(w.get("user_id")),
            "template_name": w.get("template_name"),
            "plan_name": w.get("plan_name"),
            "status": w.get("status"),
            "payment_status": w.get("payment_status"),
            "created_at": w.get("created_at").isoformat() if w.get("created_at") else None,
        })
    return out


# ============================================================
# UPDATE USER DETAILS
# ============================================================
def update_user_details(user_id, data, admin_id=None, admin_username=None):
    """Update allowed fields: username, mobile, is_active"""
    db = get_db()

    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return None, "Invalid user id"

    user = db.users.find_one({"_id": obj_id, "role": "user"})
    if not user:
        return None, "User not found"

    updates = {}

    # Username
    if "username" in data:
        new_username = str(data.get("username") or "").strip()
        if not new_username:
            return None, "Username cannot be empty"
        if new_username != user.get("username"):
            exists = db.users.find_one({
                "_id": {"$ne": obj_id},
                "username": new_username,
            })
            if exists:
                return None, "Username already taken"
            updates["username"] = new_username

    # Mobile
    if "mobile" in data:
        updates["mobile"] = str(data.get("mobile") or "").strip()

    # is_active
    if "is_active" in data:
        updates["is_active"] = bool(data["is_active"])

    if not updates:
        return None, "No valid fields to update"

    updates["updated_at"] = _now()
    db.users.update_one({"_id": obj_id}, {"$set": updates})

    if admin_id:
        log_action(
            admin_id=admin_id,
            admin_username=admin_username,
            action="user_update",
            target_type="user",
            target_id=user_id,
            metadata={
                "username": updates.get("username", user.get("username")),
                "fields": list(updates.keys()),
            },
        )

    updated = db.users.find_one({"_id": obj_id})
    return {
        "id": str(updated["_id"]),
        "username": updated.get("username"),
        "mobile": updated.get("mobile"),
        "is_active": updated.get("is_active", True),
    }, None


# ============================================================
# DELETE USER + CASCADE
# ============================================================
def delete_user_by_id(user_id, admin_id=None, admin_username=None):
    """Delete user + cascade delete their websites & payments."""
    db = get_db()

    try:
        obj_id = ObjectId(user_id)
    except Exception:
        return None, "Invalid user id"

    user = db.users.find_one({"_id": obj_id})
    if not user:
        return None, "User not found"

    if user.get("role") == "admin":
        admin_count = db.users.count_documents({"role": "admin"})
        if admin_count <= 1:
            return None, "Cannot delete the last admin"

    username = user.get("username")

    try:
        db.websites.delete_many({"user_id": obj_id})
    except Exception:
        pass

    try:
        db.payments.delete_many({"user_id": obj_id})
    except Exception:
        pass

    db.users.delete_one({"_id": obj_id})

    if admin_id:
        log_action(
            admin_id=admin_id,
            admin_username=admin_username,
            action="user_delete",
            target_type="user",
            target_id=user_id,
            metadata={"username": username},
        )

    return {"id": user_id, "username": username}, None


# ============================================================
# ADMIN PROFILE — Update username
# ============================================================
def update_admin_profile(admin_id, data, actor_id=None, actor_username=None):
    db = get_db()
    try:
        obj_id = ObjectId(admin_id)
    except Exception:
        return None, "Invalid id"

    admin = db.users.find_one({"_id": obj_id})
    if not admin:
        return None, "Admin not found"

    new_username = (data.get("username") or "").strip()
    if new_username:
        if len(new_username) < 3:
            return None, "Username must be at least 3 characters"
        if new_username != admin["username"]:
            exists = db.users.find_one({"_id": {"$ne": obj_id}, "username": new_username})
            if exists:
                return None, "Username already taken"
            db.users.update_one(
                {"_id": obj_id},
                {"$set": {"username": new_username, "updated_at": _now()}}
            )
            log_action(
                admin_id=actor_id, admin_username=actor_username,
                action="admin_username_change", target_type="user",
                target_id=str(obj_id), metadata={"new_username": new_username},
            )

    return {"id": str(obj_id), "username": new_username or admin["username"]}, None


# ============================================================
# ADMIN PASSWORD — Change (uses project's own utils.security)
# ============================================================
def change_admin_password(admin_id, current_password, new_password, actor_username=None):
    db = get_db()
    try:
        obj_id = ObjectId(admin_id)
    except Exception:
        return None, "Invalid id"

    admin = db.users.find_one({"_id": obj_id})
    if not admin:
        return None, "Admin not found"

    stored = admin.get("password_hash", "")
    if not stored:
        return None, "Password not set for this account"

    # ✅ Project's own verify (same as register_user / authenticate)
    if not verify_password(current_password, stored):
        return None, "Current password is incorrect"

    db.users.update_one(
        {"_id": obj_id},
        {"$set": {
            "password_hash": hash_password(new_password),   # ✅ Project's own hash
            "updated_at": _now(),
        }},
    )

    log_action(
        admin_id=admin_id,
        admin_username=actor_username,
        action="admin_password_change",
        target_type="user",
        target_id=str(obj_id),
        metadata={},
    )
    return {"id": str(obj_id)}, None