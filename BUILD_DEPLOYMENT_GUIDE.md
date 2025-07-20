# Build and Deployment Guide

## Build Issue Resolution

The build error you encountered was caused by the deployment platform (Render) not finding the `vite` package during the build process. This has been resolved with multiple fallback approaches.

## Fixed Build System

### 1. Enhanced Build Script (`scripts/build.js`)
- Added npm install to ensure all dependencies are available
- Uses `./node_modules/.bin/vite` for better path resolution
- Includes fallback error handling
- Creates proper directory structure for deployment

### 2. Bash Build Script (`build.sh`)
- Alternative build approach using bash
- Explicitly installs devDependencies with `--include=dev`
- Uses `npx` commands for better package resolution
- More robust for deployment platforms

### 3. Updated Render Configuration (`render.yaml`)
- Added `NPM_CONFIG_PRODUCTION=false` to ensure devDependencies are installed
- Updated build command to use bash script
- Maintained all existing environment variables

## Build Commands Available

### Local Development
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
```

### Deployment Build Options
```bash
node scripts/build.js    # Enhanced Node.js build script
bash build.sh           # Bash build script (recommended for deployment)
```

## Deployment Platform Setup

### For Render.com
1. Use the `render.yaml` configuration file
2. Build command: `bash build.sh`
3. Start command: `npm start`
4. Required environment variables:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Secret key for JWT tokens
   - `CORS_ORIGIN` - Frontend URL for CORS
   - `NODE_ENV=production`
   - `NPM_CONFIG_PRODUCTION=false` (to install build dependencies)

### For Other Platforms
1. Ensure devDependencies are installed during build
2. Use either build script approach
3. Set `NODE_ENV=production`
4. Ensure build tools (vite, esbuild, typescript) are available

## Build Output Structure
```
dist/
├── index.js          # Main server bundle
├── server/
│   └── index.js      # Server entry point (for package.json start script)
└── public/           # Frontend static assets
    ├── index.html
    └── assets/
        ├── index-[hash].css
        └── index-[hash].js
```

## Common Build Issues and Solutions

### "Cannot find package 'vite'" Error
- **Cause**: Deployment platform not installing devDependencies
- **Solution**: Set `NPM_CONFIG_PRODUCTION=false` in environment variables
- **Alternative**: Use the bash build script which explicitly installs dev dependencies

### Module Resolution Errors
- **Solution**: Use `./node_modules/.bin/` prefix for local package binaries
- **Alternative**: Use `npx` commands in bash script

### Missing Build Dependencies
- **Solution**: Ensure `npm install --include=dev` runs before build
- **Check**: Verify vite, esbuild, and typescript are available

## Testing the Build Locally
```bash
# Clean previous build
rm -rf dist/

# Test Node.js build script
node scripts/build.js

# Or test bash build script
bash build.sh

# Verify output
ls -la dist/
npm start
```

## Build Performance Notes
- Frontend bundle size: ~995KB (consider code splitting for optimization)
- Build time: ~15-20 seconds
- Backend bundle: ~78KB

The build system is now robust and should work across different deployment platforms including Render, Vercel, Railway, and others.