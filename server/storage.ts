import { type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Achievement, type InsertAchievement, type Department, type InsertDepartment } from "@shared/schema";
import { UserModel, StudentProfileModel, AchievementModel, DepartmentModel } from "./models";
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: string): Promise<boolean>;
  getUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByDepartment(department: string): Promise<User[]>;
  searchUsers(query: string): Promise<User[]>;
  getTeachersBySpecialization(specialization: string): Promise<User[]>;
  
  // Student profile operations
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(userId: string, profile: Partial<StudentProfile>): Promise<StudentProfile | undefined>;
  getAllStudentProfiles(): Promise<StudentProfile[]>;
  getStudentsByTeacher(teacherId: string): Promise<StudentProfile[]>;
  assignTeacherToStudent(studentProfileId: string, teacherId: string): Promise<StudentProfile | undefined>;
  removeTeacherFromStudent(studentProfileId: string): Promise<StudentProfile | undefined>;
  searchStudentProfiles(query: string): Promise<StudentProfile[]>;
  autoAssignTeacherByBranch(studentProfileId: string): Promise<StudentProfile | undefined>;
  
  // Achievement operations
  getAchievement(id: string): Promise<Achievement | undefined>;
  getAchievementsByStudent(studentId: string): Promise<Achievement[]>;
  getAchievementsByDepartment(department: string): Promise<Achievement[]>;
  getAchievementsByStatus(status: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: string, achievement: Partial<Achievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: string): Promise<boolean>;
  getAllAchievements(): Promise<Achievement[]>;
  
  // Department operations
  getDepartment(id: string): Promise<Department | undefined>;
  getDepartmentByCode(code: string): Promise<Department | undefined>;
  getDepartmentByName(name: string): Promise<Department | undefined>;
  createDepartment(department: InsertDepartment): Promise<Department>;
  updateDepartment(id: string, department: Partial<Department>): Promise<Department | undefined>;
  deleteDepartment(id: string): Promise<boolean>;
  getAllDepartments(): Promise<Department[]>;
}

// MongoDB storage implementation
export class MongoStorage implements IStorage {
  
  private async createOfficialAccounts() {
    try {
      // Check if official accounts already exist
      const existingAdmin = await UserModel.findOne({ email: "admin@satvirnagra.com" });
      if (existingAdmin) {
        console.log("Official accounts already exist");
        return;
      }

      // Hash password for official accounts
      const adminPassword = await bcrypt.hash("Admin@2025!", 10);
      const teacherPassword = await bcrypt.hash("Teacher@2025!", 10);

      // Create admin user
      const adminUser = await UserModel.create({
        name: "System Administrator",
        email: "admin@satvirnagra.com",
        password: adminPassword,
        role: "admin"
      });

      // Create 2 official teachers only
      const teachers = [
        {
          name: "Dr. Rajesh Kumar",
          email: "rajesh.kumar@satvirnagra.com",
          specialization: "Computer Science and Engineering"
        },
        {
          name: "Prof. Priya Sharma",
          email: "priya.sharma@satvirnagra.com",
          specialization: "Information Technology"
        }
      ];

      for (const teacherData of teachers) {
        await UserModel.create({
          ...teacherData,
          password: teacherPassword,
          role: "teacher"
        });
      }

      // Don't create any official students initially

      console.log("Official accounts created successfully");
      console.log("Admin: admin@satvirnagra.com / Admin@2025!");
      console.log("Teachers: rajesh.kumar@satvirnagra.com, priya.sharma@satvirnagra.com / Teacher@2025!");
    } catch (error) {
      console.error("Error creating official accounts:", error);
    }
  }

