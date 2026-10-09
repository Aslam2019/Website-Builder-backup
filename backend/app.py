from flask import Flask, jsonify, send_from_directory
import os
from config import Config
from flask_cors import CORS
from database.mongo import init_mongo, close_mongo
from database.indexes import create_indexes
from database.seed import run_all_seeds
from middleware.error_handler import register_error_handlers


def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)
    app.config["MAX_CONTENT_LENGTH"] = Config.MAX_CONTENT_LENGTH

    CORS(app,
         resources={r"/api/*": {"origins": Config.CORS_ORIGINS}},
         supports_credentials=True,
         allow_headers=["Content-Type", "Authorization"])

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

    app.register_blueprint(auth_bp,        url_prefix="/api/auth")
    app.register_blueprint(categories_bp,  url_prefix="/api/categories")
    app.register_blueprint(pricing_bp,     url_prefix="/api/pricing")
    app.register_blueprint(templates_bp,   url_prefix="/api/templates")
    app.register_blueprint(uploads_bp,     url_prefix="/api/uploads")
    app.register_blueprint(websites_bp,    url_prefix="/api/websites")
    app.register_blueprint(payments_bp,    url_prefix="/api/payments")
    app.register_blueprint(admin_bp,       url_prefix="/api/admin")

    # Serve uploaded files
    @app.route("/uploads/<path:subpath>", methods=["GET"])
    def serve_upload(subpath):
        return send_from_directory(Config.UPLOAD_FOLDER, subpath)

    import atexit
    atexit.register(close_mongo)

    return app


if __name__ == "__main__":
    app = create_app()
    app.run(host="0.0.0.0", port=Config.PORT, debug=(Config.ENV == "development"))