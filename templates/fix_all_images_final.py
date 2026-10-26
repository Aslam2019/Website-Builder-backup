import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

# ✅ Ithu dhaan 100% bulletproof getImgUrl function
new_func = """
const getImgUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const base = (window.__UPLOADS_BASE__ || "https://d24e11dzjriy3b.cloudfront.net").replace(/\\/$/, ''); 
  
  // Path la '/uploads/' irundha, adha appadiye sethukkom
  if (path.startsWith('/uploads/')) return `${base}${path}`;
  if (path.startsWith('uploads/')) return `${base}/${path}`;
  
  // Vera folder path irundha (/logos/ etc), adha /uploads/ kooda sethukkom
  if (path.startsWith('/')) return `${base}/uploads${path}`;
  
  // Filename mattum irundha (e.g., abc.jpg), default ah /uploads/ la thedum
  if (path.match(/\\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      return `${base}/uploads/${path}`;
  }
  
  return `${base}/${path}`;
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
            
            # Pazhaya getImgUrl function ah remove pandrom
            content = re.sub(r'const getImgUrl = \(path\) => \{.*?\n\};', '', content, flags=re.DOTALL)
            
            # Puthu function ah import lines ku apram add pandrom
            lines = content.split('\n')
            insert_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import '): insert_idx = i + 1
            
            lines.insert(insert_idx, new_func)
            content = '\n'.join(lines)
            
            # Ella <img> tags ah getImgUrl() kulla wrap pandrom (If not already wrapped)
            # Ithu img tags la irukura src={...} ellathayum target pannum
            def wrap_img(match):
                inner = match.group(1)
                if "getImgUrl" in inner: return match.group(0)
                return f"src={{getImgUrl({inner})}}"
            
            content = re.sub(r'src=\{([^}]+)\}', wrap_img, content)
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed images in {file}")
