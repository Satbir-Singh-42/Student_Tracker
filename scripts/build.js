#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

try {
  console.log('Installing build dependencies...');
  // Ensure all build dependencies are available
  execSync('npm install', { stdio: 'inherit' });

  console.log('Building frontend...');
  // Use the existing vite command from the project
  execSync('./node_modules/.bin/vite build', { stdio: 'inherit' });

  console.log('Building backend...');
  execSync('./node_modules/.bin/esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js', { stdio: 'inherit' });

  // Create the directory structure that the start script expects
  const serverDir = path.join('dist', 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  // Copy the built file to the expected location if it doesn't already exist there
  if (fs.existsSync('dist/index.js') && !fs.existsSync('dist/server/index.js')) {
    fs.copyFileSync('dist/index.js', 'dist/server/index.js');
  }

  console.log('Build completed! Files created:');
  if (fs.existsSync('dist/index.js')) {
    console.log('- dist/index.js (main build)');
  }
  if (fs.existsSync('dist/server/index.js')) {
    console.log('- dist/server/index.js (for package.json start script)');
  }
  if (fs.existsSync('dist/public')) {
    console.log('- dist/public/ (frontend assets)');
  }
} catch (error) {
  console.error('Build failed:', error.message);
  
  // Fallback: try using the original vite build command directly
  console.log('Attempting fallback build...');
  try {
    execSync('vite build', { stdio: 'inherit', cwd: process.cwd() });
    execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js', { stdio: 'inherit' });
    
    const serverDir = path.join('dist', 'server');
    if (!fs.existsSync(serverDir)) {
      fs.mkdirSync(serverDir, { recursive: true });
    }
    fs.copyFileSync('dist/index.js', 'dist/server/index.js');
    
    console.log('Fallback build completed successfully!');
  } catch (fallbackError) {
    console.error('Fallback build also failed:', fallbackError.message);
    process.exit(1);
  }
}