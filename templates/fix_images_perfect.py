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
            
            # 1. Extra '+ i' or '+ index' ah remove pandrom (e.g., src={getImgUrl(img) + i})
            content = re.sub(r'src=\{getImgUrl\(([^)]+)\)\s*\+\s*[a-zA-Z0-9_]+\}', r'src={getImgUrl(\1)}', content)
            
            # 2. `${img}${i}` ah `${img}` nu maathurom
            content = re.sub(r'src=\{`([^`]+)\$\{[^}]+\}`\}', r'src={`\1`}', content)
            
            # 3. Vera matha img tags ah getImgUrl() kulla wrap pandrom
            def wrap_src(match):
                inner = match.group(1)
                if "getImgUrl" in inner: return match.group(0)
                # If it's a static string or url
                return f"src={{getImgUrl({inner})}}"
            
            content = re.sub(r'src=\{([^}]+)\}', wrap_src, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed img tags in {file}")

