import os
import re

TEMPLATES_DIR = "/var/www/Website-Builder-backup/templates"
templates = ["gym-01", "medical-01", "salon-01", "photography-01", "real-estate-01", "portfolio-01", "education-01"]

# ✅ Ithu dhaan 100% perfect aana getImgUrl function
new_func = """
const getImgUrl = (path) => {
  if (!path) return '';
  if (typeof path !== 'string') return path;
  if (path.startsWith('http')) return path;
  const base = (window.__UPLOADS_BASE__ || "https://d24e11dzjriy3b.cloudfront.net").replace(/\\/$/, ''); 
  if (path.startsWith('/uploads/')) return `${base}${path}`;
  if (path.match(/\\.(jpeg|jpg|gif|png|webp|svg)$/i)) {
      if (path.startsWith('/')) return `${base}/uploads${path}`;
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
            
            # 1. Pazhaya getImgUrl function ah remove pandrom
            content = re.sub(r'const getImgUrl = \(path\) => \{.*?\n\};', '', content, flags=re.DOTALL)
            content = re.sub(r'const getImgUrl = \(url\) => \{.*?\n\};', '', content, flags=re.DOTALL)
            
            # 2. Puthu function ah import lines ku apram add pandrom
            lines = content.split('\n')
            insert_idx = 0
            for i, line in enumerate(lines):
                if line.startswith('import '): insert_idx = i + 1
            
            lines.insert(insert_idx, new_func)
            content = '\n'.join(lines)
            
            # 3. Ella <img> tags ah getImgUrl() kulla wrap pandrom
            # e.g., src={data.logo} -> src={getImgUrl(data.logo)}
            content = re.sub(r'src=\{([^}]+)\}', r'src={getImgUrl(\1)}', content)
            
            # (Already getImgUrl la irundha thirumba wrap aagakoodadhu)
            content = content.replace("getImgUrl(getImgUrl(", "getImgUrl((")
            
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"✅ Fixed images in {file}")
