from database.mongo import get_db

db = get_db()

print("\n===== ALL USERS IN DB =====\n")
for u in db.users.find({}):
    print(f"_id       : {u.get('_id')}")
    print(f"username  : {u.get('username')}")
    print(f"role      : {u.get('role')!r}")   # repr shows exact value
    print(f"is_active : {u.get('is_active')}")
    print(f"has_hash  : {bool(u.get('password_hash'))}")
    print(f"hash_type : {str(u.get('password_hash'))[:30]}...")
    print("-" * 40)

print(f"\nTotal users: {db.users.count_documents({})}")
print(f"Admins (role=admin): {db.users.count_documents({'role': 'admin'})}")
print(f"Admins (role=super_admin): {db.users.count_documents({'role': 'super_admin'})}")