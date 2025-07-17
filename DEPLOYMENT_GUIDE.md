# Deployment Guide

This guide provides step-by-step instructions for deploying the Student Activity Record Platform to various hosting providers.

## 🌐 Deployment Options

### Option 1: Vercel (Recommended for Frontend-heavy apps)

Vercel provides excellent support for full-stack applications with serverless functions.

#### Prerequisites
- Vercel account
- MongoDB Atlas database (free tier available)
- GitHub/GitLab repository

#### Step-by-Step Instructions

1. **Prepare MongoDB Database**
   ```bash
   # Create a MongoDB Atlas account at https://cloud.mongodb.com
   # Create a new cluster (free tier available)
   # Get connection string: mongodb+srv://username:password@cluster.mongodb.net/database
   ```

2. **Deploy to Vercel**
   ```bash
   # Option A: Using Vercel CLI
   npm i -g vercel
   vercel login
   vercel
   
   # Option B: Import from GitHub
   # Visit https://vercel.com/new
   # Connect your repository
   # Vercel will auto-detect the configuration
   ```

3. **Configure Environment Variables**
   
   In Vercel Dashboard → Project Settings → Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.vercel.app
   ```

4. **Verify Deployment**
   - Visit your deployed URL
   - Test login with demo accounts
   - Check that file uploads work
   - Verify API endpoints respond correctly

#### Vercel Configuration Details

The `vercel.json` file configures:
- Build process for both frontend and backend
- API routes under `/api/*`
- Static file serving
- Function timeout settings

### Option 2: Render (Recommended for Backend-heavy apps)

Render provides excellent support for full-stack Node.js applications with persistent storage.

#### Prerequisites
- Render account
- MongoDB Atlas database
- GitHub/GitLab repository

#### Step-by-Step Instructions

1. **Create Web Service**
   ```bash
   # Visit https://dashboard.render.com
   # Click "New +" → "Web Service"
   # Connect your repository
   ```

2. **Configure Build Settings**
   ```
   Name: student-activity-platform
   Environment: Node
   Build Command: npm run build
   Start Command: npm start
   ```

3. **Set Environment Variables**
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
   JWT_SECRET=your-super-secret-jwt-key-min-32-chars
   NODE_ENV=production
   CORS_ORIGIN=https://your-app.onrender.com
   PORT=10000
   ```

4. **Deploy**
   - Render will automatically deploy on push to main branch
   - Monitor build logs for any issues
   - First deployment may take 5-10 minutes

#### Render Configuration Details

The `render.yaml` file configures:
- Web service with Node.js environment
- Automatic database connection
- Environment variable management
- Auto-deploy on git push

### Option 3: Railway

#### Quick Deploy
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login and deploy
railway login
railway deploy
```

#### Environment Variables
```
MONGODB_URI=your-mongodb-connection-string
JWT_SECRET=your-secret-key
NODE_ENV=production
CORS_ORIGIN=https://your-app.railway.app
```

## 🗄 Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**
   - Visit https://cloud.mongodb.com
   - Sign up for free account

2. **Create Cluster**
   - Choose free tier (M0)
   - Select region closest to your users
   - Create cluster (takes 1-3 minutes)

3. **Create Database User**
   - Go to Database Access
   - Add new database user
   - Choose password authentication
   - Grant read/write access

4. **Configure Network Access**
   - Go to Network Access
   - Add IP address: `0.0.0.0/0` (allow access from anywhere)
   - Or add specific deployment provider IPs

5. **Get Connection String**
   - Go to Clusters → Connect
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

### Local MongoDB (Development)

```bash
# Install MongoDB locally
# macOS
brew install mongodb-community

# Ubuntu
sudo apt update
sudo apt install mongodb

# Start MongoDB
mongod

# Connection string for local development
MONGODB_URI=mongodb://localhost:27017/student_activity_db
```

## 🔐 Security Considerations

### Environment Variables
- Never commit `.env` files to git
- Use strong, unique JWT secrets (32+ characters)
- Rotate JWT secrets periodically
- Use different secrets for each environment

### Database Security
- Use MongoDB Atlas with authentication
- Restrict network access to known IPs
- Use strong database passwords
- Enable MongoDB encryption at rest

### File Upload Security
- Current limit: 5MB per file
- Allowed types: PDF, JPG, PNG
- Files stored in `/uploads` directory
- Consider cloud storage (AWS S3, Cloudinary) for production

## 🔧 Troubleshooting

### Common Build Issues

**Issue: "tsx not found"**
```bash
# Solution: Ensure tsx is in dependencies
npm install tsx --save-dev
```

**Issue: "Module not found"**
```bash
# Solution: Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Issue: "CORS errors"**
```bash
# Solution: Update CORS_ORIGIN environment variable
CORS_ORIGIN=https://your-actual-domain.com
```

### Runtime Issues

**Issue: "Database connection failed"**
- Verify MONGODB_URI is correct
- Check database user permissions
- Verify network access settings
- App will fallback to memory storage if database unavailable

**Issue: "JWT token errors"**
- Verify JWT_SECRET is set and 32+ characters
- Check token expiration settings
- Clear browser localStorage and re-login

**Issue: "File upload fails"**
- Check file size (must be < 5MB)
- Verify file type (PDF, JPG, PNG only)
- Ensure uploads directory exists and is writable

### Performance Optimization

**Frontend**
- Enable Vite build optimizations
- Use code splitting for large components
- Optimize images and assets
- Enable browser caching

**Backend**
- Use MongoDB indexes for frequent queries
- Implement query result caching
- Optimize file upload handling
- Use CDN for static assets

## 📊 Monitoring

### Health Checks
- Endpoint: `GET /api/health`
- Returns server status and database connectivity
- Use for uptime monitoring services

### Logging
- Express request logging enabled
- MongoDB connection status logged
- Error logging with stack traces
- Consider external logging services (LogRocket, Sentry)

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor file upload success rates
- Set up alerts for downtime

## 🔄 CI/CD Pipeline

### GitHub Actions Example
```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm test
      - uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
```

### Automated Testing
```bash
# Add to package.json scripts
"test": "jest",
"test:e2e": "playwright test",
"lint": "eslint . --ext .ts,.tsx",
"typecheck": "tsc --noEmit"
```

---

**Need help?** Create an issue in the repository with your deployment platform and error details.