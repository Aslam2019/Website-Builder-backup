from datetime import datetime, timezone
from database.mongo import get_db
from bson import ObjectId


DEFAULT_FEATURE_FLAGS = {
    "qr_code": False,
    "whatsapp_button": False,
    "custom_domain": False,
    "priority_support": False,
    "unlimited_pages": False,
}


def _now():
    return datetime.now(timezone.utc)


def _normalize_flags(raw):
    if not isinstance(raw, dict):
        return dict(DEFAULT_FEATURE_FLAGS)
    out = dict(DEFAULT_FEATURE_FLAGS)
    for k, v in raw.items():
        if k in DEFAULT_FEATURE_FLAGS:
            out[k] = bool(v)
    return out


# ============================================================
# ✅ Normalize features (support string + {text, type})
# ============================================================
def _normalize_features(features):
    """
    Normalize features to a list of {text, type} objects.

    Accepts:
      - Plain strings:  "1 Website"  →  {text: "1 Website", type: "positive"}
      - Objects:        {"text": "1 Website", "type": "positive"}
      - Legacy strings that look like dicts: "{'text': '...', 'type': 'positive'}"
    """
    if not isinstance(features, list):
        return []

    out = []
    for f in features:
        # Case 1: Object {text, type}
        if isinstance(f, dict):
            text = str(f.get("text", "")).strip()
            if not text:
                continue
            ftype = "negative" if f.get("type") == "negative" else "positive"
            out.append({"text": text, "type": ftype})
            continue

        # Case 2: String
        if isinstance(f, str):
            raw = f.strip()
            if not raw:
                continue

            # Sub-case: string looks like a Python/JSON dict
            if raw.startswith("{") and raw.endswith("}"):
                try:
                    import json
                    parsed = json.loads(raw.replace("'", '"'))
                    if isinstance(parsed, dict):
                        text = str(parsed.get("text", "")).strip()
                        if not text:
                            continue
                        ftype = "negative" if parsed.get("type") == "negative" else "positive"
                        out.append({"text": text, "type": ftype})
                        continue
                except Exception:
                    # Parse fail aana — plain text-ah treat pannunga
                    pass

            # Plain string
            out.append({"text": raw, "type": "positive"})

    return out


def list_plans(active_only=True):
    db = get_db()
    q = {"is_active": True} if active_only else {}
    return list(db.pricing_plans.find(q).sort("price", 1))


def get_plan(plan_id):
    db = get_db()
    try:
        return db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None


def create_plan(payload):
    db = get_db()
    name = (payload.get("name") or "").strip()
    if not name:
        return None, "Plan name is required"
    if db.pricing_plans.find_one({"name": name}):
        return None, "Plan with this name already exists"

    try:
        price = float(payload.get("price", 0))
    except (TypeError, ValueError):
        return None, "Price must be a number"
    if price < 0:
        return None, "Price cannot be negative"

    features = payload.get("features") or []
    if not isinstance(features, list):
        return None, "Features must be a list"

    feature_flags = _normalize_flags(payload.get("feature_flags"))

    doc = {
        "name": name,
        "price": price,
        "description": (payload.get("description") or "").strip(),
        "terms": (payload.get("terms") or "").strip(),   # ✅ NEW
        "features": _normalize_features(features),
        "feature_flags": feature_flags,
        "is_active": bool(payload.get("is_active", True)),
        "created_at": _now(),
        "updated_at": _now(),
    }
    r = db.pricing_plans.insert_one(doc)
    doc["_id"] = r.inserted_id
    return doc, None


def update_plan(plan_id, payload):
    db = get_db()
    try:
        doc = db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None, "Invalid plan id"
    if not doc:
        return None, "Plan not found"

    patch = {}
    # ✅ "terms" add panniten
    for k in ("name", "description", "is_active", "terms"):
        if k in payload:
            patch[k] = payload[k]

    if "price" in payload:
        try:
            patch["price"] = float(payload["price"])
        except (TypeError, ValueError):
            return None, "Price must be a number"

    if "features" in payload:
        if not isinstance(payload["features"], list):
            return None, "Features must be a list"
        patch["features"] = _normalize_features(payload["features"])

    if "feature_flags" in payload:
        patch["feature_flags"] = _normalize_flags(payload["feature_flags"])

    patch["updated_at"] = _now()
    db.pricing_plans.update_one({"_id": ObjectId(plan_id)}, {"$set": patch})
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)}), None


def update_plan_feature_flags(plan_id, feature_flags):
    db = get_db()
    try:
        doc = db.pricing_plans.find_one({"_id": ObjectId(plan_id)})
    except Exception:
        return None, "Invalid plan id"
    if not doc:
        return None, "Plan not found"

    if not isinstance(feature_flags, dict):
        return None, "feature_flags must be an object"

    current = _normalize_flags(doc.get("feature_flags"))
    for k, v in feature_flags.items():
        if k in DEFAULT_FEATURE_FLAGS:
            current[k] = bool(v)

    db.pricing_plans.update_one(
        {"_id": ObjectId(plan_id)},
        {"$set": {"feature_flags": current, "updated_at": _now()}}
    )
    return db.pricing_plans.find_one({"_id": ObjectId(plan_id)}), None


def delete_plan(plan_id):
    db = get_db()
    db.pricing_plans.delete_one({"_id": ObjectId(plan_id)})