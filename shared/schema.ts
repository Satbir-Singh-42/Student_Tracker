import { z } from "zod";

// User Model Schema
export const insertUserSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "teacher", "admin"]),
  profileImage: z.string().optional(),
});

// Student Profile Model Schema
export const insertStudentProfileSchema = z.object({
  userId: z.string().min(1, { message: "User ID is required" }),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  course: z.string().min(1, { message: "Course is required" }),
});

// Achievement Model Schema
export const insertAchievementSchema = z.object({
  studentId: z.string().min(1, { message: "Student ID is required" }),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  type: z.enum(["academic", "sports", "co-curricular", "extra-curricular"]),
  dateOfActivity: z.date(),
  proofUrl: z.string().min(1, { message: "Proof URL is required" }),
  status: z.enum(["Submitted", "Pending", "Verified", "Rejected"]).default("Submitted"),
  feedback: z.string().optional(),
});

// Authentication Schemas
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  ...insertUserSchema.shape,
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const studentRegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "teacher", "admin"]),
  profileImage: z.string().optional(),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  department: z.string().min(1, { message: "Department is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  course: z.string().min(1, { message: "Course is required" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Types
export type User = {
  id: string;
  name: string;
  email: string;
  password: string;
  role: "student" | "teacher" | "admin";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type StudentProfile = {
  _id: string;
  userId: string;
  rollNumber: string;
  department: string;
  year: string;
  course: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Achievement = {
  _id: string;
  studentId: string;
  title: string;
  description: string;
  type: "academic" | "sports" | "co-curricular" | "extra-curricular";
  dateOfActivity: Date;
  proofUrl: string;
  status: "Submitted" | "Pending" | "Verified" | "Rejected";
  feedback?: string;
  createdAt: Date;
  updatedAt: Date;
};

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type StudentRegister = z.infer<typeof studentRegisterSchema>;
