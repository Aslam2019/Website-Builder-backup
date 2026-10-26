import os
import re
from database.mongo import get_db
from bson import ObjectId
from utils.template_engine import render_template
from publish_service import trigger_publish

# 1. Ella Templates oda HTML ah Static index.js ku fix pandrom
TEMPLATES_DIR = "/var/www/Website-Builder-backup/backend/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

print("🔧 Fixing template HTML files...")
for tpl in templates:
    dist_path = os.path.join(TEMPLATES_DIR, tpl, "dist", "index.html")
    if os.path.exists(dist_path):
        with open(dist_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Ellam hash names ah (e.g., index-D8Kif.js) static index.js and index.css ku maathurom
        content = re.sub(r'index-[a-zA-Z0-9]+\.js', 'index.js', content)
        content = re.sub(r'index-[a-zA-Z0-9]+\.css', 'index.css', content)
        
        # Script tag ah correct ah maathi, uploads_base add pandrom (Jinja2 format)
        if "window.__SITE_DATA__" not in content:
            content = content.replace("</body>", '<script>window.__SITE_DATA__ = {{ form_data | tojson | safe }}; window.__UPLOADS_BASE__ = "{{ uploads_base }}";</script></body>')
            
        with open(dist_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"✅ Fixed HTML for {tpl}")
    else:
        print(f"❌ Missing dist/index.html for {tpl}")

# 2. S3 Ku Upload Pannunga (AWS CLI use panni)
print("\n☁️ Uploading templates to S3...")
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/gym-01/dist/ s3://website-builder-published-sites/templates/gym-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/medical-01/dist/ s3://website-builder-published-sites/templates/medical-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/salon-01/dist/ s3://website-builder-published-sites/templates/salon-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/photography-01/dist/ s3://website-builder-published-sites/templates/photography-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/real-estate-01/dist/ s3://website-builder-published-sites/templates/real-estate-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/portfolio-01/dist/ s3://website-builder-published-sites/templates/portfolio-01/ --delete')
os.system('aws s3 sync /var/www/Website-Builder-backup/backend/templates/education-01/dist/ s3://website-builder-published-sites/templates/education-01/ --delete')
print("✅ S3 Upload complete.")

# 3. Ellam Users Ah Re-Publish Pandrom
print("\n🚀 Re-publishing all users...")
db = get_db()
websites = db.websites.find({"status": "published"})
count = 0

for website in websites:
    try:
        # Template name ah correct ah set pandrom (e.g. "Gym Template 01" -> "gym-01")
        clean_name = website.get("template_name", "").lower()
        if "gym" in clean_name: clean_name = "gym-01"
        elif "medical" in clean_name: clean_name = "medical-01"
        elif "salon" in clean_name: clean_name = "salon-01"
        elif "photography" in clean_name: clean_name = "photography-01"
        elif "real" in clean_name: clean_name = "real-estate-01"
        elif "portfolio" in clean_name: clean_name = "portfolio-01"
        elif "education" in clean_name: clean_name = "education-01"
        else: clean_name = clean_name.replace(" ", "-")

        db.websites.update_one(
            {"_id": website["_id"]},
            {"$set": {"template_name": clean_name}}
        )

        # HTML generate pandrom
        html_content = render_template(
            clean_name,
            website.get("form_data") or {},
            "https://d24e11dzjriy3b.cloudfront.net"
        )
        
        # SQS Trigger pandrom
        trigger_publish(
            website_id=str(website["_id"]),
            user_id=str(website.get("user_id")),
            username=website.get("username"),
            template_name=clean_name,
            html_content=html_content
        )
        print(f"✅ Re-published: {website.get('username')} ({clean_name})")
        count += 1
    except Exception as e:
        print(f"❌ Failed for {website.get('username')}: {e}")

print(f"\n🎉 Total {count} websites re-published successfully!")
