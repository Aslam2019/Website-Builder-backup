from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.pricing_service import (
    list_plans, get_plan, create_plan, update_plan, delete_plan,
    update_plan_feature_flags,      # ← NEW
)
from services.log_service import log_action

pricing_bp = Blueprint("pricing", __name__)


@pricing_bp.route("", methods=["GET"])
def get_plans():
    show_all = request.args.get("all", "false").lower() == "true"
    plans = list_plans(active_only=not show_all)
    return success({"plans": serialize_doc(plans)})


@pricing_bp.route("/<plan_id>", methods=["GET"])
def get_one(plan_id):
    if not is_valid_object_id(plan_id):
        return error("Invalid plan id", 400)
    plan = get_plan(plan_id)
    if not plan:
        return error("Plan not found", 404)
    return success({"plan": serialize_doc(plan)})


@pricing_bp.route("", methods=["POST"])
@token_required
@admin_required
def add_plan():
    data = request.get_json(silent=True) or {}
    doc, err = create_plan(data)
    if err:
        return error(err, 400)
    log_action(g.user_id, g.username, "pricing_create",
               target_type="pricing", target_id=str(doc["_id"]),
               metadata={"name": doc.get("name")})
    return success({"plan": serialize_doc(doc)}, "Plan created", 201)


@pricing_bp.route("/<plan_id>", methods=["PUT"])
@token_required
@admin_required
def edit_plan(plan_id):
    if not is_valid_object_id(plan_id):
        return error("Invalid plan id", 400)
    data = request.get_json(silent=True) or {}
    doc, err = update_plan(plan_id, data)
    if err:
        return error(err, 404)
    log_action(g.user_id, g.username, "pricing_update",
               target_type="pricing", target_id=plan_id)
    return success({"plan": serialize_doc(doc)}, "Plan updated")


# ============================================================
# ✅ NEW — Update only feature flags
# ============================================================
@pricing_bp.route("/<plan_id>/features", methods=["PUT"])
@token_required
@admin_required
def update_features(plan_id):
    if not is_valid_object_id(plan_id):
        return error("Invalid plan id", 400)

    data = request.get_json(silent=True) or {}
    # Accept either { feature_flags: {...} } or {...} directly
    flags = data.get("feature_flags") if isinstance(data.get("feature_flags"), dict) else data

    doc, err = update_plan_feature_flags(plan_id, flags)
    if err:
        return error(err, 400)

    log_action(g.user_id, g.username, "pricing_features_update",
               target_type="pricing", target_id=plan_id,
               metadata={"feature_flags": doc.get("feature_flags", {})})

    return success({"plan": serialize_doc(doc)}, "Feature flags updated")


@pricing_bp.route("/<plan_id>", methods=["DELETE"])
@token_required
@admin_required
def remove_plan(plan_id):
    if not is_valid_object_id(plan_id):
        return error("Invalid plan id", 400)
    delete_plan(plan_id)
    log_action(g.user_id, g.username, "pricing_delete",
               target_type="pricing", target_id=plan_id)
    return success({}, "Plan deleted")