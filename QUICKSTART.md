# Quick Start Guide

Get your learning platform up and running in 5 minutes!

## 🎯 Goal

By the end of this guide, you'll have:
- ✅ A working local codelab server
- ✅ Two sample codelabs to explore
- ✅ Knowledge to create your own codelabs

## 📦 Step 1: Prerequisites

Make sure you have Go installed:

```bash
go version
```

If not installed, download from: https://golang.org/dl/

## 🚀 Step 2: Start the Server

Run the serve script:

```bash
./serve.sh
```

Or using npm:

```bash
npm run serve
```

Your browser should open to `http://localhost:9090`

## 🎓 Step 3: Explore Sample Codelabs

Click on either:
- **Getting Started** - Learn how to use the platform
- **Web Development Basics** - Build a task list app

## ✍️ Step 4: Create Your First Codelab

### Option A: Using the Script

```bash
./new-codelab.sh
```

Follow the prompts to create a new codelab template.

### Option B: Manually

1. Create a new file in `codelabs/my-tutorial.md`
2. Add the metadata header:

```markdown
author: Your Name
summary: What you'll learn
id: my-tutorial
categories: topic
environments: Web
status: Published

# My Tutorial Title

## Section 1
Duration: 0:05:00

Your content here...
```

3. Export to HTML:

```bash
cd codelabs
go run github.com/googlecodelabs/tools/claat@latest export my-tutorial.md
```

4. Refresh your browser at `http://localhost:9090`

## 🎨 Step 5: Customize Your Content

Edit your markdown file and add:

### Info Boxes

```markdown
Positive
: Success tips appear in green boxes

Negative
: Warnings appear in yellow boxes
```

### Code Blocks

````markdown
```javascript
console.log("Hello, World!");
```
````

### Lists

```markdown
* Bullet point
* Another point

1. Numbered item
2. Another item
```

### Links

```markdown
[Link Text](https://example.com)
```

## 🔄 Step 6: Update and Reload

After editing your markdown:

```bash
cd codelabs
go run github.com/googlecodelabs/tools/claat@latest export your-codelab.md
```

Refresh your browser to see changes!

## 📤 Step 7: Deploy (Optional)

### GitHub Pages

1. Export all codelabs:
```bash
npm run export
```

2. Push to GitHub

3. Enable GitHub Pages in Settings → Pages

4. Set source to `main` branch, `/codelabs` folder

### Netlify

1. Connect your GitHub repo to Netlify
2. Set publish directory to `codelabs`
3. Deploy!

## 🆘 Troubleshooting

### Server won't start
- Check if Go is installed: `go version`
- Make sure you're in the `my-codelabs` directory
- Try: `cd codelabs && go run github.com/googlecodelabs/tools/claat@latest serve`

### Changes not showing
- Re-export your codelab after editing
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Check the terminal for export errors

### Styles missing when opening HTML directly
- Always use `claat serve` for local preview
- Styles work correctly when deployed online

## 📚 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Explore the sample codelabs** to see what's possible
3. **Check the Format Guide** for advanced markdown features
4. **Join the community** at the Codelab Authors Google Group

## 🎉 You're Ready!

Start creating amazing interactive tutorials. Happy teaching!

---

**Need help?** Check the [full README](README.md) or open an issue on GitHub.
