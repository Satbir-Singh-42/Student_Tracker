#!/usr/bin/env node
import { build } from 'vite';
import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';

console.log('Building Student Activity Record Platform...\n');

// Step 1: Build client
console.log('📦 Building client...');
await build({
  configFile: 'vite.config.ts',
  mode: 'production'
});
console.log('✅ Client build completed\n');

// Step 2: Build server
console.log('🚀 Building server...');
if (!existsSync('dist')) {
  mkdirSync('dist', { recursive: true });
}

execSync('esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/server/index.js', {
  stdio: 'inherit'
});
console.log('✅ Server build completed\n');

console.log('🎉 Build completed successfully!');
console.log('📁 Client build: client/dist/');
console.log('📁 Server build: dist/server/index.js');