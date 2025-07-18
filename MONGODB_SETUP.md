# MongoDB Setup Guide

## Quick Setup for Your Existing MongoDB

Since you already have a MongoDB application, here's how to connect it to your Student Activity Record Platform:

### Step 1: Get Your MongoDB Connection String

If you're using:

#### MongoDB Atlas (Cloud):
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

#### Local MongoDB:
Your connection string will be: `mongodb://localhost:27017/student-activity-platform`

#### MongoDB Cloud Services:
Use the connection string provided by your cloud provider

### Step 2: Configure Environment Variables

Create a `.env` file in your project root:

```bash
# Copy the .env.example file
cp .env.example .env
```

Edit the `.env` file and add your MongoDB connection string:

```env
MONGODB_URI=your-mongodb-connection-string-here
JWT_SECRET=your-super-secret-jwt-key-32-characters-long
PORT=5000
NODE_ENV=development
```

### Step 3: Generate a JWT Secret

Create a secure JWT secret (32+ characters). You can use:
- Online generator: https://generate-secret.vercel.app/32
- Or run in terminal: `openssl rand -hex 32`

### Step 4: Test Connection

1. Save your `.env` file
2. Restart the application (it will automatically reload)
3. Check the console for "✅ MongoDB connected successfully"

### Step 5: Database Schema

Your MongoDB database will automatically create these collections:
- `users` - User accounts (students, teachers, admins)
- `studentprofiles` - Extended student information
- `achievements` - Student achievements and activities

### Demo Accounts

After connecting MongoDB, the system will create demo accounts:
- **Student**: student@example.com / password123
- **Teacher**: teacher@example.com / password123  
- **Admin**: admin@example.com / password123

### Troubleshooting

#### Connection Issues:
- Check if your MongoDB URI is correct
- Ensure your IP is whitelisted (for Atlas)
- Verify username/password are correct
- Check network connectivity

#### Common Error Messages:
- "ECONNREFUSED" - MongoDB server not running or wrong host/port
- "Authentication failed" - Wrong username/password
- "Network timeout" - Firewall/network issues

### File Storage Information

**Current Setup:**
- Files are stored in `/uploads` directory on the server
- Supported formats: JPG, PNG, PDF
- Maximum file size: 5MB
- Access via: `http://your-domain/uploads/filename.jpg`

**For Production (Render):**
- Files are stored temporarily on Render's ephemeral filesystem
- Files may be deleted when the service restarts
- Consider cloud storage (AWS S3, Google Cloud Storage) for production

### Security Notes

1. **Never commit your `.env` file** - it's already in `.gitignore`
2. **Use a strong JWT secret** - minimum 32 characters
3. **Restrict MongoDB access** - only allow your application's IP
4. **Use environment variables** - for all sensitive configuration

### Next Steps

After successful MongoDB connection:
1. Test user registration and login
2. Try uploading achievements
3. Test different user roles (student, teacher, admin)
4. Deploy to Render using the deployment guide

Your application is now ready to use your MongoDB database!