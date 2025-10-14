# 🚀 Deployment Guide

Complete guide to deploying your learning platform to various hosting services.

## 📋 Pre-Deployment Checklist

Before deploying, make sure:
- [ ] All codelabs are exported to HTML
- [ ] Content is reviewed and tested
- [ ] Links work correctly
- [ ] Images are included
- [ ] Metadata is complete (author, summary, etc.)
- [ ] Status is set to "Published" (not "Draft")

## 🔨 Build Your Codelabs

Export all codelabs to HTML:

```bash
cd codelabs
go run github.com/googlecodelabs/tools/claat@latest export *.md
```

Or use npm:

```bash
npm run export
```

## 🌐 Deployment Options

---

## Option 1: GitHub Pages (Recommended for Beginners)

**Pros:** Free, easy, automatic updates  
**Cons:** Public repos only (for free tier)

### Step-by-Step

1. **Initialize Git (if not already done)**
```bash
git init
git add .
git commit -m "Initial commit: Learning platform setup"
```

2. **Create GitHub Repository**
- Go to GitHub.com
- Click "New Repository"
- Name it (e.g., `my-learning-platform`)
- Don't initialize with README (you already have one)

3. **Push to GitHub**
```bash
git remote add origin https://github.com/yourusername/my-learning-platform.git
git branch -M main
git push -u origin main
```

4. **Enable GitHub Pages**
- Go to repository Settings
- Scroll to "Pages" section
- Source: Deploy from branch
- Branch: `main`
- Folder: `/codelabs` or `/ (root)`
- Click Save

5. **Access Your Site**
Your site will be available at:
```
https://yourusername.github.io/my-learning-platform/
```

### Custom Domain (Optional)
1. Add a `CNAME` file in your codelabs directory:
```bash
echo "learn.yourdomain.com" > codelabs/CNAME
```

2. Configure DNS:
- Add CNAME record: `learn` → `yourusername.github.io`

3. Update GitHub Pages settings with your custom domain

---

## Option 2: Netlify

**Pros:** Easy, fast, free SSL, form handling  
**Cons:** Build minutes limited on free tier

### Method A: Git Integration (Recommended)

1. **Push to GitHub/GitLab/Bitbucket**
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-repo-url>
git push -u origin main
```

2. **Deploy on Netlify**
- Go to [netlify.com](https://netlify.com)
- Click "Add new site" → "Import an existing project"
- Connect your Git provider
- Select your repository
- Build settings:
  - Build command: `npm run export` (or leave empty)
  - Publish directory: `codelabs`
- Click "Deploy site"

3. **Configure Domain (Optional)**
- Site settings → Domain management
- Add custom domain or use provided `.netlify.app` domain

### Method B: Drag and Drop

1. **Export all codelabs**
```bash
npm run export
```

2. **Deploy**
- Go to [netlify.com](https://netlify.com)
- Drag the `codelabs` folder to the deploy zone
- Done!

### netlify.toml Configuration

Create `netlify.toml` in root:

```toml
[build]
  publish = "codelabs"
  command = "cd codelabs && go run github.com/googlecodelabs/tools/claat@latest export *.md"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

---

## Option 3: Vercel

**Pros:** Fast, global CDN, great DX  
**Cons:** More complex for static sites

### Deploy via CLI

1. **Install Vercel CLI**
```bash
npm install -g vercel
```

2. **Deploy**
```bash
vercel
```

Follow the prompts:
- Set up and deploy: Y
- Which scope: Your account
- Link to existing project: N
- Project name: my-learning-platform
- Directory: `./codelabs`
- Override settings: N

3. **Production Deploy**
```bash
vercel --prod
```

### Deploy via Git

1. **Push to GitHub**
```bash
git init
git add .
git commit -m "Initial commit"
git push
```

