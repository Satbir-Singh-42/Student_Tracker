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
    
    // Add demo accounts for all roles
    this.createDemoAccounts();
  }
  
  // Create demo accounts for different roles
  private createDemoAccounts() {
    // Admin user
    const adminUser: User = {
      id: this.currentUserId++,
      name: "Admin User",
      email: "admin@example.com",
      password: "password123", // Plain password for demo accounts
      role: "admin",
      profileImage: null
    };
    this.users.set(adminUser.id, adminUser);
    
    // Teacher user
    const teacherUser: User = {
      id: this.currentUserId++,
      name: "Teacher User",
      email: "teacher@example.com",
      password: "password123", // Plain password for demo accounts
      role: "teacher",
      profileImage: null
    };
    this.users.set(teacherUser.id, teacherUser);
    
    // Student user
    const studentUser: User = {
      id: this.currentUserId++,
      name: "Student User",
      email: "student@example.com",
      password: "password123", // Plain password for demo accounts
      role: "student",
      profileImage: null
    };
    this.users.set(studentUser.id, studentUser);
    
    // Create student profile for the student user
    const studentProfile: StudentProfile = {
      id: this.currentProfileId++,
      userId: studentUser.id,
      rollNumber: "S12345",
      department: "Computer Science",
      year: "3rd Year",
      course: "B.Tech"
    };
    this.studentProfiles.set(studentProfile.id, studentProfile);
    
    // Add some sample achievements for the student
    const achievements: Achievement[] = [
      {
        id: this.currentAchievementId++,
        studentId: studentUser.id,
        title: "Best Project Award",
        description: "Received the best project award for innovative web application",
        type: "academic",
        dateOfActivity: new Date(2023, 9, 15),
        proofUrl: "/uploads/sample-certificate.pdf",
        status: "Verified",
        feedback: "Excellent work on the project!",
        lastUpdated: new Date()
      },
      {
        id: this.currentAchievementId++,
        studentId: studentUser.id,
        title: "College Cricket Team",
        description: "Selected for college cricket team and participated in inter-college tournament",
        type: "sports",
        dateOfActivity: new Date(2023, 5, 10),
        proofUrl: "/uploads/cricket-team-selection.pdf",
        status: "Verified",
        feedback: "Great contribution to the team",
        lastUpdated: new Date()
      },
      {
        id: this.currentAchievementId++,
        studentId: studentUser.id,
        title: "Web Development Workshop",
        description: "Organized a web development workshop for junior students",
        type: "co-curricular",
        dateOfActivity: new Date(2023, 11, 5),
        proofUrl: "/uploads/workshop-photos.pdf",
        status: "Pending",
        feedback: null,
        lastUpdated: new Date()
      }
    ];
    
    // Add the achievements to the Map
    achievements.forEach(achievement => {
      this.achievements.set(achievement.id, achievement);
    });
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
    // Ensure profileImage is not undefined
    const user: User = { 
      ...userData, 
      id,
      profileImage: userData.profileImage || null
    };
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
      lastUpdated: new Date(),
      // Ensure required fields have default values if not provided
      status: achievementData.status || "Submitted",
      feedback: achievementData.feedback || null
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
