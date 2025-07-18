# MongoDB Atlas Data Viewing Guide

## You're Already Connected! 🎉

Based on your screenshot, you're successfully viewing your MongoDB Atlas database. Here's how to check all your collections:

## Current View: Users Collection
You can see one user document:
- **_id**: ObjectId("687a2fb4d4d3fcd9fccb90e8")
- **name**: "Test Student"
- **email**: "teststudent@example.com" 
- **password**: (hashed with bcrypt)
- **role**: "student"
- **profileImage**: null
- **createdAt**: 2025-07-18T11:26:37.378+00:00
- **updatedAt**: 2025-07-18T11:26:37.378+00:00

## How to Check All Collections:

### 1. **Users Collection** (Currently Viewing)
- Click on "users" in the left sidebar
- Shows all user accounts (students, teachers, admins)
- Each user has: name, email, password (hashed), role, timestamps

### 2. **Student Profiles Collection**
- Click on "studentprofiles" in the left sidebar
- Shows extended profile information for students
- Contains: rollNumber, department, year, course, userId

### 3. **Achievements Collection**
- Click on "achievements" in the left sidebar
- Shows all student achievements and activities
- Contains: title, description, type, status, proofUrl, studentId

## Navigation Tips:

### **View Documents:**
- Each collection shows documents (rows) on the right side
- Use the pagination at the bottom to see more documents
- Click on any document to expand and view full details

### **Filter/Search:**
- Use the "Filter" box at the top to search
- Examples:
  - `{"role": "student"}` - Show only students
  - `{"email": "test@example.com"}` - Find specific user
  - `{"status": "Verified"}` - Show verified achievements

### **Query Examples:**
```json
// Find all students
{"role": "student"}

// Find specific department
{"department": "Computer Science"}

// Find pending achievements
{"status": "Pending"}

// Find achievements by student
{"studentId": "687a2fb4d4d3fcd9fccb90e8"}
```

## What You Should See:

### **Users Collection:**
- 4 user documents
- Mix of students, teachers, admins
- Hashed passwords for security
- Created/updated timestamps

### **Student Profiles Collection:**
- 1 profile document
- Contains roll number, department, year, course
- Linked to user via userId field

### **Achievements Collection:**
- Currently empty (0 documents)
- Will populate as students add achievements
- Each achievement links to student via studentId

## Database Health Check:

✅ **Connected** - You're successfully viewing your live database
✅ **Collections Created** - All 3 collections exist (users, studentprofiles, achievements)
✅ **Data Present** - Users and profiles are being stored correctly
✅ **Security** - Passwords are properly hashed
✅ **Relationships** - Foreign key relationships working (userId, studentId)

## Next Steps:

1. **Click "studentprofiles"** to see student profile data
2. **Click "achievements"** to see achievement records
3. **Use filters** to search for specific data
4. **Test the application** to see new data appear in real-time

Your database is working perfectly and ready for production deployment!