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
  
  // Student profile operations
  getStudentProfile(userId: string): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(userId: string, profile: Partial<StudentProfile>): Promise<StudentProfile | undefined>;
  
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

      // Create teacher users
      const teacher1 = await UserModel.create({
        name: "Dr. Rajesh Kumar",
        email: "rajesh.kumar@satvirnagra.com",
        password: teacherPassword,
        role: "teacher"
      });

      const teacher2 = await UserModel.create({
        name: "Prof. Priya Sharma",
        email: "priya.sharma@satvirnagra.com",
        password: teacherPassword,
        role: "teacher"
      });

      console.log("Official accounts created successfully");
      console.log("Admin: admin@satvirnagra.com / Admin@2025!");
      console.log("Teacher 1: rajesh.kumar@satvirnagra.com / Teacher@2025!");
      console.log("Teacher 2: priya.sharma@satvirnagra.com / Teacher@2025!");
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
        return;
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

      // Create demo teacher user
      const demoTeacherUser = await UserModel.create({
        name: "Demo Teacher",
        email: "demo.teacher@example.com",
        password: demoPassword,
        role: "teacher"
      });

      // Create demo student user
      const demoStudentUser = await UserModel.create({
        name: "Demo Student",
        email: "demo.student@example.com",
        password: demoPassword,
        role: "student"
      });

      // Create demo student profile
      await StudentProfileModel.create({
        userId: demoStudentUser._id,
        rollNumber: "DEMO001",
        department: "Computer Science",
        year: "third",
        course: "B.Tech"
      });

      // Force create demo achievements for the student
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

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await UserModel.find({ role });
      return users.map(user => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by role:", error);
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
          const studentsCount = await StudentProfileModel.countDocuments({ department: dept.name });
          const teachersCount = await UserModel.countDocuments({ role: 'teacher' }); // In a real system, teachers would be assigned to departments
          
          return {
            ...dept.toObject(),
            id: dept._id.toString(),
            studentsCount,
            teachersCount: Math.floor(teachersCount / departments.length) // Distribute teachers evenly for demo
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

      // Create default departments
      const defaultDepartments = [
        {
          name: "Computer Science and Engineering",
          code: "CSE",
          description: "Computer Science and Engineering Department focusing on software development, algorithms, and computer systems."
        },
        {
          name: "Electronics and Communication Engineering",
          code: "ECE",
          description: "Electronics and Communication Engineering Department specializing in electronic systems and communication technologies."
        },
        {
          name: "Mechanical Engineering",
          code: "MECH",
          description: "Mechanical Engineering Department covering design, manufacturing, and mechanical systems."
        },
        {
          name: "Civil Engineering",
          code: "CIVIL",
          description: "Civil Engineering Department focusing on infrastructure, construction, and urban planning."
        },
        {
          name: "Electrical Engineering",
          code: "EEE",
          description: "Electrical Engineering Department specializing in electrical systems, power, and control engineering."
        },
        {
          name: "Information Technology",
          code: "IT",
          description: "Information Technology Department focusing on software systems, networking, and IT infrastructure."
        },
        {
          name: "Biotechnology",
          code: "BIOTECH",
          description: "Biotechnology Department combining biology and technology for innovative solutions."
        },
        {
          name: "Chemical Engineering",
          code: "CHEM",
          description: "Chemical Engineering Department focusing on chemical processes and materials engineering."
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
  // Create both official and demo accounts when storage is initialized
  setTimeout(() => {
    (storage as any).createOfficialAccounts();
    (storage as any).createDemoAccounts();
    (storage as any).createDefaultDepartments();
    (storage as any).ensureDemoAchievements();
  }, 1000);
  return storage;
};