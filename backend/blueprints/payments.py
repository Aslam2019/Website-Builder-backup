from flask import Blueprint, request, g
from middleware.auth_middleware import token_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.payment_service import (
    create_dummy_payment, list_payments, get_payment,
)

payments_bp = Blueprint("payments", __name__)


@payments_bp.route("/dummy", methods=["POST"])
@token_required
def dummy_pay():
    """
    Create a dummy payment (test payment).
    Body: { website_id, plan_id, amount? }
    """
    data = request.get_json(silent=True) or {}
    website_id = data.get("website_id")
    plan_id = data.get("plan_id") or data.get("pricing_plan_id")
    amount = data.get("amount")

    if not website_id or not plan_id:
        return error("website_id and plan_id are required", 400)

    payment, err = create_dummy_payment(g.user_id, website_id, plan_id, amount)
    if err:
        return error(err, 400)

    return success(
        {"payment": serialize_doc(payment)},
        "Test payment successful. Website published.",
        201
    )


@payments_bp.route("", methods=["GET"])
@token_required
def list_mine():
    """
    User: own payments. Admin: ?all=true returns all payments.
    """
    if g.role == "super_admin" and request.args.get("all", "false").lower() == "true":
        payments = list_payments(user_id=None)
    else:
        payments = list_payments(user_id=g.user_id)
    return success({"payments": serialize_doc(payments)})


@payments_bp.route("/<payment_id>", methods=["GET"])
@token_required
def get_one(payment_id):
    if not is_valid_object_id(payment_id):
        return error("Invalid payment id", 400)
    doc = get_payment(payment_id)
    if not doc:
        return error("Payment not found", 404)

    if g.role != "super_admin" and str(doc["user_id"]) != g.user_id:
        return error("Access denied", 403)

    return success({"payment": serialize_doc(doc)})