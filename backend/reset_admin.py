"""
Emergency admin password reset — robust version.
Run: python reset_admin.py
"""
from datetime import datetime, timezone
from database.mongo import get_db
from utils.security import hash_password   # ✅ Same as login

db = get_db()

# -------- EDIT THESE --------
ADMIN_USERNAME = "admin"
NEW_PASSWORD   = "Admin@123"
# ----------------------------

print("\n===== Searching for admin user =====\n")

# Try multiple lookup strategies
admin = None

# 1. Exact username + role admin
admin = db.users.find_one({"username": ADMIN_USERNAME, "role": "admin"})
if admin:
    print(f"✅ Found by (username + role=admin)")

# 2. Username only (role may be different)
if not admin:
    admin = db.users.find_one({"username": ADMIN_USERNAME})
    if admin:
        print(f"✅ Found by username only. Actual role: {admin.get('role')!r}")

# 3. Case-insensitive username
if not admin:
    import re
    admin = db.users.find_one({"username": {"$regex": f"^{ADMIN_USERNAME}$", "$options": "i"}})
    if admin:
        print(f"✅ Found by case-insensitive. Username: {admin.get('username')}, role: {admin.get('role')!r}")

# Not found — show all users
if not admin:
    print(f"❌ No user matching '{ADMIN_USERNAME}'")
    print(f"\n===== ALL USERS IN DB =====")
    all_users = list(db.users.find({}))
    if not all_users:
        print("   ⚠️  Database la user eh illa!")
    for u in all_users:
        print(f"   - username={u.get('username')!r}  role={u.get('role')!r}  _id={u.get('_id')}")
    exit(1)

# -------- Reset password --------
new_hash = hash_password(NEW_PASSWORD)

db.users.update_one(
    {"_id": admin["_id"]},
    {"$set": {
        "password_hash": new_hash,
        "updated_at": datetime.now(timezone.utc),
    }},
)

print(f"\n✅ Password reset successful!")
print(f"   Username    : {admin.get('username')}")
print(f"   Role        : {admin.get('role')!r}")
print(f"   New password: {NEW_PASSWORD}")
print(f"   Hash prefix : {new_hash[:40]}...")
print(f"\n👉 Login with:")
print(f"   Username: {admin.get('username')}")
print(f"   Password: {NEW_PASSWORD}")