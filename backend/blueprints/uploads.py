from flask import Blueprint, request
from middleware.auth_middleware import token_required
from utils.responses import success, error
from utils.file_upload import validate_and_save

uploads_bp = Blueprint("uploads", __name__)

ALLOWED_SUBFOLDERS = {
    "logo", "profile", "gallery", "portfolio",
    "property", "project", "resume", "template_preview",
}


@uploads_bp.route("/image", methods=["POST"])
@token_required
def upload_image():
    if "file" not in request.files:
        return error("No file provided", 400)
    subfolder = request.form.get("folder", "gallery")
    if subfolder not in ALLOWED_SUBFOLDERS:
        return error("Invalid folder", 400)

    url, err = validate_and_save(request.files["file"], "image", subfolder)
    if err:
        return error(err, 400)
    return success({"url": url}, "Image uploaded", 201)


@uploads_bp.route("/resume", methods=["POST"])
@token_required
def upload_resume():
    if "file" not in request.files:
        return error("No file provided", 400)
    url, err = validate_and_save(request.files["file"], "document", "resume")
    if err:
        return error(err, 400)
    return success({"url": url}, "Resume uploaded", 201)