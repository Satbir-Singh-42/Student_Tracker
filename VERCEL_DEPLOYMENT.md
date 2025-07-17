# Vercel Deployment Guide

## Quick Deploy Setup

### 1. Vercel Dashboard Settings
When deploying on Vercel, use these exact settings:

- **Build Command**: `vite build` (or leave empty)
- **Output Directory**: `client/dist`
- **Install Command**: `npm install` (or leave empty)
- **Root Directory**: Leave empty (use root)

### 2. Environment Variables
Set these environment variables in your Vercel dashboard:

```
NODE_ENV=production
DATABASE_URL=your_postgresql_connection_string
JWT_SECRET=your_jwt_secret_key
CORS_ORIGIN=https://your-vercel-domain.vercel.app
```

### 3. Database Setup
1. Create a PostgreSQL database (recommended: Neon, Supabase, or PlanetScale)
2. Copy the connection string
3. Add it as `DATABASE_URL` in Vercel environment variables

### 4. Deploy Steps
1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Set the build settings as shown above
4. Add environment variables
5. Deploy!

## Project Structure for Vercel

```
├── api/
│   └── index.ts          # Serverless function entry point
├── client/
│   └── dist/            # Built frontend (auto-generated)
├── server/              # Server code
├── shared/              # Shared types and schemas
└── vercel.json          # Vercel configuration
```

## How It Works

- **Frontend**: Built with Vite and served from `client/dist`
- **Backend**: Serverless function at `api/index.ts` handles all API routes
- **Database**: PostgreSQL with Drizzle ORM
- **Routing**: Vercel handles routing between frontend and API

## Troubleshooting

### Build Errors
- Make sure `client/dist` directory exists after build
- Check that `vite build` command works locally
- Verify all dependencies are in `package.json`

### API Errors
- Check environment variables are set correctly
- Verify database connection string is valid
- Check function logs in Vercel dashboard

### Database Issues
- Ensure DATABASE_URL is properly formatted
- Check database is accessible from Vercel
- Verify database has proper tables created

## Testing Locally
```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Test build process
npm run build
```

The app will be available at your Vercel domain once deployed successfully.