import { type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Achievement, type InsertAchievement } from "@shared/schema";
import bcrypt from 'bcrypt';

// Storage interface (duplicated to avoid circular import)
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

// In-memory storage implementation for development fallback
export class FallbackMemoryStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private studentProfiles: Map<string, StudentProfile> = new Map();
  private achievements: Map<string, Achievement> = new Map();
  private currentId: number = 1;

  constructor() {
    // Create demo accounts immediately
    this.createDemoAccounts();
  }

  private generateId(): string {
    return (this.currentId++).toString();
  }

  private async createDemoAccounts() {
    try {
      // Hash password for demo accounts
      const hashedPassword = await bcrypt.hash("password123", 10);

      // Create admin user
      const adminUser: User = {
        _id: this.generateId(),
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(adminUser._id, adminUser);

      // Create teacher user
      const teacherUser: User = {
        _id: this.generateId(),
        name: "Teacher User",
        email: "teacher@example.com",
        password: hashedPassword,
        role: "teacher",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(teacherUser._id, teacherUser);

      // Create student user
      const studentUser: User = {
        _id: this.generateId(),
        name: "Student User",
        email: "student@example.com",
        password: hashedPassword,
        role: "student",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.users.set(studentUser._id, studentUser);

      // Create student profile
      const studentProfile: StudentProfile = {
        _id: this.generateId(),
        userId: studentUser._id,
        rollNumber: "S12345",
        department: "Computer Science",
        year: "3rd Year",
        course: "B.Tech",
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.studentProfiles.set(studentProfile._id, studentProfile);

      // Create sample achievements
      const achievements: Achievement[] = [
        {
          _id: this.generateId(),
          studentId: studentUser._id,
          title: "Best Project Award",
          description: "Received the best project award for innovative web application",
          type: "academic",
          dateOfActivity: new Date(2023, 9, 15),
          proofUrl: "/uploads/sample-certificate.pdf",
          status: "Verified",
          feedback: "Excellent work on the project!",
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          _id: this.generateId(),
          studentId: studentUser._id,
          title: "College Cricket Team",
          description: "Selected for college cricket team and participated in inter-college tournament",
          type: "sports",
          dateOfActivity: new Date(2023, 5, 10),
          proofUrl: "/uploads/cricket-team-selection.pdf",
          status: "Verified",
          feedback: "Great contribution to the team",
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      achievements.forEach(achievement => {
        this.achievements.set(achievement._id, achievement);
      });

      console.log("Demo accounts created successfully in memory");
    } catch (error) {
      console.error("Error creating demo accounts:", error);
    }
  }

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const user: User = {
      _id: this.generateId(),
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.users.set(user._id, user);
    return user;
  }

  async updateUser(id: string, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    const profiles = Array.from(this.studentProfiles.values())
      .filter(profile => profile.department === department);
    const userIds = profiles.map(profile => profile.userId);
    return Array.from(this.users.values()).filter(user => userIds.includes(user._id));
  }

  // Student profile operations
  async getStudentProfile(userId: string): Promise<StudentProfile | undefined> {
    return Array.from(this.studentProfiles.values()).find(profile => profile.userId === userId);
  }

  async createStudentProfile(profileData: InsertStudentProfile): Promise<StudentProfile> {
    const profile: StudentProfile = {
      _id: this.generateId(),
      ...profileData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.studentProfiles.set(profile._id, profile);
    return profile;
  }

  async updateStudentProfile(userId: string, profileData: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    const profile = Array.from(this.studentProfiles.values()).find(p => p.userId === userId);
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData, updatedAt: new Date() };
    this.studentProfiles.set(profile._id, updatedProfile);
    return updatedProfile;
  }

  // Achievement operations
  async getAchievement(id: string): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAchievementsByStudent(studentId: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.studentId === studentId);
  }

  async getAchievementsByDepartment(department: string): Promise<Achievement[]> {
    const profiles = Array.from(this.studentProfiles.values())
      .filter(profile => profile.department === department);
    const userIds = profiles.map(profile => profile.userId);
    return Array.from(this.achievements.values()).filter(achievement => userIds.includes(achievement.studentId));
  }

  async getAchievementsByStatus(status: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values()).filter(achievement => achievement.status === status);
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const achievement: Achievement = {
      _id: this.generateId(),
      ...achievementData,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.achievements.set(achievement._id, achievement);
    return achievement;
  }

  async updateAchievement(id: string, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    
    const updatedAchievement = { ...achievement, ...achievementData, updatedAt: new Date() };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: string): Promise<boolean> {
    return this.achievements.delete(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
}