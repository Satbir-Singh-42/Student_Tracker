# MongoDB Atlas Connection Steps

## Based on Your Screenshot

I can see you have a MongoDB Atlas cluster named "Cluster0" that's running. Here's how to get the connection string:

## Step 1: Get Connection String from Atlas

1. **Click the "Connect" button** on your Cluster0 (visible in your screenshot)
2. You'll see three connection options:
   - Compass (GUI)
   - **Application** ← Choose this one
   - MongoDB Shell

3. **Select "Connect your application"**
4. Choose **Node.js** as the driver
5. Copy the connection string that looks like:
   ```
   mongodb+srv://username:<password>@cluster0.xxxxx.mongodb.net/
   ```

## Step 2: Complete the Connection String

The connection string you copy will need:
1. **Replace `<password>`** with your actual database user password
2. **Add database name** at the end: `/student-activity-platform`

Final format:
```
mongodb+srv://username:your-password@cluster0.xxxxx.mongodb.net/student-activity-platform
```

## Step 3: Update Your Application

Replace the MONGODB_URI in your `.env` file:
```env
MONGODB_URI=mongodb+srv://your-username:your-password@cluster0.xxxxx.mongodb.net/student-activity-platform
```

## Step 4: Database User Setup (If Needed)

If you haven't created a database user yet:
1. Go to **Database Access** in the left sidebar
2. Click **Add New Database User**
3. Create username and password
4. Grant **Read and write to any database** permissions

## Step 5: Network Access (If Needed)

Ensure your app can connect:
1. Go to **Network Access** in the left sidebar
2. Click **Add IP Address**
3. Add **0.0.0.0/0** (allow from anywhere) for development
4. Or add your specific IPs for production

## What Happens Next

Once you provide the correct connection string:
1. The application will automatically restart
2. You'll see "✅ MongoDB connected successfully" in the console
3. All data will be stored in your Atlas database
4. Demo accounts will be created in MongoDB
5. Ready for production deployment

## Need Help?

If you need assistance:
1. Share the connection string (without the password)
2. Let me know if you encounter any errors
3. I can help troubleshoot the connection