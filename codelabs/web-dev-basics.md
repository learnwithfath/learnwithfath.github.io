author: Your Name
summary: Learn the fundamentals of web development with HTML, CSS, and JavaScript
id: web-dev-basics
categories: web,html,css,javascript,beginner
environments: Web
status: Published
feedback link: https://github.com/yourusername/feedback
analytics account: 0

# Web Development Basics

## Introduction
Duration: 0:02:00

Welcome to Web Development Basics! In this tutorial, you'll learn the three core technologies that power the web.

### What You'll Build
By the end of this tutorial, you'll create a simple interactive webpage with:
* Structured content (HTML)
* Beautiful styling (CSS)
* Interactive features (JavaScript)

### Prerequisites
* A text editor (VS Code recommended)
* A web browser
* Basic computer skills

Positive
: No prior programming experience needed! We'll start from scratch.

## Understanding HTML
Duration: 0:10:00

HTML (HyperText Markup Language) is the backbone of web pages. It defines the structure and content.

### Basic HTML Structure
Every HTML document follows this basic structure:

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My First Webpage</title>
</head>
<body>
    <h1>Welcome to My Website</h1>
    <p>This is my first paragraph.</p>
</body>
</html>
```

### Common HTML Elements
Here are the most frequently used HTML tags:

**Headings:**
```html
<h1>Main Heading</h1>
<h2>Subheading</h2>
<h3>Smaller Heading</h3>
```

**Paragraphs and Text:**
```html
<p>This is a paragraph.</p>
<strong>Bold text</strong>
<em>Italic text</em>
```

**Lists:**
```html
<ul>
    <li>Unordered item 1</li>
    <li>Unordered item 2</li>
</ul>

<ol>
    <li>Ordered item 1</li>
    <li>Ordered item 2</li>
</ol>
```

**Links and Images:**
```html
<a href="https://www.example.com">Click here</a>
<img src="image.jpg" alt="Description">
```

### Try It Yourself
1. Create a file named `index.html`
2. Copy the basic HTML structure above
3. Add your own content
4. Open it in your browser

Positive
: You've created your first HTML page!

## Styling with CSS
Duration: 0:12:00

CSS (Cascading Style Sheets) makes your webpage beautiful by controlling colors, fonts, layouts, and more.

### Adding CSS to HTML
There are three ways to add CSS:

**1. Inline CSS:**
```html
<p style="color: blue;">This text is blue</p>
```

**2. Internal CSS:**
```html
<head>
    <style>
        p {
            color: blue;
        }
    </style>
</head>
```

**3. External CSS (Recommended):**
```html
<head>
    <link rel="stylesheet" href="styles.css">
</head>
```

### CSS Selectors
Target HTML elements using selectors:

```css
/* Element selector */
p {
    color: #333;
    font-size: 16px;
}

/* Class selector */
.highlight {
    background-color: yellow;
}

/* ID selector */
#header {
    background-color: #4285f4;
    padding: 20px;
}

/* Multiple selectors */
h1, h2, h3 {
    font-family: Arial, sans-serif;
}
```

### Common CSS Properties
Here are essential CSS properties:

```css
.container {
    /* Colors */
    color: #333;
    background-color: #f5f5f5;
    
    /* Spacing */
    margin: 20px;
    padding: 15px;
    
    /* Typography */
    font-size: 16px;
    font-weight: bold;
    text-align: center;
    
    /* Box model */
    width: 80%;
    height: 200px;
    border: 1px solid #ddd;
    border-radius: 8px;
    
    /* Display */
    display: flex;
    justify-content: center;
    align-items: center;
}
```

### Create Your Stylesheet
Create a file named `styles.css`:

```css
body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    line-height: 1.6;
    margin: 0;
    padding: 20px;
    background-color: #f4f4f4;
}

.container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

h1 {
    color: #4285f4;
    border-bottom: 3px solid #4285f4;
    padding-bottom: 10px;
}

button {
    background-color: #4285f4;
    color: white;
    padding: 12px 24px;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
}

button:hover {
    background-color: #357ae8;
}
```

Negative
: Remember to link your CSS file in the HTML `<head>` section!

## Adding Interactivity with JavaScript
Duration: 0:15:00

JavaScript brings your webpage to life with interactivity and dynamic behavior.

### Including JavaScript
Add JavaScript to your HTML:

```html
<body>
    <!-- Your HTML content -->
    
    <script src="script.js"></script>
</body>
```

### JavaScript Basics
Learn fundamental JavaScript concepts:

**Variables:**
```javascript
// Modern way to declare variables
let name = "John";
const age = 25;
var oldWay = "avoid using var";

