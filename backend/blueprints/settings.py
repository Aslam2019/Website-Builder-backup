from flask import Blueprint, request, g
from datetime import datetime
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from database.mongo import get_db
from services.settings_service import (
    get_site_settings, update_site_settings,
    list_terms, get_term_by_slug, create_term, update_term, delete_term,
)

settings_bp = Blueprint("settings", __name__)


# ============================================================
# SITE SETTINGS
# ============================================================
@settings_bp.route("/site", methods=["GET", "OPTIONS"])
def public_get_settings():
    if request.method == "OPTIONS":
        return "", 200
    return success(get_site_settings())


@settings_bp.route("/site", methods=["PUT", "OPTIONS"])
@token_required
@admin_required
def update_settings_route():
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json() or {}
    res, err = update_site_settings(data, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "Settings updated")


# ============================================================
# ✅ TERMS & CONDITIONS
# ============================================================

# --- Public: list active terms (for footer) ---
@settings_bp.route("/terms", methods=["GET", "OPTIONS"])
def public_list_terms():
    if request.method == "OPTIONS":
        return "", 200
    return success({"terms": list_terms(include_inactive=False)})


# --- Public: get single term by slug ---
@settings_bp.route("/terms/<slug>", methods=["GET", "OPTIONS"])
def public_get_term(slug):
    if request.method == "OPTIONS":
        return "", 200
    res, err = get_term_by_slug(slug)
    if err:
        return error(err, 404)
    return success(res)


# --- Admin: list ALL (including inactive) ---
@settings_bp.route("/admin/terms", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def admin_list_terms():
    if request.method == "OPTIONS":
        return "", 200
    return success({"terms": list_terms(include_inactive=True)})


# --- Admin: create ---
@settings_bp.route("/admin/terms", methods=["POST", "OPTIONS"])
@token_required
@admin_required
def admin_create_term():
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json() or {}
    res, err = create_term(data, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "Term created")


# --- Admin: update ---
@settings_bp.route("/admin/terms/<term_id>", methods=["PUT", "OPTIONS"])
@token_required
@admin_required
def admin_update_term(term_id):
    if request.method == "OPTIONS":
        return "", 200
    data = request.get_json() or {}
    res, err = update_term(term_id, data, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "Term updated")


# --- Admin: delete ---
@settings_bp.route("/admin/terms/<term_id>", methods=["DELETE", "OPTIONS"])
@token_required
@admin_required
def admin_delete_term(term_id):
    if request.method == "OPTIONS":
        return "", 200
    res, err = delete_term(term_id, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "Term deleted")


# ============================================================
# ✅ FRONTEND CONTENT (Admin Edit Panna)
# ============================================================
@settings_bp.route('/frontend', methods=['GET', 'OPTIONS'])
def get_frontend_content():
    """Public GET — Frontend la irundhu fetch panna."""
    if request.method == "OPTIONS":
        return "", 200

    db = get_db()
    doc = db.settings.find_one({"type": "frontend_content"})

    # Ithu default content (edhavadhu illana)
    default_content = {
        "hero": {
            "title": "Your Website.",
            "accent": "Your Way.",
            "subtitle": "Choose from a beautiful collection of templates, customize it yourself, and get your website live — in just a few clicks."
        },
        "about": {
            "title": "Your Website. Your Vision.",
            "accent": "Live in Minutes.",
            "description": "Create your own professional website without any coding or technical skills. Our easy-to-use platform helps you go from sign up to live in just a few simple steps."
        },
        "footer": {
            "description": "Create a professional website in minutes — no code, no hassle."
        },
        "contact": {
            "email": "hello@ncube.com",
            "address": "27 Division St, New York, NY 10002, USA",
            "phone": "+1 800 123 456 789",
            "working_hours": "Mon – Fri: 9 am – 6 pm"
        },
        "social": {
            "instagram": "https://instagram.com/ncube",
            "twitter": "https://twitter.com/ncube",
            "facebook": "https://facebook.com/ncube",
            "linkedin": "https://linkedin.com/company/ncube"
        }
    }

    if not doc:
        return success({"content": default_content})

    # Merge doc content with default (to handle missing keys)
    existing = doc.get("content", {})
    merged = {**default_content, **existing}
    
    # Ensure sub-objects are also merged if they exist partially
    for key in ["hero", "about", "footer", "contact", "social"]:
        if key in existing and isinstance(existing[key], dict):
            merged[key] = {**default_content[key], **existing[key]}
        elif key not in existing:
            merged[key] = default_content[key]

    return success({"content": merged})


@settings_bp.route('/frontend', methods=['PUT', 'OPTIONS'])
@token_required
@admin_required
def update_frontend_content():
    """Admin PUT — Content ah update panna."""
    if request.method == "OPTIONS":
        return "", 200

    db = get_db()
    data = request.get_json(silent=True) or {}
    content = data.get("content")

    if not content:
        return error("Content is required", 400)

    db.settings.update_one(
        {"type": "frontend_content"},
        {"$set": {"type": "frontend_content", "content": content, "updated_at": datetime.utcnow()}},
        upsert=True
    )

    return success({}, "Frontend content updated")