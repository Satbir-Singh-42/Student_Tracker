#!/bin/bash

# Build script for deployment platforms
echo "🏗️  Building Student Activity Platform..."

# Install dependencies if not already installed
if [ ! -d "node_modules" ]; then
  echo "📦 Installing dependencies..."
  npm install
fi

# Build frontend
echo "🎨 Building frontend..."
npm run check
vite build

# Build backend
echo "⚙️  Building backend..."
esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

# Create uploads directory in dist
echo "📁 Setting up upload directory..."
mkdir -p dist/uploads

# Copy any existing uploads
if [ -d "uploads" ]; then
  cp -r uploads/* dist/uploads/ 2>/dev/null || true
fi

echo "✅ Build completed successfully!"
echo "📍 Frontend built to: dist/public"
echo "📍 Backend built to: dist/index.js"
echo "📍 Upload directory: dist/uploads"