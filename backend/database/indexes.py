from database.mongo import get_db


def create_indexes():
    """Create indexes for frequently queried fields."""
    db = get_db()

    # users
    db.users.create_index("username", unique=True)
    db.users.create_index("role")
    db.users.create_index("is_active")
    db.users.create_index("category_id")

    # categories
    db.categories.create_index("name", unique=True)
    db.categories.create_index("slug", unique=True)
    db.categories.create_index("is_active")

    # templates
    db.templates.create_index("category_id")
    db.templates.create_index("is_active")
    db.templates.create_index([("category_id", 1), ("is_active", 1)])

    # pricing_plans
    db.pricing_plans.create_index("name", unique=True)
    db.pricing_plans.create_index("is_active")

    # websites
    db.websites.create_index("user_id")
    db.websites.create_index("status")
    db.websites.create_index("category_id")
    db.websites.create_index("template_id")

    # payments
    db.payments.create_index("user_id")
    db.payments.create_index("website_id")
    db.payments.create_index("status")
    db.payments.create_index("payment_id", unique=True, sparse=True)

    # admin_logs
    db.admin_logs.create_index("admin_id")
    db.admin_logs.create_index("action")
    db.admin_logs.create_index("created_at")

    print("[MongoDB] Indexes created successfully")