2. **Import on Vercel**
- Go to [vercel.com](https://vercel.com)
- Import Git repository
- Configure:
  - Framework: Other
  - Root directory: `codelabs`
  - Build command: (leave empty)
  - Output directory: (leave empty)
- Deploy

---

## Option 4: Firebase Hosting

**Pros:** Google infrastructure, fast, free SSL  
**Cons:** Requires Firebase setup

### Setup

1. **Install Firebase CLI**
```bash
npm install -g firebase-tools
```

2. **Login**
```bash
firebase login
```

3. **Initialize**
```bash
firebase init hosting
```

Configure:
- Use existing project or create new
- Public directory: `codelabs`
- Single-page app: No
- Set up automatic builds: No
- Overwrite index.html: No

4. **Deploy**
```bash
firebase deploy
```

### firebase.json Configuration

```json
{
  "hosting": {
    "public": "codelabs",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

---

## Option 5: AWS S3 + CloudFront

**Pros:** Scalable, professional, full control  
**Cons:** More complex, costs money (but cheap)

### Setup

1. **Install AWS CLI**
```bash
brew install awscli  # macOS
# or download from aws.amazon.com/cli
```

2. **Configure AWS**
```bash
aws configure
```

3. **Create S3 Bucket**
```bash
aws s3 mb s3://my-learning-platform
```

4. **Enable Static Website Hosting**
```bash
aws s3 website s3://my-learning-platform \
  --index-document index.html \
  --error-document error.html
```

5. **Upload Files**
```bash
aws s3 sync codelabs/ s3://my-learning-platform --acl public-read
```

6. **Set Bucket Policy**
Create `bucket-policy.json`:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::my-learning-platform/*"
  }]
}
```

Apply:
```bash
aws s3api put-bucket-policy \
  --bucket my-learning-platform \
  --policy file://bucket-policy.json
```

### CloudFront (CDN) - Optional

1. Create CloudFront distribution pointing to S3 bucket
2. Configure SSL certificate
3. Update DNS to point to CloudFront

---

## Option 6: Google Cloud Storage

**Pros:** Google infrastructure, scalable  
**Cons:** Requires GCP account

### Setup

1. **Install gcloud CLI**
```bash
# Follow instructions at cloud.google.com/sdk/docs/install
```

2. **Create Bucket**
```bash
gsutil mb gs://my-learning-platform
```

3. **Upload Files**
```bash
gsutil -m cp -r codelabs/* gs://my-learning-platform
```

4. **Make Public**
```bash
gsutil iam ch allUsers:objectViewer gs://my-learning-platform
```

5. **Enable Website Configuration**
```bash
gsutil web set -m index.html -e 404.html gs://my-learning-platform
```

---

## Option 7: Traditional Web Hosting

**Pros:** Simple, works anywhere  
**Cons:** Manual updates

### Via FTP/SFTP

1. **Export codelabs**
```bash
npm run export
```

2. **Upload via FTP client**
- Use FileZilla, Cyberduck, or similar
- Upload contents of `codelabs/` directory
- Upload to `public_html` or `www` directory

### Via SSH

```bash
# Export locally
npm run export

# Upload via rsync
rsync -avz codelabs/ user@yourserver.com:/var/www/html/
```

---

## 🔄 Continuous Deployment

### GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy Codelabs

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Setup Go
      uses: actions/setup-go@v2
      with:
        go-version: '1.21'
    
    - name: Export Codelabs
      run: |
        cd codelabs
        go install github.com/googlecodelabs/tools/claat@latest
        ~/go/bin/claat export *.md
    
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./codelabs
```

---

## 🔒 Security Best Practices

### HTTPS
- Always use HTTPS (most platforms provide free SSL)
- Use Let's Encrypt for custom domains

### Headers
Add security headers (varies by platform):
```
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: no-referrer-when-downgrade
```

### Content
- Don't include sensitive information
- Sanitize any user-generated content
- Keep dependencies updated

---

## 📊 Analytics Setup

### Google Analytics

1. **Get Tracking ID**
- Go to analytics.google.com
- Create property
- Get tracking ID (UA-XXXXXXXXX-X or G-XXXXXXXXXX)

2. **Add to Codelabs**
Add to metadata in each `.md` file:
```markdown
analytics account: UA-XXXXXXXXX-X
```

3. **Re-export**
```bash
npm run export
```

---

## 🧪 Testing Before Deployment

### Local Testing
```bash
./serve.sh
```

Visit `http://localhost:9090` and test:
- [ ] All links work
- [ ] Images load
- [ ] Code blocks render correctly
- [ ] Navigation works
- [ ] Progress tracking works
- [ ] Mobile responsive

### Production Testing
After deployment:
- [ ] Test on multiple browsers
- [ ] Test on mobile devices
- [ ] Check page load speed
- [ ] Verify SSL certificate
- [ ] Test all codelabs end-to-end

---

## 🔧 Troubleshooting

### 404 Errors
- Check publish directory is correct
- Ensure index.html exists
- Verify file permissions

### Styles Not Loading
- Check paths are relative, not absolute
- Ensure all assets are uploaded
- Clear browser cache

### Slow Loading
- Enable CDN
- Optimize images
- Enable compression (gzip)

---

## 📈 Post-Deployment

### Monitor
- Set up uptime monitoring (UptimeRobot, Pingdom)
- Check analytics regularly
- Monitor error logs

### Update
```bash
# Make changes to .md files
# Re-export
npm run export

# Deploy (method depends on platform)
git add .
git commit -m "Update codelabs"
git push  # If using Git-based deployment
```

### Maintain
- Review content quarterly
- Update outdated information
- Fix broken links
- Add new codelabs regularly

---

## 🎉 You're Live!

Your learning platform is now accessible to the world!

**Share it:**
- Social media
- Developer communities
- Your website/blog
- Email newsletter

**Promote it:**
- Write a blog post
- Create a demo video
- Submit to directories
- Ask for feedback

---

**Need help?** Check the README.md or open an issue on GitHub.

**Happy deploying! 🚀**
