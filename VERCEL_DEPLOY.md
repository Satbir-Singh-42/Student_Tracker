# Vercel Deployment Guide

## Quick Deploy to Vercel

### Prerequisites
- Vercel account (free tier available)
- MongoDB Atlas database
- GitHub/GitLab repository

### Step 1: Prepare MongoDB Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create database user with read/write permissions
4. Set network access to `0.0.0.0/0` (allow all IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Step 2: Deploy to Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your repository
3. Vercel auto-detects the configuration
4. Add environment variables (see below)
5. Deploy

### Step 3: Configure Environment Variables

In Vercel Dashboard → Project Settings → Environment Variables:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
CORS_ORIGIN=https://your-app.vercel.app
```

### Step 4: Verify Deployment

1. Visit your deployment URL
2. Test the health endpoint: `https://your-app.vercel.app/api/health`
3. Login with demo accounts:
   - Student: `student@example.com` / `password123`
   - Teacher: `teacher@example.com` / `password123`
   - Admin: `admin@example.com` / `password123`

## Configuration Details

### Vercel.json Configuration
The `vercel.json` file is configured for:
- Serverless function deployment
- Static file serving from `dist/public`
- API routes under `/api/*`
- File upload handling
- 30-second function timeout

### Build Process
1. Frontend builds to `dist/public` using Vite
2. Backend bundles to `dist/index.js` using esbuild
3. Vercel serves static files and serverless functions

### File Structure After Build
```
dist/
├── public/           # Frontend assets (served statically)
│   ├── index.html
│   └── assets/
├── index.js          # Backend serverless function
└── uploads/          # User uploaded files
```

## Troubleshooting

### Common Issues

**Build fails**
- Check that all dependencies are in `package.json`
- Verify TypeScript compiles without errors
- Ensure build command runs locally

**API routes not working**
- Verify environment variables are set
- Check function logs in Vercel dashboard
- Ensure CORS_ORIGIN matches your domain

**Database connection fails**
- Verify MongoDB URI format
- Check network access settings in MongoDB Atlas
- Test connection string locally

**File uploads not working**
- Vercel has 50MB limit for serverless functions
- Consider using external file storage (Cloudinary, AWS S3)
- Current limit is 5MB per file

### Vercel Limits (Free Tier)
- Function execution: 10 seconds
- Function size: 50MB
- Bandwidth: 100GB/month
- Deployments: Unlimited

## Production Optimization

### Performance
- Enable compression in Express
- Use CDN for static assets
- Optimize bundle size with code splitting

### Security
- Use strong JWT secrets
- Enable HTTPS only
- Validate all inputs
- Sanitize file uploads

### Monitoring
- Enable Vercel Analytics
- Set up error tracking
- Monitor function execution times
- Track API response times

## Next Steps

After successful deployment:
1. Set up custom domain (optional)
2. Configure SSL certificate (automatic)
3. Set up monitoring and alerts
4. Plan database backups
5. Document deployment process for team

---

**Need Help?** Check the Vercel documentation or create an issue in the repository.