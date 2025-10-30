# Learn with Fath - Interactive Learning Platform

A beautiful, interactive learning platform built using Google's Codelabs tools. Create engaging, step-by-step tutorials for any topic!

## 🌐 Live Site

Visit the live platform: **[learnwithfath.github.io](https://learnwithfath.github.io)**

## 🚀 Features

- **Interactive Tutorials** - Step-by-step learning experience
- **Progress Tracking** - Automatically saves user progress
- **Time Estimates** - Shows duration for each section
- **Responsive Design** - Works on desktop and mobile
- **Syntax Highlighting** - Beautiful code blocks
- **Info Boxes** - Highlight important tips and warnings
- **Easy Authoring** - Write tutorials in Markdown or Google Docs

## 📋 Prerequisites

- **Go** (for claat tool) - [Install Go](https://golang.org/dl/)
- A text editor (VS Code, Sublime Text, etc.)
- A web browser

## 🛠️ Installation

### 1. Clone this repository

```bash
git clone <your-repo-url>
cd my-codelabs
```

### 2. Install the claat tool

```bash
go install github.com/googlecodelabs/tools/claat@latest
```

Or download pre-compiled binaries from [Releases](https://github.com/googlecodelabs/tools/releases/latest)

### 3. Verify installation

```bash
claat version
```

## 📝 Creating Your First Codelab

### Step 1: Create a Markdown File

Create a new `.md` file in the `codelabs/` directory with this structure:

```markdown
author: Your Name
summary: Brief description of your codelab
id: unique-codelab-id
categories: topic1,topic2
environments: Web
status: Published
feedback link: https://github.com/yourusername/feedback

# Your Codelab Title

## Section 1
Duration: 0:05:00

Your content here...

## Section 2
Duration: 0:10:00

More content...
```

### Step 2: Export to HTML

```bash
cd codelabs
claat export your-codelab.md
```

This creates a directory with the same name as your codelab ID containing the HTML files.

### Step 3: Preview Locally

```bash
# Using npm script (recommended)
npm run serve

# Or directly with claat
claat serve
```

Open your browser to `http://localhost:9090` and click on your codelab!

**To stop the server:**

```bash
# Stop the running server
npm run stop

# Or press Ctrl+C in the terminal where server is running
```

## 📚 Markdown Syntax Guide

### Headers and Metadata

```markdown
author: Your Name
summary: What learners will accomplish
id: unique-identifier
categories: web,javascript,beginner
environments: Web
status: Published
feedback link: https://example.com/feedback

# Main Title

## Section Title
Duration: 0:05:00
```

### Info Boxes

```markdown
Positive
: This appears in a green success box

Negative
: This appears in a yellow warning box
```

### Code Blocks

````markdown
```javascript
function hello() {
  console.log("Hello, World!");
}
```
````

### Lists

```markdown
* Bullet point 1
* Bullet point 2

1. Numbered item 1
2. Numbered item 2
```

### Links and Images

```markdown
[Link Text](https://example.com)
![Alt Text](path/to/image.png)
```

## 🎨 Customization

### Styling

The generated codelabs use Google's Material Design. To customize:

1. Modify the generated HTML files
2. Add custom CSS
3. Update the codelab-elements styles

### Branding

You can create a custom landing page using the [site generator](https://github.com/googlecodelabs/tools/tree/master/site).

## 📂 Project Structure

```
my-codelabs/
├── README.md
├── codelabs/
│   ├── getting-started.md          # Source markdown
│   ├── getting-started/            # Generated HTML
│   │   ├── index.html
│   │   └── codelab.json
│   ├── web-dev-basics.md
│   └── web-dev-basics/
└── docs/                           # Optional: for GitHub Pages
```

## 🌐 Publishing Your Codelabs

### Option 1: GitHub Pages

1. Export all codelabs:
```bash
cd codelabs
claat export *.md
```

2. Move generated directories to a `docs/` folder
3. Enable GitHub Pages in repository settings
4. Point to the `docs/` folder

### Option 2: Netlify

1. Export codelabs
2. Create a `netlify.toml`:
```toml
[build]
  publish = "codelabs"
```
3. Deploy to Netlify

### Option 3: Firebase Hosting

```bash
firebase init hosting
firebase deploy
```

### Option 4: Any Static Host

The generated HTML is purely static and can be hosted anywhere:
- AWS S3
- Google Cloud Storage
- Vercel
- Any web server (nginx, Apache)

## 🎯 Sample Codelabs Included

### 1. Getting Started
- **ID**: `getting-started`
- **Topics**: Platform navigation, progress tracking, best practices
- **Duration**: ~36 minutes

### 2. Web Development Basics
- **ID**: `web-dev-basics`
- **Topics**: HTML, CSS, JavaScript, building a task list app
- **Duration**: ~61 minutes

## 🔧 Advanced Usage

### Export to Different Formats

```bash
# Export to HTML (default)
claat export codelab.md

# Export to Markdown
claat export -f md codelab.md

# Export from Google Docs
claat export <google-doc-id>
```

### Serve on Custom Port

```bash
claat serve -addr localhost:8080
```

### Watch for Changes

```bash
# In one terminal
claat serve

# In another terminal, re-export when you make changes
claat export codelab.md
```

## 📖 Resources

- [Official Codelabs Tools](https://github.com/googlecodelabs/tools)
- [Format Guide](https://github.com/googlecodelabs/tools/blob/master/FORMAT-GUIDE.md)
- [Markdown Parser Examples](https://github.com/googlecodelabs/tools/tree/master/claat/parser/md)
- [Codelab Authors Google Group](https://groups.google.com/forum/#!forum/codelab-authors)

## 💡 Tips for Great Codelabs

1. **Keep sections focused** - Each section should cover one concept
2. **Use realistic examples** - Show real-world applications
3. **Include checkpoints** - Let learners verify their progress
4. **Add visuals** - Screenshots and diagrams enhance understanding
5. **Test thoroughly** - Follow your own tutorial to catch issues
6. **Get feedback** - Have others try your codelab before publishing

## 🤝 Contributing

Want to add more codelabs? 

1. Create your markdown file in `codelabs/`
2. Follow the format guide
3. Export and test locally
4. Submit a pull request

## 📄 License

This project uses Google's Codelabs tools, which are open source. Your content can be licensed as you prefer.

## 🆘 Troubleshooting

### claat command not found
- Make sure Go is installed
- Add `$GOPATH/bin` to your PATH
- Try `go install github.com/googlecodelabs/tools/claat@latest` again

### Export fails with image errors
- Use local images instead of external URLs
- Ensure image paths are relative to the markdown file
- Check that images exist in the specified location

### Styles not loading locally
- This is normal when opening `index.html` directly
- Use `claat serve` to preview properly
- Styles will work correctly when deployed online

## 🎓 Next Steps

1. **Create your first codelab** - Start with a topic you know well
2. **Customize the design** - Make it match your brand
3. **Build a landing page** - Create a catalog of all your codelabs
4. **Share with learners** - Deploy and gather feedback
5. **Iterate and improve** - Update based on user feedback

---

**Happy Teaching! 🎉**

For questions or issues, please open an issue on GitHub or join the [Codelab Authors Group](https://groups.google.com/forum/#!forum/codelab-authors).
