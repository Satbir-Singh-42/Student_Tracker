# MongoDB Connection Configuration

## Current Status
Your application is configured but can't connect to MongoDB because `localhost:27017` isn't available in the Replit environment.

## How to Connect Your MongoDB

### Option 1: MongoDB Atlas (Cloud Database)
If you're using MongoDB Atlas:
1. Go to your MongoDB Atlas dashboard
2. Click "Connect" on your cluster
3. Choose "Connect your application"
4. Copy the connection string (format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)

### Option 2: Remote MongoDB Server
If you have a remote MongoDB server:
1. Get your connection string from your hosting provider
2. Format: `mongodb://username:password@your-server.com:27017/dbname`

### Option 3: MongoDB Cloud Services
For services like MongoDB Cloud, Railway, or others:
1. Get the connection string from your provider's dashboard
2. It will typically be in format: `mongodb://username:password@host:port/database`

## Update Your Configuration

Edit your `.env` file and replace the MONGODB_URI with your actual connection string:

```env
# Replace this line:
MONGODB_URI=mongodb://localhost:27017/student-activity-platform

# With your actual MongoDB connection string:
MONGODB_URI=mongodb+srv://your-username:your-password@your-cluster.mongodb.net/student-activity-platform
```

## Test the Connection

After updating the `.env` file:
1. Save the file
2. The application will automatically restart
3. Check the console for "✅ MongoDB connected successfully"

## Common Connection String Formats

### MongoDB Atlas:
```
mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/database-name
```

### Self-hosted/Cloud:
```
mongodb://username:password@hostname:port/database-name
```

### No Authentication:
```
mongodb://hostname:port/database-name
```

## Troubleshooting

### Connection Refused Error:
- Check if your MongoDB server is running
- Verify the host and port are correct
- Ensure your IP is whitelisted (for cloud services)

### Authentication Error:
- Verify username and password are correct
- Check if the user has proper permissions

### Network Error:
- Check firewall settings
- Verify network connectivity to the MongoDB server

## Next Steps

1. **Get your MongoDB connection string** from your MongoDB provider
2. **Update the `.env` file** with the correct connection string
3. **Restart the application** to test the connection
4. **Deploy to Render** using the same connection string

## Current Fallback
While MongoDB is not connected, the application is using in-memory storage, so you can still:
- Test all features
- Create demo accounts
- Upload files
- Test the user interface

Once you provide the correct MongoDB connection string, all data will be stored in your actual database.