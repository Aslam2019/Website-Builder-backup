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

            # 1. Fix map returning broken template literals (Salon, Real Estate, Medical, Gym)
            # `.map((img) => \` \${getImgUrl(img)}\`)` -> `.map((img) => getImgUrl(img))`
            content = re.sub(r'\.map\(([^)]+)\)\s*=>\s*`\s*\$\{getImgUrl\(([^)]+)\)\}`', r'.map(\1 => getImgUrl(\2))', content)
            
            # 2. Fix missing backtick in className (Portfolio, Photography, Education)
            # `className={\`...\${...}\`}` (missing closing backtick)
            content = re.sub(r'className=\{`([^`]+)\$\{([^}]+)\}`\}', r'className={`\1${\2}`}', content)
            content = re.sub(r'className=\{`([^`]+)\$\{([^}]+)\}\s*\$\{([^}]+)\}`\}', r'className={`\1${\2} ${\3}`}', content)

            # 3. Fix broken image sources
            content = re.sub(r'src=\{`\s*\$\{getImgUrl\(([^)]+)\)\}`\}', r'src={getImgUrl(\1)}', content)
            content = re.sub(r'src=\{`\s*getImgUrl\(([^)]+)\)`\}', r'src={getImgUrl(\1)}', content)

            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed syntax in {file}")
