# MongoDB Data Verification Guide

## Method 1: MongoDB Atlas Web Interface (Easiest)

### Access Your Data:
1. Go to [MongoDB Atlas](https://cloud.mongodb.com/)
2. Sign in to your account
3. Click on your cluster "Cluster0"
4. Click "Browse Collections" button
5. Select database: `student-activity-platform`

### View Collections:
- **users** - All user accounts (students, teachers, admins)
- **studentprofiles** - Student profile information
- **achievements** - Student achievements and activities

### Search and Filter:
- Click on any collection to view documents
- Use the search bar to find specific records
- Filter by fields like email, role, status, etc.

## Method 2: MongoDB Compass (Desktop GUI)

### Install MongoDB Compass:
1. Download from [MongoDB Compass](https://www.mongodb.com/products/compass)
2. Install the application
3. Open MongoDB Compass

### Connect to Your Database:
1. Use connection string: `mongodb+srv://satbirsingh:Nobody.1234@cluster0.psbseon.mongodb.net/student-activity-platform`
2. Click "Connect"
3. Navigate to your database and collections

### Features:
- Visual query builder
- Real-time performance metrics
- Data export/import capabilities
- Index management

## Method 3: API Endpoints (Current Application)

### Check Users via API:
```bash
# Get user by login (requires valid token)
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "freshstudent@gmail.com", "password": "password123"}'

# Get achievements (requires authentication)
curl -X GET http://localhost:5000/api/achievements \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Health Check:
```bash
curl http://localhost:5000/api/health
```

## Method 4: MongoDB Shell (Command Line)

### Install MongoDB Shell:
```bash
# Install mongosh (MongoDB Shell)
npm install -g mongosh
```

### Connect and Query:
```bash
# Connect to your database
mongosh "mongodb+srv://satbirsingh:Nobody.1234@cluster0.psbseon.mongodb.net/student-activity-platform"

# List all collections
show collections

# View all users
db.users.find()

# View specific user
db.users.findOne({"email": "freshstudent@gmail.com"})

# Count documents
db.users.countDocuments()
db.studentprofiles.countDocuments()
db.achievements.countDocuments()

# View recent registrations
db.users.find().sort({"createdAt": -1}).limit(5)
```

## Method 5: Add Debug Endpoint (Temporary)

I can add a temporary debug endpoint to your application to view database contents:

```javascript
// Debug endpoint to view database contents
app.get("/api/debug/users", async (req, res) => {
  try {
    const users = await storage.getUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
```

## Current Database Status

Based on your application logs, here's what should be in your database:

### Users Collection:
- **Fresh New Student** - freshstudent@gmail.com (student)
- **Demo accounts** - If created (student@example.com, teacher@example.com, admin@example.com)

### Student Profiles Collection:
- Profile for Fresh New Student with roll number "FRESH2025"
- Department: Computer Science
- Year: first, Course: BTech

### Achievements Collection:
- Currently empty (achievements are added by users through the interface)

## Recommended Check Method

**For beginners**: Use MongoDB Atlas web interface
**For developers**: Use MongoDB Compass desktop app
**For quick checks**: Use the API endpoints

## What to Look For:

1. **User Documents**: Check if users are being created with correct fields
2. **Password Hashing**: Passwords should be hashed strings, not plain text
3. **Student Profiles**: Each student should have a corresponding profile
4. **Timestamps**: createdAt and updatedAt fields should be present
5. **Object IDs**: Each document should have a unique _id field

## Next Steps:

1. Choose your preferred method to check the data
2. Verify user registration is working
3. Check that student profiles are being created
4. Test the complete user flow from registration to login

Your database is live and operational - you can verify all your data is being stored correctly!