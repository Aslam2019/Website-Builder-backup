import os
import subprocess
import shutil

ROOT_DIR = os.path.dirname(os.path.abspath(__file__))
TEMPLATES_DIR = os.path.join(ROOT_DIR, 'templates')
BACKEND_DIR = os.path.join(ROOT_DIR, 'backend', 'templates')

# ✅ CloudFront URL
CLOUDFRONT_URL = "https://d24e11dzjriy3b.cloudfront.net"

def run_build():
    templates = [d for d in os.listdir(TEMPLATES_DIR) if os.path.isdir(os.path.join(TEMPLATES_DIR, d))]
    
    for tpl in templates:
        tpl_path = os.path.join(TEMPLATES_DIR, tpl)
        if not os.path.exists(os.path.join(tpl_path, 'package.json')):
            continue

        print(f"📦 Building {tpl}...")
        
        # ✅ 1. Create/Update .env for Vite Build
        env_path = os.path.join(tpl_path, '.env')
        with open(env_path, 'w') as f:
            f.write(f"VITE_UPLOADS_BASE_URL={CLOUDFRONT_URL}\n")
            f.write(f"VITE_API_BASE_URL=/api\n") # Relative path for API

        try:
            subprocess.run(["npm", "install", "--silent"], cwd=tpl_path, check=True, shell=True)
            subprocess.run(["npm", "run", "build"], cwd=tpl_path, check=True, shell=True)
            
            dist_path = os.path.join(tpl_path, 'dist')
            target_dist = os.path.join(BACKEND_DIR, tpl, 'dist')
            
            if os.path.exists(dist_path):
                if os.path.exists(target_dist):
                    shutil.rmtree(target_dist)
                os.makedirs(os.path.dirname(target_dist), exist_ok=True)
                shutil.copytree(dist_path, target_dist)
                print(f"✅ {tpl} built successfully (with CloudFront URLs)")
                
        except subprocess.CalledProcessError:
            print(f"❌ Error building {tpl}")
        
        # ✅ Cleanup: Remove the temporary .env
        if os.path.exists(env_path):
            os.remove(env_path)

if __name__ == "__main__":
    run_build()