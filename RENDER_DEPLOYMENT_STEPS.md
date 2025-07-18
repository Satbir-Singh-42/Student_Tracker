# Render Deployment Guide - Student Activity Record Platform

## Prerequisites Check ✅

Your application is ready for deployment with:
- ✅ MongoDB Atlas database connected
- ✅ JWT authentication configured  
- ✅ Production build working (982KB frontend, 51KB backend)
- ✅ Environment variables prepared
- ✅ render.yaml configuration file ready

## Step 1: Create Render Account

1. Go to [https://render.com/](https://render.com/)
2. Click "Get Started for Free"
3. Sign up with GitHub, Google, or email
4. Verify your email address

## Step 2: Connect Your Repository

### Option A: GitHub Repository (Recommended)
1. Push your code to GitHub if not already done
2. In Render dashboard, click "New +"
3. Select "Web Service"
4. Choose "Build and deploy from a Git repository"
5. Connect your GitHub account
6. Select your repository

### Option B: Direct Git Repository
1. In Render dashboard, click "New +"
2. Select "Web Service"
3. Choose "Build and deploy from a Git repository"
4. Enter your repository URL

## Step 3: Configure Web Service

### Basic Settings:
- **Name**: `student-activity-platform` (or your preferred name)
- **Runtime**: `Node`
- **Region**: Choose closest to your users (US East, Europe, etc.)
- **Branch**: `main` (or your default branch)
- **Build Command**: `npm install && npm run build`
- **Start Command**: `npm start`

### Advanced Settings:
- **Instance Type**: `Free` (for testing) or `Starter` (for production)
- **Auto-Deploy**: `Yes` (deploys automatically on git push)

## Step 4: Set Environment Variables

In the Render dashboard, go to "Environment" tab and add these variables:

### Required Variables:
```
MONGODB_URI=mongodb+srv://satbirsingh:Nobody.1234@cluster0.psbseon.mongodb.net/student-activity-platform
JWT_SECRET=1612d80669f1a4ef7035361f5405161f337c267e1159ed7c5022042a2e7eb567
NODE_ENV=production
```

### Optional Variables:
```
PORT=10000
CORS_ORIGIN=https://your-app-name.onrender.com
```

**Important**: Replace `your-app-name` with your actual Render app name.

## Step 5: Deploy

1. Click "Create Web Service"
2. Wait for deployment (usually 5-10 minutes)
3. Monitor build logs for any errors
4. Once deployed, your app will be available at `https://your-app-name.onrender.com`

## Step 6: Verify Deployment

### Health Check:
Visit: `https://your-app-name.onrender.com/api/health`
Should return: `{"status":"ok","timestamp":"..."}`

### Test Registration:
1. Go to your app URL
2. Click "Sign Up"
3. Register a new account
4. Login with the new account

### Test Database:
1. Check MongoDB Atlas to see new user data
2. Verify user authentication works
3. Test file upload functionality

## Step 7: Configure Custom Domain (Optional)

1. In Render dashboard, go to "Settings" tab
2. Click "Custom Domains"
3. Add your domain name
4. Configure DNS records as instructed by Render

## Troubleshooting Common Issues

### Build Fails:
- Check build logs in Render dashboard
- Verify `package.json` has correct build script
- Ensure all dependencies are in `dependencies`, not `devDependencies`

### App Doesn't Start:
- Check that `npm start` command is correct
- Verify PORT environment variable is set
- Check application logs for errors

### Database Connection Fails:
- Verify MongoDB URI is correct
- Check MongoDB Atlas network access (IP whitelist)
- Ensure database user has proper permissions

### Environment Variables:
- Double-check all required variables are set
- Verify no typos in variable names
- Ensure JWT_SECRET is exactly as provided

## Production Checklist

Before going live:
- [ ] Test all user registration/login flows
- [ ] Verify file upload works
- [ ] Check database connectivity
- [ ] Test admin/teacher/student roles
- [ ] Verify JWT authentication
- [ ] Test API endpoints
- [ ] Check mobile responsiveness
- [ ] Monitor application performance

## Render Features You Get:

- **Automatic HTTPS**: SSL certificates managed automatically
- **Auto-scaling**: Handles traffic spikes
- **Health checks**: Monitors app availability
- **Log aggregation**: Centralized logging
- **Zero-downtime deployments**: Seamless updates

## Cost Estimation:

- **Free Tier**: Good for testing, sleeps after 15 minutes of inactivity
- **Starter ($7/month)**: Always-on, no sleep, good for production
- **Standard ($25/month)**: More resources, faster performance

## Your App is Ready!

Your Student Activity Record Platform is fully prepared for Render deployment. The database is connected, authentication is configured, and build process is verified. Simply follow the steps above to deploy your application.

**Deployment Time**: 5-10 minutes
**Expected Result**: Fully functional web application at your Render URL