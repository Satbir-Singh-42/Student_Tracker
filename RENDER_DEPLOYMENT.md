# Render Deployment Guide

## Prerequisites

1. A Render account (free tier available)
2. GitHub repository with your code
3. MongoDB Atlas account or MongoDB instance

## Step 1: Prepare Your Repository

Ensure your repository has:
- `render.yaml` configuration file
- `build.js` build script
- Proper `package.json` with build and start scripts

## Step 2: Set Up MongoDB Database

### Option A: MongoDB Atlas (Recommended)
1. Create a free MongoDB Atlas account
2. Create a new cluster
3. Get your connection string (replace `<password>` with your actual password)
4. Example: `mongodb+srv://username:<password>@cluster0.mongodb.net/student_activity_platform`

### Option B: Render PostgreSQL (Alternative)
1. Create a PostgreSQL database in Render
2. Use the connection string provided

## Step 3: Deploy to Render

### Method 1: Using render.yaml (Recommended)
1. Connect your GitHub repository to Render
2. Render will automatically detect the `render.yaml` file
3. Set the following environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string (32+ characters)
   - `NODE_ENV`: `production`
   - `CORS_ORIGIN`: Your frontend URL (e.g., `https://your-app.onrender.com`)

### Method 2: Manual Setup
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Configure the service:
   - **Build Command**: `npm run build`
   - **Start Command**: `npm start`
   - **Environment**: `Node`
   - **Health Check Path**: `/api/health`

## Step 4: Environment Variables

Set these in your Render service settings:

```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/student_activity_platform
JWT_SECRET=your-super-secure-jwt-secret-key-here
CORS_ORIGIN=https://your-app.onrender.com
```

## Step 5: Deploy

1. Push your code to GitHub
2. Render will automatically build and deploy
3. Your app will be available at `https://your-app.onrender.com`

## Troubleshooting

### Common Issues

1. **Build fails**: Check that all dependencies are in `package.json`
2. **Database connection fails**: Verify MongoDB connection string
3. **CORS errors**: Ensure `CORS_ORIGIN` is set correctly
4. **File uploads not working**: Check uploads directory permissions

### Logs
- Access logs in Render dashboard
- Monitor build process and runtime logs
- Check health endpoint: `https://your-app.onrender.com/api/health`

## Testing

1. Visit your deployed app
2. Test login with demo accounts:
   - Student: `student@example.com` / `password123`
   - Teacher: `teacher@example.com` / `password123`
   - Admin: `admin@example.com` / `password123`

## Free Tier Limitations

- Service spins down after 15 minutes of inactivity
- 750 hours per month (enough for continuous running)
- 512MB RAM, 0.1 CPU
- Consider upgrading for production use

## Monitoring

- Set up monitoring in Render dashboard
- Configure alerts for downtime
- Monitor resource usage

## Custom Domain (Optional)

1. Add custom domain in Render settings
2. Update DNS records
3. SSL certificates are automatically provided