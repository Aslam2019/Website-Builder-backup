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

    # ✅ 1. Relative path (/assets/) ah CloudFront ku maathurom
    content = re.sub(r'src="/assets/index\.js"', 'src="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.js"', content)
    content = re.sub(r'href="/assets/index\.css"', 'href="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.css"', content)

    # ✅ 2. form_data inject pannirukka nu confirm pandrom
    if "window.__SITE_DATA__" not in content:
        content = content.replace("</body>", '<script>window.__SITE_DATA__ = {{ form_data | tojson | safe }}; window.__UPLOADS_BASE__ = "{{ uploads_base }}";</script></body>')

    with open(dist_path, "w", encoding="utf-8") as f:
        f.write(content)
    print(f"✅ Fixed Paths for {tpl}")
