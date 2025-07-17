import { pgTable, text, serial, integer, boolean, timestamp, uuid } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User Model
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role", { enum: ["student", "teacher", "admin"] }).notNull(),
  profileImage: text("profile_image"),
});

// Student Profile Model
export const studentProfiles = pgTable("student_profiles", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  rollNumber: text("roll_number").notNull().unique(),
  department: text("department").notNull(),
  year: text("year").notNull(),
  course: text("course").notNull(),
});

// Achievement Model
export const achievements = pgTable("achievements", {
  id: serial("id").primaryKey(),
  studentId: integer("student_id").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type", { enum: ["academic", "sports", "co-curricular", "extra-curricular"] }).notNull(),
  dateOfActivity: timestamp("date_of_activity").notNull(),
  proofUrl: text("proof_url").notNull(),
  status: text("status", { enum: ["Submitted", "Pending", "Verified", "Rejected"] }).notNull().default("Submitted"),
  feedback: text("feedback"),
  lastUpdated: timestamp("last_updated").notNull().defaultNow(),
});

// Validation Schemas
export const insertUserSchema = createInsertSchema(users).omit({ id: true });
export const insertStudentProfileSchema = createInsertSchema(studentProfiles).omit({ id: true });
export const insertAchievementSchema = createInsertSchema(achievements).omit({ id: true, lastUpdated: true });

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
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type StudentProfile = typeof studentProfiles.$inferSelect;
export type InsertStudentProfile = z.infer<typeof insertStudentProfileSchema>;
export type Achievement = typeof achievements.$inferSelect;
export type InsertAchievement = z.infer<typeof insertAchievementSchema>;
export type Login = z.infer<typeof loginSchema>;
export type Register = z.infer<typeof registerSchema>;
export type StudentRegister = z.infer<typeof studentRegisterSchema>;
