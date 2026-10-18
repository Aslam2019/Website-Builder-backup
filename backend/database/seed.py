from datetime import datetime, timezone
from database.mongo import get_db
from utils.security import hash_password
from config import Config


def _now():
    return datetime.now(timezone.utc)


def seed_admin():
    """Create the super admin account if it doesn't exist."""
    db = get_db()
    existing = db.users.find_one({"username": Config.ADMIN_USERNAME})
    if existing:
        print(f"[Seed] Admin '{Config.ADMIN_USERNAME}' already exists")
        return

    admin_doc = {
        "username": Config.ADMIN_USERNAME,
        "password_hash": hash_password(Config.ADMIN_PASSWORD),
        "mobile": Config.ADMIN_MOBILE,
        "role": "super_admin",
        "category_id": None,
        "is_active": True,
        "created_at": _now(),
        "updated_at": _now(),
    }
    db.users.insert_one(admin_doc)
    print(f"[Seed] Super Admin created: {Config.ADMIN_USERNAME} / {Config.ADMIN_PASSWORD}")


def seed_categories():
    """Create initial categories if not present."""
    db = get_db()
    initial = [
        {"name": "Portfolio",       "slug": "portfolio",   "description": "Personal portfolio websites"},
        {"name": "Real Estate",     "slug": "real-estate", "description": "Real estate property websites"},
        {"name": "Salon & Spa",     "slug": "salon-spa",   "description": "Salon and spa booking websites"},
        {"name": "Photography",     "slug": "photography", "description": "Photography portfolio websites"},
    ]
    for c in initial:
        existing = db.categories.find_one({"slug": c["slug"]})
        if existing:
            continue
        db.categories.insert_one({
            "name": c["name"],
            "slug": c["slug"],
            "description": c["description"],
            "is_active": True,
            "created_at": _now(),
            "updated_at": _now(),
        })
        print(f"[Seed] Category created: {c['name']}")


def seed_templates():
    """Create 1 template per category (Template 01)."""
    db = get_db()
    categories = list(db.categories.find({}))
    for cat in categories:
        for i in (1,):   # ✅ ONLY Template 01
            tpl_name = f"{cat['name']} Template 0{i}"
            existing = db.templates.find_one({
                "category_id": cat["_id"],
                "name": tpl_name
            })
            if existing:
                continue
            db.templates.insert_one({
                "name": tpl_name,
                "category_id": cat["_id"],
                "preview_image": f"/uploads/template_previews/{cat['slug']}-0{i}.png",
                "config": {"layout": "default", "variant": i},
                "is_active": True,
                "created_at": _now(),
                "updated_at": _now(),
            })
            print(f"[Seed] Template created: {tpl_name}")


def seed_pricing():
    """Create initial pricing plans."""
    db = get_db()
    plans = [
        {
            "name": "Basic",
            "price": 999,
            "description": "Perfect for individuals getting started",
            "features": ["1 Website", "Basic Templates", "5 Pages", "Email Support", "1 GB Storage"],
            "is_active": True,
        },
        # ✅ "Pro" block removed — admin manually "Pro Plan" add pannirukaar
    ]
    for p in plans:
        existing = db.pricing_plans.find_one({"name": p["name"]})
        if existing:
            continue
        p["created_at"] = _now()
        p["updated_at"] = _now()
        db.pricing_plans.insert_one(p)
        print(f"[Seed] Pricing created: {p['name']}")


def run_all_seeds():
    print("[Seed] Running database seeds...")
    seed_admin()
    seed_categories()
    seed_templates()
    seed_pricing()
    print("[Seed] Done.")