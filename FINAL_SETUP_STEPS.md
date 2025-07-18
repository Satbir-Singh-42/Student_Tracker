# Final Setup Steps - Almost Done!

## Current Status
I've configured your application with your MongoDB Atlas connection string. Here's what you need to do:

## Step 1: Replace the Database Password
In your `.env` file, replace `<db_password>` with your actual database password:

```env
# Current (needs password):
MONGODB_URI=mongodb+srv://satbirsingh:<db_password>@cluster0.psbseon.mongodb.net/student-activity-platform

# Update to (with your actual password):
MONGODB_URI=mongodb+srv://satbirsingh:YOUR-ACTUAL-PASSWORD@cluster0.psbseon.mongodb.net/student-activity-platform
```

## Step 2: Get Your Database Password
If you don't remember your database password:
1. Go to **Database Access** in MongoDB Atlas
2. Find the user "satbirsingh"
3. Click **Edit** 
4. Click **Edit Password**
5. Set a new password and save it

## Step 3: Test the Connection
After updating the password:
1. Save the `.env` file
2. The application will automatically restart
3. Watch for "✅ MongoDB connected successfully" in the console

## Step 4: Verify Everything Works
Once connected, test these features:
- Login with demo accounts
- Create new achievements
- Upload files
- Switch between different user roles

## For Production (Render) Deployment
Use the same connection string in Render's environment variables:
```
MONGODB_URI=mongodb+srv://satbirsingh:YOUR-PASSWORD@cluster0.psbseon.mongodb.net/student-activity-platform
JWT_SECRET=your-32-character-secret-key
NODE_ENV=production
```

## Database Collections Created Automatically
Your MongoDB will automatically create these collections:
- `users` - User accounts (students, teachers, admins)
- `studentprofiles` - Student profile information
- `achievements` - Student achievements and activities

## Demo Accounts (Created in MongoDB)
- **Student**: student@example.com / password123
- **Teacher**: teacher@example.com / password123
- **Admin**: admin@example.com / password123

## Next Steps
1. Update the password in `.env` file
2. Test the connection
3. Deploy to Render using the deployment guide
4. Your application is ready for production!

## Need Help?
If you encounter any issues:
- Check MongoDB Atlas network access settings
- Verify the database user has proper permissions
- Ensure the password is correct and URL-encoded if it contains special characters