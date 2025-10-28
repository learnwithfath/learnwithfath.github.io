summary: Qiscus Multichannel Widget Integration Guide
id: qiscus-multichannel-widget-integration
categories: Web Development, Customer Support, Chat Integration
tags: qiscus, javascript, widget, chat, multichannel, vanilla-js
status: Published
authors: Qiscus Team
Feedback Link: https://github.com/fathullahqiscus/support-multichannel-widget-embed-version

# Qiscus Multichannel Widget Integration Guide

## Overview
Duration: 2

### What You'll Learn

- How to integrate Qiscus Multichannel Widget into your website
- Configure the widget with your app credentials
- Customize the widget appearance
- Handle user sessions with smart restoration
- Manage resolved conversations intelligently
- Implement advanced features and event handling

### What You'll Need

- A Qiscus Multichannel account and App ID
- Basic knowledge of HTML and JavaScript
- A web server or local development environment
- Modern web browser (Chrome, Firefox, Safari, or Edge)

### What You'll Build

A fully functional customer support chat widget integrated into your website with:

- Real-time messaging
- Smart session restoration with error handling
- Resolved room detection and management
- Custom styling
- Comprehensive event handling
- User management

## Getting Your Qiscus Credentials
Duration: 3

### Step 1: Create a Qiscus Account

1. Visit [Qiscus Multichannel Dashboard](https://multichannel.qiscus.com/)
2. Sign up for a new account or log in
3. Create a new application

### Step 2: Get Your App ID

1. Navigate to your application dashboard
2. Go to **Settings** → **App Information**
3. Copy your **App ID** (you'll need this for integration)
4. Optionally, copy your **Channel ID** for specific channel routing

### Step 3: Configure Your Application

Configure these settings in your dashboard:

- **Application Name**: Your company/product name
- **Avatar**: Upload your company logo
- **Welcome Message**: Set a greeting message
- **Office Hours**: Configure availability times
- **Agent Assignment**: Set up automatic or manual assignment

positive
: Keep your App ID secure and never commit it to public repositories!

## Basic Integration
Duration: 5

### Step 1: Download the Widget Files

Clone or download the widget from GitHub:

```bash
git clone https://github.com/fathullahqiscus/support-multichannel-widget-embed-version.git
cd support-multichannel-widget-embed-version
```

### Step 2: Include Required Files

Add these files to your HTML page in the correct order (including LoggerService):

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website with Qiscus Chat</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    
    <!-- Load Qiscus Widget Services -->
    <script src="services/EventEmitter.js"></script>
    <script src="services/LoggerService.js"></script>
    <script src="services/StorageService.js"></script>
    <script src="services/SDKService.js"></script>
    <script src="services/APIService.js"></script>
    <script src="services/StateManager.js"></script>
    <script src="services/UIService.js"></script>
    <script src="services/ChatService.js"></script>
    <script src="qiscus-widget.js"></script>
</body>
</html>
```

### Step 3: Initialize the Widget

Add this script after loading all files:

```html
<script>
    // Initialize widget with your App ID
    const widget = new QiscusMultichannelWidget({
        appId: 'YOUR_APP_ID', // Replace with your actual App ID
        channelId: 'YOUR_CHANNEL_ID', // Optional
        primaryColor: '#55B29A',
        onReady: (widget) => {
            console.log('Widget is ready!');
        }
    });
</script>
```

negative
: Don't forget to replace `YOUR_APP_ID` with your actual App ID from the dashboard!

## Setting Up User Authentication
Duration: 4

### Configure User Information

Before initiating a chat, you need to set user information:

```javascript
// Set user information
widget.setUser({
    userId: 'customer@example.com',
    displayName: 'John Doe',
    avatarUrl: 'https://ui-avatars.com/api/?name=John+Doe',
    extras: {
        department: 'Sales',
        plan: 'Premium'
    },
    userProperties: {
        customerType: 'VIP',
        registrationDate: '2024-01-01'
    }
});
```

### User Configuration Options

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `userId` | string | Yes | Unique identifier for the user |
| `displayName` | string | Yes | User's display name |
| `avatarUrl` | string | No | URL to user's avatar image |
| `extras` | object | No | Additional user metadata |
| `userProperties` | object | No | Custom user properties |

### Initiate Chat Session

After setting user information, initiate the chat:

```javascript
// Start the chat
widget.initiateChat()
    .then((user) => {
        console.log('Chat initiated for:', user);
    })
    .catch((error) => {
        console.error('Failed to initiate chat:', error);
    });
```

positive
: The widget automatically handles session restoration on page refresh!

## Customizing Widget Appearance
Duration: 3

### Theme Configuration

Customize colors to match your brand:

```javascript
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    primaryColor: '#667eea',
    secondaryColor: '#f0f0f0',
    theme: {
        fontFamily: 'Arial, sans-serif',
        borderRadius: '12px'
    }
});
```

### Custom CSS

You can also customize the widget with CSS:

```css
/* Customize chat button */
.qiscus-chat-button {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
}

