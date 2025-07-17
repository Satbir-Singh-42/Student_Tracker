# Vercel Deployment Guide

## Prerequisites

1. Vercel account (free tier available)
2. GitHub repository with your code
3. MongoDB Atlas account or MongoDB instance

## Step 1: Prepare Your Repository

Ensure your repository has:
- `vercel.json` configuration file
- `api/index.ts` serverless function
- `build.js` build script
- Proper deployment structure

## Step 2: Set Up MongoDB Database

### MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Add your IP address to the whitelist (or use 0.0.0.0/0 for Vercel)
4. Get your connection string
5. Example: `mongodb+srv://username:<password>@cluster0.mongodb.net/student_activity_platform`

## Step 3: Deploy to Vercel

### Method 1: Vercel CLI (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Method 2: GitHub Integration
1. Connect your GitHub repository to Vercel
2. Vercel will automatically detect the `vercel.json` file
3. Set environment variables in Vercel dashboard

## Step 4: Environment Variables

Set these in your Vercel project settings:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/student_activity_platform
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://your-app.vercel.app
```

## Step 5: Configure Domain

1. Your app will be available at `https://your-app.vercel.app`
2. Add custom domain in Vercel dashboard (optional)
3. SSL certificates are automatically provided

## Vercel Configuration Details

### vercel.json Structure
```json
{
  "version": 2,
  "buildCommand": "npm run build",
  "outputDirectory": "dist/public",
  "functions": {
    "api/index.ts": {
      "maxDuration": 30
    }
  },
  "routes": [
    {
      "src": "/uploads/(.*)",
      "dest": "/uploads/$1"
    },
    {
      "src": "/api/(.*)",
      "dest": "/api/index.ts"
    },
    {
      "src": "/(.*)",
      "dest": "/dist/public/index.html"
    }
  ]
}
```

## Troubleshooting

### Common Issues

1. **Serverless function timeout**: Increase `maxDuration` in `vercel.json`
2. **Static files not serving**: Check `outputDirectory` path
3. **API routes not working**: Verify `api/index.ts` exists
4. **Database connection fails**: Check MongoDB connection string
5. **CORS errors**: Ensure `CORS_ORIGIN` is set correctly

### File Upload Limitations
- Vercel has a 4.5MB limit for serverless functions
- Consider using external storage (AWS S3, Cloudinary) for file uploads
- Current implementation uses local storage which may not persist

### Logs
- Access logs in Vercel dashboard
- Monitor function execution time
- Check error logs for debugging

## Testing

1. Visit your deployed app
2. Test login with demo accounts:
   - Student: `student@example.com` / `password123`
   - Teacher: `teacher@example.com` / `password123`
   - Admin: `admin@example.com` / `password123`
3. Test API endpoints: `https://your-app.vercel.app/api/health`

## Free Tier Limitations

- 100GB bandwidth per month
- 1000 serverless function invocations per day
- 10s execution time limit
- Consider upgrading for production use

## Performance Optimization

1. **Cold starts**: Serverless functions may have cold start delays
2. **Database connections**: Use connection pooling
3. **Static assets**: Automatically optimized by Vercel
4. **Caching**: Configure appropriate cache headers

## Custom Domain (Optional)

1. Add custom domain in Vercel settings
2. Update DNS records
3. SSL certificates are automatically provided

## Monitoring

- Built-in analytics in Vercel dashboard
- Function execution logs
- Performance metrics
- Error tracking

## Production Considerations

1. **File Storage**: Implement cloud storage for file uploads
2. **Database**: Use MongoDB Atlas with proper connection pooling
3. **Environment Variables**: Use Vercel's environment variable management
4. **Security**: Implement proper rate limiting and security headers