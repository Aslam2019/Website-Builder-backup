#!/bin/bash

# Ella templates-um irukura path
TEMPLATES_DIR="/var/www/Website-Builder-backup/backend/templates"

# Loop through each template folder
for template in "$TEMPLATES_DIR"/*/; do
    template_name=$(basename "$template")
    echo "========================================="
    echo "🚀 Building: $template_name"
    echo "========================================="

    # Go inside the template folder
    cd "$template" || exit

    # Install dependencies and build
    npm install
    npm run build

    # Check if build was successful
    if [ -d "dist" ]; then
        echo "✅ Build successful for $template_name"
    else
        echo "❌ Build failed for $template_name"
    fi

    # Remove node_modules to save space
    rm -rf node_modules

    echo ""
done

echo "🎉 All templates build process completed!"
