#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('Building frontend...');
execSync('vite build', { stdio: 'inherit' });

console.log('Building backend...');
execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js', { stdio: 'inherit' });

// Create the directory structure that the start script expects
const serverDir = path.join('dist', 'server');
if (!fs.existsSync(serverDir)) {
  fs.mkdirSync(serverDir, { recursive: true });
}

// Copy the built file to the expected location
fs.copyFileSync('dist/index.js', 'dist/server/index.js');

console.log('Build completed! Files created:');
console.log('- dist/index.js (main build)');
console.log('- dist/server/index.js (for package.json start script)');
console.log('- dist/public/ (frontend assets)');