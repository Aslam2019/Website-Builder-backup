from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.enquiry_service import (
    create_enquiry, list_enquiries, update_enquiry_status, delete_enquiry,
)
from services.log_service import log_action

enquiries_bp = Blueprint("enquiries", __name__)


# ============================================================
# PUBLIC — Submit custom plan enquiry
# ============================================================
@enquiries_bp.route("/custom-plan", methods=["POST", "OPTIONS"])
def submit_custom_plan():
    if request.method == "OPTIONS":
        return "", 200

    data = request.get_json(silent=True) or {}
    doc, err = create_enquiry(data)
    if err:
        return error(err, 400)

    return success(
        {"enquiry_id": str(doc["_id"])},
        "Thanks! We'll contact you within 24 hours.",
        201
    )


# ============================================================
# ADMIN — List all enquiries
# ============================================================
@enquiries_bp.route("/admin/custom-plan", methods=["GET", "OPTIONS"])
@token_required
@admin_required
def admin_list_enquiries():
    if request.method == "OPTIONS":
        return "", 200

    status = request.args.get("status")
    docs = list_enquiries(status=status)
    return success({"enquiries": serialize_doc(docs)})


# ============================================================
# ADMIN — Update status
# ============================================================
@enquiries_bp.route("/admin/custom-plan/<enquiry_id>/status", methods=["PUT", "OPTIONS"])
@token_required
@admin_required
def admin_update_status(enquiry_id):
    if request.method == "OPTIONS":
        return "", 200
    if not is_valid_object_id(enquiry_id):
        return error("Invalid enquiry id", 400)

    data = request.get_json(silent=True) or {}
    status = data.get("status")

    doc, err = update_enquiry_status(enquiry_id, status, g.user_id, g.username)
    if err:
        return error(err, 400)

    log_action(g.user_id, g.username, "enquiry_status_update",
               target_type="enquiry", target_id=enquiry_id,
               metadata={"status": status})

    return success({"enquiry": serialize_doc(doc)}, "Status updated")


# ============================================================
# ADMIN — Delete
# ============================================================
@enquiries_bp.route("/admin/custom-plan/<enquiry_id>", methods=["DELETE", "OPTIONS"])
@token_required
@admin_required
def admin_delete_enquiry(enquiry_id):
    if request.method == "OPTIONS":
        return "", 200
    if not is_valid_object_id(enquiry_id):
        return error("Invalid enquiry id", 400)

    ok, err = delete_enquiry(enquiry_id)
    if not ok:
        return error(err, 404)

    log_action(g.user_id, g.username, "enquiry_delete",
               target_type="enquiry", target_id=enquiry_id)

    return success({}, "Enquiry deleted")