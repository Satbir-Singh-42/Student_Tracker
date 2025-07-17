import { type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Achievement, type InsertAchievement } from "@shared/schema";
import { UserModel, StudentProfileModel, AchievementModel } from "./models";
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
}

// MongoDB storage implementation
export class MongoStorage implements IStorage {
  constructor() {
    // Initialize demo accounts after a short delay to ensure connection
    setTimeout(() => {
      this.createDemoAccounts();
    }, 1000);
  }
  
  // Create demo accounts for different roles
  private async createDemoAccounts() {
    try {
      // Check if demo accounts already exist
      const existingAdmin = await UserModel.findOne({ email: "admin@example.com" });
      if (existingAdmin) return;

      // Hash password for demo accounts
      const hashedPassword = await bcrypt.hash("password123", 10);

      // Create admin user
      const adminUser = await UserModel.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
      });

      // Create teacher user
      const teacherUser = await UserModel.create({
        name: "Teacher User",
        email: "teacher@example.com",
        password: hashedPassword,
        role: "teacher"
      });

      // Create student user
      const studentUser = await UserModel.create({
        name: "Student User",
        email: "student@example.com",
        password: hashedPassword,
        role: "student"
      });

      // Create student profile
      const studentProfile = await StudentProfileModel.create({
        userId: studentUser._id,
        rollNumber: "S12345",
        department: "Computer Science",
        year: "3rd Year",
        course: "B.Tech"
      });

      // Create sample achievements
      await AchievementModel.create([
        {
          studentId: studentUser._id,
          title: "Best Project Award",
          description: "Received the best project award for innovative web application",
          type: "academic",
          dateOfActivity: new Date(2023, 9, 15),
          proofUrl: "/uploads/sample-certificate.pdf",
          status: "Verified",
          feedback: "Excellent work on the project!"
        },
        {
          studentId: studentUser._id,
          title: "College Cricket Team",
          description: "Selected for college cricket team and participated in inter-college tournament",
          type: "sports",
          dateOfActivity: new Date(2023, 5, 10),
          proofUrl: "/uploads/cricket-team-selection.pdf",
          status: "Verified",
          feedback: "Great contribution to the team"
        },
        {
          studentId: studentUser._id,
          title: "Web Development Workshop",
          description: "Organized a web development workshop for junior students",
          type: "co-curricular",
          dateOfActivity: new Date(2023, 11, 5),
          proofUrl: "/uploads/workshop-photos.pdf",
          status: "Pending",
          feedback: null
        }
      ]);

      console.log("Demo accounts created successfully");
    } catch (error) {
      console.error("Error creating demo accounts:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      return user ? { ...user.toObject(), _id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting user:", error);
      return undefined;
    }
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findOne({ email });
      return user ? { ...user.toObject(), _id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return undefined;
    }
  }

  async createUser(userData: InsertUser): Promise<User> {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await UserModel.create({
        ...userData,
        password: hashedPassword
      });
      return { ...user.toObject(), _id: user._id.toString() };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    try {
      const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
      return user ? { ...user.toObject(), _id: user._id.toString() } : undefined;
    } catch (error) {
      console.error("Error updating user:", error);
      return undefined;
    }
  }

  async deleteUser(id: string): Promise<boolean> {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }

  async getUsers(): Promise<User[]> {
    try {
      const users = await UserModel.find();
      return users.map(user => ({ ...user.toObject(), _id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }

  async getUsersByRole(role: string): Promise<User[]> {
    try {
      const users = await UserModel.find({ role });
      return users.map(user => ({ ...user.toObject(), _id: user._id.toString() }));
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
      return users.map(user => ({ ...user.toObject(), _id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by department:", error);
      return [];
    }
  }

  // Student profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findOne({ userId });
      return profile ? { ...profile.toObject(), _id: profile._id.toString(), userId: profile.userId.toString() } : undefined;
    } catch (error) {
      console.error("Error getting student profile:", error);
      return undefined;
    }
  }

  async createStudentProfile(profileData: InsertStudentProfile): Promise<StudentProfile> {
    try {
      const profile = await StudentProfileModel.create(profileData);
      return { ...profile.toObject(), _id: profile._id.toString(), userId: profile.userId.toString() };
    } catch (error) {
      console.error("Error creating student profile:", error);
      throw error;
    }
  }

  async updateStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    try {
      const profile = await StudentProfileModel.findOneAndUpdate({ userId }, profileData, { new: true });
      return profile ? { ...profile.toObject(), _id: profile._id.toString(), userId: profile.userId.toString() } : undefined;
    } catch (error) {
      console.error("Error updating student profile:", error);
      return undefined;
    }
  }

  // Achievement operations
  async getAchievement(id: string): Promise<Achievement | undefined> {
    try {
      const achievement = await AchievementModel.findById(id);
      return achievement ? { ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() } : undefined;
    } catch (error) {
      console.error("Error getting achievement:", error);
      return undefined;
    }
  }

  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ studentId });
      return achievements.map(achievement => ({ ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() }));
    } catch (error) {
      console.error("Error getting achievements by student:", error);
      return [];
    }
  }

  async getAchievementsByDepartment(department: string): Promise<Achievement[]> {
    try {
      const profiles = await StudentProfileModel.find({ department });
      const userIds = profiles.map(profile => profile.userId);
      const achievements = await AchievementModel.find({ studentId: { $in: userIds } });
      return achievements.map(achievement => ({ ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() }));
    } catch (error) {
      console.error("Error getting achievements by department:", error);
      return [];
    }
  }

  async getAchievementsByStatus(status: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ status });
      return achievements.map(achievement => ({ ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() }));
    } catch (error) {
      console.error("Error getting achievements by status:", error);
      return [];
    }
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    try {
      const achievement = await AchievementModel.create(achievementData);
      return { ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() };
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }

  async updateAchievement(id: string, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(id, achievementData, { new: true });
      return achievement ? { ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() } : undefined;
    } catch (error) {
      console.error("Error updating achievement:", error);
      return undefined;
    }
  }

  async deleteAchievement(id: string): Promise<boolean> {
    try {
      const result = await AchievementModel.findByIdAndDelete(id);
      return !!result;
    } catch (error) {
      console.error("Error deleting achievement:", error);
      return false;
    }
  }

  async getAllAchievements(): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find();
      return achievements.map(achievement => ({ ...achievement.toObject(), _id: achievement._id.toString(), studentId: achievement.studentId.toString() }));
    } catch (error) {
      console.error("Error getting all achievements:", error);
      return [];
    }
  }
}

export const storage = new MongoStorage();
