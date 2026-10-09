from database.mongo import get_db
from bson import ObjectId

db = get_db()

print("\n===== ALL USERS WITH ROLE =====\n")
for u in db.users.find({}):
    print(f"  _id: {u.get('_id')}")
    print(f"  username: {u.get('username')}")
    print(f"  role: {u.get('role')}")
    print(f"  is_active: {u.get('is_active')}")
    print(f"  fields: {list(u.keys())}")
    print("  --- password-related ---")
    for key in ("password_hash", "password", "hashed_password", "pass"):
        val = u.get(key)
        if val:
            preview = str(val)[:60] + ("..." if len(str(val)) > 60 else "")
            print(f"    {key}: {preview}")
    print()

print("\n===== ADMIN USER DETAIL =====\n")
admin = db.users.find_one({"role": "admin"})
if admin:
    for k, v in admin.items():
        if k == "password_hash" or k == "password":
            print(f"  {k}: {str(v)[:80]}...")
        else:
            print(f"  {k}: {v}")
else:
    print("  ❌ No admin found")