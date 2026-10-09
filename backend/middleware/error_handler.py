from flask import jsonify
from werkzeug.exceptions import HTTPException


def register_error_handlers(app):
    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"success": False, "message": "Resource not found"}), 404

    @app.errorhandler(405)
    def method_not_allowed(e):
        return jsonify({"success": False, "message": "Method not allowed"}), 405

    @app.errorhandler(413)
    def payload_too_large(e):
        return jsonify({"success": False, "message": "File too large"}), 413

    @app.errorhandler(HTTPException)
    def http_error(e):
        return jsonify({"success": False, "message": e.description}), e.code

    @app.errorhandler(Exception)
    def unhandled(e):
        app.logger.exception("Unhandled error")
        return jsonify({"success": False, "message": "Internal server error"}), 500