/* Customize header */
.qiscus-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

/* Customize message bubbles */
.qiscus-message.right .qiscus-message-bubble {
    background: #667eea;
    border-radius: 18px 18px 4px 18px;
}

.qiscus-message.left .qiscus-message-bubble {
    background: #f5f5f5;
    border-radius: 18px 18px 18px 4px;
}
```

## Handling Chat Events
Duration: 4

### Available Event Callbacks

The widget provides several callbacks for handling events:

```javascript
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    
    // Widget is ready
    onReady: (widget) => {
        console.log('Widget initialized');
    },
    
    // User logged in successfully
    onLoginSuccess: (user) => {
        console.log('User logged in:', user);
        // Update your UI, analytics, etc.
    },
    
    // Login failed
    onLoginError: (error) => {
        console.error('Login failed:', error);
        // Show error message to user
    },
    
    // New message received
    onMessageReceived: (message) => {
        console.log('New message:', message);
        // Show notification, play sound, etc.
    },
    
    // Message sent successfully
    onMessageSent: (message) => {
        console.log('Message sent:', message);
    },
    
    // Room/conversation changed
    onRoomChanged: (room) => {
        console.log('Room changed:', room);
    },
    
    // Agent is typing
    onTyping: (data) => {
        console.log('Typing status:', data);
    }
});
```

### Using Event Emitter

For more granular control, use the event emitter:

```javascript
// Session Events
widget.eventEmitter.on('chat:initiated', (data) => {
    console.log('New chat session created', data);
});

widget.eventEmitter.on('chat:restored', (data) => {
    console.log('Session restored!');
    console.log('User:', data.user);
    console.log('Room:', data.room);
    console.log('Messages:', data.messages.length);
});

widget.eventEmitter.on('chat:error', (error) => {
    console.error('Chat error:', error);
    // Handle session restoration failure
    if (error.message.includes('restore')) {
        widget.clearUser();
    }
});

// Message Events
widget.eventEmitter.on('message:received', (message) => {
    console.log('Message received:', message);
    
    // Show browser notification
    if (Notification.permission === 'granted') {
        new Notification('New message from support', {
            body: message.message,
            icon: '/icon.png'
        });
    }
});

widget.eventEmitter.on('message:sent', (message) => {
    console.log('Message sent successfully', message);
});

// Room Events
widget.eventEmitter.on('room:loaded', (room) => {
    console.log('Room loaded:', room.name);
});

widget.eventEmitter.on('state:unreadChanged', (count) => {
    console.log('Unread messages:', count);
    
    // Update badge in your UI
    document.getElementById('unread-badge').textContent = count;
});

// Authentication Events
widget.eventEmitter.on('sdk:loginSuccess', (user) => {
    console.log('SDK login successful', user);
});

