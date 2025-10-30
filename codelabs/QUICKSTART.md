# 🚀 Quick Start Guide - New Modular Architecture

## ⚡ TL;DR

```bash
# Migrate to new version
./migrate.sh

# Start server
npm run serve

# Add new codelab: Edit data/codelabs.json
# That's it! ✨
```

## 📝 Adding a New Codelab (2 Minutes)

### Step 1: Generate your codelab

```bash
npm run export:single your-codelab.md
```

### Step 2: Add entry to `data/codelabs.json`

```json
{
  "id": "your-codelab-id",
  "title": "Your Codelab Title",
  "icon": "🎨",
  "summary": "Brief description of what users will learn...",
  "duration": 45,
  "sections": 8,
  "tags": ["Tag1", "Tag2", "Tag3"],
  "categories": ["category1", "category2"],
  "searchTerms": "keywords for search",
  "url": "your-codelab-id/",
  "ctaText": "Start Learning"
}
```

### Step 3: Update stats (optional - auto-calculated)

```json
"stats": {
  "totalTutorials": 6,
  "totalSubPhases": 24,
  "totalMajorPhases": 6
}
```

### Step 4: Done! ✅

Refresh browser - your new codelab appears automatically!

## 🎯 Field Descriptions

| Field | Type | Required | Description | Example |
|-------|------|----------|-------------|---------|
| `id` | string | ✅ | Unique identifier | `"web-dev-basics"` |
| `title` | string | ✅ | Display title | `"Web Development Basics"` |
| `icon` | string | ✅ | Emoji icon | `"💻"` |
| `summary` | string | ✅ | Short description | `"Learn HTML, CSS, JS..."` |
| `duration` | number | ⚠️ | Minutes to complete | `45` |
| `sections` | number | ✅ | Number of sections | `8` |
| `tags` | array | ✅ | Display tags | `["HTML", "CSS"]` |
| `categories` | array | ✅ | Search categories | `["web", "beginner"]` |
| `searchTerms` | string | ✅ | Search keywords | `"html css javascript"` |
| `url` | string | ✅ | Relative URL | `"web-dev-basics/"` |
| `ctaText` | string | ✅ | Button text | `"Start Learning"` |
| `phases` | number | ⚠️ | For learning paths | `6` |
| `sectionLabel` | string | ⚠️ | Custom label | `"Sub-phases"` |

⚠️ = Optional field

## 🔧 Configuration

Edit `index.html` (or `index-new.html`):

```javascript
const appConfig = {
    dataUrl: 'data/codelabs.json',  // Change data source
    itemsPerPage: 6,                 // Cards per page (default: 6)
    elements: { ... }                // DOM element references
};
```

### Change Items Per Page

```javascript
itemsPerPage: 9  // Show 9 cards per page
```

### Change Data Source

```javascript
dataUrl: 'https://api.example.com/codelabs.json'  // Remote API
```

## 🎨 Customization

### Change Theme Colors

Edit `css/styles.css`:

```css
/* Background gradient */
body {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}

/* Card title color */
.codelab-card h2 {
    color: #YOUR_ACCENT_COLOR;
}

/* Button color */
.cta-button {
    background: #YOUR_BUTTON_COLOR;
}
```

### Add Custom Fields

1. **Add to JSON:**
```json
{
    "difficulty": "Beginner",
    "author": "John Doe"
}
```

2. **Update Renderer** (`js/CodelabCardRenderer.js`):
```javascript
renderCard(codelab) {
    // Add after summary
    const difficulty = codelab.difficulty 
        ? `<span class="difficulty">${codelab.difficulty}</span>` 
        : '';
    
    card.innerHTML = `
        <h2>${codelab.icon} ${codelab.title}</h2>
        <p class="summary">${codelab.summary}</p>
        ${difficulty}
        ...
    `;
}
```

3. **Add CSS** (`css/styles.css`):
```css
.difficulty {
    display: inline-block;
    padding: 4px 12px;
    background: #4CAF50;
    color: white;
    border-radius: 12px;
    font-size: 0.8em;
    margin-bottom: 10px;
}
```

## 🐛 Debugging

### Check Browser Console

