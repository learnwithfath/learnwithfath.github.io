# 🖥️ Server Management Guide

## Quick Commands

```bash
# Start the local development server
npm run serve

# Stop the running server
npm run stop
```

## 🚀 Starting the Server

### Method 1: Using npm (Recommended)

```bash
npm run serve
```

**What happens:**
- Server starts on `http://localhost:9090`
- Automatically opens in your browser
- Shows list of available codelabs
- Watches for file changes (hot reload)

### Method 2: Direct claat command

```bash
cd codelabs
claat serve
```

### Method 3: Custom port

```bash
cd codelabs
claat serve -addr localhost:8080
```

## 🛑 Stopping the Server

### Method 1: Using npm (Recommended)

```bash
npm run stop
```

**What happens:**
- Finds all processes on port 9090
- Gracefully stops the server
- Force kills if needed
- Confirms port is free

**Output example:**
```
🛑 Stopping Codelabs Server...

🔍 Found processes on port 9090: 12345
🛑 Stopping processes...
✅ Server stopped successfully

📊 Port 9090 is now free

💡 To start the server again, run: npm run serve
```

### Method 2: Keyboard shortcut

Press `Ctrl+C` in the terminal where the server is running.

### Method 3: Manual process kill

```bash
# Find the process
lsof -ti:9090

# Kill the process
kill $(lsof -ti:9090)

# Force kill if needed
kill -9 $(lsof -ti:9090)
```

## 🔍 Checking Server Status

### Check if server is running

```bash
# Check port 9090
lsof -ti:9090

# If returns a number, server is running
# If returns nothing, server is stopped
```

### Check claat processes

```bash
# Find all claat serve processes
pgrep -f "claat.*serve"

# Show detailed info
ps aux | grep "claat.*serve"
```

### Test server connection

```bash
# Using curl
curl http://localhost:9090

# Using browser
open http://localhost:9090
```

## 🐛 Troubleshooting

### Problem: Port already in use

**Error message:**
```
listen tcp :9090: bind: address already in use
```

**Solution:**
```bash
# Stop the existing server
npm run stop

# Or kill manually
kill $(lsof -ti:9090)

# Then start again
npm run serve
```

### Problem: Server won't stop

**Symptoms:**
- `npm run stop` doesn't work
- Port still shows as in use
- Can't start new server

**Solution:**
```bash
# Force kill all claat processes
pkill -9 -f "claat.*serve"

# Force kill processes on port 9090
kill -9 $(lsof -ti:9090)

# Verify port is free
lsof -ti:9090  # Should return nothing
```

### Problem: Server starts but can't access

**Symptoms:**
- Server starts without errors
- Browser shows "Can't connect"
- `http://localhost:9090` doesn't work

**Solutions:**

1. **Check if server is actually running:**
```bash
lsof -ti:9090
```

2. **Try different browser:**
```bash
# Chrome
open -a "Google Chrome" http://localhost:9090

# Firefox
open -a Firefox http://localhost:9090

# Safari
open -a Safari http://localhost:9090
```

3. **Check firewall settings:**
```bash
# macOS: System Preferences > Security & Privacy > Firewall
# Allow incoming connections for Go/claat
```

4. **Try different port:**
```bash
cd codelabs
claat serve -addr localhost:8080
```

### Problem: Changes not reflecting

**Symptoms:**
- Made changes to codelabs
- Server running but changes don't show
- Old content still displays

**Solutions:**

1. **Re-export the codelab:**
```bash
cd codelabs
claat export your-codelab.md
```

2. **Hard refresh browser:**
- Chrome/Firefox: `Cmd+Shift+R` (Mac) or `Ctrl+Shift+R` (Windows)
- Safari: `Cmd+Option+R`

3. **Clear browser cache:**
```bash
# Or use incognito/private mode
```

4. **Restart server:**
```bash
npm run stop
npm run serve
```

## 📊 Server Logs

### View server output

Server logs appear in the terminal where you ran `npm run serve`:

```
🚀 Starting Codelabs Server...

📝 Available codelabs:
  - Getting Started (getting-started)
  - Web Development Basics (web-dev-basics)

🌐 Server will start at http://localhost:9090
Press Ctrl+C to stop the server

Serving codelabs on localhost:9090, opening browser tab now...
```

### Common log messages

**Success:**
```
Serving codelabs on localhost:9090
```

**Error - Port in use:**
```
listen tcp :9090: bind: address already in use
```

**Error - No codelabs found:**
```
No codelabs found in directory
```

## 🔧 Advanced Usage

### Run server in background

```bash
# Start in background
npm run serve &

# Get process ID
echo $!

# Stop using process ID
kill <process-id>

# Or use npm stop
npm run stop
```

### Run multiple servers

```bash
# Terminal 1: Default port
cd codelabs
claat serve

# Terminal 2: Different port
cd codelabs
claat serve -addr localhost:8080

# Terminal 3: Another port
cd codelabs
claat serve -addr localhost:8081
```

### Auto-restart on changes

```bash
# Install nodemon
npm install -g nodemon

# Watch for markdown changes
nodemon --watch codelabs/*.md --exec "cd codelabs && claat export *.md"

# In another terminal, run server
npm run serve
```

## 📝 Best Practices

### Development Workflow

1. **Start server once:**
```bash
npm run serve
```

2. **Keep it running while developing**

3. **Make changes to markdown files**

4. **Re-export when needed:**
```bash
npm run export:single your-codelab.md
```

5. **Refresh browser to see changes**

6. **Stop server when done:**
```bash
npm run stop
```

### Production Deployment

For production, don't use `claat serve`. Instead:

1. **Export all codelabs:**
```bash
npm run export
```

2. **Deploy static files to:**
- GitHub Pages
- Netlify
- Vercel
- AWS S3
- Any web server

3. **No server needed** - Just static HTML!

## 🎯 Quick Reference

| Command | Description |
|---------|-------------|
| `npm run serve` | Start development server |
| `npm run stop` | Stop running server |
| `npm run export` | Export all codelabs |
| `npm run export:single <file>` | Export single codelab |
| `lsof -ti:9090` | Check if port is in use |
| `kill $(lsof -ti:9090)` | Kill process on port |
| `Ctrl+C` | Stop server (keyboard) |

## 💡 Tips

1. **Always stop server before closing terminal**
   - Use `npm run stop` or `Ctrl+C`
   - Prevents orphaned processes

2. **Use npm scripts instead of direct commands**
   - `npm run serve` instead of `claat serve`
   - Easier to remember
   - Consistent across projects

3. **Check server status before starting**
   - Run `lsof -ti:9090` first
   - Prevents "port in use" errors

4. **Keep terminal open while developing**
   - See server logs
   - Easy to stop with `Ctrl+C`

5. **Use different ports for multiple projects**
   - Avoid conflicts
   - Run multiple servers simultaneously

---

**Need help?** Check the main [README.md](README.md) or [QUICKSTART.md](codelabs/QUICKSTART.md)
