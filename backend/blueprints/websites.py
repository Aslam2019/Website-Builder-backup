from flask import Blueprint, request, g, redirect, Response, jsonify
from middleware.auth_middleware import token_required
from middleware.role_middleware import admin_required
from utils.responses import success, error
from utils.helpers import serialize_doc, is_valid_object_id
from services.website_service import (
    create_website, get_user_websites, get_website_by_id,
    update_website, delete_website,
)
from database.mongo import get_db
import requests
from bson import ObjectId
from utils.template_engine import render_template, normalize_template_name
from publish_service import trigger_publish
from datetime import datetime

websites_bp = Blueprint("websites", __name__)

# ============================================================
# CREATE (draft)
# ============================================================
@websites_bp.route("", methods=["POST"])
@token_required
def create():
    """User creates website record (draft)."""
    data = request.get_json(silent=True) or {}
    doc, err = create_website(g.user_id, data)
    if err:
        return error(err, 400)
    return success({"website": serialize_doc(doc)}, "Website created", 201)

# ============================================================
# LIST — User's own websites (Admin: ?all=true)
# ============================================================
@websites_bp.route("", methods=["GET"])
@token_required
def list_mine():
    """User: own websites. Admin: ?all=true returns all."""
    db = get_db()
    if g.role == "super_admin" and request.args.get("all", "false").lower() == "true":
        docs = list(db.websites.find({}).sort("created_at", -1))
    else:
        docs = get_user_websites(g.user_id)
    return success({"websites": serialize_doc(docs)})

# ============================================================
# ✅ MY-WEBSITE — Latest published website (for QR code)
# ============================================================
@websites_bp.route("/my-website", methods=["GET", "OPTIONS"])
@token_required
def get_my_website():
    if request.method == "OPTIONS":
        return "", 200
    db = get_db()
    doc = db.websites.find_one(
        {
            "user_id": g.user_id,
            "status": "published",
        },
        sort=[("published_at", -1), ("updated_at", -1)],
    )
    if not doc:
        doc = db.websites.find_one(
            {
                "user_id": g.user_id,
                "live_url": {"$exists": True, "$ne": None, "$ne": ""},
            },
            sort=[("updated_at", -1)],
        )
    if not doc:
        return success(None, "No published website found")
    return success(serialize_doc(doc))

# ============================================================
# ✅ SUBDOMAIN RESOLVE (URL Masking)
# ============================================================
@websites_bp.route('/resolve/<subdomain>', methods=['GET'], defaults={'path': ''}, strict_slashes=False)
@websites_bp.route('/resolve/<subdomain>/<path:path>', methods=['GET'])
def resolve_subdomain(subdomain, path):
    db = get_db()
    website = db.websites.find_one({
        "username": {"$regex": f"^{subdomain}$", "$options": "i"}, 
        "status": "published"
    })
    
    if not website:
        return jsonify({"message": "Website not found in DB", "success": False}), 404

    # 1. Config.json requested -> return latest form_data directly
    if path == "config.json":
        return jsonify(website.get("form_data", {}))

    cloudfront_base = "https://d24e11dzjriy3b.cloudfront.net"

    # 2. Render latest template directly from DB for immediate updates
    try:
        clean_tpl = normalize_template_name(website.get("template_name", ""))
        rendered_html = render_template(clean_tpl, website.get("form_data") or {}, cloudfront_base)
        if rendered_html and not rendered_html.startswith("<h1>Template Error"):
            resp = Response(rendered_html, mimetype='text/html')
            resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            resp.headers["Pragma"] = "no-cache"
            resp.headers["Expires"] = "0"
            return resp
    except Exception as e:
        print(f"Direct resolve template render failed: {e}")

    # 3. Fallback to CloudFront live_url
    if website.get("live_url"):
        try:
            target_url = f"{website['live_url']}?v={int(datetime.now().timestamp())}"
            response = requests.get(target_url, verify=False, timeout=5)
            resp = Response(response.text, mimetype='text/html')
            resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
            return resp
        except Exception as e:
            return jsonify({"message": f"Error fetching CloudFront: {str(e)}", "success": False}), 500
            
    return jsonify({"message": "Live URL not generated", "success": False}), 404

# ============================================================
# GET ONE — by ID
# ============================================================
@websites_bp.route("/<website_id>", methods=["GET"])
@token_required
def get_one(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    doc = get_website_by_id(website_id)
    if not doc:
        return error("Website not found", 404)
    if g.role != "super_admin" and str(doc["user_id"]) != g.user_id:
        return error("Access denied", 403)
    return success({"website": serialize_doc(doc)})

# ============================================================
# UPDATE
# ============================================================
@websites_bp.route("/<website_id>", methods=["PUT"])
@token_required
def edit(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    data = request.get_json(silent=True) or {}
    is_admin = g.role == "super_admin"
    doc, err = update_website(website_id, g.user_id, data, is_admin=is_admin)
    if err:
        return error(err, 403 if "access" in err.lower() else 404)
    
    if doc and doc.get("status") == "published":
        try:
            db = get_db()
            template_name = doc.get("template_name", "portfolio-01")
            clean_template_name = normalize_template_name(template_name)
            cloudfront_base = "https://d24e11dzjriy3b.cloudfront.net"

            username = doc.get("username")
            if not username:
                user = db.users.find_one({"_id": ObjectId(doc.get("user_id"))})
                username = user.get("username") if user else f"site-{website_id}"
                db.websites.update_one({"_id": ObjectId(website_id)}, {"$set": {"username": username}})

            live_url = f"{cloudfront_base}/{username}/index.html"
            db.websites.update_one(
                {"_id": ObjectId(website_id)},
                {"$set": {
                    "template_name": clean_template_name,
                    "live_url": live_url,
                    "updated_at": datetime.now()
                }}
            )

            # ✅ Fresh HTML generated from user's latest edited form data!
            html_content = render_template(clean_template_name, doc.get("form_data") or {}, cloudfront_base)
            
            # ✅ Trigger publish via SQS -> Lambda -> S3 -> CloudFront
            trigger_publish(
                website_id=str(website_id),
                user_id=str(g.user_id),
                username=str(username),
                template_name=clean_template_name,
                html_content=html_content
            )
            print(f"✅ Updated publish triggered for {username} ({clean_template_name})")
        except Exception as e:
            print(f"❌ Edit publish failed: {e}")
            
    return success({"website": serialize_doc(doc)}, "Website updated")

# ============================================================
# DELETE
# ============================================================
@websites_bp.route("/<website_id>", methods=["DELETE"])
@token_required
def remove(website_id):
    if not is_valid_object_id(website_id):
        return error("Invalid website id", 400)
    is_admin = g.role == "super_admin"
    ok, err = delete_website(website_id, g.user_id, is_admin=is_admin)
    if not ok:
        return error(err or "Delete failed", 403)
    return success({}, "Website deleted")
