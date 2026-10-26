import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

# ✅ Ithu dhaan 100% perfect function
new_func = """
const getImgUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path;
  
  // 1. Already full URL ah irundha (https://...), adha appadiye return pannu
  if (path.startsWith('http')) return path;
  
  const base = (window.__UPLOADS_BASE__ || "https://d24e11dzjriy3b.cloudfront.net").replace(/\\/$/, ''); 
  
  // 2. Path la /uploads/ irundha, base kooda sethu return pannu
  if (path.startsWith('/uploads/')) return `${base}${path}`;
  if (path.startsWith('uploads/')) return `${base}/${path}`;
  
  // 3. Vera path irundha, /uploads/ sethu return pannu
  if (path.startsWith('/')) return `${base}/uploads${path}`;
  
  // 4. Filename mattum irundha
  return `${base}/uploads/${path}`;
};
"""

for tpl in templates:
    src_dir = os.path.join(TEMPLATES_DIR, tpl, "src")
    if not os.path.exists(src_dir): continue
    
    for file in os.listdir(src_dir):
        if file.endswith("Template.jsx") or file == "App.jsx":
            filepath = os.path.join(src_dir, file)
            with open(filepath, 'r', encoding='utf-8') as f:
                content = f.read()
            
            # Pazhaya getImgUrl ah remove pandrom
            content = re.sub(r'const getImgUrl = \(path\) => \{.*?\n\};', '', content, flags=re.DOTALL)
            content = re.sub(r'const getImgUrl = \(url\) => \{.*?\n\};', '', content, flags=re.DOTALL)
            
            # Puthu function ah add pandrom
            lines = content.split('\n')
            insert_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import '): insert_idx = i + 1
            lines.insert(insert_idx, new_func)
            content = '\n'.join(lines)
            
            # Vera edhavadhu direct ah `${uploadsBase}${img}` nu irundha adhayum clean pandrom
            content = content.replace("`${uploadsBase}${", "`${getImgUrl(")
            content = content.replace("}`}", ")}`}")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed double URL bug in {file}")
