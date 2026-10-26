import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

for tpl in templates:
    src_dir = os.path.join(TEMPLATES_DIR, tpl, "src")
    if not os.path.exists(src_dir): continue
    
    for file in os.listdir(src_dir):
        if file.endswith("Template.jsx") or file == "App.jsx":
            filepath = os.path.join(src_dir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # ✅ Ithu dhaan main fix (Broken syntax ah clean pandrom)
            # 1. src={`${getImgUrl(img)`}  ->  src={getImgUrl(img)}
            content = re.sub(r'src=\{`\$\{getImgUrl\(([^}]+)\)`\}', r'src={getImgUrl(\1)}', content)
            
            # 2. url(`${getImgUrl(img)}`) -> url(${getImgUrl(img)})
            content = re.sub(r'url\(`\$\{getImgUrl\(([^}]+)\)\}`\)', r'url(${getImgUrl(\1)})', content)
            
            # 3. ` ${getImgUrl(img)}` (with extra space) -> getImgUrl(img)
            content = re.sub(r'`\s*\$\{getImgUrl\(([^}]+)\)\}`', r'getImgUrl(\1)', content)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed syntax in {file}")
