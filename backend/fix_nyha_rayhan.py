from database.mongo import get_db
from bson import ObjectId
from utils.template_engine import render_template
from publish_service import trigger_publish

db = get_db()
username = "nyha_rayhan"
website = db.websites.find_one({"username": {"$regex": f"^{username}$", "$options": "i"}})

if website:
    html_content = render_template(
        website.get("template_name"),
        website.get("form_data") or {},
        "https://d24e11dzjriy3b.cloudfront.net"
    )
    trigger_publish(
        website_id=str(website["_id"]),
        user_id=str(website.get("user_id")),
        username=website.get("username"),
        template_name=website.get("template_name"),
        html_content=html_content
    )
    print(f"✅ SQS Sent for {username}")
else:
    print("❌ Website not found")