widget.eventEmitter.on('sdk:userSet', (userData) => {
    console.log('User set with token', userData);
});
```

### Available Events

**Session Events:**
- `chat:initiated` - New chat session created
- `chat:restored` - Session restored from localStorage
- `chat:error` - Chat error occurred
- `session:cleared` - Session cleared by user

**Message Events:**
- `message:sent` - Message sent successfully
- `message:received` - New message received
- `sdk:newMessages` - Multiple new messages received
- `state:messageAdded` - Message added to state

**Room Events:**
- `room:loaded` - Room data loaded
- `state:unreadChanged` - Unread message count changed

**Authentication Events:**
- `sdk:loginSuccess` - User logged in to SDK
- `sdk:loginError` - SDK login failed
- `sdk:userSet` - User set with token

## Debug Mode & Logging
Duration: 3

### Enable Debug Mode

For development and troubleshooting, enable debug mode to see detailed logs:

```javascript
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    debugMode: true  // Enable detailed logging
});
```

negative
: Always set `debugMode: false` in production to avoid exposing sensitive information!

### LoggerService

The widget uses a centralized LoggerService for conditional logging:

- **Debug Mode ON**: All logs are shown (development)
- **Debug Mode OFF**: Only errors are logged (production)

### Production Configuration

```javascript
// Production-ready configuration
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    debugMode: false,  // No debug logs (default)
    primaryColor: '#55B29A'
});
```

positive
: Debug mode defaults to `false` for production safety!

## Advanced Features
Duration: 5

### Programmatic Control

Control the widget programmatically:

```javascript
// Open widget
widget.openWidget();

// Close widget
widget.closeWidget();

// Toggle widget
widget.toggleWidget();

// Send message programmatically
widget.sendMessage('Hello from code!');

// Load more messages
widget.loadMoreMessages()
    .then((messages) => {
        console.log('Loaded messages:', messages);
    });

// Update room info (refresh room and messages)
const roomId = widget.stateManager.get('roomId');
const [room, messages] = await widget.updateRoomInfo(roomId);
console.log('Room:', room);
console.log('Messages:', messages.length);

// Clear user session
widget.clearUser();
```

### Integration with Your Authentication System

```javascript
// Example: Integrate with your login system
document.getElementById('login-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const name = document.getElementById('name').value;
    
    // Your authentication logic
    const user = await yourAuthSystem.login(email);
    
    // Set user in Qiscus widget
    widget.setUser({
        userId: user.email,
        displayName: user.name,
        avatarUrl: user.avatar,
        extras: {
            memberId: user.id,
            memberSince: user.createdAt
        }
    });
    
    // Initiate chat
    await widget.initiateChat();
});
```

### Sending Messages with Metadata

```javascript
// Send message with custom metadata
widget.sendMessage('I need help with my order', {
    orderId: '12345',
    orderDate: '2024-10-27',
    orderTotal: 99.99
});
```

## Session Management
Duration: 5

### Smart Session Restoration

The widget automatically saves and restores user sessions with intelligent error handling:

```javascript
// Listen for session restoration
widget.eventEmitter.on('chat:restored', (data) => {
    console.log('Session restored!');
    console.log('User:', data.user);
    console.log('Room:', data.room);
    console.log('Messages:', data.messages.length);
});

// Listen for errors
widget.eventEmitter.on('chat:error', (error) => {
    console.error('Session error:', error);
    // Handle failed restoration
    widget.clearUser();
});
```

### Session Flow

1. **First Visit**: User sets info and initiates chat
2. **Session Saved**: User data, token, and room ID stored in localStorage
3. **Page Refresh**: Widget checks for existing session
4. **Session Restored**: Room and messages automatically loaded
5. **Resolved Rooms**: Intelligent handling based on app configuration

### Resolved Room Handling

The widget intelligently handles resolved conversations:

```javascript
// When a room is marked as resolved:
// 1. Widget checks room.options.is_resolved flag
// 2. If resolved AND app is sessional → creates new session
// 3. If resolved AND app is NOT sessional → restores existing room
// 4. If NOT resolved → always restores existing room

// Check if room is resolved
const isResolved = widget.chatService.checkIfRoomResolved();
console.log('Room resolved:', isResolved);
```

### Session Restoration with Error Handling

```javascript
// initiateChat() automatically handles session restoration
try {
    await widget.initiateChat();
    // Session restored or new session created
} catch (error) {
    console.error('Failed to initiate chat:', error);
    
    // If session restoration fails, clear and retry
    widget.clearUser();
    widget.setUser({ userId: 'user@example.com', displayName: 'John' });
    await widget.initiateChat();
}
```

### Manual Session Control

```javascript
// Clear session manually
widget.clearUser();

