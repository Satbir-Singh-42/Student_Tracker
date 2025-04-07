import { users, type User, type InsertUser, type StudentProfile, type InsertStudentProfile, type Achievement, type InsertAchievement } from "@shared/schema";

// Define the storage interface
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: number, user: Partial<User>): Promise<User | undefined>;
  deleteUser(id: number): Promise<boolean>;
  getUsers(): Promise<User[]>;
  getUsersByRole(role: string): Promise<User[]>;
  getUsersByDepartment(department: string): Promise<User[]>;
  
  // Student profile operations
  getStudentProfile(userId: number): Promise<StudentProfile | undefined>;
  createStudentProfile(profile: InsertStudentProfile): Promise<StudentProfile>;
  updateStudentProfile(userId: number, profile: Partial<StudentProfile>): Promise<StudentProfile | undefined>;
  
  // Achievement operations
  getAchievement(id: number): Promise<Achievement | undefined>;
  getAchievementsByStudent(studentId: number): Promise<Achievement[]>;
  getAchievementsByDepartment(department: string): Promise<Achievement[]>;
  getAchievementsByStatus(status: string): Promise<Achievement[]>;
  createAchievement(achievement: InsertAchievement): Promise<Achievement>;
  updateAchievement(id: number, achievement: Partial<Achievement>): Promise<Achievement | undefined>;
  deleteAchievement(id: number): Promise<boolean>;
  getAllAchievements(): Promise<Achievement[]>;
}

// In-memory storage implementation
export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private studentProfiles: Map<number, StudentProfile>;
  private achievements: Map<number, Achievement>;
  private currentUserId: number;
  private currentProfileId: number;
  private currentAchievementId: number;

  constructor() {
    this.users = new Map();
    this.studentProfiles = new Map();
    this.achievements = new Map();
    this.currentUserId = 1;
    this.currentProfileId = 1;
    this.currentAchievementId = 1;
    
    // Add a default admin user
    const adminUser: User = {
      id: this.currentUserId++,
      name: "Admin User",
      email: "admin@example.com",
      password: "$2b$10$TmVRx9FvuYXDcgMsUDOjO.nA3.2P3eyqvfq/0H3p5iyVXf0o2hVY2", // hashed "admin123"
      role: "admin",
      profileImage: null
    };
    this.users.set(adminUser.id, adminUser);
  }

  // User operations
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.email === email);
  }

  async createUser(userData: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...userData, id };
    this.users.set(id, user);
    return user;
  }

  async updateUser(id: number, userData: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...userData };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async getUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async getUsersByRole(role: string): Promise<User[]> {
    return Array.from(this.users.values()).filter(user => user.role === role);
  }

  async getUsersByDepartment(department: string): Promise<User[]> {
    const studentProfilesWithDept = Array.from(this.studentProfiles.values())
      .filter(profile => profile.department === department);
    
    const userIds = studentProfilesWithDept.map(profile => profile.userId);
    return Array.from(this.users.values())
      .filter(user => userIds.includes(user.id));
  }

  // Student profile operations
  async getStudentProfile(userId: number): Promise<StudentProfile | undefined> {
    return Array.from(this.studentProfiles.values())
      .find(profile => profile.userId === userId);
  }

  async createStudentProfile(profileData: InsertStudentProfile): Promise<StudentProfile> {
    const id = this.currentProfileId++;
    const profile: StudentProfile = { ...profileData, id };
    this.studentProfiles.set(id, profile);
    return profile;
  }

  async updateStudentProfile(userId: number, profileData: Partial<StudentProfile>): Promise<StudentProfile | undefined> {
    const profile = Array.from(this.studentProfiles.values())
      .find(p => p.userId === userId);
    
    if (!profile) return undefined;
    
    const updatedProfile = { ...profile, ...profileData };
    this.studentProfiles.set(profile.id, updatedProfile);
    return updatedProfile;
  }

  // Achievement operations
  async getAchievement(id: number): Promise<Achievement | undefined> {
    return this.achievements.get(id);
  }

  async getAchievementsByStudent(studentId: number): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.studentId === studentId);
  }

  async getAchievementsByDepartment(department: string): Promise<Achievement[]> {
    const studentProfilesWithDept = Array.from(this.studentProfiles.values())
      .filter(profile => profile.department === department);
    
    const userIds = studentProfilesWithDept.map(profile => profile.userId);
    return Array.from(this.achievements.values())
      .filter(achievement => userIds.includes(achievement.studentId));
  }

  async getAchievementsByStatus(status: string): Promise<Achievement[]> {
    return Array.from(this.achievements.values())
      .filter(achievement => achievement.status === status);
  }

  async createAchievement(achievementData: InsertAchievement): Promise<Achievement> {
    const id = this.currentAchievementId++;
    const achievement: Achievement = { 
      ...achievementData, 
      id,
      lastUpdated: new Date()
    };
    this.achievements.set(id, achievement);
    return achievement;
  }

  async updateAchievement(id: number, achievementData: Partial<Achievement>): Promise<Achievement | undefined> {
    const achievement = this.achievements.get(id);
    if (!achievement) return undefined;
    
    const updatedAchievement = { 
      ...achievement, 
      ...achievementData,
      lastUpdated: new Date()
    };
    this.achievements.set(id, updatedAchievement);
    return updatedAchievement;
  }

  async deleteAchievement(id: number): Promise<boolean> {
    return this.achievements.delete(id);
  }

  async getAllAchievements(): Promise<Achievement[]> {
    return Array.from(this.achievements.values());
  }
}

export const storage = new MemStorage();
