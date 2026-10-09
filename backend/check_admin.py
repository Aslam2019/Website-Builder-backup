from database.mongo import get_db
from bson import ObjectId

db = get_db()
admin = db.users.find_one({"role": "admin"})

if not admin:
    print("❌ No admin found")
else:
    print("✅ Admin:", admin.get("username"))
    print("--- Password-related fields ---")
    for key in ("password_hash", "password", "hashed_password", "pass"):
        val = admin.get(key)
        if val:
            preview = str(val)[:50] + "..." if len(str(val)) > 50 else str(val)
            print(f"  {key}: {preview}")
        else:
            print(f"  {key}: (empty/not set)")