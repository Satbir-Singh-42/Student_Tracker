# Render Deployment Guide

## Quick Deploy to Render

### Prerequisites
- Render account (free tier available)
- MongoDB Atlas database
- GitHub/GitLab repository

### Step 1: Prepare MongoDB Database
1. Go to [MongoDB Atlas](https://cloud.mongodb.com)
2. Create a free cluster (M0)
3. Create database user with read/write permissions
4. Set network access to `0.0.0.0/0` (allow all IPs)
5. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/database`

### Step 2: Deploy to Render

1. Go to [render.com](https://render.com)
2. Connect your GitHub/GitLab account
3. Click "New +" → "Web Service"
4. Select your repository
5. Configure the service:
   ```
   Name: student-activity-platform
   Environment: Node
   Region: Choose closest to your users
   Branch: main
   Build Command: npm run build
   Start Command: npm start
   ```

### Step 3: Configure Environment Variables

In Render Dashboard → Environment:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
NODE_ENV=production
CORS_ORIGIN=https://your-app.onrender.com
PORT=10000
```

### Step 4: Deploy and Verify

1. Click "Create Web Service"
2. Monitor build logs for any issues
3. Wait for deployment (usually 5-10 minutes)
4. Test the health endpoint: `https://your-app.onrender.com/api/health`
5. Login with demo accounts:
   - Student: `student@example.com` / `password123`
   - Teacher: `teacher@example.com` / `password123` 
   - Admin: `admin@example.com` / `password123`

## Configuration Details

### Render.yaml Configuration
The `render.yaml` file configures:
- Node.js web service
- Automatic health checks
- Environment variable management
- Free tier deployment

### Build Process
1. Render runs `npm install`
2. Executes `npm run build`
3. Starts service with `npm start`
4. Serves on port 10000

### File Structure
```
Server serves both:
├── API routes at /api/*
├── Static files from dist/public/
└── File uploads at /uploads/*
```

## Render Features

### Automatic Features
- SSL certificate (HTTPS)
- Health checks at `/api/health`
- Auto-deploy on git push
- Environment variable management
- Log aggregation

### Free Tier Limits
- 512MB RAM
- Shared CPU
- Goes to sleep after 15 minutes of inactivity
- 750 hours/month runtime

## Troubleshooting

### Common Issues

**Build fails**
```bash
# Check logs in Render dashboard
# Common fixes:
- Ensure all dependencies in package.json
- Verify build command works locally
- Check Node.js version compatibility
```

**Service won't start**
```bash
# Check start command logs
# Common fixes:
- Verify npm start works locally
- Check PORT environment variable
- Ensure server binds to 0.0.0.0, not localhost
```

**Database connection fails**
```bash
# Check environment variables
# Verify MongoDB Atlas settings:
- Network access allows all IPs (0.0.0.0/0)
- Database user has correct permissions
- Connection string format is correct
```

**Cold starts (free tier)**
- Service sleeps after 15 minutes
- First request after sleep takes 30+ seconds
- Consider upgrading to paid plan for production

### Performance Optimization

**Free Tier**
- Keep service warm with external monitoring
- Optimize startup time
- Minimize bundle size

**Paid Tier**
- Persistent storage available
- No cold starts
- More CPU and RAM

## Monitoring

### Built-in Features
- Service metrics in dashboard
- Real-time logs
- Health check monitoring
- Deployment history

### External Monitoring
```bash
# Keep service warm (free tier)
# Use services like:
- UptimeRobot
- Pingdom
- StatusCake
```

## Production Considerations

### Scaling
- Horizontal scaling available on paid plans
- Database optimization for higher loads
- CDN for static assets

### Security
- HTTPS enabled by default
- Environment variables encrypted
- Regular security updates
- Network isolation

### Backup Strategy
- Database backups (MongoDB Atlas)
- Code versioning (Git)
- Environment variable backup
- Deployment rollback capability

## Next Steps

After successful deployment:
1. Set up custom domain (paid feature)
2. Configure monitoring and alerts
3. Plan scaling strategy
4. Set up CI/CD pipeline
5. Document maintenance procedures

---

**Free Tier Perfect For:**
- Development and testing
- Small-scale applications
- Proof of concepts
- Personal projects

**Upgrade When:**
- Need persistent connections
- High traffic expected
- Custom domains required
- Professional SLA needed