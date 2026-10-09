from flask import Blueprint, request, g
from services.auth_service import (
    register_user, authenticate, build_token_for, get_user_public
)
from middleware.auth_middleware import token_required
from utils.responses import success, error
from utils.validators import (
    validate_username, validate_password, validate_mobile
)
from services.log_service import log_action

auth_bp = Blueprint("auth", __name__)


@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json(silent=True) or {}

    username = (data.get("username") or "").strip()
    password = data.get("password") or ""
    confirm = data.get("confirm_password") or data.get("confirmPassword") or ""
    mobile = (data.get("mobile") or "").strip()
    category_id = data.get("category_id") or data.get("category")
    preferred_plan_id = data.get("preferred_plan_id") or data.get("preferredPlanId")

    errors = {}
    if (e := validate_username(username)):
        errors["username"] = e
    if (e := validate_password(password)):
        errors["password"] = e
    if password != confirm:
        errors["confirm_password"] = "Passwords do not match"
    if (e := validate_mobile(mobile)):
        errors["mobile"] = e
    if not category_id:
        errors["category"] = "Category is required"

    if errors:
        return error("Validation failed", 400, errors)

    user, err = register_user({
        "username": username,
        "password": password,
        "mobile": mobile,
        "category_id": category_id,
        "preferred_plan_id": preferred_plan_id,
    })
    if err:
        return error(err, 400)

    return success(
        {"user": get_user_public(user)},
        "Registration successful. Please login.",
        201
    )


@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(silent=True) or {}
    username = (data.get("username") or "").strip()
    password = data.get("password") or ""

    if not username or not password:
        return error("Username and password are required", 400)

    user, err = authenticate(username, password)
    if err:
        return error(err, 401)

    token = build_token_for(user)

    if user.get("role") == "super_admin":
        log_action(
            admin_id=str(user["_id"]),
            admin_username=user["username"],
            action="admin_login",
        )

    return success({
        "token": token,
        "user": get_user_public(user),
    }, "Login successful")


@auth_bp.route("/me", methods=["GET"])
@token_required
def me():
    return success({"user": get_user_public(g.user)})


@auth_bp.route("/logout", methods=["POST"])
@token_required
def logout():
    if g.role == "super_admin":
        log_action(
            admin_id=g.user_id,
            admin_username=g.username,
            action="admin_logout",
        )
    return success({}, "Logged out successfully")