  private async createDemoAccounts() {
    try {
      // Check if demo accounts already exist
      const existingDemoAdmin = await UserModel.findOne({ email: "demo.admin@example.com" });
      if (existingDemoAdmin) {
        console.log("Demo accounts already exist");
        // Clear existing demo data and recreate
        await this.clearDemoData();
      }

      // Hash password for demo accounts
      const demoPassword = await bcrypt.hash("demo123", 10);

      // Create demo admin user
      const demoAdminUser = await UserModel.create({
        name: "Demo Administrator",
        email: "demo.admin@example.com",
        password: demoPassword,
        role: "admin"
      });

      // Create 1 demo teacher only
      const demoTeacher = await UserModel.create({
        name: "Demo Teacher",
        email: "demo.teacher@example.com",
        password: demoPassword,
        role: "teacher",
        specialization: "Computer Science and Engineering"
      });

      // Create 1 demo student only
      const demoStudentUser = await UserModel.create({
        name: "Demo Student",
        email: "demo.student@example.com",
        password: demoPassword,
        role: "student"
      });

      // Create demo student profile
      const demoStudentProfile = await StudentProfileModel.create({
        userId: demoStudentUser._id,
        rollNumber: "DEMO001",
        department: "Engineering",
        branch: "Computer Science and Engineering",
        year: "third",
        course: "B.Tech"
      });

      // Auto-assign teacher based on branch
      await this.autoAssignTeacherByBranch(demoStudentProfile._id.toString());
      
      // Create demo achievements for the demo student
      await this.forceDemoAchievementsCreation(demoStudentUser._id.toString());

      console.log("Demo accounts created successfully");
      console.log("Demo Admin: demo.admin@example.com / demo123");
      console.log("Demo Teacher: demo.teacher@example.com / demo123");
      console.log("Demo Student: demo.student@example.com / demo123");
    } catch (error) {
      console.error("Error creating demo accounts:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      return user ? { ...user.toObject(), id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email });
      return user ? { ...user.toObject(), id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const user = await UserModel.create(userData);
      return { ...user.toObject(), id: user._id.toString() };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
      return user ? { ...user.toObject(), id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  // Get users filtered by account type (demo vs official)
  async getUsersFilteredByType(adminEmail: string): Promise<User[]> {
    try {
      const allUsers = await this.getUsers();
      return this.filterUsersByType(allUsers, adminEmail);
    } catch (error) {
      console.error("Error getting filtered users:", error);
      return [];
    }
  }

  // Helper method to check if user is demo or official
  private isDemoUser(email: string): boolean {
    return email.includes('@example.com');
  }

  // Helper method to filter users based on admin type
  private filterUsersByType(users: User[], adminEmail: string): User[] {
    const isAdminDemo = this.isDemoUser(adminEmail);
    return users.filter(user => this.isDemoUser(user.email) === isAdminDemo);
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await UserModel.find({ role });
      return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by role:", error);
      return [];
    }
  }

  // Get users by role filtered by account type (demo vs official)
  async getUsersByRoleFilteredByType(role: string, adminEmail: string): Promise<User[]> {
    try {
      const allUsers = await this.getUsersByRole(role);
      return this.filterUsersByType(allUsers, adminEmail);
    } catch (error) {
      console.error("Error getting filtered users by role:", error);
      return [];
    }
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    try {
      const profiles = await StudentProfileModel.find({ department });
      const userIds = profiles.map(profile => profile.userId);
      const users = await UserModel.find({ _id: { $in: userIds } });
      return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by department:", error);
      return [];
    }
  }

  // Student profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findOne({ userId });
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting student profile:", error);
      return undefined;
    }
  }

  async createStudentProfile(profileData: InsertStudentProfile): Promise<StudentProfile> {
    try {
      const profile = await StudentProfileModel.create(profileData);
      return { ...profile.toObject(), id: profile._id.toString() };
    } catch (error) {
      console.error("Error creating student profile:", error);
      throw error;
    }
  }

  async updateStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findOneAndUpdate(
        { userId },
        profileData,
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : undefined;
    } catch (error) {
      console.error("Error updating student profile:", error);
      return undefined;
    }
  }

  async getAllStudentProfiles(): Promise<StudentProfile[]> {
    try {
      const profiles = await StudentProfileModel.find().populate('userId', 'name email').populate('assignedTeacher', 'name email');
      return profiles.map(profile => ({
        ...profile.toObject(),
        id: profile._id.toString(),
        assignedTeacher: profile.assignedTeacher ? profile.assignedTeacher._id.toString() : undefined
      }));
    } catch (error) {
      console.error("Error getting all student profiles:", error);
      return [];
    }
  }

  // Get student profiles filtered by account type (demo vs official)
  async getStudentProfilesFilteredByType(adminEmail: string): Promise<StudentProfile[]> {
    try {
      const profiles = await this.getAllStudentProfiles();
      const isAdminDemo = this.isDemoUser(adminEmail);
      
      return profiles.filter(profile => {
        const userEmail = (profile as any).userId?.email || '';
        const isProfileDemo = this.isDemoUser(userEmail);
        return isAdminDemo === isProfileDemo;
      });
    } catch (error) {
      console.error("Error getting filtered student profiles:", error);
      return [];
    }
  }

  async getStudentsByTeacher(teacherId: string): Promise<StudentProfile[]> {
    try {
      const profiles = await StudentProfileModel.find({ assignedTeacher: teacherId }).populate('userId', 'name email');
      return profiles.map(profile => ({
        ...profile.toObject(),
        id: profile._id.toString(),
        assignedTeacher: teacherId
      }));
    } catch (error) {
      console.error("Error getting students by teacher:", error);
      return [];
    }
  }

  async getUnassignedStudentProfiles(): Promise<StudentProfile[]> {
    try {
      const profiles = await StudentProfileModel.find({ 
        $or: [
          { assignedTeacher: { $exists: false } },
          { assignedTeacher: null }
        ]
      });
      return profiles.map(profile => ({ ...profile.toObject(), id: profile._id.toString() }));
    } catch (error) {
      console.error("Error getting unassigned student profiles:", error);
      return [];
    }
  }

  async getTeachersBySpecialization(specialization: string): Promise<User[]> {
    try {
      const teachers = await UserModel.find({ 
        role: 'teacher',
        specialization: specialization
      });
      return teachers.map(teacher => ({ ...teacher.toObject(), id: teacher._id.toString() }));
    } catch (error) {
      console.error("Error getting teachers by specialization:", error);
      return [];
    }
  }

  async canTeacherVerifyAchievement(teacherId: string, achievementId: string): Promise<boolean> {
    try {
      // Get the achievement
      const achievement = await AchievementModel.findById(achievementId);
      if (!achievement) return false;

      // Get the student profile
      const studentProfile = await StudentProfileModel.findOne({ userId: achievement.studentId });
      if (!studentProfile) return false;

      // Get the teacher
      const teacher = await UserModel.findById(teacherId);
      if (!teacher || teacher.role !== 'teacher') return false;

      // Check if teacher's specialization matches student's branch OR has additional branch access
      if (teacher.specialization === studentProfile.branch) {
        return true;
      }

      // Check if teacher has additional branch access
      const additionalBranches = (teacher as any).additionalBranches || [];
      return additionalBranches.includes(studentProfile.branch);
    } catch (error) {
      console.error("Error checking teacher verification permissions:", error);
      return false;
    }
  }

  async searchUsers(query: string): Promise<User[]> {
    try {
      const users = await UserModel.find({
        $or: [
          { name: { $regex: query, $options: 'i' } },
          { email: { $regex: query, $options: 'i' } },
          { specialization: { $regex: query, $options: 'i' } }
        ]
      });
      return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }

  async searchStudentProfiles(query: string): Promise<StudentProfile[]> {
    try {
      const profiles = await StudentProfileModel.find({
        $or: [
          { rollNumber: { $regex: query, $options: 'i' } },
          { department: { $regex: query, $options: 'i' } },
          { branch: { $regex: query, $options: 'i' } },
          { course: { $regex: query, $options: 'i' } }
        ]
      }).populate('userId', 'name email');
      return profiles.map(profile => ({ ...profile.toObject(), id: profile._id.toString() }));
    } catch (error) {
      console.error("Error searching student profiles:", error);
      return [];
    }
  }

  async assignTeacherToStudent(studentProfileId: string, teacherId: string): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: teacherId },
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : undefined;
    } catch (error) {
      console.error("Error assigning teacher to student:", error);
      return undefined;
    }
  }

  async autoAssignTeacherByBranch(studentProfileId: string): Promise<StudentProfile | undefined> {
    try {
      // Get student profile
      const studentProfile = await StudentProfileModel.findById(studentProfileId);
      if (!studentProfile) {
        return undefined;
      }

      // Find teachers with matching specialization
      const teachers = await UserModel.find({
        role: 'teacher',
        specialization: studentProfile.branch
      });

      if (teachers.length === 0) {
        console.log(`No teachers found for branch: ${studentProfile.branch}`);
        // Try to find any teacher as fallback
        const anyTeachers = await UserModel.find({ role: 'teacher' });
        if (anyTeachers.length === 0) {
          console.log("No teachers available for assignment");
          return undefined;
        }
        
        // Get teacher with least workload
        const teacherWorkloads = await Promise.all(
          anyTeachers.map(async (teacher) => {
            const assignedStudents = await StudentProfileModel.countDocuments({
              assignedTeacher: teacher._id
            });
            return {
              teacher,
              workload: assignedStudents
            };
          })
        );

        teacherWorkloads.sort((a, b) => a.workload - b.workload);
        const selectedTeacher = teacherWorkloads[0].teacher;
        
        const updatedProfile = await StudentProfileModel.findByIdAndUpdate(
          studentProfileId,
          { assignedTeacher: selectedTeacher._id },
          { new: true }
        );

        console.log(`Auto-assigned fallback teacher ${selectedTeacher.name} to student ${studentProfile.rollNumber}`);
        return updatedProfile ? { ...updatedProfile.toObject(), id: updatedProfile._id.toString() } : undefined;
      }

      // Get teacher workload (number of assigned students)
      const teacherWorkloads = await Promise.all(
        teachers.map(async (teacher) => {
          const assignedStudents = await StudentProfileModel.countDocuments({
            assignedTeacher: teacher._id
          });
          return {
            teacher,
            workload: assignedStudents
          };
        })
      );

      // Sort by workload (ascending) to balance the load
      teacherWorkloads.sort((a, b) => a.workload - b.workload);
      
      // Assign the teacher with the lowest workload
      const selectedTeacher = teacherWorkloads[0].teacher;
      
      const updatedProfile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: selectedTeacher._id },
        { new: true }
      );

      console.log(`Auto-assigned teacher ${selectedTeacher.name} to student ${studentProfile.rollNumber} for branch ${studentProfile.branch}`);
      return updatedProfile ? { ...updatedProfile.toObject(), id: updatedProfile._id.toString() } : undefined;
    } catch (error) {
      console.error("Error auto-assigning teacher:", error);
      return undefined;
    }
  }

  async removeTeacherFromStudent(studentProfileId: string): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: null },
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : undefined;
    } catch (error) {
      console.error("Error removing teacher from student:", error);
      return undefined;
    }
  }





  // Achievement operations
  async getAchievement(id: string): Promise<Achievement | undefined> {
    try {
      const achievement = await AchievementModel.findById(id);
      return achievement ? { 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      } : undefined;
    } catch (error) {
      console.error("Error getting achievement:", error);
      return undefined;
    }
  }

  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ studentId });
      return achievements.map(achievement => ({ 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting achievements by student:", error);
      return [];
    }
  }

  async getAchievementsByDepartment(department: string): Promise<Achievement[]> {
    try {
      const profiles = await StudentProfileModel.find({ department });
      const studentIds = profiles.map(profile => profile.userId);
      const achievements = await AchievementModel.find({ studentId: { $in: studentIds } });
      return achievements.map(achievement => ({ 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting achievements by department:", error);
      return [];
    }
  }

  async getAchievementsByStatus(status: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ status });
      return achievements.map(achievement => ({ 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting achievements by status:", error);
      return [];
    }
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    try {
      const achievement = await AchievementModel.create(achievementData);
      return { 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      };
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }

  async updateAchievement(id: string, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(id, achievementData, { new: true });
      return achievement ? { 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      } : undefined;
    } catch (error) {
      console.error("Error updating achievement:", error);
      return undefined;
    }
  }

  async deleteAchievement(id: string): Promise<boolean> {
    try {
      const result = await AchievementModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting achievement:", error);
      return false;
    }
  }

  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find();
      return achievements.map(achievement => ({ 
        ...achievement.toObject(), 
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting all achievements:", error);
      return [];
    }
  }

  // Get achievements filtered by account type (demo vs official)
  async getAchievementsFilteredByType(adminEmail: string): Promise<Achievement[]> {
    try {
      const achievements = await this.getAllAchievements();
      const isAdminDemo = this.isDemoUser(adminEmail);
      
      // Get all users to filter achievements
      const allUsers = await this.getUsers();
      const filteredUserIds = allUsers
        .filter(user => this.isDemoUser(user.email) === isAdminDemo)
        .map(user => user.id);
      
      return achievements.filter(achievement => 
        filteredUserIds.includes(achievement.studentId)
      );
    } catch (error) {
      console.error("Error getting filtered achievements:", error);
      return [];
    }
  }

  // Department operations
  async getDepartment(id: string): Promise<Department | undefined> {
    try {
      const department = await DepartmentModel.findById(id);
      return department ? { ...department.toObject(), id: department._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting department:", error);
      return undefined;
    }
  }

  async getDepartmentByCode(code: string): Promise<Department | undefined> {
    try {
      const department = await DepartmentModel.findOne({ code: code.toUpperCase() });
      return department ? { ...department.toObject(), id: department._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting department by code:", error);
      return undefined;
    }
  }

  async getDepartmentByName(name: string): Promise<Department | undefined> {
    try {
      const department = await DepartmentModel.findOne({ name });
      return department ? { ...department.toObject(), id: department._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting department by name:", error);
      return undefined;
    }
  }

  async createDepartment(departmentData: InsertDepartment): Promise<Department> {
    try {
      const department = await DepartmentModel.create({
        ...departmentData,
        code: departmentData.code.toUpperCase()
      });
      return { ...department.toObject(), id: department._id.toString() };
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  }

  async updateDepartment(id: string, departmentData: Partial<Department>): Promise<Department | undefined> {
    try {
      const updateData = { ...departmentData };
      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }
      const department = await DepartmentModel.findByIdAndUpdate(id, updateData, { new: true });
      return department ? { ...department.toObject(), id: department._id.toString() } : undefined;
    } catch (error) {
      console.error("Error updating department:", error);
      return undefined;
    }
  }

  async deleteDepartment(id: string): Promise<boolean> {
    try {
      const result = await DepartmentModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting department:", error);
      return false;
    }
  }

  async getAllDepartments(): Promise<Department[]> {
    try {
      const departments = await DepartmentModel.find().sort({ name: 1 });
      const departmentsWithCounts = await Promise.all(
        departments.map(async (dept) => {
          // Count students by branch, not department
          const studentsCount = await StudentProfileModel.countDocuments({ branch: dept.name });
          // Count teachers by specialization
          const teachersCount = await UserModel.countDocuments({ 
            role: 'teacher', 
            specialization: dept.name 
          });
          
          return {
            ...dept.toObject(),
            id: dept._id.toString(),
            studentsCount,
            teachersCount
          };
        })
      );
      return departmentsWithCounts;
    } catch (error) {
      console.error("Error getting all departments:", error);
      return [];
    }
  }

  private async createDemoAchievements(studentId: string) {
    try {
      // Check if demo achievements already exist
      const existingAchievements = await AchievementModel.countDocuments({ studentId });
      if (existingAchievements > 0) {
        console.log("Demo achievements already exist for student:", studentId);
        return;
      }

      console.log("Creating demo achievements for student:", studentId);

      // Create demo achievements with the provided certificates
      const demoAchievements = [
        {
          studentId,
          title: "Bachelor of Science Degree",
          description: "Graduation certificate for Bachelor of Science degree from Maxwell International School. Awarded to Richard Sanchez on June 30, 2030.",
          type: "academic",
          dateOfActivity: new Date("2030-06-30"),
          proofUrl: "/uploads/degree_demo_student.pdf",
          status: "Verified",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          studentId,
          title: "National Health Seminar Participation",
          description: "Certificate of participation in National Seminars on 'Health' hosted by the University Of Aldenaire. Awarded to Anna Katrina Marchesi on November 22, 2023.",
          type: "co-curricular",
          dateOfActivity: new Date("2023-11-22"),
          proofUrl: "/uploads/participation_demo_student.pdf",
          status: "Verified",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const createdAchievements = await AchievementModel.insertMany(demoAchievements);
      console.log("Demo achievements created successfully:", createdAchievements.length, "achievements");
    } catch (error) {
      console.error("Error creating demo achievements:", error);
    }
  }

  private async forceDemoAchievementsCreation(studentId: string) {
    try {
      // Delete existing demo achievements first
      await AchievementModel.deleteMany({ studentId });
      console.log("Deleted existing demo achievements for student:", studentId);

      // Create demo achievements with the provided certificates
      const demoAchievements = [
        {
          studentId,
          title: "Bachelor of Science Degree",
          description: "Graduation certificate for Bachelor of Science degree from Maxwell International School. Awarded to Richard Sanchez on June 30, 2030.",
          type: "academic",
          dateOfActivity: new Date("2030-06-30"),
          proofUrl: "/uploads/degree_demo_student.pdf",
          status: "Verified",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          studentId,
          title: "National Health Seminar Participation",
          description: "Certificate of participation in National Seminars on 'Health' hosted by the University Of Aldenaire. Awarded to Anna Katrina Marchesi on November 22, 2023.",
          type: "co-curricular",
          dateOfActivity: new Date("2023-11-22"),
          proofUrl: "/uploads/participation_demo_student.pdf",
          status: "Verified",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const createdAchievements = await AchievementModel.insertMany(demoAchievements);
      console.log("Demo achievements forcibly created successfully:", createdAchievements.length, "achievements");
    } catch (error) {
      console.error("Error forcibly creating demo achievements:", error);
    }
  }

  async clearAllData() {
    try {
      // Delete all users, student profiles, and achievements
      await AchievementModel.deleteMany({});
      await StudentProfileModel.deleteMany({});
      await UserModel.deleteMany({});
      
      console.log("All data cleared successfully");
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  }

  async clearDemoData() {
    try {
      // Delete all demo users (admin, teachers, students)
      const demoUsers = await UserModel.find({ 
        email: { $regex: "@example\\.com$" } 
      });
      
      for (const user of demoUsers) {
        // Delete student profiles for demo students
        await StudentProfileModel.deleteMany({ userId: user._id });
        
        // Delete achievements for demo students
        await AchievementModel.deleteMany({ studentId: user._id.toString() });
        
        // Delete the user
        await UserModel.deleteOne({ _id: user._id });
      }
      
      console.log("Demo data cleared successfully");
    } catch (error) {
      console.error("Error clearing demo data:", error);
    }
  }

  private async ensureDemoAchievements() {
    try {
      // Get demo student user
      const demoStudent = await UserModel.findOne({ email: "demo.student@example.com" });
      if (!demoStudent) {
        console.log("Demo student not found, skipping demo achievements creation");
        return;
      }

      // Force create demo achievements
      await this.forceDemoAchievementsCreation(demoStudent._id.toString());
    } catch (error) {
      console.error("Error ensuring demo achievements:", error);
    }
  }

  private async createDefaultDepartments() {
    try {
      // Check if departments already exist
      const existingDepartments = await DepartmentModel.countDocuments();
      if (existingDepartments > 0) {
        console.log("Departments already exist");
        return;
      }

      // Create default departments - Only B.Tech and M.Tech Engineering Branches
      const defaultDepartments = [
        {
          name: "Computer Science and Engineering",
          code: "CSE",
          description: "B.Tech and M.Tech programs in Computer Science and Engineering focusing on software development, algorithms, and computer systems."
        },
        {
          name: "Electrical Engineering",
          code: "EE",
          description: "B.Tech and M.Tech programs in Electrical Engineering specializing in electrical systems, power, and control engineering."
        },
        {
          name: "Information Technology",
          code: "IT",
          description: "B.Tech and M.Tech programs in Information Technology focusing on software systems, networking, and IT infrastructure."
        },
        {
          name: "Electronics and Communication Engineering",
          code: "ECE",
          description: "B.Tech and M.Tech programs in Electronics and Communication Engineering specializing in electronic systems and communication technologies."
        },
        {
          name: "Civil Engineering",
          code: "CE",
          description: "B.Tech and M.Tech programs in Civil Engineering focusing on infrastructure, construction, and urban planning."
        },
        {
          name: "Mechanical Engineering",
          code: "ME",
          description: "B.Tech and M.Tech programs in Mechanical Engineering covering design, manufacturing, and mechanical systems."
        }
      ];

      await DepartmentModel.insertMany(defaultDepartments);
      console.log("Default departments created successfully");
    } catch (error) {
      console.error("Error creating default departments:", error);
    }
  }
}

// Create storage instance
export const createStorage = (): IStorage => {
  const storage = new MongoStorage();
  // Clear all data and create accounts when storage is initialized
  setTimeout(() => {
    (storage as any).clearAllData().then(() => {
      (storage as any).createOfficialAccounts();
      (storage as any).createDemoAccounts();
      (storage as any).createDefaultDepartments();
      (storage as any).ensureDemoAchievements();
    });
  }, 1000);
  return storage;
};