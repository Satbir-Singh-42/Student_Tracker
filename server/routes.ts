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
  insertUserSchema,
  insertDepartmentSchema
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
        department: "Engineering", // Default to Engineering
        branch: validatedData.branch,
        year: validatedData.year,
        course: validatedData.course
      };

      const newProfile = await storage.createStudentProfile(profileData);

      // Auto-assign teacher based on branch
      if (newProfile) {
        await storage.autoAssignTeacherByBranch(newProfile.id);
      }

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
      
      // Check if the requesting admin is a demo account
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      
      // Filter users based on admin type
      const filteredUsers = users.filter(user => {
        const isUserDemo = user.email.includes('demo.') && user.email.includes('@example.com');
        
        if (isDemoAdmin) {
          // Demo admin sees only demo accounts
          return isUserDemo;
        } else {
          // Production admin sees only production accounts
          return !isUserDemo;
        }
      });
      
      res.json(filteredUsers.map(user => ({
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
      // Check if the requesting admin is a demo account
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      
      if (isDemoAdmin) {
        return res.status(403).json({ 
          message: "Demo accounts cannot create new users. This is a demonstration environment with restricted permissions.",
          type: "demo_restriction"
        });
      }

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
          department: "Engineering", // Default to Engineering
          branch: studentData.branch,
          year: studentData.year,
          course: studentData.course
        };

        const newProfile = await storage.createStudentProfile(profileData);
        
        // Auto-assign teacher based on branch for new students
        if (newProfile) {
          await storage.autoAssignTeacherByBranch(newProfile.id);
        }
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
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Define protected accounts (both real and demo)
      const protectedEmails = [
        "admin@satvirnagra.com",
        "demo.admin@example.com",
        "demo.teacher@example.com",
        "demo.student@example.com"
      ];

      // Check if this is a protected account
      if (protectedEmails.includes(user.email)) {
        return res.status(403).json({ message: "Cannot edit protected account" });
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
      const userId = req.params.id;
      
      // Prevent admin from deleting themselves
      if (userId === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      
      // Get user to check if it's a protected admin account
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Define protected accounts (both real and demo)
      const protectedEmails = [
        "admin@satvirnagra.com",
        "demo.admin@example.com",
        "demo.teacher@example.com",
        "demo.student@example.com"
      ];

      // Check if this is a protected account
      if (protectedEmails.includes(user.email)) {
        return res.status(403).json({ message: "Cannot delete protected account" });
      }
      
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
        
        // Check if the requesting admin is a demo account
        const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoAdmin) {
          // Demo admin sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production admin sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
        
        // Check if the requesting teacher is a demo account
        const isDemoTeacher = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoTeacher) {
          // Demo teacher sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production teacher sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
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
      const achievementId = req.params.id;
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
      const achievementId = req.params.id;
      const achievement = await storage.getAchievement(achievementId);
      
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }

      // Check permissions
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }

      // For teachers, check if they can verify this achievement based on branch
      if (req.user.role === "teacher" && (req.body.status || req.body.feedback)) {
        const canVerify = await storage.canTeacherVerifyAchievement(req.user.id, achievementId);
        if (!canVerify) {
          return res.status(403).json({ 
            message: "You can only verify achievements from students in your specialization branch" 
          });
        }
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
      const achievementId = req.params.id;
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
        
        // Check if the requesting admin is a demo account
        const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoAdmin) {
          // Demo admin sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production admin sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
        
        // Check if the requesting teacher is a demo account
        const isDemoTeacher = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoTeacher) {
          // Demo teacher sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production teacher sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
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

  app.get("/api/reports/csv", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      let achievements = [];
      
      // Get appropriate achievements based on role
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
        
        // Check if the requesting admin is a demo account
        const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoAdmin) {
          // Demo admin sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production admin sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
      } else if (req.user.role === "teacher") {
        // Teachers see achievements from all departments for simplicity in demo
        // In production, we would get the teacher's assigned department
        const teacherDepartment = req.query.department as string || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
        
        // Check if the requesting teacher is a demo account
        const isDemoTeacher = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
        
        if (isDemoTeacher) {
          // Demo teacher sees only achievements from demo accounts
          const demoUsers = await storage.getUsers();
          const demoUserIds = demoUsers
            .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
            .map(user => user.id);
          achievements = achievements.filter(achievement => demoUserIds.includes(achievement.studentId));
        } else {
          // Production teacher sees only achievements from production accounts
          const productionUsers = await storage.getUsers();
          const productionUserIds = productionUsers
            .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
            .map(user => user.id);
          achievements = achievements.filter(achievement => productionUserIds.includes(achievement.studentId));
        }
      }

      // Format as CSV
      let csv = "ID,Title,Description,Type,Date of Activity,Status,Student Name,Last Updated\n";
      
      for (const achievement of achievements) {
        // Get student name
        const student = await storage.getUser(achievement.studentId);
        const studentName = student ? student.name : "Unknown";
        
        csv += `${achievement._id},"${achievement.title.replace(/"/g, '""')}","${achievement.description.replace(/"/g, '""')}",${achievement.type},${achievement.dateOfActivity.toISOString().split('T')[0]},${achievement.status},"${studentName}",${achievement.updatedAt.toISOString().split('T')[0]}\n`;
      }
      
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename=achievements-report.csv');
      res.send(csv);
    } catch (error) {
      console.error("Error generating CSV report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });

  // Department Routes
  app.get("/api/departments", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      res.json(departments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });

  app.get("/api/departments/:id", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      const departmentId = req.params.id;
      const department = await storage.getDepartment(departmentId);
      
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      res.json(department);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch department" });
    }
  });

  app.post("/api/departments", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      
      // Check for duplicate department code
      const existingDepartmentByCode = await storage.getDepartmentByCode(validatedData.code);
      if (existingDepartmentByCode) {
        return res.status(400).json({ message: "Department code already exists" });
      }

      // Check for duplicate department name
      const existingDepartmentByName = await storage.getDepartmentByName(validatedData.name);
      if (existingDepartmentByName) {
        return res.status(400).json({ message: "Department name already exists" });
      }

      const newDepartment = await storage.createDepartment(validatedData);
      res.status(201).json(newDepartment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create department" });
    }
  });

  app.put("/api/departments/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const departmentId = req.params.id;
      const validatedData = insertDepartmentSchema.partial().parse(req.body);
      
      const department = await storage.getDepartment(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Check for duplicate department code if code is being updated
      if (validatedData.code && validatedData.code !== department.code) {
        const existingDepartmentByCode = await storage.getDepartmentByCode(validatedData.code);
        if (existingDepartmentByCode) {
          return res.status(400).json({ message: "Department code already exists" });
        }
      }

      // Check for duplicate department name if name is being updated
      if (validatedData.name && validatedData.name !== department.name) {
        const existingDepartmentByName = await storage.getDepartmentByName(validatedData.name);
        if (existingDepartmentByName) {
          return res.status(400).json({ message: "Department name already exists" });
        }
      }

      const updatedDepartment = await storage.updateDepartment(departmentId, validatedData);
      res.json(updatedDepartment);
    } catch (error) {
      if (error instanceof z.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to update department" });
    }
  });

  app.delete("/api/departments/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const departmentId = req.params.id;
      
      // Check if department exists
      const department = await storage.getDepartment(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }

      // Check if any students are assigned to this department
      const studentsInDepartment = await storage.getUsersByDepartment(department.name);
      if (studentsInDepartment.length > 0) {
        return res.status(400).json({ 
          message: "Cannot delete department with enrolled students. Please reassign students first." 
        });
      }

      const success = await storage.deleteDepartment(departmentId);
      if (!success) {
        return res.status(404).json({ message: "Department not found" });
      }
      
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete department" });
    }
  });

  // Teacher-Student Assignment Routes

  // Get all student profiles (Admin only)
  app.get("/api/student-profiles", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const profiles = await storage.getAllStudentProfiles();
      
      // Check if the requesting admin is a demo account
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      
      if (isDemoAdmin) {
        // Demo admin sees only profiles from demo accounts
        const demoUsers = await storage.getUsers();
        const demoUserIds = demoUsers
          .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
          .map(user => user.id);
        const filteredProfiles = profiles.filter(profile => demoUserIds.includes(profile.userId));
        res.json(filteredProfiles);
      } else {
        // Production admin sees only profiles from production accounts
        const productionUsers = await storage.getUsers();
        const productionUserIds = productionUsers
          .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
          .map(user => user.id);
        const filteredProfiles = profiles.filter(profile => productionUserIds.includes(profile.userId));
        res.json(filteredProfiles);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student profiles" });
    }
  });

  // Get students assigned to a teacher
  app.get("/api/teacher/:teacherId/students", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      const { teacherId } = req.params;
      const students = await storage.getStudentsByTeacher(teacherId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });

  // Assign teacher to student (Admin only)
  app.post("/api/student-profiles/:studentId/assign-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { studentId } = req.params;
      const { teacherId } = req.body;

      if (!teacherId) {
        return res.status(400).json({ message: "Teacher ID is required" });
      }

      // Verify teacher exists and has teacher role
      const teacher = await storage.getUser(teacherId);
      if (!teacher || teacher.role !== 'teacher') {
        return res.status(400).json({ message: "Invalid teacher ID" });
      }

      const updatedProfile = await storage.assignTeacherToStudent(studentId, teacherId);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to assign teacher" });
    }
  });

  // Remove teacher assignment from student (Admin only)
  app.delete("/api/student-profiles/:studentId/remove-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { studentId } = req.params;
      const updatedProfile = await storage.removeTeacherFromStudent(studentId);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Student profile not found" });
      }

      res.json(updatedProfile);
    } catch (error) {
      res.status(500).json({ message: "Failed to remove teacher assignment" });
    }
  });

  // Auto-assign teacher based on student's branch (Admin only)
  app.post("/api/student-profiles/:studentId/auto-assign-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { studentId } = req.params;
      const updatedProfile = await storage.autoAssignTeacherByBranch(studentId);
      if (!updatedProfile) {
        return res.status(404).json({ message: "Student profile not found or no suitable teacher available" });
      }

      res.json({
        message: "Teacher auto-assigned successfully based on branch",
        profile: updatedProfile
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-assign teacher" });
    }
  });

  // Auto-assign teachers to all students without assigned teachers
  app.post("/api/auto-assign-all-teachers", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const unassignedProfiles = await storage.getUnassignedStudentProfiles();
      const results = [];

      for (const profile of unassignedProfiles) {
        const updatedProfile = await storage.autoAssignTeacherByBranch(profile.id);
        if (updatedProfile) {
          results.push({
            studentId: profile.id,
            rollNumber: profile.rollNumber,
            branch: profile.branch,
            success: true
          });
        } else {
          results.push({
            studentId: profile.id,
            rollNumber: profile.rollNumber,
            branch: profile.branch,
            success: false,
            reason: "No suitable teacher found"
          });
        }
      }

      res.json({
        message: "Auto-assignment completed",
        results,
        totalProcessed: results.length,
        successful: results.filter(r => r.success).length,
        failed: results.filter(r => !r.success).length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-assign teachers" });
    }
  });

  // Search Routes

  // Search users (Admin only)
  app.get("/api/search/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const users = await storage.searchUsers(query);
      
      // Filter users based on admin type (demo vs production)
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      const filteredUsers = users.filter(user => {
        const isUserDemo = user.email.includes('demo.') && user.email.includes('@example.com');
        return isDemoAdmin ? isUserDemo : !isUserDemo;
      });

      res.json(filteredUsers.map(user => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        specialization: user.specialization
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Search student profiles (Admin only)
  app.get("/api/search/student-profiles", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== 'string') {
        return res.status(400).json({ message: "Search query is required" });
      }

      const profiles = await storage.searchStudentProfiles(query);
      
      // Filter profiles based on admin type (demo vs production)
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      if (isDemoAdmin) {
        const demoUsers = await storage.getUsers();
        const demoUserIds = demoUsers
          .filter(user => user.email.includes('demo.') && user.email.includes('@example.com'))
          .map(user => user.id);
        const filteredProfiles = profiles.filter(profile => demoUserIds.includes(profile.userId));
        res.json(filteredProfiles);
      } else {
        const productionUsers = await storage.getUsers();
        const productionUserIds = productionUsers
          .filter(user => !(user.email.includes('demo.') && user.email.includes('@example.com')))
          .map(user => user.id);
        const filteredProfiles = profiles.filter(profile => productionUserIds.includes(profile.userId));
        res.json(filteredProfiles);
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to search student profiles" });
    }
  });

  // Get teachers by specialization (Admin only)
  app.get("/api/teachers/by-specialization/:specialization", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { specialization } = req.params;
      const teachers = await storage.getTeachersBySpecialization(specialization);
      
      // Filter teachers based on admin type (demo vs production)
      const isDemoAdmin = req.user.email.includes('demo.') && req.user.email.includes('@example.com');
      const filteredTeachers = teachers.filter(teacher => {
        const isTeacherDemo = teacher.email.includes('demo.') && teacher.email.includes('@example.com');
        return isDemoAdmin ? isTeacherDemo : !isTeacherDemo;
      });

      res.json(filteredTeachers.map(teacher => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers by specialization" });
    }
  });

  // Only add error handlers for API routes in development
  // The global error handler will be added after Vite middleware setup

  return httpServer;
}
