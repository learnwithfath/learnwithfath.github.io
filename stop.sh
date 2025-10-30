#!/bin/bash

# Script to stop the running Codelabs server

echo "🛑 Stopping Codelabs Server..."
echo ""

# Find and kill processes running on port 9090
PORT=9090
PIDS=$(lsof -ti:$PORT 2>/dev/null)

if [ -z "$PIDS" ]; then
    echo "ℹ️  No server running on port $PORT"
    echo ""
    
    # Also check for claat serve processes
    CLAAT_PIDS=$(pgrep -f "claat.*serve" 2>/dev/null)
    
    if [ -z "$CLAAT_PIDS" ]; then
        echo "✅ No Codelabs server processes found"
    else
        echo "🔍 Found claat serve processes: $CLAAT_PIDS"
        echo "🛑 Stopping claat serve processes..."
        kill $CLAAT_PIDS 2>/dev/null
        sleep 1
        
        # Force kill if still running
        if pgrep -f "claat.*serve" > /dev/null; then
            echo "⚠️  Force stopping..."
            kill -9 $(pgrep -f "claat.*serve") 2>/dev/null
        fi
        
        echo "✅ Claat serve processes stopped"
    fi
else
    echo "🔍 Found processes on port $PORT: $PIDS"
    echo "🛑 Stopping processes..."
    
    # Try graceful shutdown first
    kill $PIDS 2>/dev/null
    sleep 2
    
    # Check if still running
    REMAINING=$(lsof -ti:$PORT 2>/dev/null)
    if [ ! -z "$REMAINING" ]; then
        echo "⚠️  Force stopping remaining processes..."
        kill -9 $REMAINING 2>/dev/null
    fi
    
    echo "✅ Server stopped successfully"
fi

echo ""
echo "📊 Port $PORT is now free"
echo ""
echo "💡 To start the server again, run: npm run serve"
echo ""
