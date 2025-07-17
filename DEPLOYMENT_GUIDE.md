# Vercel Deployment Guide

## Prerequisites

1. **Vercel Account**: Create a free account at [vercel.com](https://vercel.com)
2. **GitHub Repository**: Push your code to a GitHub repository
3. **Database**: Set up a PostgreSQL database (recommended: Neon, Supabase, or Vercel Postgres)

## Step 1: Prepare Your Database

### Option A: Use Neon Database (Recommended)
1. Go to [neon.tech](https://neon.tech) and create a free account
2. Create a new project
3. Copy your connection string (looks like: `postgresql://username:password@host/database`)

### Option B: Use Vercel Postgres
1. In your Vercel dashboard, go to Storage
2. Create a new Postgres database
3. Copy the connection string

## Step 2: Deploy to Vercel

### Method 1: Using Vercel CLI (Recommended)

1. Install Vercel CLI:
```bash
npm install -g vercel
```

2. Login to Vercel:
```bash
vercel login
```

3. Deploy your project:
```bash
vercel
```

4. Follow the prompts and set up environment variables when asked.

### Method 2: Using Vercel Dashboard

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "New Project"
3. Import your GitHub repository
4. Configure the following settings:
   - **Framework Preset**: Other
   - **Build Command**: `npm run build:client` (or leave empty to use default)
   - **Output Directory**: `client/dist`
   - **Install Command**: `npm install`

## Step 3: Configure Environment Variables

In your Vercel project settings, add these environment variables:

### Required Variables:
- `DATABASE_URL`: Your PostgreSQL connection string
- `NODE_ENV`: `production`
- `JWT_SECRET`: A random string for JWT tokens (generate with: `openssl rand -base64 32`)

### Optional Variables:
- `CORS_ORIGIN`: Your frontend URL (e.g., `https://yourapp.vercel.app`)

## Step 4: Update Your Code for Production

### 1. Update Database Configuration
Make sure your database connection works with the production DATABASE_URL.

### 2. Update CORS Settings
In `server/middleware/security.ts`, update the CORS configuration:

```typescript
export function corsMiddleware(req: Request, res: Response, next: NextFunction) {
  const origin = process.env.CORS_ORIGIN || req.headers.origin;
  
  res.header('Access-Control-Allow-Origin', origin);
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
}
```

## Step 5: Build Configuration

The `vercel.json` file is already configured for you. It includes:
- API routes handling (`/api/*` → server)
- Static file serving (frontend)
- Environment variables
- Function timeout settings

## Step 6: Initialize Database

After deployment, you'll need to initialize your database:

1. Run database migrations if you have any
2. The demo accounts should be created automatically by the MemStorage class

## Step 7: Test Your Deployment

1. Visit your Vercel app URL
2. Test the login functionality with demo accounts:
   - Student: `student@example.com` / `password123`
   - Teacher: `teacher@example.com` / `password123`
   - Admin: `admin@example.com` / `password123`

## Common Issues and Solutions

### 1. Database Connection Issues
- Verify your `DATABASE_URL` is correct
- Check if your database allows connections from Vercel's IP ranges
- Ensure SSL is enabled in your database connection

### 2. API Routes Not Working
- Check that your API routes start with `/api/`
- Verify the `vercel.json` routing configuration
- Check function logs in Vercel dashboard

### 3. Static Files Not Loading
- Ensure your build output is in `client/dist`
- Check that the build command runs successfully
- Verify file paths in your frontend code

### 4. Environment Variables Not Working
- Double-check variable names (case-sensitive)
- Ensure variables are set in Vercel dashboard
- Redeploy after adding new variables

## Monitoring and Maintenance

1. **Logs**: Check function logs in Vercel dashboard
2. **Performance**: Monitor function execution time
3. **Database**: Monitor database usage and connections
4. **Updates**: Redeploy when you push changes to your repository

## Alternative Deployment Options

If you prefer other platforms:
- **Railway**: Similar to Vercel but with built-in database
- **Render**: Good for full-stack applications
- **Heroku**: Traditional platform with add-ons
- **DigitalOcean App Platform**: Affordable option

## Support

If you encounter issues:
1. Check Vercel's documentation
2. Review function logs in dashboard
3. Test your API endpoints directly
4. Verify database connectivity

Your Student Activity Record Platform should now be live on Vercel!