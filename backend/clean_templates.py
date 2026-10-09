"""
Cleanup script: removes all Template 02 entries from DB.
Run: python clean_templates.py
"""
from database.mongo import init_mongo, get_db


def cleanup():
    print("[Cleanup] Connecting to MongoDB...")
    init_mongo()
    db = get_db()

    # Delete all docs whose name ends with 'Template 02'
    result = db.templates.delete_many({"name": {"$regex": "Template 02$"}})
    print(f"[Cleanup] Deleted {result.deleted_count} documents")

    # Show remaining
    remaining = list(db.templates.find({}).sort("name", 1))
    print(f"\n[Cleanup] Remaining templates: {len(remaining)}")
    for t in remaining:
        print(f"  ✓ {t['name']}")


if __name__ == "__main__":
    cleanup()