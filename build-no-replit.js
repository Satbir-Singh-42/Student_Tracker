import { build } from 'vite';
import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Clean Vite config without Replit dependencies
const cleanViteConfig = {
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "client", "src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "dist/public"),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, "client", "index.html")
    }
  },
  define: {
    'process.env.NODE_ENV': JSON.stringify('production')
  }
};

console.log('Building frontend...');
try {
  await build(cleanViteConfig);
  console.log('Frontend build completed');
  
  // Build backend
  console.log('Building backend...');
  const esbuildProcess = spawn('npx', [
    'esbuild', 
    'server/index.ts', 
    '--platform=node', 
    '--packages=external', 
    '--bundle', 
    '--format=esm', 
    '--outfile=dist/index.js'
  ], { stdio: 'inherit' });
  
  esbuildProcess.on('close', (code) => {
    if (code === 0) {
      console.log('Backend build completed');
      console.log('Build process finished successfully');
    } else {
      console.error('Backend build failed');
      process.exit(1);
    }
  });
} catch (error) {
  console.error('Frontend build failed:', error);
  process.exit(1);
}