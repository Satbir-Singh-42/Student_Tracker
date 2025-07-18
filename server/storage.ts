import { type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Achievement, type InsertAchievement } from "@shared/schema";
import { UserModel, StudentProfileModel, AchievementModel } from "./models";
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
      return achievement ? { ...achievement.toObject(), id: achievement._id.toString() } : undefined;
    } catch (error) {
      console.error("Error getting achievement:", error);
      return undefined;
    }
  }

  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ studentId });
      return achievements.map(achievement => ({ ...achievement.toObject(), id: achievement._id.toString() }));
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
      return achievements.map(achievement => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting achievements by department:", error);
      return [];
    }
  }

  async getAchievementsByStatus(status: string): Promise<Achievement[]> {
    try {
      const achievements = await AchievementModel.find({ status });
      return achievements.map(achievement => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting achievements by status:", error);
      return [];
    }
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    try {
      const achievement = await AchievementModel.create(achievementData);
      return { ...achievement.toObject(), id: achievement._id.toString() };
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }

  async updateAchievement(id: string, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(id, achievementData, { new: true });
      return achievement ? { ...achievement.toObject(), id: achievement._id.toString() } : undefined;
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
      return achievements.map(achievement => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting all achievements:", error);
      return [];
    }
  }
}

// Create storage instance
export const createStorage = (): IStorage => {
  const storage = new MongoStorage();
  // Create official accounts when storage is initialized
  setTimeout(() => {
    (storage as any).createOfficialAccounts();
  }, 1000);
  return storage;
};