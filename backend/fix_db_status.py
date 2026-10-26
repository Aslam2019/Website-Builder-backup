from database.mongo import get_db

db = get_db()

# Ella website-oda status ah 'published' ku maathurom
result = db.websites.update_many(
    {}, 
    {"$set": {"status": "published", "payment_status": "successful"}}
)

print(f"✅ Updated {result.modified_count} websites to 'published' status.")
