#!/bin/bash

# Quick start script for serving codelabs locally

echo "🚀 Starting Codelabs Server..."
echo ""
echo "📝 Available codelabs:"
echo "  - Getting Started (getting-started)"
echo "  - Web Development Basics (web-dev-basics)"
echo ""
echo "🌐 Server will start at http://localhost:9090"
echo "Press Ctrl+C to stop the server"
echo ""

cd codelabs
go run github.com/googlecodelabs/tools/claat@latest serve
