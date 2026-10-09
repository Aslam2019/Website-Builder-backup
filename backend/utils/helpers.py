import re
from bson import ObjectId
from bson.errors import InvalidId


def is_valid_object_id(value):
    try:
        ObjectId(str(value))
        return True
    except (InvalidId, TypeError):
        return False


def to_object_id(value):
    return ObjectId(str(value))


def slugify(text):
    text = str(text).strip().lower()
    text = re.sub(r"[^a-z0-9\s-]", "", text)
    text = re.sub(r"\s+", "-", text)
    text = re.sub(r"-+", "-", text).strip("-")
    return text


def serialize_doc(doc):
    """Convert Mongo doc -> JSON-safe dict (ObjectId->str, datetime->iso)."""
    if doc is None:
        return None
    if isinstance(doc, list):
        return [serialize_doc(d) for d in doc]
    out = {}
    for k, v in doc.items():
        if isinstance(v, ObjectId):
            out[k] = str(v)
        elif hasattr(v, "isoformat"):
            out[k] = v.isoformat()
        elif isinstance(v, dict):
            out[k] = serialize_doc(v)
        elif isinstance(v, list):
            out[k] = [serialize_doc(i) if isinstance(i, (dict, list)) else
                      (str(i) if isinstance(i, ObjectId) else
                       i.isoformat() if hasattr(i, "isoformat") else i)
                      for i in v]
        else:
            out[k] = v
    return out