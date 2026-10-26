import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

for tpl in templates:
    src_dir = os.path.join(TEMPLATES_DIR, tpl, "src")
    if not os.path.exists(src_dir): continue
    
    for file in os.listdir(src_dir):
        if file.endswith("Template.jsx"):
            filepath = os.path.join(src_dir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()

            # 1. Fix the broken map functions (Salon, RealEstate, Medical, Gym)
            # Fixes: .map((img) => `${getImgUrl(img}`) -> .map((img) => getImgUrl(img))
            content = re.sub(r'\.map\(\(([^)]+)\)\s*=>\s*`\$\{getImgUrl\(([^}]+)\}`\)', r'.map((\1) => getImgUrl(\2))', content)
            content = re.sub(r'\.map\(([a-zA-Z0-9_]+)\s*=>\s*`\$\{getImgUrl\(([^}]+)\}`\)', r'.map(\1 => getImgUrl(\2))', content)

            # 2. Fix the broken ternary strings (Photography, Portfolio)
            # Fixes: : '')} -> : ''}
            content = content.replace(": '')}", ": ''}")

            # 3. Fix the broken className in Education
            # Fixes: ${className)} -> ${className}
            content = content.replace("${className)}", "${className}")

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed syntax in {file}")
