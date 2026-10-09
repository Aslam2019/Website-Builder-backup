from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.category_service import (
    list_categories, create_category, update_category, toggle_category
)
from services.log_service import log_action
from database.mongo import get_db
from bson import ObjectId

categories_bp = Blueprint("categories", __name__)


@categories_bp.route("", methods=["GET"])
def get_categories():
    show_all = request.args.get("all", "false").lower() == "true"
    cats = list_categories(active_only=not show_all)
    return success({"categories": serialize_doc(cats)})


@categories_bp.route("", methods=["POST"])
@token_required
@admin_required
def add_category():
    data = request.get_json(silent=True) or {}
    name = (data.get("name") or "").strip()
    if not name:
        return error("Category name is required", 400)
    doc, err = create_category(name, data.get("description", ""))
    if err:
        return error(err, 400)
    log_action(g.user_id, g.username, "category_create",
               target_type="category", target_id=str(doc["_id"]),
               metadata={"name": name})
    return success({"category": serialize_doc(doc)}, "Category created", 201)


@categories_bp.route("/<cat_id>", methods=["PUT"])
@token_required
@admin_required
def edit_category(cat_id):
    if not is_valid_object_id(cat_id):
        return error("Invalid category id", 400)
    data = request.get_json(silent=True) or {}
    doc, err = update_category(cat_id, data)
    if err:
        return error(err, 404)
    log_action(g.user_id, g.username, "category_update",
               target_type="category", target_id=cat_id)
    return success({"category": serialize_doc(doc)}, "Category updated")


@categories_bp.route("/<cat_id>", methods=["DELETE"])
@token_required
@admin_required
def delete_category(cat_id):
    if not is_valid_object_id(cat_id):
        return error("Invalid category id", 400)
    db = get_db()
    db.categories.delete_one({"_id": ObjectId(cat_id)})
    log_action(g.user_id, g.username, "category_delete",
               target_type="category", target_id=cat_id)
    return success({}, "Category deleted")