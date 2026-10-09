import os
import uuid
from werkzeug.utils import secure_filename
from config import Config

ALLOWED = {
    "image": Config.ALLOWED_IMAGE_EXT,
    "document": Config.ALLOWED_DOC_EXT,
}

SUBFOLDERS = {
    "logo", "profile", "gallery", "portfolio",
    "property", "project", "resume", "template_preview"
}


def _ext(filename):
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""


def validate_and_save(file_storage, kind, subfolder):
    """
    Validate + save file securely.
    kind: 'image' | 'document'
    subfolder: key in SUBFOLDERS
    Returns: (relative_url, error)
    """
    if file_storage is None or file_storage.filename == "":
        return None, "No file provided"

    if subfolder not in SUBFOLDERS:
        return None, "Invalid upload folder"

    ext = _ext(file_storage.filename)
    allowed = ALLOWED.get(kind, set())
    if ext not in allowed:
        return None, f"File type .{ext} not allowed"

    # Check size via content_length if available
    # (Flask also enforces MAX_CONTENT_LENGTH globally)
    file_storage.stream.seek(0, os.SEEK_END)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > Config.MAX_CONTENT_LENGTH:
        return None, f"File too large (max {Config.MAX_CONTENT_LENGTH // (1024*1024)} MB)"

    # Secure filename + unique prefix
    safe_name = secure_filename(file_storage.filename)
    if not safe_name:
        safe_name = f"file.{ext}"
    unique = f"{uuid.uuid4().hex[:10]}_{safe_name}"

    folder = os.path.join(Config.UPLOAD_FOLDER, f"{subfolder}s")  # 'logos', 'profiles' etc
    os.makedirs(folder, exist_ok=True)
    full_path = os.path.join(folder, unique)
    file_storage.save(full_path)

    # Return relative URL: /uploads/<folder>/<file>
    rel = f"/uploads/{subfolder}s/{unique}"
    return rel, None