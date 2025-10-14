#!/bin/bash

# Script to create a new codelab from a template

echo "📝 Create a New Codelab"
echo "======================"
echo ""

# Get codelab details
read -p "Codelab ID (e.g., my-first-codelab): " CODELAB_ID
read -p "Title: " TITLE
read -p "Author: " AUTHOR
read -p "Summary: " SUMMARY
read -p "Categories (comma-separated): " CATEGORIES

# Create the markdown file
FILENAME="codelabs/${CODELAB_ID}.md"

cat > "$FILENAME" << EOF
author: ${AUTHOR}
summary: ${SUMMARY}
id: ${CODELAB_ID}
categories: ${CATEGORIES}
environments: Web
status: Draft
feedback link: https://github.com/yourusername/feedback

# ${TITLE}

## Overview
Duration: 0:02:00

Welcome to this codelab! In this tutorial, you'll learn...

### What You'll Learn
* Topic 1
* Topic 2
* Topic 3

### Prerequisites
* Prerequisite 1
* Prerequisite 2

Positive
: This is a tip or positive note!

## Section 1
Duration: 0:05:00

Add your content here...

### Subsection

More content...

Negative
: This is a warning or important note!

## Section 2
Duration: 0:10:00

### Code Example

\`\`\`javascript
function example() {
  console.log("Hello, World!");
}
\`\`\`

### Try It Yourself
1. Step 1
2. Step 2
3. Step 3

## Next Steps
Duration: 0:02:00

Congratulations! You've completed this codelab.

### What's Next?
* Continue learning with...
* Try building...
* Explore more...

## Summary
Duration: 0:01:00

### What You Learned
* ✅ Item 1
* ✅ Item 2
* ✅ Item 3

Thank you for completing this codelab!
EOF

echo ""
echo "✅ Created: ${FILENAME}"
echo ""
echo "Next steps:"
echo "1. Edit ${FILENAME} with your content"
echo "2. Export: cd codelabs && claat export ${CODELAB_ID}.md"
echo "3. Preview: ./serve.sh"
echo ""
