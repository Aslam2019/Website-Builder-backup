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
            
            # 1. src={img + i} or src={item + index} ah remove pandrom
            content = re.sub(r'src=\{([^}]+)\s*\+\s*(i|index)\}', r'src={getImgUrl(\1)}', content)
            
            # 2. src={`${img}${i}`} or src={`${url}${index}`} ah remove pandrom
            content = re.sub(r'src=\{`\$\{([^}]+)\}\$\{(i|index)\}`\}', r'src={getImgUrl(\1)}', content)

            # 3. Vera edhavadhu img tags la index irundha adhayum remove pandrom
            content = re.sub(r'src=\{([^}]+)\[\s*(i|index)\s*\]\}', r'src={getImgUrl(\1[\2])}', content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed +i bug in {file}")
