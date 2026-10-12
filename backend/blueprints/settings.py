from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
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
# ✅ TERMS & CONDITIONS (NEW)
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