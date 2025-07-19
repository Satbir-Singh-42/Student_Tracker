# Student-Teacher Allocation System

## Overview

The Student Activity Record Platform includes a comprehensive teacher-student allocation system that allows administrators to assign teachers to students for monitoring their achievements and activities.

## System Components

### 1. Database Schema

**Student Profile Model** (Updated with teacher assignment):
- `userId`: Reference to User (student)
- `rollNumber`: Unique student identifier
- `department`: Academic department
- `year`: Academic year
- `course`: Course/program
- `assignedTeacher`: Reference to User (teacher) - **NEW FIELD**

### 2. User Roles and Permissions

**Admin**: 
- View all student profiles
- Assign/unassign teachers to students
- Manage user accounts
- View comprehensive reports

**Teacher**:
- View students assigned to them
- Review and verify student achievements
- Provide feedback on submissions

**Student**:
- Register and maintain profile
- Submit achievements and activities
- View their assigned teacher

### 3. API Endpoints

#### Student Profile Management
```
GET /api/student-profiles
- Description: Get all student profiles (filtered by admin type)
- Access: Admin only
- Response: Array of student profiles with teacher assignments

POST /api/student-profiles/:studentId/assign-teacher
- Description: Assign a teacher to a student
- Access: Admin only
- Body: { "teacherId": "teacher_id" }
- Response: Updated student profile

DELETE /api/student-profiles/:studentId/remove-teacher
- Description: Remove teacher assignment from student
- Access: Admin only
- Response: Updated student profile

GET /api/teacher/:teacherId/students
- Description: Get all students assigned to a specific teacher
- Access: Admin, Teacher (own students)
- Response: Array of student profiles
```

## How Students Are Allocated to Teachers

### 1. Manual Assignment (Current Implementation)
- **Process**: Admin manually assigns teachers to individual students
- **Method**: Admin selects student profile and assigns available teacher
- **Benefits**: Precise control, custom assignments based on expertise
- **Use Case**: Specialized mentorship, specific subject expertise

### 2. Department-Based Assignment (Recommended Enhancement)
- **Process**: Students automatically assigned to teachers within same department
- **Method**: System matches student department with teacher expertise
- **Benefits**: Subject matter alignment, easier management
- **Implementation**: Can be added as automatic assignment rule

### 3. Load Balancing Assignment (Future Enhancement)
- **Process**: Distribute students evenly among available teachers
- **Method**: Calculate teacher workload and assign new students accordingly
- **Benefits**: Fair distribution, prevents overloading
- **Metrics**: Number of students per teacher, achievement workload

## Current Official System Status

### Production Accounts
1. **System Administrator** (admin@satvirnagra.com)
   - Full system access
   - Can assign teachers to students
   - Manages all user accounts

2. **Dr. Rajesh Kumar** (rajesh.kumar@satvirnagra.com)
   - Teacher role
   - Available for student assignment
   - Can review student achievements

3. **Prof. Priya Sharma** (priya.sharma@satvirnagra.com)
   - Teacher role
   - Available for student assignment
   - Can review student achievements

### Demo System Separation
- **Demo accounts**: Completely isolated from production
- **Data isolation**: Demo admins see only demo data
- **Restricted permissions**: Demo accounts cannot create new users

## Teacher Assignment Workflow

### For Administrators:
1. Log in to admin dashboard
2. Navigate to User Management
3. View student profiles
4. Select "Assign Teacher" for desired student
5. Choose from available teachers
6. Confirm assignment

### For Teachers:
1. Log in to teacher dashboard
2. View "My Students" section
3. See assigned students and their achievements
4. Review and verify student submissions
5. Provide feedback and grades

### For Students:
1. Register with student credentials
2. Complete profile with department/course info
3. View assigned teacher (if any)
4. Submit achievements for review
5. Receive feedback from assigned teacher

## Implementation Benefits

1. **Mentorship**: Students get dedicated teacher guidance
2. **Accountability**: Clear responsibility for student monitoring
3. **Workload Management**: Balanced distribution of student oversight
4. **Subject Expertise**: Match students with relevant teachers
5. **Progress Tracking**: Teachers monitor specific student achievements
6. **Communication**: Direct channel between students and teachers

## Security Features

1. **Role-based Access**: Only admins can assign teachers
2. **Data Isolation**: Demo and production data completely separate
3. **Protected Accounts**: System prevents deletion of key accounts
4. **Authentication**: JWT-based secure access control
5. **Validation**: Ensures only valid teachers can be assigned

## Future Enhancements

1. **Automatic Assignment Rules**
   - Department-based auto-assignment
   - Load balancing algorithms
   - Preference-based matching

2. **Teacher Specialization Tags**
   - Subject expertise markers
   - Achievement type specialization
   - Custom assignment criteria

3. **Workload Analytics**
   - Teacher capacity monitoring
   - Student distribution metrics
   - Performance tracking

4. **Notification System**
   - Assignment notifications
   - Achievement alerts
   - Deadline reminders

This system provides a solid foundation for managing student-teacher relationships while maintaining data integrity and security across both demonstration and production environments.