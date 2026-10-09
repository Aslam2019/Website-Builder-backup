from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.admin_service import (
    dashboard_stats, list_users, toggle_user_active, list_all_websites,
    update_user_details, delete_user_by_id,
    update_admin_profile, change_admin_password,   # ✅ NEW
)
from services.log_service import list_logs
from services.payment_service import list_payments

admin_bp = Blueprint("admin", __name__)


# -------- Dashboard --------

@admin_bp.route("/dashboard", methods=["GET"])
@token_required
@admin_required
def dashboard():
    return success({"stats": dashboard_stats()})


# -------- Users --------

@admin_bp.route("/users", methods=["GET"])
@token_required
@admin_required
def users():
    search = request.args.get("search")
    category_id = request.args.get("category_id")
    return success({"users": list_users(search=search, category_id=category_id)})


@admin_bp.route("/users/<user_id>/activate", methods=["PUT"])
@token_required
@admin_required
def activate_user(user_id):
    if not is_valid_object_id(user_id):
        return error("Invalid user id", 400)
    res, err = toggle_user_active(user_id, g.user_id, g.username, activate=True)
    if err:
        return error(err, 404)
    return success(res, "User activated")


@admin_bp.route("/users/<user_id>/deactivate", methods=["PUT"])
@token_required
@admin_required
def deactivate_user(user_id):
    if not is_valid_object_id(user_id):
        return error("Invalid user id", 400)
    res, err = toggle_user_active(user_id, g.user_id, g.username, activate=False)
    if err:
        return error(err, 404)
    return success(res, "User deactivated")


# ✅ NEW — Update user details
@admin_bp.route("/users/<user_id>", methods=["PUT"])
@token_required
@admin_required
def update_user(user_id):
    if not is_valid_object_id(user_id):
        return error("Invalid user id", 400)
    data = request.get_json() or {}
    res, err = update_user_details(user_id, data, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "User updated")


# ✅ NEW — Delete user
@admin_bp.route("/users/<user_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_user(user_id):
    if not is_valid_object_id(user_id):
        return error("Invalid user id", 400)
    res, err = delete_user_by_id(user_id, g.user_id, g.username)
    if err:
        return error(err, 404)
    return success(res, "User deleted")


# -------- Websites --------

@admin_bp.route("/websites", methods=["GET"])
@token_required
@admin_required
def websites():
    return success({"websites": list_all_websites()})


# -------- Payments --------

@admin_bp.route("/payments", methods=["GET"])
@token_required
@admin_required
def payments():
    status = request.args.get("status")
    all_payments = list_payments(user_id=None)
    if status:
        all_payments = [p for p in all_payments if p.get("status") == status]
    return success({"payments": serialize_doc(all_payments)})


# -------- Logs --------

@admin_bp.route("/logs", methods=["GET"])
@token_required
@admin_required
def logs():
    limit = int(request.args.get("limit", 100))
    return success({"logs": serialize_doc(list_logs(limit=limit))})

    # -------- Profile: update username --------

@admin_bp.route("/profile", methods=["PUT"])
@token_required
@admin_required
def update_profile():
    data = request.get_json() or {}
    res, err = update_admin_profile(g.user_id, data, g.user_id, g.username)
    if err:
        return error(err, 400)
    return success(res, "Profile updated")


# -------- Profile: change password --------

@admin_bp.route("/profile/password", methods=["PUT"])
@token_required
@admin_required
def change_password():
    data = request.get_json() or {}
    current_password = data.get("current_password")
    new_password = data.get("new_password")
    if not current_password or not new_password:
        return error("Both passwords are required", 400)
    if len(new_password) < 6:
        return error("Password must be at least 6 characters", 400)
    res, err = change_admin_password(g.user_id, current_password, new_password, g.username)
    if err:
        return error(err, 400)
    return success(res, "Password changed")