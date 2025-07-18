import { z } from "zod";

// User Types
export interface User {
  id: number;
  name: string;
  email: string;
  role: "student" | "teacher" | "admin";
  profileImage: string | null;
  specialization?: string;
  additionalBranches?: string[];
}

export interface StudentProfile {
  id: number;
  userId: number;
  rollNumber: string;
  department: string;
  branch: string;
  year: string;
  course: string;
}

// Achievement Types
export interface Achievement {
  id: number;
  studentId: number;
  title: string;
  description: string;
  type: "academic" | "sports" | "co-curricular" | "extra-curricular";
  dateOfActivity: Date;
  proofUrl: string;
  status: "Submitted" | "Pending" | "Verified" | "Rejected";
  feedback?: string;
  lastUpdated: Date;
}

// Form Schemas
export const loginSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

export const registerSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "teacher", "admin"]).default("student"),
  specialization: z.string().optional(),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const studentRegisterSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z.enum(["student", "teacher", "admin"]).default("student"),
  rollNumber: z.string().min(1, { message: "Roll number is required" }),
  branch: z.string().min(1, { message: "Branch is required" }),
  year: z.string().min(1, { message: "Year is required" }),
  course: z.string().min(1, { message: "Course is required" }),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export const achievementSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  type: z.enum(["academic", "sports", "co-curricular", "extra-curricular"], {
    errorMap: () => ({ message: "Please select a valid type" })
  }),
  dateOfActivity: z.date({
    required_error: "Date of activity is required",
  }),
  proof: z.instanceof(File, { message: "Proof file is required" }).refine(
    (file) => file.size <= 5 * 1024 * 1024, 
    { message: "File must be less than 5MB" }
  ).refine(
    (file) => {
      const validTypes = ["image/jpeg", "image/png", "application/pdf", "text/csv", "application/vnd.ms-excel"];
      return validTypes.includes(file.type);
    },
    { message: "File must be JPG, PNG, PDF, or CSV" }
  ),
});

export const verificationSchema = z.object({
  status: z.enum(["Verified", "Rejected"]),
  feedback: z.string().optional(),
}).refine(
  data => data.status !== "Rejected" || !!data.feedback,
  { 
    message: "Feedback is required when rejecting",
    path: ["feedback"] 
  }
);

// Statistics Types
export interface Statistics {
  totalCount: number;
  verifiedCount: number;
  pendingCount: number;
  rejectedCount: number;
  typeStats: {
    academic: number;
    sports: number;
    "co-curricular": number;
    "extra-curricular": number;
  };
  successRate: number;
}
