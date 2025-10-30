#!/bin/bash

# Migration script from old index.html to new modular version
# This script safely migrates to the new SOLID-based architecture

echo "🚀 Starting migration to new modular architecture..."
echo ""

# Step 1: Backup old version
echo "📦 Step 1: Creating backup..."
if [ -f "index.html" ]; then
    cp index.html index-old-backup.html
    echo "✅ Backup created: index-old-backup.html"
else
    echo "⚠️  No existing index.html found"
fi
echo ""

# Step 2: Verify new files exist
echo "🔍 Step 2: Verifying new files..."
missing_files=0

files_to_check=(
    "index-new.html"
    "css/styles.css"
    "js/CodelabDataService.js"
    "js/CodelabCardRenderer.js"
    "js/PaginationController.js"
    "js/SearchController.js"
    "js/UIController.js"
    "js/CodelabApp.js"
    "data/codelabs.json"
)

for file in "${files_to_check[@]}"; do
    if [ -f "$file" ]; then
        echo "✅ $file"
    else
        echo "❌ Missing: $file"
        missing_files=$((missing_files + 1))
    fi
done

if [ $missing_files -gt 0 ]; then
    echo ""
    echo "❌ Migration aborted: $missing_files file(s) missing"
    exit 1
fi

echo ""
echo "✅ All required files present"
echo ""

# Step 3: Replace index.html
echo "🔄 Step 3: Replacing index.html..."
mv index.html index-old.html 2>/dev/null
cp index-new.html index.html
echo "✅ New index.html activated"
echo ""

# Step 4: Verify JSON data
echo "🔍 Step 4: Validating JSON data..."
if command -v python3 &> /dev/null; then
    if python3 -c "import json; json.load(open('data/codelabs.json'))" 2>/dev/null; then
        echo "✅ JSON data is valid"
    else
        echo "❌ JSON data is invalid!"
        echo "   Please fix data/codelabs.json before proceeding"
        exit 1
    fi
else
    echo "⚠️  Python3 not found, skipping JSON validation"
fi
echo ""

# Step 5: Summary
echo "✨ Migration completed successfully!"
echo ""
echo "📋 Summary:"
echo "  - Old version backed up to: index-old-backup.html"
echo "  - Old version moved to: index-old.html"
echo "  - New version activated: index.html"
echo ""
echo "🧪 Next steps:"
echo "  1. Test the new version: npm run serve"
echo "  2. Verify all codelabs are working"
echo "  3. Test search functionality"
echo "  4. Test pagination"
echo ""
echo "📚 Documentation: README-ARCHITECTURE.md"
echo ""
echo "🔄 To rollback:"
echo "  mv index-old.html index.html"
echo ""
echo "✅ Done!"
