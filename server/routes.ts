import express, { type Express, type Request, type Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { createStorage } from "./storage";
import { getMongoDBStatus } from "./database";
import { z } from "zod";
import { globalErrorHandler, notFoundHandler, asyncHandler } from "./middleware/errorHandler";
import { securityHeaders, corsMiddleware, generalLimiter, authLimiter, uploadLimiter } from "./middleware/security";
import { validateBody, validateParams, idParamSchema } from "./middleware/validation";
import {
  loginSchema,
  registerSchema,
  studentRegisterSchema,
  insertAchievementSchema,
  insertStudentProfileSchema,
  insertUserSchema
} from "@shared/schema";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fromZodError } from "zod-validation-error";

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";

// Setup multer for file uploads
const uploadDir = path.join(import.meta.dirname, "../uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});

const upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed."));
    }
  }
});

// Middleware to verify JWT token
const authenticateToken = (req: Request, res: Response, next: any) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ message: "No token provided" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};

// Middleware to check role
const checkRole = (roles: string[]) => {
  return (req: Request, res: Response, next: any) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);
  
  // Initialize storage
  const storage = createStorage();

  // Apply security middleware
  app.use(securityHeaders);
  app.use(corsMiddleware);
  
  // Apply rate limiting only in production
  if (process.env.NODE_ENV === 'production') {
    app.use(generalLimiter);
  }

  // Set up Express to handle JSON and URLencoded bodies
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Serve uploaded files
  app.use('/uploads', express.static(uploadDir));

  // Health check endpoint
  app.head("/api/health", (req: Request, res: Response) => {
    res.status(200).end();
  });

  app.get("/api/health", (req: Request, res: Response) => {
    res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // Authentication Routes
  app.post("/api/auth/login", authLimiter, validateBody(loginSchema), asyncHandler(async (req: Request, res: Response) => {
      const validatedData = req.body;
      
      const user = await storage.getUserByEmail(validatedData.email);
      if (!user) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Compare password with bcrypt
      const isPasswordValid = await bcrypt.compare(validatedData.password, user.password);
      
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }

      // Generate JWT token
      const token = jwt.sign(
        { id: user.id, email: user.email, role: user.role, name: user.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.json({
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          profileImage: user.profileImage
        },
        token
      });
  }));

  // Logout endpoint
  app.post("/api/auth/logout", (req, res) => {
    // Since we're using JWT, we don't need to do anything on the server
    // The client will clear the token
    res.status(200).json({ message: "Logged out successfully" });
  });
  

  app.post("/api/auth/register", authLimiter, validateBody(studentRegisterSchema), asyncHandler(async (req, res) => {
      const validatedData = req.body;
      
      // Check for duplicate email
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      // Check for duplicate roll number
      const students = await storage.getUsersByRole("student");
      for (const student of students) {
        const profile = await storage.getStudentProfile(student.id);
        if (profile && profile.rollNumber === validatedData.rollNumber) {
          return res.status(400).json({ message: "Roll number is already registered" });
        }
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user with student role
      const userData = {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: "student" as const,
        profileImage: null
      };

      const newUser = await storage.createUser(userData);

      // Create student profile
      const profileData = {
        userId: newUser.id,
        rollNumber: validatedData.rollNumber,
        department: validatedData.department,
        year: validatedData.year,
        course: validatedData.course
      };

      await storage.createStudentProfile(profileData);

      // Generate JWT token
      const token = jwt.sign(
        { id: newUser.id, email: newUser.email, role: newUser.role, name: newUser.name },
        JWT_SECRET,
        { expiresIn: "24h" }
      );

      res.status(201).json({
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          profileImage: newUser.profileImage
        },
        token
      });
  }));

  // User Routes
  app.get("/api/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.post("/api/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      
      // Check for duplicate email
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(validatedData.password, 10);

      // Create user
      const userData = {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        profileImage: null
      };

      const newUser = await storage.createUser(userData);

      // If student, create student profile
      if (validatedData.role === "student" && "rollNumber" in validatedData) {
        const studentData = validatedData as z.infer<typeof studentRegisterSchema>;
        const profileData = {
          userId: newUser.id,
          rollNumber: studentData.rollNumber,
          department: studentData.department,
          year: studentData.year,
          course: studentData.course
        };

        await storage.createStudentProfile(profileData);
      }

      res.status(201).json({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        profileImage: newUser.profileImage
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });

  app.put("/api/users/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const updatedUser = await storage.updateUser(userId, req.body);
      res.json({
        id: updatedUser!.id,
        name: updatedUser!.name,
        email: updatedUser!.email,
        role: updatedUser!.role,
        profileImage: updatedUser!.profileImage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });

  app.delete("/api/users/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const success = await storage.deleteUser(userId);
      if (!success) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  // Achievement Routes
  app.get("/api/achievements", authenticateToken, async (req, res) => {
    try {
      let achievements;
      
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
      } else {
        // Students see only their own achievements
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }
      
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });

  app.get("/api/achievements/:id", authenticateToken, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      // Check if user has permission to view this achievement
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievement" });
    }
  });

  app.post("/api/achievements", authenticateToken, checkRole(["student"]), upload.single('proof'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Proof file is required" });
      }

      const fileUrl = `/uploads/${req.file.filename}`;
      
      const achievementData = {
        ...req.body,
        studentId: req.user.id,
        proofUrl: fileUrl,
        status: "Submitted",
        dateOfActivity: new Date(req.body.dateOfActivity)
      };

      const validatedData = insertAchievementSchema.parse(achievementData);
      
      // Check for duplicate title
      const userAchievements = await storage.getAchievementsByStudent(req.user.id);
      const hasDuplicate = userAchievements.some(ach => ach.title === validatedData.title);
      if (hasDuplicate) {
        return res.status(400).json({ message: "You already have an achievement with this title" });
      }

      const newAchievement = await storage.createAchievement(validatedData);
      
      // Automatically change status to Pending after submission
      const updatedAchievement = await storage.updateAchievement(newAchievement.id, {
        status: "Pending"
      });
      
      res.status(201).json(updatedAchievement);
    } catch (error) {
      if (req.file) {
        // Remove uploaded file if there was an error
        fs.unlinkSync(req.file.path);
      }
      
      if (error instanceof z.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });

  app.put("/api/achievements/:id", authenticateToken, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      // Check permissions
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Students can only update rejected achievements
      if (req.user.role === "student" && achievement.status !== "Rejected") {
        return res.status(400).json({ message: "Only rejected achievements can be updated" });
      }

      // Teachers can only update pending achievements to Verified or Rejected
      if (req.user.role === "teacher" && achievement.status !== "Pending") {
        return res.status(400).json({ message: "Only pending achievements can be verified or rejected" });
      }

      // If rejecting, feedback is required
      if (req.body.status === "Rejected" && !req.body.feedback) {
        return res.status(400).json({ message: "Feedback is required when rejecting an achievement" });
      }

      // If student is resubmitting, set status to Pending
      if (req.user.role === "student") {
        req.body.status = "Pending";
      }

      const updatedAchievement = await storage.updateAchievement(achievementId, req.body);
      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update achievement" });
    }
  });

  app.delete("/api/achievements/:id", authenticateToken, checkRole(["student", "admin"]), async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      // Check permissions for students
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // Delete the proof file
      if (achievement.proofUrl) {
        const filePath = path.join(import.meta.dirname, "..", achievement.proofUrl);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }

      const success = await storage.deleteAchievement(achievementId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });

  // Statistics/Report Routes
  app.get("/api/statistics", authenticateToken, async (req, res) => {
    try {
      let achievements = [];
      let totalCount = 0;
      let verifiedCount = 0;
      let pendingCount = 0;
      let rejectedCount = 0;
      let typeStats: Record<string, number> = {
        academic: 0,
        sports: 0,
        "co-curricular": 0,
        "extra-curricular": 0
      };

      // Get appropriate achievements based on role
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
      } else {
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }

      // Calculate statistics
      totalCount = achievements.length;
      verifiedCount = achievements.filter(a => a.status === "Verified").length;
      pendingCount = achievements.filter(a => a.status === "Pending").length;
      rejectedCount = achievements.filter(a => a.status === "Rejected").length;
      
      // Calculate type stats
      achievements.forEach(a => {
        typeStats[a.type] = (typeStats[a.type] || 0) + 1;
      });

      res.json({
        totalCount,
        verifiedCount,
        pendingCount,
        rejectedCount,
        typeStats,
        successRate: totalCount > 0 ? (verifiedCount / totalCount) * 100 : 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });

  app.get("/api/reports/csv", authenticateToken, async (req, res) => {
    try {
      let achievements = [];
      
      // Get appropriate achievements based on role
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }

      // Format as CSV
      let csv = "ID,Title,Description,Type,Date of Activity,Status,Last Updated\n";
      
      for (const achievement of achievements) {
        // Get student name
        const student = await storage.getUser(achievement.studentId);
        const studentName = student ? student.name : "Unknown";
        
        csv += `${achievement.id},"${achievement.title.replace(/"/g, '""')}","${achievement.description.replace(/"/g, '""')}",${achievement.type},${achievement.dateOfActivity.toISOString().split('T')[0]},${achievement.status},${achievement.lastUpdated.toISOString().split('T')[0]},${studentName}\n`;
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=achievements.csv');
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Only add error handlers for API routes in development
  // The global error handler will be added after Vite middleware setup

  return httpServer;
}
