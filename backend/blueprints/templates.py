from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.template_service import (
    list_templates, get_template, create_template,
    update_template, delete_template,
)
from services.log_service import log_action
from database.mongo import get_db

templates_bp = Blueprint("templates", __name__)


@templates_bp.route("", methods=["GET"])
def get_templates():
    category_id = request.args.get("category_id")
    show_all = request.args.get("all", "false").lower() == "true"
    templates = list_templates(category_id=category_id, active_only=not show_all)
    db = get_db()

    out = []
    for t in templates:
        cat = db.categories.find_one({"_id": t["category_id"]})
        item = serialize_doc(t)
        item["category"] = {
            "id": str(cat["_id"]),
            "name": cat["name"],
            "slug": cat["slug"],
        } if cat else None
        out.append(item)

    return success({"templates": out})


@templates_bp.route("/<tpl_id>", methods=["GET"])
def get_one(tpl_id):
    if not is_valid_object_id(tpl_id):
        return error("Invalid template id", 400)
    tpl = get_template(tpl_id)
    if not tpl:
        return error("Template not found", 404)
    return success({"template": serialize_doc(tpl)})


@templates_bp.route("", methods=["POST"])
@token_required
@admin_required
def add_template():
    data = request.get_json(silent=True) or {}
    doc, err = create_template(data)
    if err:
        return error(err, 400)
    log_action(g.user_id, g.username, "template_create",
               target_type="template", target_id=str(doc["_id"]),
               metadata={"name": doc.get("name")})
    return success({"template": serialize_doc(doc)}, "Template created", 201)


@templates_bp.route("/<tpl_id>", methods=["PUT"])
@token_required
@admin_required
def edit_template(tpl_id):
    if not is_valid_object_id(tpl_id):
        return error("Invalid template id", 400)
    data = request.get_json(silent=True) or {}
    doc, err = update_template(tpl_id, data)
    if err:
        return error(err, 404)
    log_action(g.user_id, g.username, "template_update",
               target_type="template", target_id=tpl_id)
    return success({"template": serialize_doc(doc)}, "Template updated")


@templates_bp.route("/<tpl_id>", methods=["DELETE"])
@token_required
@admin_required
def remove_template(tpl_id):
    if not is_valid_object_id(tpl_id):
        return error("Invalid template id", 400)
    ok, err = delete_template(tpl_id)
    if not ok:
        return error(err or "Delete failed", 400)
    log_action(g.user_id, g.username, "template_delete",
               target_type="template", target_id=tpl_id)
    return success({}, "Template deleted")