// Check session status
const session = widget.storageService.getSession(widget.config.appId);
console.log('Has session:', !!session);

// Update room info manually
const [room, messages] = await widget.updateRoomInfo(roomId);
console.log('Room:', room);
console.log('Messages:', messages.length);
```

positive
: Sessions persist across page refreshes with automatic error recovery!

negative
: If you see "Failed to restore existing session", use widget.clearUser() to reset

## Production Deployment
Duration: 4

### Step 1: Minify and Bundle

For production, minify your JavaScript files:

```bash
# Using Terser (install: npm install -g terser)
terser services/*.js qiscus-widget.js \
  --compress \
  --mangle \
  --output qiscus-widget.min.js
```

### Step 2: CDN Hosting

Host the minified file on a CDN:

```html
<script src="https://cdn.yourcompany.com/qiscus-widget.min.js"></script>
```

### Step 3: Async Loading

Load the widget asynchronously for better performance:

```html
<script>
    (function() {
        const script = document.createElement('script');
        script.src = 'https://cdn.yourcompany.com/qiscus-widget.min.js';
        script.async = true;
        script.onload = function() {
            const widget = new QiscusMultichannelWidget({
                appId: 'YOUR_APP_ID',
                debugMode: false  // Disable debug mode in production
            });
        };
        document.head.appendChild(script);
    })();
</script>
```

### Step 4: Environment Configuration

Use environment variables for different environments:

```javascript
const config = {
    development: {
        appId: 'dev-app-id',
        debugMode: true
    },
    production: {
        appId: 'prod-app-id',
        debugMode: false
    }
};

const env = process.env.NODE_ENV || 'production';
const widget = new QiscusMultichannelWidget(config[env]);
```

positive
: Always disable debug mode in production for security and performance!

## Testing Your Integration
Duration: 3

### Local Testing

1. **Start a local server**:
```bash
# Using Python
python -m http.server 8000

# Or using Node.js
npx http-server -p 8000
```

2. **Open in browser**:
```bash
open http://localhost:8000/index.html
```

3. **Test the widget**:
   - Click the chat button
   - Send a message
   - Refresh the page (test session restoration)
   - Check browser console for logs (if debug mode enabled)

### Browser Compatibility Testing

Test on multiple browsers:

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Testing Checklist

- [ ] Widget appears on page load
- [ ] Chat button is clickable
- [ ] User can send messages
- [ ] Messages are received
- [ ] Session persists on refresh
- [ ] Resolved rooms handled correctly
- [ ] No console errors (except expected ones)
- [ ] Debug mode works correctly
- [ ] Mobile responsive

## Troubleshooting
Duration: 3

### Common Issues and Solutions

#### Widget Not Appearing

**Problem**: Widget doesn't show on page

**Solution**:
```javascript
// Check console for errors
console.log('QiscusMultichannelWidget:', typeof QiscusMultichannelWidget);

// Verify App ID
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    debugMode: true,  // Enable to see logs
    onReady: () => console.log('Widget ready!')
});
```

#### Messages Not Sending

**Problem**: Messages fail to send

**Solution**:
```javascript
// Ensure user is set
if (!widget.userConfig) {
    console.error('User not set. Call setUser() first.');
}

// Check chat is initiated
widget.initiateChat()
    .then(() => widget.sendMessage('Test'))
    .catch(error => console.error('Error:', error));
```

#### Session Not Persisting

**Problem**: Session doesn't restore on refresh

**Solution**:
```javascript
// Check localStorage
if (typeof(Storage) === "undefined") {
    console.error('localStorage not supported');
}

// Check stored session
const session = localStorage.getItem('QiscusWidget::last-user-data');
console.log('Stored session:', session);
```

#### Session Restoration Failed

**Problem**: Error: "Failed to restore existing session"

**Solution**:
```javascript
// Clear the session and try again
widget.clearUser();
widget.setUser({ userId: 'user@example.com', displayName: 'John' });
await widget.initiateChat();

// Or manually clear localStorage
Object.keys(localStorage)
    .filter(key => key.startsWith('QiscusWidget::'))
    .forEach(key => localStorage.removeItem(key));
```

#### Debug Mode Issues

**Problem**: Too many logs in production

**Solution**:
```javascript
// Ensure debug mode is disabled
const widget = new QiscusMultichannelWidget({
    appId: 'YOUR_APP_ID',
    debugMode: false  // Must be false in production
});
```

## Best Practices
Duration: 2

### Security

1. **Never expose sensitive data**:
```javascript
// ❌ Bad
const widget = new QiscusMultichannelWidget({
    appId: 'my-secret-app-id', // Don't hardcode
    apiKey: 'secret-key' // Never expose API keys
});

// ✅ Good
const widget = new QiscusMultichannelWidget({
    appId: process.env.QISCUS_APP_ID // Use environment variables
});
```

2. **Validate user input**:
```javascript
// Sanitize user input before sending
function sanitizeMessage(text) {
    return text.trim().replace(/<script>/gi, '');
}

widget.sendMessage(sanitizeMessage(userInput));
```

### Performance

1. **Lazy load the widget**:
```javascript
// Load widget only when needed
document.getElementById('chat-button').addEventListener('click', () => {
    if (!window.qiscusWidget) {
        loadQiscusWidget().then(() => {
            window.qiscusWidget.openWidget();
        });
    }
});
```

2. **Limit message history**:
```javascript
// Load only recent messages
widget.loadMoreMessages(20); // Limit to 20 messages
```

### User Experience

1. **Show loading states**:
```javascript
widget.eventEmitter.on('chat:initiated', () => {
    hideLoadingSpinner();
    showChatInterface();
});
```

2. **Handle errors gracefully**:
```javascript
widget.eventEmitter.on('chat:error', (error) => {
    showUserFriendlyError('Unable to connect. Please try again.');
    logErrorToMonitoring(error);
});
```

3. **Provide feedback**:
```javascript
widget.eventEmitter.on('message:sent', () => {
    showSuccessToast('Message sent!');
});
```

## Complete Example
Duration: 5

Here's a complete, production-ready example:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Website with Qiscus Chat</title>
    <style>
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            margin: 0;
            padding: 20px;
        }
        .notification {
            position: fixed;
            top: 20px;
            right: 20px;
            background: #4CAF50;
            color: white;
            padding: 15px;
            border-radius: 5px;
            display: none;
        }
    </style>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>Need help? Click the chat button in the bottom right corner!</p>
    
    <div id="notification" class="notification"></div>
    
    <!-- Load Qiscus Widget Services -->
    <script src="services/EventEmitter.js"></script>
    <script src="services/LoggerService.js"></script>
    <script src="services/StorageService.js"></script>
    <script src="services/SDKService.js"></script>
    <script src="services/APIService.js"></script>
    <script src="services/StateManager.js"></script>
    <script src="services/UIService.js"></script>
    <script src="services/ChatService.js"></script>
    <script src="qiscus-widget.js"></script>
    
    <script>
        // Initialize widget
        const widget = new QiscusMultichannelWidget({
            appId: 'your-app-id',
            channelId: '127590',
            primaryColor: '#667eea',
            debugMode: false,  // Disable in production
            
            // Callbacks
            onReady: (w) => {
                console.log('Widget ready!');
                showNotification('Chat is ready!', 'success');
            },
            
            onLoginSuccess: (user) => {
                console.log('Login success:', user.username);
                showNotification(`Welcome, ${user.username}!`, 'success');
            },
            
            onLoginError: (error) => {
                console.error('Login error:', error);
                showNotification('Failed to connect to chat', 'error');
            },
            
            onMessageReceived: (message) => {
                console.log('New message:', message.message);
                showNotification('New message received!', 'info');
                
                // Show browser notification
                if (Notification.permission === 'granted') {
                    new Notification('New message from support', {
                        body: message.message,
                        icon: '/icon.png'
                    });
                }
            },
            
            onMessageSent: (message) => {
                console.log('Message sent:', message.message);
            },
            
            onRoomChanged: (room) => {
                console.log('Room changed:', room);
            },
            
            onTyping: (data) => {
                console.log('Typing:', data.typing);
            }
        });
        
        // Set user information (get from your auth system)
        const currentUser = getCurrentUser(); // Your function
        
        if (currentUser) {
            widget.setUser({
                userId: currentUser.email,
                displayName: currentUser.name,
                avatarUrl: currentUser.avatar,
                extras: {
                    userId: currentUser.id,
                    plan: currentUser.plan
                }
            });
            
            // Initiate chat
            widget.initiateChat()
                .then((user) => {
                    console.log('Chat initiated for:', user);
                })
                .catch((error) => {
                    console.error('Failed to initiate chat:', error);
                    // Handle error - maybe clear session and retry
                    if (error.message.includes('restore')) {
                        widget.clearUser();
                        showNotification('Please refresh and try again', 'error');
                    }
                });
        }
        
        // Listen to events
        widget.eventEmitter.on('chat:restored', (data) => {
            console.log('Session restored:', data.user);
            showNotification('Welcome back!', 'success');
        });
        
        widget.eventEmitter.on('chat:error', (error) => {
            console.error('Chat error:', error);
            showNotification('Chat error occurred', 'error');
        });
        
        widget.eventEmitter.on('state:unreadChanged', (count) => {
            console.log('Unread messages:', count);
            updateUnreadBadge(count);
        });
        
        // Helper functions
        function showNotification(message, type) {
            const notification = document.getElementById('notification');
            notification.textContent = message;
            notification.style.background = type === 'error' ? '#f44336' : 
                                           type === 'success' ? '#4CAF50' : '#2196F3';
            notification.style.display = 'block';
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }
        
        function getCurrentUser() {
            // Replace with your actual auth system
            return {
                email: 'customer@example.com',
                name: 'John Doe',
                avatar: 'https://ui-avatars.com/api/?name=John+Doe',
                id: '12345',
                plan: 'Premium'
            };
        }
        
        function updateUnreadBadge(count) {
            // Update your UI with unread count
            const badge = document.getElementById('unread-badge');
            if (badge) {
                badge.textContent = count;
                badge.style.display = count > 0 ? 'block' : 'none';
            }
        }
        
        // Request notification permission
        if ('Notification' in window && Notification.permission === 'default') {
            Notification.requestPermission();
        }
    </script>
</body>
</html>
```

## Next Steps
Duration: 1

### Congratulations! 🎉

You've successfully integrated the Qiscus Multichannel Widget into your website!

### What's Next?

**Explore More Features:**
- [API Documentation](https://github.com/fathullahqiscus/support-multichannel-widget-embed-version/blob/main/API_DOCUMENTATION.md)
- [GitHub Repository](https://github.com/fathullahqiscus/support-multichannel-widget-embed-version)
- [Qiscus Dashboard](https://multichannel.qiscus.com/)

**Customize Further:**
- Adjust colors and styling to match your brand
- Implement custom event handlers
- Add analytics tracking
- Integrate with your CRM system

**Production Deployment:**
- Minify and bundle your code
- Set up CDN hosting
- Configure environment variables
- Enable error tracking (Sentry, LogRocket, etc.)

**Get Support:**
- 📧 Email: support@qiscus.com
- 💬 Chat: Use the widget on [qiscus.com](https://qiscus.com)
- 🐛 Issues: [GitHub Issues](https://github.com/fathullahqiscus/support-multichannel-widget-embed-version/issues)

positive
: Remember to disable debug mode in production for security and performance!

### Resources

- [Qiscus Multichannel Dashboard](https://multichannel.qiscus.com/)
- [API Documentation](./API_DOCUMENTATION.md)
- [GitHub Repository](https://github.com/fathullahqiscus/support-multichannel-widget-embed-version)
- [Example Implementation](./index.html)

---

Made with ❤️ by Qiscus Team
