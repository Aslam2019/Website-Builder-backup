from flask import Flask, jsonify, send_from_directory, request, Response
import os
import time
import requests
from config import Config
from flask_cors import CORS
from database.mongo import init_mongo, close_mongo
from database.indexes import create_indexes
from database.seed import run_all_seeds
from middleware.error_handler import register_error_handlers
from blueprints.settings import settings_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

    CORS(app,
         resources={r"/api/*": {"origins": "*"}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"])

    register_error_handlers(app)

    with app.app_context():
        init_mongo()
        create_indexes()
        run_all_seeds()

    @app.route("/api/health", methods=["GET"])
    def health():
        return jsonify({
            "success": True,
            "message": "Website Builder API is running",
            "data": {"status": "ok"}
        })

    # -------- Blueprints --------
    from blueprints.auth import auth_bp
    from blueprints.categories import categories_bp
    from blueprints.pricing import pricing_bp
    from blueprints.templates import templates_bp
    from blueprints.uploads import uploads_bp
    from blueprints.websites import websites_bp
    from blueprints.payments import payments_bp
    from blueprints.admin import admin_bp
    from blueprints.enquiries import enquiries_bp

    # Blueprint registration
    app.register_blueprint(enquiries_bp, url_prefix="/api/enquiries")
    app.register_blueprint(auth_bp,        url_prefix="/api/auth")
    app.register_blueprint(categories_bp,  url_prefix="/api/categories")
    app.register_blueprint(pricing_bp,     url_prefix="/api/pricing")
    app.register_blueprint(templates_bp,   url_prefix="/api/templates")
    app.register_blueprint(uploads_bp,     url_prefix="/api/uploads")
    app.register_blueprint(websites_bp,    url_prefix="/api/websites")
    app.register_blueprint(payments_bp,    url_prefix="/api/payments")
    app.register_blueprint(admin_bp,       url_prefix="/api/admin")
    app.register_blueprint(settings_bp,    url_prefix="/api/settings")

    # Serve uploaded files
    @app.route("/uploads/<path:subpath>", methods=["GET"])
    def serve_upload(subpath):
        return send_from_directory(Config.UPLOAD_FOLDER, subpath)

    # ============================================================
    # ✅ FIXED: SUBDOMAIN ROUTING (Direct render with CloudFront fallback)
    # ============================================================
    @app.route('/', defaults={'path': ''}, subdomain='<subdomain>')
    @app.route('/<path:path>', subdomain='<subdomain>')
    def handle_subdomain(subdomain, path):
        # Ignore main domain and API subdomain
        if subdomain in ['www', 'api']:
            return jsonify({"message": "Not found"}), 404

        from database.mongo import get_db
        from utils.template_engine import render_template, normalize_template_name
        
        db = get_db()
        website = db.websites.find_one({
            "username": {"$regex": f"^{subdomain}$", "$options": "i"}, 
            "status": "published"
        })

        if not website:
            return jsonify({"message": "Website not found in DB", "success": False}), 404

        if path == "config.json":
            return jsonify(website.get("form_data", {}))

        cloudfront_base = "https://d24e11dzjriy3b.cloudfront.net"

        # 1. Direct render from DB (Always 100% fresh, reflects edits instantly!)
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
            print(f"Direct template render failed, falling back to CloudFront: {e}")

        # 2. Fallback to CloudFront live_url
        if website.get("live_url"):
            try:
                target_url = f"{website['live_url']}?v={int(time.time())}"
                response = requests.get(target_url, verify=False, timeout=5)
                resp = Response(response.text, mimetype='text/html')
                resp.headers["Cache-Control"] = "no-cache, no-store, must-revalidate"
                return resp
            except Exception as e:
                return jsonify({"message": f"Error fetching CloudFront: {str(e)}", "success": False}), 500
                
        return jsonify({"message": "Live URL not generated", "success": False}), 404

    import atexit
    atexit.register(close_mongo)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=(Config.ENV == "development"))
