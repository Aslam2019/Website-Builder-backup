#!/bin/bash

TEMPLATES_DIR="/var/www/Website-Builder-backup/templates"
BACKEND_TEMPLATES_DIR="/var/www/Website-Builder-backup/backend/templates"

for dir in "$TEMPLATES_DIR"/*/; do
    if [ -d "$dir" ]; then
        template_name=$(basename "$dir")
        echo "========================================="
        echo "🚀 Building: $template_name"
        echo "========================================="

        cd "$dir" || exit

        # 1. Vite config ah static name ku maathi build pandrom
        cat > vite.config.js <<EOF
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name].js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name].[ext]'
      }
    }
  }
})
EOF

        npm install
        npm run build

        # 2. Build aana index.html la hash name ah static index.js ku maathurom
        if [ -f "dist/index.html" ]; then
            sed -i -E 's|src="[^"]*index\.js"|src="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.js"|g' dist/index.html
            sed -i -E 's|href="[^"]*index\.css"|href="{{ uploads_base }}/templates/{{ template_slug }}/assets/index.css"|g' dist/index.html
            
            # Jinja2 variables ah add pandrom
            if ! grep -q "window.__SITE_DATA__" "dist/index.html"; then
                sed -i 's|</body>|<script>\n  window.__SITE_DATA__ = {{ form_data \| tojson \| safe }};\n  window.__UPLOADS_BASE__ = "{{ uploads_base }}";\n</script>\n</body>|' "dist/index.html"
            fi
        fi

        # 3. S3 ku upload pandrom
        aws s3 sync dist/ s3://website-builder-published-sites/templates/$template_name/ --delete

        # 4. Backend templates folder ku copy pandrom
        rm -rf "$BACKEND_TEMPLATES_DIR/$template_name/dist"
        cp -r dist "$BACKEND_TEMPLATES_DIR/$template_name/"

        echo "✅ Done and Synced: $template_name"
        echo ""
    fi
done
