#!/bin/bash

# Build script for deployment platforms
set -e

echo "Installing all dependencies (including devDependencies)..."
npm install --include=dev

echo "Building frontend..."
npx vite build

echo "Building backend..."
npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js

echo "Setting up server directory structure..."
mkdir -p dist/server
cp dist/index.js dist/server/index.js

echo "Build completed successfully!"
echo "Frontend assets: dist/public/"
echo "Backend bundle: dist/index.js"
echo "Server entry: dist/server/index.js"