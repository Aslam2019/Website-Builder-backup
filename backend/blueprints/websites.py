from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.website_service import (
    create_website, get_user_websites, get_website_by_id,
    update_website, delete_website,
)
from database.mongo import get_db

websites_bp = Blueprint("websites", __name__)


# ============================================================
# CREATE (draft)
# ============================================================
@websites_bp.route("", methods=["POST"])
@token_required
def create():
    """User creates website record (draft)."""
    data = request.get_json(silent=True) or {}
    doc, err = create_website(g.user_id, data)
    if err:
        return error(err, 400)
    return success({"website": serialize_doc(doc)}, "Website created", 201)


# ============================================================
# LIST — User's own websites (Admin: ?all=true)
# ============================================================
@websites_bp.route("", methods=["GET"])
@token_required
def list_mine():
    """User: own websites. Admin: ?all=true returns all."""
    db = get_db()

    if g.role == "super_admin" and request.args.get("all", "false").lower() == "true":
        docs = list(db.websites.find({}).sort("created_at", -1))
    else:
        docs = get_user_websites(g.user_id)

    return success({"websites": serialize_doc(docs)})


# ============================================================
# ✅ MY-WEBSITE — Latest published website (for QR code)
# ⚠️  MUST be defined BEFORE /<website_id> route
# ============================================================
@websites_bp.route("/my-website", methods=["GET", "OPTIONS"])
@token_required
def get_my_website():
    """
    Returns the user's most recent PUBLISHED website.
    Used by frontend to generate QR code from live_url.
    Returns null if no published website exists.
    """
    if request.method == "OPTIONS":
        return "", 200

    db = get_db()

    # Find the latest published website for this user
    doc = db.websites.find_one(
        {
            "user_id": g.user_id,
            "status": "published",
        },
        sort=[("published_at", -1), ("updated_at", -1)],
    )

    # Fallback: if no "published" status found, try latest with live_url
    if not doc:
        doc = db.websites.find_one(
            {
                "user_id": g.user_id,
                "live_url": {"$exists": True, "$ne": None, "$ne": ""},
            },
            sort=[("updated_at", -1)],
        )

    if not doc:
        return success(None, "No published website found")

    return success(serialize_doc(doc))


# ============================================================
# GET ONE — by ID
# ============================================================
@websites_bp.route("/<website_id>", methods=["GET"])
@token_required
def get_one(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    doc = get_website_by_id(website_id)
    if not doc:
        return error("Website not found", 404)

    if g.role != "super_admin" and str(doc["user_id"]) != g.user_id:
        return error("Access denied", 403)

    return success({"website": serialize_doc(doc)})


# ============================================================
# UPDATE
# ============================================================
@websites_bp.route("/<website_id>", methods=["PUT"])
@token_required
def edit(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    data = request.get_json(silent=True) or {}
    is_admin = g.role == "super_admin"
    doc, err = update_website(website_id, g.user_id, data, is_admin=is_admin)
    if err:
        return error(err, 403 if "access" in err.lower() else 404)
    return success({"website": serialize_doc(doc)}, "Website updated")


# ============================================================
# DELETE
# ============================================================
@websites_bp.route("/<website_id>", methods=["DELETE"])
@token_required
def remove(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    is_admin = g.role == "super_admin"
    ok, err = delete_website(website_id, g.user_id, is_admin=is_admin)
    if not ok:
        return error(err or "Delete failed", 403)
    return success({}, "Website deleted")