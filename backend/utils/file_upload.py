import os
import uuid
import boto3
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

# S3 Client Setup
s3 = boto3.client(
    's3',
    aws_access_key_id=os.getenv("AWS_ACCESS_KEY_ID"),
    aws_secret_access_key=os.getenv("AWS_SECRET_ACCESS_KEY"),
    region_name=os.getenv("AWS_REGION", "ap-south-1")
)
BUCKET_NAME = os.getenv("PUBLISHED_BUCKET_NAME", "website-builder-published-sites")
CLOUDFRONT_BASE = "https://d24e11dzjriy3b.cloudfront.net"

def _ext(filename):
    return filename.rsplit(".", 1)[-1].lower() if "." in filename else ""

def validate_and_save(file_storage, kind, subfolder):
    if file_storage is None or file_storage.filename == "":
        return None, "No file provided"

    if subfolder not in SUBFOLDERS:
        return None, "Invalid upload folder"

    ext = _ext(file_storage.filename)
    allowed = ALLOWED.get(kind, set())
    if ext not in allowed:
        return None, f"File type .{ext} not allowed"

    # Size Check
    file_storage.stream.seek(0, os.SEEK_END)
    size = file_storage.stream.tell()
    file_storage.stream.seek(0)
    if size > Config.MAX_CONTENT_LENGTH:
        return None, f"File too large (max {Config.MAX_CONTENT_LENGTH // (1024*1024)} MB)"

    safe_name = secure_filename(file_storage.filename)
    if not safe_name:
        safe_name = f"file.{ext}"
    unique = f"{uuid.uuid4().hex[:10]}_{safe_name}"

    # ✅ S3 Ku Upload Pandrom
    s3_key = f"uploads/{subfolder}s/{unique}"
    
    try:
        s3.upload_fileobj(
            file_storage,
            BUCKET_NAME,
            s3_key,
            ExtraArgs={"ContentType": file_storage.content_type}
        )
    except Exception as e:
        return None, f"S3 Upload failed: {str(e)}"

    # ✅ Full CloudFront URL Ah Return Pandrom
    file_url = f"{CLOUDFRONT_BASE}/{s3_key}"
    return file_url, None