// Different data types
let number = 42;
let text = "Hello";
let isTrue = true;
let items = [1, 2, 3];
let person = { name: "Alice", age: 30 };
```

**Functions:**
```javascript
// Function declaration
function greet(name) {
    return `Hello, ${name}!`;
}

// Arrow function (modern)
const greet = (name) => {
    return `Hello, ${name}!`;
};

// Shorter arrow function
const greet = (name) => `Hello, ${name}!`;

// Using the function
console.log(greet("World"));
```

**DOM Manipulation:**
```javascript
// Select elements
const button = document.getElementById('myButton');
const heading = document.querySelector('h1');
const allParagraphs = document.querySelectorAll('p');

// Change content
heading.textContent = 'New Heading';
heading.innerHTML = '<span>New HTML Content</span>';

// Change styles
heading.style.color = 'blue';
heading.style.fontSize = '32px';

// Add/remove classes
heading.classList.add('highlight');
heading.classList.remove('highlight');
heading.classList.toggle('active');
```

**Event Listeners:**
```javascript
// Click event
button.addEventListener('click', function() {
    alert('Button clicked!');
});

// Modern arrow function syntax
button.addEventListener('click', () => {
    console.log('Button clicked!');
});

// Form submission
const form = document.querySelector('form');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    console.log('Form submitted!');
});
```

### Create an Interactive Counter
Create `script.js`:

```javascript
// Wait for DOM to load
document.addEventListener('DOMContentLoaded', () => {
    let count = 0;
    
    const counterDisplay = document.getElementById('counter');
    const incrementBtn = document.getElementById('increment');
    const decrementBtn = document.getElementById('decrement');
    const resetBtn = document.getElementById('reset');
    
    // Update display
    function updateDisplay() {
        counterDisplay.textContent = count;
        
        // Change color based on value
        if (count > 0) {
            counterDisplay.style.color = 'green';
        } else if (count < 0) {
            counterDisplay.style.color = 'red';
        } else {
            counterDisplay.style.color = 'black';
        }
    }
    
    // Event listeners
    incrementBtn.addEventListener('click', () => {
        count++;
        updateDisplay();
    });
    
    decrementBtn.addEventListener('click', () => {
        count--;
        updateDisplay();
    });
    
    resetBtn.addEventListener('click', () => {
        count = 0;
        updateDisplay();
    });
});
```

Positive
: JavaScript makes your webpage interactive and responsive to user actions!

## Building Your First Project
Duration: 0:20:00

Let's combine HTML, CSS, and JavaScript to build a complete interactive webpage.

### Project: Interactive Task List

**index.html:**
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>My Task List</title>
    <link rel="stylesheet" href="styles.css">
</head>
<body>
    <div class="container">
        <h1>📝 My Task List</h1>
        
        <div class="input-section">
            <input type="text" id="taskInput" placeholder="Enter a new task...">
            <button id="addBtn">Add Task</button>
        </div>
        
        <ul id="taskList"></ul>
        
        <div class="stats">
            <p>Total tasks: <span id="totalTasks">0</span></p>
            <p>Completed: <span id="completedTasks">0</span></p>
        </div>
    </div>
    
    <script src="script.js"></script>
</body>
</html>
```

**styles.css:**
```css
* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
}

.container {
    background: white;
    border-radius: 15px;
    padding: 30px;
    box-shadow: 0 10px 40px rgba(0,0,0,0.2);
    max-width: 500px;
    width: 100%;
}

h1 {
    color: #333;
    margin-bottom: 25px;
    text-align: center;
}

.input-section {
    display: flex;
    gap: 10px;
    margin-bottom: 20px;
}

#taskInput {
    flex: 1;
    padding: 12px;
    border: 2px solid #ddd;
    border-radius: 8px;
    font-size: 16px;
}

#taskInput:focus {
    outline: none;
    border-color: #667eea;
}

#addBtn {
    padding: 12px 24px;
    background: #667eea;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    font-size: 16px;
    transition: background 0.3s;
}

#addBtn:hover {
    background: #5568d3;
}

#taskList {
    list-style: none;
    margin-bottom: 20px;
}

.task-item {
    background: #f8f9fa;
    padding: 15px;
    margin-bottom: 10px;
    border-radius: 8px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    transition: all 0.3s;
}

.task-item:hover {
    transform: translateX(5px);
    box-shadow: 0 2px 8px rgba(0,0,0,0.1);
}

.task-item.completed {
    opacity: 0.6;
    text-decoration: line-through;
}

.task-text {
    flex: 1;
    cursor: pointer;
}

.delete-btn {
    background: #e74c3c;
    color: white;
    border: none;
    padding: 8px 12px;
    border-radius: 5px;
    cursor: pointer;
    transition: background 0.3s;
}

.delete-btn:hover {
    background: #c0392b;
}

.stats {
    text-align: center;
    padding-top: 20px;
    border-top: 2px solid #eee;
    color: #666;
}

.stats p {
    margin: 5px 0;
}

.stats span {
    font-weight: bold;
    color: #667eea;
}
```

