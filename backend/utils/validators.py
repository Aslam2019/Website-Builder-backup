import re
from email_validator import validate_email, EmailNotValidError

USERNAME_RE = re.compile(r"^[a-zA-Z0-9_]{3,30}$")
MOBILE_RE = re.compile(r"^[6-9]\d{9}$")          # Indian 10-digit
URL_RE = re.compile(r"^https?://[^\s]+$")
SLUG_RE = re.compile(r"^[a-z0-9]+(?:-[a-z0-9]+)*$")


def validate_username(username):
    if not username or not isinstance(username, str):
        return "Username is required"
    if not USERNAME_RE.match(username.strip()):
        return "Username must be 3-30 chars (letters, numbers, underscore)"
    return None


def validate_password(password):
    if not password or not isinstance(password, str):
        return "Password is required"
    if len(password) < 6:
        return "Password must be at least 6 characters"
    if len(password) > 128:
        return "Password too long"
    return None


def validate_mobile(mobile):
    if not mobile:
        return "Mobile number is required"
    if not MOBILE_RE.match(str(mobile).strip()):
        return "Enter a valid 10-digit mobile number"
    return None


def validate_email_field(email):
    if not email:
        return "Email is required"
    try:
        validate_email(email, check_deliverability=False)
        return None
    except EmailNotValidError:
        return "Enter a valid email address"


def validate_url(url):
    if not url:
        return None  # optional
    if not URL_RE.match(str(url).strip()):
        return "Enter a valid URL (must start with http:// or https://)"
    return None


def validate_slug(slug):
    if not slug:
        return "Slug is required"
    if not SLUG_RE.match(slug.strip()):
        return "Slug must be lowercase letters, numbers, hyphens only"
    return None


def validate_length(value, field, min_len=0, max_len=5000, required=True):
    if value is None or (isinstance(value, str) and not value.strip()):
        return f"{field} is required" if required else None
    if not isinstance(value, str):
        return f"{field} must be text"
    if len(value.strip()) < min_len:
        return f"{field} must be at least {min_len} characters"
    if len(value.strip()) > max_len:
        return f"{field} must be at most {max_len} characters"
    return None