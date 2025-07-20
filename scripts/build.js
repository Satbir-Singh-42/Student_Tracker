#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🏗️  Starting production build...');

try {
  // Set NODE_ENV for production build
  process.env.NODE_ENV = 'production';
  
  console.log('📦 Installing dependencies...');
  execSync('npm ci --include=dev', { stdio: 'inherit' });

  console.log('🎨 Building frontend with Vite...');
  // Use production config if in production environment
  const viteConfig = process.env.RENDER ? 'vite.config.production.ts' : 'vite.config.ts';
  execSync(`npx vite build --config ${viteConfig}`, { stdio: 'inherit' });

  console.log('⚙️  Building backend with esbuild...');
  execSync('npx esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js', { stdio: 'inherit' });

  // Create the directory structure that the start script expects
  const serverDir = path.join('dist', 'server');
  if (!fs.existsSync(serverDir)) {
    fs.mkdirSync(serverDir, { recursive: true });
  }

  // Copy the built file to the expected location
  if (fs.existsSync('dist/index.js')) {
    fs.copyFileSync('dist/index.js', 'dist/server/index.js');
  }

  console.log('✅ Build completed successfully!');
  console.log('📁 Generated files:');
  
  if (fs.existsSync('dist/index.js')) {
    const stats = fs.statSync('dist/index.js');
    console.log(`   - dist/index.js (${Math.round(stats.size / 1024)}KB)`);
  }
  
  if (fs.existsSync('dist/server/index.js')) {
    console.log('   - dist/server/index.js (server entry)');
  }
  
  if (fs.existsSync('dist/public')) {
    const files = fs.readdirSync('dist/public');
    console.log(`   - dist/public/ (${files.length} frontend files)`);
  }

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}