from database.mongo import get_db
from bson import ObjectId

db = get_db()

# Screenshot la paatha rayhan_nyha user id
user_id = ObjectId("6acf242b3073486e6d998a92")
username = "rayhan_nyha"

print(f"Updating websites for {username}...")

result = db.websites.update_many(
    {"username": username},
    {"$set": {"user_id": user_id}}
)

print(f"Matched: {result.matched_count}, Modified: {result.modified_count}")
