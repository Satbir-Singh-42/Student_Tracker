# Environment Variables Setup Guide

## Required Environment Variables

### 1. JWT_SECRET
**Purpose**: Secret key for signing JWT authentication tokens
**How to Generate**: Use a strong random string (32+ characters)

**Options to Generate**:
```bash
# Option 1: Online generator
# Visit: https://randomkeygen.com/ and use "CodeIgniter Encryption Keys"

# Option 2: Command line (if you have openssl)
openssl rand -base64 32

# Option 3: Node.js (if you have node installed)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

**Example**: `a8f5f167f44f4964e6c998dee827110c`

### 2. MONGODB_URI
**Purpose**: Connection string for MongoDB database
**Format**: `mongodb+srv://username:password@cluster.mongodb.net/database-name`

**Steps to Get**:
1. Create MongoDB Atlas account at https://cloud.mongodb.com/
2. Create a new cluster (free M0 tier)
3. Create database user with read/write permissions
4. Whitelist your IP (or use 0.0.0.0/0 for all IPs)
5. Get connection string from "Connect" → "Connect your application"

**Example**: `mongodb+srv://myuser:mypassword@cluster0.abc123.mongodb.net/student-activity-platform`

### 3. NODE_ENV
**Purpose**: Application environment setting
**Value**: `production` (for deployment)

### 4. CORS_ORIGIN
**Purpose**: Allowed origins for CORS requests
**Value**: Your deployed application URL
**Example**: `https://your-app-name.onrender.com`

### 5. PORT
**Purpose**: Server port number
**Note**: Automatically set by Render, don't manually set this

## Setting Environment Variables in Render

1. Go to your Render service dashboard
2. Click on "Environment" in the left sidebar
3. Click "Add Environment Variable"
4. Add each variable with its value
5. Save changes and redeploy

## File Storage Information

### Current Setup
- **Location**: `/uploads` directory on server
- **File Types**: JPG, PNG, PDF
- **Size Limit**: 5MB per file
- **Access URL**: `https://your-app.onrender.com/uploads/filename.ext`

### Important Notes
- **Ephemeral Storage**: Files are deleted when server restarts
- **Production Recommendation**: Use cloud storage (AWS S3, Google Cloud Storage, Cloudinary)

### Cloud Storage Migration (Future Enhancement)
For production applications, consider implementing:
- AWS S3 for reliable file storage
- Cloudinary for image processing
- Google Cloud Storage for scalable storage

## Demo Accounts (Pre-configured)
The application comes with demo accounts for testing:

- **Student**: `student@example.com` / `password123`
- **Teacher**: `teacher@example.com` / `password123`
- **Admin**: `admin@example.com` / `password123`

These accounts are created automatically when using in-memory storage or can be seeded into your MongoDB database.

## Security Best Practices

1. **Never commit secrets to version control**
2. **Use strong, unique JWT secrets**
3. **Restrict database access to your application only**
4. **Use environment-specific CORS settings**
5. **Regularly rotate JWT secrets**
6. **Monitor database access logs**

## Troubleshooting

### Database Connection Issues
- Check MongoDB URI format
- Verify database user credentials
- Ensure IP whitelist includes your server
- Test connection from MongoDB Compass

### Authentication Issues
- Verify JWT_SECRET is set correctly
- Check token expiration settings
- Ensure CORS_ORIGIN matches your domain

### File Upload Issues
- Remember files are temporary on Render
- Check file size limits (5MB)
- Verify allowed file types (JPG, PNG, PDF)