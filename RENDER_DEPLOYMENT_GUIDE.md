# Render Deployment Guide - Student Activity Record Platform

## Overview
This guide will help you deploy your Student Activity Record Platform to Render with MongoDB Atlas and proper environment configuration.

## Prerequisites
- Render account (free tier available)
- MongoDB Atlas account (free tier available)
- Your project code

## Step 1: Set Up MongoDB Atlas Database

### Create MongoDB Atlas Cluster
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Create a free account or sign in
3. Create a new project called "Student Activity Platform"
4. Build a new cluster (choose the free M0 tier)
5. Choose a cloud provider and region (AWS, Google Cloud, or Azure)
6. Set cluster name to "student-platform"

### Configure Database Access
1. In MongoDB Atlas, go to "Database Access" in the left sidebar
2. Click "Add New Database User"
3. Create a user with username and password (save these!)
4. Grant "Read and write to any database" permissions
5. Click "Add User"

### Configure Network Access
1. Go to "Network Access" in the left sidebar
2. Click "Add IP Address"
3. Click "Allow Access from Anywhere" (0.0.0.0/0)
4. Click "Confirm"

### Get Connection String
1. Go to "Database" in the left sidebar
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (looks like: `mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/`)
5. Replace `<password>` with your actual password
6. Add database name at the end: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/student-activity-platform`

## Step 2: Prepare Your Project for Render

### Update render.yaml Configuration
The project already includes a `render.yaml` file. Make sure it looks like this:

```yaml
services:
  - type: web
    name: student-activity-platform
    env: node
    buildCommand: npm install && npm run build
    startCommand: npm start
    envVars:
      - key: NODE_ENV
        value: production
      - key: MONGODB_URI
        fromDatabase:
          name: mongodb-connection
          property: connectionString
      - key: JWT_SECRET
        generateValue: true
      - key: CORS_ORIGIN
        value: https://your-app-name.onrender.com
```

### Verify Build Configuration
Make sure your `package.json` has the correct build and start scripts:

```json
{
  "scripts": {
    "dev": "tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outfile=dist/index.js",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

## Step 3: Deploy to Render

### Connect Repository
1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click "New" → "Web Service"
3. Connect your Git repository (GitHub, GitLab, or Bitbucket)
4. Select your repository

### Configure Service
1. **Name**: `student-activity-platform`
2. **Environment**: `Node`
3. **Build Command**: `npm install && npm run build`
4. **Start Command**: `npm start`
5. **Auto-Deploy**: Enable this for automatic deployments

### Set Environment Variables
In the "Environment" section, add these variables:

1. **NODE_ENV**: `production`
2. **MONGODB_URI**: Your MongoDB Atlas connection string from Step 1
3. **JWT_SECRET**: Generate a secure random string (32+ characters)
4. **CORS_ORIGIN**: `https://your-app-name.onrender.com` (update with your actual Render URL)

### Deploy
1. Click "Create Web Service"
2. Wait for the deployment to complete (5-10 minutes)
3. Your app will be available at `https://your-app-name.onrender.com`

## Step 4: File Storage Configuration

### Image Storage Location
Your uploaded images and documents are stored in the `/uploads` directory on the server. Here's how it works:

1. **Development**: Files are stored in `./uploads/` folder locally
2. **Production (Render)**: Files are stored in the ephemeral filesystem at `/app/uploads/`

### Important Notes about File Storage on Render:
- **Ephemeral Storage**: Render uses ephemeral storage, meaning uploaded files will be deleted when the service restarts
- **For Production**: Consider using cloud storage like:
  - AWS S3
  - Google Cloud Storage
  - Cloudinary
  - Uploadcare

### Current File Upload Configuration:
- **File Types**: JPG, PNG, PDF
- **File Size Limit**: 5MB
- **Storage Path**: `/uploads/` directory
- **Access URL**: `https://your-app.onrender.com/uploads/filename.jpg`

## Step 5: Test Your Deployment

### Verify the Application
1. Visit your Render URL
2. Try logging in with demo accounts:
   - **Student**: `student@example.com` / `password123`
   - **Teacher**: `teacher@example.com` / `password123`
   - **Admin**: `admin@example.com` / `password123`

### Test Core Features
1. **Authentication**: Login/logout functionality
2. **File Upload**: Try uploading an achievement document
3. **Database**: Add new achievements, users, etc.
4. **Role Access**: Test different user roles

## Step 6: Monitor and Maintain

### Check Logs
1. Go to your Render service dashboard
2. Click on "Logs" tab to see application logs
3. Monitor for any errors or issues

### Database Monitoring
1. Check MongoDB Atlas metrics
2. Monitor database connections and performance
3. Set up alerts for database issues

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `NODE_ENV` | Application environment | `production` |
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/dbname` |
| `JWT_SECRET` | Secret key for JWT tokens | `your-super-secret-key-here` |
| `CORS_ORIGIN` | Allowed CORS origin | `https://your-app.onrender.com` |
| `PORT` | Server port (auto-set by Render) | `10000` |

## Troubleshooting

### Common Issues

1. **Build Fails**:
   - Check that all dependencies are in `package.json`
   - Verify build command is correct
   - Check for TypeScript errors

2. **Database Connection Issues**:
   - Verify MongoDB URI is correct
   - Check MongoDB Atlas network access settings
   - Ensure database user has proper permissions

3. **File Upload Issues**:
   - Remember that files are stored temporarily on Render
   - Consider implementing cloud storage for production

4. **Environment Variables**:
   - Make sure all required environment variables are set
   - Check that JWT_SECRET is properly generated

### Support
- Render Documentation: https://render.com/docs
- MongoDB Atlas Documentation: https://docs.atlas.mongodb.com/

## Security Considerations

1. **JWT Secret**: Use a strong, random secret key
2. **Database**: Restrict database access to your application only
3. **CORS**: Set specific origins instead of wildcards in production
4. **File Uploads**: Implement file type validation and size limits
5. **Environment Variables**: Never commit secrets to version control

## Next Steps

After successful deployment:
1. Consider implementing cloud file storage
2. Set up monitoring and alerting
3. Configure custom domain if needed
4. Implement backup strategies for database
5. Set up CI/CD pipeline for automated deployments

Your Student Activity Record Platform is now ready for production use on Render!