**script.js:**
```javascript
document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('taskInput');
    const addBtn = document.getElementById('addBtn');
    const taskList = document.getElementById('taskList');
    const totalTasksSpan = document.getElementById('totalTasks');
    const completedTasksSpan = document.getElementById('completedTasks');
    
    let tasks = [];
    
    // Add task
    function addTask() {
        const taskText = taskInput.value.trim();
        
        if (taskText === '') {
            alert('Please enter a task!');
            return;
        }
        
        const task = {
            id: Date.now(),
            text: taskText,
            completed: false
        };
        
        tasks.push(task);
        taskInput.value = '';
        renderTasks();
    }
    
    // Toggle task completion
    function toggleTask(id) {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }
    
    // Delete task
    function deleteTask(id) {
        tasks = tasks.filter(t => t.id !== id);
        renderTasks();
    }
    
    // Render tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            
            const span = document.createElement('span');
            span.className = 'task-text';
            span.textContent = task.text;
            span.onclick = () => toggleTask(task.id);
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'delete-btn';
            deleteBtn.textContent = 'Delete';
            deleteBtn.onclick = () => deleteTask(task.id);
            
            li.appendChild(span);
            li.appendChild(deleteBtn);
            taskList.appendChild(li);
        });
        
        updateStats();
    }
    
    // Update statistics
    function updateStats() {
        totalTasksSpan.textContent = tasks.length;
        completedTasksSpan.textContent = tasks.filter(t => t.completed).length;
    }
    
    // Event listeners
    addBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    });
});
```

### Test Your Project
1. Create all three files in the same folder
2. Open `index.html` in your browser
3. Try adding, completing, and deleting tasks
4. Watch the statistics update automatically!

Positive
: Congratulations! You've built a fully functional web application!

## Best Practices
Duration: 0:08:00

### HTML Best Practices
* Use semantic HTML elements (`<header>`, `<nav>`, `<main>`, `<footer>`)
* Always include `alt` attributes for images
* Use proper heading hierarchy (h1 → h2 → h3)
* Validate your HTML

### CSS Best Practices
* Use external stylesheets
* Follow a naming convention (BEM, SMACSS)
* Keep specificity low
* Use CSS variables for colors and spacing
* Make your design responsive

```css
:root {
    --primary-color: #667eea;
    --secondary-color: #764ba2;
    --spacing: 20px;
}

.button {
    background-color: var(--primary-color);
    padding: var(--spacing);
}
```

### JavaScript Best Practices
* Use `const` and `let` instead of `var`
* Write descriptive variable and function names
* Keep functions small and focused
* Comment complex logic
* Handle errors gracefully

```javascript
// Good
const calculateTotal = (items) => {
    return items.reduce((sum, item) => sum + item.price, 0);
};

// Bad
var x = (a) => { return a.reduce((b,c) => b + c.p, 0); };
```

Negative
: Avoid inline styles and scripts in production code!

## Next Steps
Duration: 0:03:00

### Continue Learning
Now that you know the basics, explore:
* **Responsive Design** - Make sites work on all devices
* **CSS Flexbox & Grid** - Advanced layouts
* **JavaScript ES6+** - Modern JavaScript features
* **APIs and Fetch** - Connect to external data
* **React or Vue** - Modern JavaScript frameworks

### Resources
* [MDN Web Docs](https://developer.mozilla.org) - Comprehensive web documentation
* [CSS-Tricks](https://css-tricks.com) - CSS tutorials and tips
* [JavaScript.info](https://javascript.info) - Modern JavaScript tutorial
* [freeCodeCamp](https://www.freecodecamp.org) - Free coding courses

### Build Projects
The best way to learn is by building:
1. Personal portfolio website
2. Weather app using an API
3. Calculator
4. Quiz application
5. Blog with comments

Positive
: Keep coding, keep learning, and most importantly - have fun! 🚀

## Summary
Duration: 0:01:00

### What You Learned
* ✅ HTML structure and common elements
* ✅ CSS styling and selectors
* ✅ JavaScript basics and DOM manipulation
* ✅ Building an interactive web application
* ✅ Best practices for web development

### Your Achievement
You've completed Web Development Basics and built a real working application!

Keep practicing and building. Every expert was once a beginner. Happy coding! 💻
