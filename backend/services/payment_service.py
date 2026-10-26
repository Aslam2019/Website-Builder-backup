from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId
from utils.security import generate_payment_id
from services.log_service import log_action
from publish_service import trigger_publish
from utils.template_engine import render_template


def _now():
    return datetime.now(timezone.utc)


def create_dummy_payment(user_id, website_id, plan_id, amount=None):
    """
    Dummy payment. Marks payment successful, publishes website.
    Real gateway can be plugged in later.
    """
    db = get_db()

    # -------- Validate user --------
    try:
        user = db.users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        return None, "Invalid user"
    if not user:
        return None, "User not found"

    # -------- Validate website --------
    try:
        website = db.websites.find_one({"_id": ObjectId(website_id)})
    except Exception:
        return None, "Invalid website"
    if not website:
        return None, "Website not found"
    if str(website["user_id"]) != str(user_id):
        return None, "You do not own this website"

    # -------- Validate plan --------
    try:
        plan = db.pricing_plans.find_one({"_id": ObjectId(plan_id), "is_active": True})
    except Exception:
        return None, "Invalid plan"
    if not plan:
        return None, "Pricing plan not found or inactive"

    # Already paid?
    existing = db.payments.find_one({
        "website_id": website["_id"],
        "status": "successful",
    })
    if existing:
        return None, "This website is already paid"

    final_amount = float(amount) if amount is not None else float(plan["price"])
    payment_id = generate_payment_id()
    now = _now()

    # -------- Create Payment Record --------
    payment_doc = {
        "payment_id": payment_id,
        "user_id": user["_id"],
        "username": user["username"],
        "website_id": website["_id"],
        "website_name": website.get("name", ""),
        "plan_id": plan["_id"],
        "plan_name": plan["name"],
        "amount": final_amount,
        "currency": "INR",
        "status": "successful",
        "payment_reference": f"DUMMY-{payment_id}",
        "is_test_payment": True,
        "payment_date": now,
        "created_at": now,
    }
    result = db.payments.insert_one(payment_doc)
    payment_doc["_id"] = result.inserted_id

        # -------- Generate Live URL & Publish website --------
    cloudfront_base = "https://d24e11dzjriy3b.cloudfront.net" 
    
    # ✅ Username ah folder name ah use pandrom
    username = website.get("username", f"site-{website_id}")
    live_url = f"{cloudfront_base}/{username}/index.html"

    db.websites.update_one(
        {"_id": website["_id"]},
        {"$set": {
            "status": "published",
            "payment_status": "successful",
            "payment_id": payment_doc["_id"],
            "live_url": live_url, 
            "published_at": now,
            "updated_at": now,
        }}
    )

    # -------- SQS Trigger (Template Merge) --------
    try:
        template_name = website.get("template_name", "unknown")
        form_data = website.get("form_data", {})
        
        html_content = render_template(template_name, form_data, cloudfront_base)

        trigger_publish(
            website_id=str(website_id),
            user_id=str(user_id),
            username=username,
            template_name=template_name,
            html_content=html_content
        )
    except Exception as e:
        print(f"SQS Trigger failed: {e}")
    # -------- Log --------
    log_action(
        admin_id=None,
        admin_username=user["username"],
        action="payment_success",
        target_type="payment",
        target_id=str(payment_doc["_id"]),
        metadata={"amount": final_amount, "plan": plan["name"], "test": True},
    )

    return payment_doc, None


def list_payments(user_id=None):
    db = get_db()
    q = {}
    if user_id:
        q["user_id"] = ObjectId(user_id)
    return list(db.payments.find(q).sort("created_at", -1))


def get_payment(payment_id):
    db = get_db()
    try:
        return db.payments.find_one({"_id": ObjectId(payment_id)})
    except Exception:
        return None
