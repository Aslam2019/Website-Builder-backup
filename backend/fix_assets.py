import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/backend/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

for tpl in templates:
    dist_path = os.path.join(TEMPLATES_DIR, tpl, "dist", "index.html")
    if not os.path.exists(dist_path):
        continue
        
    with open(dist_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Replace JS src
    content = re.sub(r'src="[^"]*index\.js"', 'src="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.js"', content)
    # Replace CSS href
    content = re.sub(r'href="[^"]*index\.css"', 'href="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.css"', content)

    with open(dist_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Fixed HTML for {tpl}")