```javascript
// App is exposed to window
window.codelabApp

// Test search
window.codelabApp.search('javascript')

// Go to page
window.codelabApp.goToPage(2)

// Clear search
window.codelabApp.clearSearch()
```

### Validate JSON

```bash
# Using Python
python3 -m json.tool data/codelabs.json

# Using Node.js
node -e "console.log(JSON.parse(require('fs').readFileSync('data/codelabs.json')))"

# Online: https://jsonlint.com/
```

### Common Issues

**Cards not showing:**
- Check browser console for errors
- Verify `data/codelabs.json` is valid JSON
- Check network tab for 404 errors

**Search not working:**
- Verify `searchTerms` field in JSON
- Check `categories` array
- Open console and test: `window.codelabApp.search('test')`

**Pagination not showing:**
- Check `itemsPerPage` config
- Verify you have more items than `itemsPerPage`
- Check console: `window.codelabApp.paginationController.getPaginationInfo()`

## 📊 Performance Tips

### Optimize Images

```bash
# If you add images to cards later
# Compress images before adding
```

### Lazy Load

For many codelabs (50+), consider lazy loading:

```javascript
// In CodelabCardRenderer.js
renderCard(codelab) {
    // Add loading="lazy" to images
    const img = `<img src="${codelab.image}" loading="lazy" />`;
}
```

### Bundle & Minify (Production)

```bash
# Install terser
npm install -g terser

# Minify JS files
terser js/*.js -o js/bundle.min.js -c -m

# Update HTML to use bundle
<script src="js/bundle.min.js"></script>
```

## 🧪 Testing Checklist

Before deploying:

- [ ] All codelabs load correctly
- [ ] Search works for all keywords
- [ ] Pagination works (prev/next)
- [ ] Mobile responsive
- [ ] No console errors
- [ ] Links open correctly
- [ ] Stats display correctly
- [ ] Animations smooth

## 📚 Examples

### Example 1: Simple Codelab

```json
{
  "id": "python-basics",
  "title": "Python Basics",
  "icon": "🐍",
  "summary": "Learn Python programming from scratch",
  "duration": 60,
  "sections": 10,
  "tags": ["Python", "Programming", "Beginner"],
  "categories": ["python", "programming", "beginner"],
  "searchTerms": "python programming basics tutorial",
  "url": "python-basics/",
  "ctaText": "Start Learning"
}
```

### Example 2: Learning Path

```json
{
  "id": "fullstack-path",
  "title": "Full-Stack Developer Path",
  "icon": "🎯",
  "summary": "Complete journey from frontend to backend",
  "duration": null,
  "phases": 8,
  "sections": 32,
  "sectionLabel": "Sub-phases",
  "tags": ["Full-Stack", "Web Dev", "Career"],
  "categories": ["fullstack", "web", "career"],
  "searchTerms": "fullstack developer path career",
  "url": "./fullstack-path.html",
  "ctaText": "Start Journey"
}
```

### Example 3: Indonesian Content

```json
{
  "id": "belajar-react",
  "title": "Belajar React dari Nol",
  "icon": "⚛️",
  "summary": "Panduan lengkap belajar React untuk pemula",
  "duration": 90,
  "sections": 12,
  "tags": ["React", "JavaScript", "Pemula", "Indonesia"],
  "categories": ["react", "javascript", "pemula"],
  "searchTerms": "react javascript pemula indonesia tutorial",
  "url": "belajar-react/",
  "ctaText": "Mulai Belajar"
}
```

## 🚀 Next Steps

1. **Read Full Documentation**: `README-ARCHITECTURE.md`
2. **Migrate**: Run `./migrate.sh`
3. **Add Your First Codelab**: Edit `data/codelabs.json`
4. **Customize**: Update colors in `css/styles.css`
5. **Deploy**: Push to your hosting

## 💡 Pro Tips

1. **Use Consistent Icons**: Pick from same emoji set
2. **Write Good Summaries**: 1-2 sentences, clear value
3. **Tag Wisely**: Use common, searchable tags
4. **Test Search**: Add yourself as a user and search
5. **Keep JSON Clean**: Use JSON formatter/linter

## 📞 Need Help?

- Check `README-ARCHITECTURE.md` for detailed docs
- Use browser console for debugging
- Validate JSON before committing
- Test on mobile devices

---

**Happy Coding! 🎉**
