from database.mongo import get_db
from bson import ObjectId
from utils.template_engine import render_template
from publish_service import trigger_publish

db = get_db()
username = "nyha_rayhan"

# 1. Website ah database la thedum (case-insensitive)
website = db.websites.find_one({"username": {"$regex": f"^{username}$", "$options": "i"}})

if not website:
    print(f"❌ Website not found for {username}")
    exit()

print(f"🔍 Found website: {website.get('username')} | Template: {website.get('template_name')}")

# 2. Template name ah force ah correct ah set pandrom (e.g., "Gym Template 01" -> "gym-01")
clean_name = website.get("template_name", "").lower()
if "gym" in clean_name:
    clean_name = "gym-01"
elif "medical" in clean_name:
    clean_name = "medical-01"
elif "salon" in clean_name:
    clean_name = "salon-01"
elif "photography" in clean_name:
    clean_name = "photography-01"
elif "real" in clean_name:
    clean_name = "real-estate-01"
elif "portfolio" in clean_name:
    clean_name = "portfolio-01"
elif "education" in clean_name:
    clean_name = "education-01"
else:
    clean_name = clean_name.replace(" ", "-")

db.websites.update_one(
    {"_id": website["_id"]},
    {"$set": {"template_name": clean_name}}
)
print(f"✅ Template name fixed to: {clean_name}")

# 3. SQS Trigger pannuvom
try:
    html_content = render_template(
        clean_name,
        website.get("form_data") or {},
        "https://d24e11dzjriy3b.cloudfront.net"
    )
    
    # Output size ah print pandrom (error page 144 bytes dhaan irukkum)
    print(f"📄 Generated HTML Size: {len(html_content)} bytes")
    
    if len(html_content) < 500:
        print("⚠️ WARNING: HTML size is too small. Check template file!")

    trigger_publish(
        website_id=str(website["_id"]),
        user_id=str(website.get("user_id")),
        username=website.get("username"),
        template_name=clean_name,
        html_content=html_content
    )
    print(f"✅ SQS Sent for {username}")
except Exception as e:
    print(f"❌ Error: {e}")
