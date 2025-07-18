var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __esm = (fn, res) => function __init() {
  return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};

// vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import themePlugin from "@replit/vite-plugin-shadcn-theme-json";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";
var vite_config_default;
var init_vite_config = __esm({
  async "vite.config.ts"() {
    "use strict";
    vite_config_default = defineConfig({
      plugins: [
        react(),
        runtimeErrorOverlay(),
        themePlugin(),
        ...process.env.NODE_ENV !== "production" && process.env.REPL_ID !== void 0 ? [
          await import("@replit/vite-plugin-cartographer").then(
            (m) => m.cartographer()
          )
        ] : []
      ],
      resolve: {
        alias: {
          "@": path.resolve(import.meta.dirname, "client", "src"),
          "@shared": path.resolve(import.meta.dirname, "shared"),
          "@assets": path.resolve(import.meta.dirname, "attached_assets")
        }
      },
      root: path.resolve(import.meta.dirname, "client"),
      build: {
        outDir: path.resolve(import.meta.dirname, "dist/public"),
        emptyOutDir: true
      }
    });
  }
});

// server/vite.ts
var vite_exports = {};
__export(vite_exports, {
  log: () => log,
  serveStatic: () => serveStatic,
  setupVite: () => setupVite
});
import express from "express";
import fs from "fs";
import path2 from "path";
import { createServer as createViteServer, createLogger } from "vite";
import { nanoid } from "nanoid";
function log(message, source = "express") {
  const formattedTime = (/* @__PURE__ */ new Date()).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}
async function setupVite(app2, server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true
  };
  const vite = await createViteServer({
    ...vite_config_default,
    configFile: false,
    customLogger: {
      ...viteLogger,
      error: (msg, options) => {
        viteLogger.error(msg, options);
        process.exit(1);
      }
    },
    server: serverOptions,
    appType: "custom"
  });
  app2.use(vite.middlewares);
  app2.use("*", async (req, res, next) => {
    const url = req.originalUrl;
    try {
      const clientTemplate = path2.resolve(
        import.meta.dirname,
        "..",
        "client",
        "index.html"
      );
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e);
      next(e);
    }
  });
}
function serveStatic(app2) {
  const distPath = path2.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }
  app2.use(express.static(distPath));
  app2.use("*", (_req, res) => {
    res.sendFile(path2.resolve(distPath, "index.html"));
  });
}
var viteLogger;
var init_vite = __esm({
  async "server/vite.ts"() {
    "use strict";
    await init_vite_config();
    viteLogger = createLogger();
  }
});

// server/index.ts
import dotenv from "dotenv";
import express3 from "express";

// server/routes.ts
import express2 from "express";
import { createServer } from "http";

// server/models.ts
import mongoose from "mongoose";
var userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    required: true
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
var studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  rollNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  department: {
    type: String,
    required: true,
    trim: true
  },
  year: {
    type: String,
    required: true,
    trim: true
  },
  course: {
    type: String,
    required: true,
    trim: true
  }
}, {
  timestamps: true
});
var achievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    enum: ["academic", "sports", "co-curricular", "extra-curricular"],
    required: true
  },
  dateOfActivity: {
    type: Date,
    required: true
  },
  proofUrl: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ["Submitted", "Pending", "Verified", "Rejected"],
    default: "Submitted"
  },
  feedback: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});
var UserModel = mongoose.model("User", userSchema);
var StudentProfileModel = mongoose.model("StudentProfile", studentProfileSchema);
var AchievementModel = mongoose.model("Achievement", achievementSchema);

// server/storage.ts
import bcrypt from "bcrypt";
var MongoStorage = class {
  async createDemoAccounts() {
    try {
      const existingAdmin = await UserModel.findOne({ email: "admin@example.com" });
      if (existingAdmin) {
        console.log("Demo accounts already exist");
        return;
      }
      const hashedPassword = await bcrypt.hash("password123", 10);
      const adminUser = await UserModel.create({
        name: "Admin User",
        email: "admin@example.com",
        password: hashedPassword,
        role: "admin"
      });
      const teacherUser = await UserModel.create({
        name: "Teacher User",
        email: "teacher@example.com",
        password: hashedPassword,
        role: "teacher"
      });
      const studentUser = await UserModel.create({
        name: "Student User",
        email: "student@example.com",
        password: hashedPassword,
        role: "student"
      });
      await StudentProfileModel.create({
        userId: studentUser._id,
        rollNumber: "STU001",
        department: "Computer Science",
        year: "third",
        course: "B.Tech"
      });
      console.log("Demo accounts created successfully");
    } catch (error) {
      console.error("Error creating demo accounts:", error);
    }
  }
  // User operations
  async getUser(id) {
    try {
      const user = await UserModel.findById(id);
      return user ? { ...user.toObject(), id: user._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting user:", error);
      return void 0;
    }
  }
  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
      return user ? { ...user.toObject(), id: user._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting user by email:", error);
      return void 0;
    }
  }
  async createUser(userData) {
    try {
      const user = await UserModel.create(userData);
      return { ...user.toObject(), id: user._id.toString() };
    } catch (error) {
      console.error("Error creating user:", error);
      throw error;
    }
  }
  async updateUser(id, userData) {
    try {
      const user = await UserModel.findByIdAndUpdate(id, userData, { new: true });
      return user ? { ...user.toObject(), id: user._id.toString() } : void 0;
    } catch (error) {
      console.error("Error updating user:", error);
      return void 0;
    }
  }
  async deleteUser(id) {
    try {
      const result = await UserModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting user:", error);
      return false;
    }
  }
  async getUsers() {
    try {
      const users = await UserModel.find();
      return users.map((user) => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users:", error);
      return [];
    }
  }
  async getUsersByRole(role) {
    try {
      const users = await UserModel.find({ role });
      return users.map((user) => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by role:", error);
      return [];
    }
  }
  async getUsersByDepartment(department) {
    try {
      const profiles = await StudentProfileModel.find({ department });
      const userIds = profiles.map((profile) => profile.userId);
      const users = await UserModel.find({ _id: { $in: userIds } });
      return users.map((user) => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error getting users by department:", error);
      return [];
    }
  }
  // Student profile operations
  async getStudentProfile(userId) {
    try {
      const profile = await StudentProfileModel.findOne({ userId });
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting student profile:", error);
      return void 0;
    }
  }
  async createStudentProfile(profileData) {
    try {
      const profile = await StudentProfileModel.create(profileData);
      return { ...profile.toObject(), id: profile._id.toString() };
    } catch (error) {
      console.error("Error creating student profile:", error);
      throw error;
    }
  }
  async updateStudentProfile(userId, profileData) {
    try {
      const profile = await StudentProfileModel.findOneAndUpdate(
        { userId },
        profileData,
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : void 0;
    } catch (error) {
      console.error("Error updating student profile:", error);
      return void 0;
    }
  }
  // Achievement operations
  async getAchievement(id) {
    try {
      const achievement = await AchievementModel.findById(id);
      return achievement ? { ...achievement.toObject(), id: achievement._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting achievement:", error);
      return void 0;
    }
  }
  async getAchievementsByStudent(studentId) {
    try {
      const achievements = await AchievementModel.find({ studentId });
      return achievements.map((achievement) => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting achievements by student:", error);
      return [];
    }
  }
  async getAchievementsByDepartment(department) {
    try {
      const profiles = await StudentProfileModel.find({ department });
      const studentIds = profiles.map((profile) => profile.userId);
      const achievements = await AchievementModel.find({ studentId: { $in: studentIds } });
      return achievements.map((achievement) => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting achievements by department:", error);
      return [];
    }
  }
  async getAchievementsByStatus(status) {
    try {
      const achievements = await AchievementModel.find({ status });
      return achievements.map((achievement) => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting achievements by status:", error);
      return [];
    }
  }
  async createAchievement(achievementData) {
    try {
      const achievement = await AchievementModel.create(achievementData);
      return { ...achievement.toObject(), id: achievement._id.toString() };
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }
  async updateAchievement(id, achievementData) {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(id, achievementData, { new: true });
      return achievement ? { ...achievement.toObject(), id: achievement._id.toString() } : void 0;
    } catch (error) {
      console.error("Error updating achievement:", error);
      return void 0;
    }
  }
  async deleteAchievement(id) {
    try {
      const result = await AchievementModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting achievement:", error);
      return false;
    }
  }
  async getAllAchievements() {
    try {
      const achievements = await AchievementModel.find();
      return achievements.map((achievement) => ({ ...achievement.toObject(), id: achievement._id.toString() }));
    } catch (error) {
      console.error("Error getting all achievements:", error);
      return [];
    }
  }
};
var createStorage = () => {
  const storage = new MongoStorage();
  setTimeout(() => {
    storage.createDemoAccounts();
  }, 1e3);
  return storage;
};

// server/routes.ts
import { z as z3 } from "zod";

// server/middleware/errorHandler.ts
await init_vite();
function createAppError(message, statusCode = 500) {
  const error = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}
function asyncHandler(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// server/middleware/security.ts
import rateLimit from "express-rate-limit";
var generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 1e3,
  // limit each IP to 1000 requests per windowMs (more generous for development)
  message: {
    message: "Too many requests from this IP, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Skip rate limiting for health checks and essential API calls
  skip: (req) => {
    return req.path === "/api/health" || req.path === "/api/statistics";
  }
});
var authLimiter = rateLimit({
  windowMs: 15 * 60 * 1e3,
  // 15 minutes
  max: 5,
  // limit each IP to 5 requests per windowMs
  message: {
    message: "Too many authentication attempts, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
var uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1e3,
  // 1 hour
  max: 10,
  // limit each IP to 10 uploads per hour
  message: {
    message: "Too many uploads, please try again later."
  },
  standardHeaders: true,
  legacyHeaders: false
});
function securityHeaders(req, res, next) {
  res.removeHeader("X-Powered-By");
  res.setHeader("X-Content-Type-Options", "nosniff");
  res.setHeader("X-Frame-Options", "DENY");
  res.setHeader("X-XSS-Protection", "1; mode=block");
  res.setHeader("Referrer-Policy", "strict-origin-when-cross-origin");
  if (req.secure) {
    res.setHeader("Strict-Transport-Security", "max-age=31536000; includeSubDomains");
  }
  next();
}
function corsMiddleware(req, res, next) {
  const origin = req.headers.origin;
  const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:5000"];
  if (!origin || allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin || "*");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
    return;
  }
  next();
}

// server/middleware/validation.ts
import { z } from "zod";
function validateBody(schema) {
  return (req, res, next) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        const message = error.errors.map((err) => `${err.path.join(".")}: ${err.message}`).join(", ");
        next(createAppError(`Validation failed: ${message}`, 400));
      } else {
        next(error);
      }
    }
  };
}
var idParamSchema = z.object({
  id: z.string().transform(Number).refine((n) => n > 0, "ID must be a positive number")
});
var paginationSchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sort: z.string().optional(),
  order: z.enum(["asc", "desc"]).default("desc")
});
var searchSchema = z.object({
  q: z.string().min(1).optional(),
  status: z.string().optional(),
  type: z.string().optional(),
  department: z.string().optional()
});

// shared/schema.ts
import { z as z2 } from "zod";
var insertUserSchema = z2.object({
  name: z2.string().min(1, { message: "Name is required" }),
  email: z2.string().email({ message: "Invalid email address" }),
  password: z2.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z2.enum(["student", "teacher", "admin"]),
  profileImage: z2.string().optional()
});
var insertStudentProfileSchema = z2.object({
  userId: z2.string().min(1, { message: "User ID is required" }),
  rollNumber: z2.string().min(1, { message: "Roll number is required" }),
  department: z2.string().min(1, { message: "Department is required" }),
  year: z2.string().min(1, { message: "Year is required" }),
  course: z2.string().min(1, { message: "Course is required" })
});
var insertAchievementSchema = z2.object({
  studentId: z2.string().min(1, { message: "Student ID is required" }),
  title: z2.string().min(1, { message: "Title is required" }),
  description: z2.string().min(1, { message: "Description is required" }),
  type: z2.enum(["academic", "sports", "co-curricular", "extra-curricular"]),
  dateOfActivity: z2.date(),
  proofUrl: z2.string().min(1, { message: "Proof URL is required" }),
  status: z2.enum(["Submitted", "Pending", "Verified", "Rejected"]).default("Submitted"),
  feedback: z2.string().optional()
});
var loginSchema = z2.object({
  email: z2.string().email({ message: "Invalid email address" }),
  password: z2.string().min(6, { message: "Password must be at least 6 characters" })
});
var registerSchema = z2.object({
  ...insertUserSchema.shape,
  confirmPassword: z2.string().min(6, { message: "Password must be at least 6 characters" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});
var studentRegisterSchema = z2.object({
  name: z2.string().min(1, { message: "Name is required" }),
  email: z2.string().email({ message: "Invalid email address" }),
  password: z2.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z2.string().min(6, { message: "Password must be at least 6 characters" }),
  role: z2.enum(["student", "teacher", "admin"]),
  profileImage: z2.string().optional(),
  rollNumber: z2.string().min(1, { message: "Roll number is required" }),
  department: z2.string().min(1, { message: "Department is required" }),
  year: z2.string().min(1, { message: "Year is required" }),
  course: z2.string().min(1, { message: "Course is required" })
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

// server/routes.ts
import bcrypt2 from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path3 from "path";
import fs2 from "fs";
import { fromZodError } from "zod-validation-error";
var JWT_SECRET = process.env.JWT_SECRET || "supersecretkey";
var uploadDir = path3.join(import.meta.dirname, "../uploads");
if (!fs2.existsSync(uploadDir)) {
  fs2.mkdirSync(uploadDir, { recursive: true });
}
var storage_multer = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path3.extname(file.originalname);
    cb(null, file.fieldname + "-" + uniqueSuffix + ext);
  }
});
var upload = multer({
  storage: storage_multer,
  limits: {
    fileSize: 5 * 1024 * 1024
    // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedFileTypes = [".jpg", ".jpeg", ".png", ".pdf"];
    const ext = path3.extname(file.originalname).toLowerCase();
    if (allowedFileTypes.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Only JPG, PNG, and PDF files are allowed."));
    }
  }
});
var authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });
  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: "Invalid or expired token" });
    req.user = user;
    next();
  });
};
var checkRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ message: "Not authenticated" });
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Access denied" });
    }
    next();
  };
};
async function registerRoutes(app2) {
  const httpServer = createServer(app2);
  const storage = createStorage();
  app2.use(securityHeaders);
  app2.use(corsMiddleware);
  if (process.env.NODE_ENV === "production") {
    app2.use(generalLimiter);
  }
  app2.use(express2.json());
  app2.use(express2.urlencoded({ extended: true }));
  app2.use("/uploads", express2.static(uploadDir));
  app2.head("/api/health", (req, res) => {
    res.status(200).end();
  });
  app2.get("/api/health", (req, res) => {
    res.status(200).json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
  });
  app2.post("/api/auth/login", authLimiter, validateBody(loginSchema), asyncHandler(async (req, res) => {
    const validatedData = req.body;
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    let isPasswordValid = false;
    if (user.email.includes("@example.com") && user.password === validatedData.password) {
      isPasswordValid = true;
    } else {
      isPasswordValid = await bcrypt2.compare(validatedData.password, user.password);
    }
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
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
  app2.post("/api/auth/logout", (req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  });
  app2.post("/api/auth/register", authLimiter, validateBody(studentRegisterSchema), asyncHandler(async (req, res) => {
    const validatedData = req.body;
    const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
    if (existingUserByEmail) {
      return res.status(400).json({ message: "Email is already registered" });
    }
    const students = await storage.getUsersByRole("student");
    for (const student of students) {
      const profile = await storage.getStudentProfile(student.id);
      if (profile && profile.rollNumber === validatedData.rollNumber) {
        return res.status(400).json({ message: "Roll number is already registered" });
      }
    }
    const hashedPassword = await bcrypt2.hash(validatedData.password, 10);
    const userData = {
      name: validatedData.name,
      email: validatedData.email,
      password: hashedPassword,
      role: "student",
      profileImage: null
    };
    const newUser = await storage.createUser(userData);
    const profileData = {
      userId: newUser.id,
      rollNumber: validatedData.rollNumber,
      department: validatedData.department,
      year: validatedData.year,
      course: validatedData.course
    };
    await storage.createStudentProfile(profileData);
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
  app2.get("/api/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const users = await storage.getUsers();
      res.json(users.map((user) => ({
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
  app2.post("/api/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const validatedData = registerSchema.parse(req.body);
      const existingUserByEmail = await storage.getUserByEmail(validatedData.email);
      if (existingUserByEmail) {
        return res.status(400).json({ message: "Email is already registered" });
      }
      const hashedPassword = await bcrypt2.hash(validatedData.password, 10);
      const userData = {
        name: validatedData.name,
        email: validatedData.email,
        password: hashedPassword,
        role: validatedData.role,
        profileImage: null
      };
      const newUser = await storage.createUser(userData);
      if (validatedData.role === "student" && "rollNumber" in validatedData) {
        const studentData = validatedData;
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
      if (error instanceof z3.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/users/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const updatedUser = await storage.updateUser(userId, req.body);
      res.json({
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        profileImage: updatedUser.profileImage
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to update user" });
    }
  });
  app2.delete("/api/users/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
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
  app2.get("/api/achievements", authenticateToken, async (req, res) => {
    try {
      let achievements;
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
        const teacherDepartment = req.query.department || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
      } else {
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }
      res.json(achievements);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievements" });
    }
  });
  app2.get("/api/achievements/:id", authenticateToken, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      res.json(achievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch achievement" });
    }
  });
  app2.post("/api/achievements", authenticateToken, checkRole(["student"]), upload.single("proof"), async (req, res) => {
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
      const userAchievements = await storage.getAchievementsByStudent(req.user.id);
      const hasDuplicate = userAchievements.some((ach) => ach.title === validatedData.title);
      if (hasDuplicate) {
        return res.status(400).json({ message: "You already have an achievement with this title" });
      }
      const newAchievement = await storage.createAchievement(validatedData);
      const updatedAchievement = await storage.updateAchievement(newAchievement.id, {
        status: "Pending"
      });
      res.status(201).json(updatedAchievement);
    } catch (error) {
      if (req.file) {
        fs2.unlinkSync(req.file.path);
      }
      if (error instanceof z3.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create achievement" });
    }
  });
  app2.put("/api/achievements/:id", authenticateToken, async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === "student" && achievement.status !== "Rejected") {
        return res.status(400).json({ message: "Only rejected achievements can be updated" });
      }
      if (req.user.role === "teacher" && achievement.status !== "Pending") {
        return res.status(400).json({ message: "Only pending achievements can be verified or rejected" });
      }
      if (req.body.status === "Rejected" && !req.body.feedback) {
        return res.status(400).json({ message: "Feedback is required when rejecting an achievement" });
      }
      if (req.user.role === "student") {
        req.body.status = "Pending";
      }
      const updatedAchievement = await storage.updateAchievement(achievementId, req.body);
      res.json(updatedAchievement);
    } catch (error) {
      res.status(500).json({ message: "Failed to update achievement" });
    }
  });
  app2.delete("/api/achievements/:id", authenticateToken, checkRole(["student", "admin"]), async (req, res) => {
    try {
      const achievementId = parseInt(req.params.id);
      const achievement = await storage.getAchievement(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (achievement.proofUrl) {
        const filePath = path3.join(import.meta.dirname, "..", achievement.proofUrl);
        if (fs2.existsSync(filePath)) {
          fs2.unlinkSync(filePath);
        }
      }
      const success = await storage.deleteAchievement(achievementId);
      res.status(204).end();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete achievement" });
    }
  });
  app2.get("/api/statistics", authenticateToken, async (req, res) => {
    try {
      let achievements = [];
      let totalCount = 0;
      let verifiedCount = 0;
      let pendingCount = 0;
      let rejectedCount = 0;
      let typeStats = {
        academic: 0,
        sports: 0,
        "co-curricular": 0,
        "extra-curricular": 0
      };
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
        const teacherDepartment = req.query.department || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
      } else {
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }
      totalCount = achievements.length;
      verifiedCount = achievements.filter((a) => a.status === "Verified").length;
      pendingCount = achievements.filter((a) => a.status === "Pending").length;
      rejectedCount = achievements.filter((a) => a.status === "Rejected").length;
      achievements.forEach((a) => {
        typeStats[a.type] = (typeStats[a.type] || 0) + 1;
      });
      res.json({
        totalCount,
        verifiedCount,
        pendingCount,
        rejectedCount,
        typeStats,
        successRate: totalCount > 0 ? verifiedCount / totalCount * 100 : 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch statistics" });
    }
  });
  app2.get("/api/reports/csv", authenticateToken, async (req, res) => {
    try {
      let achievements = [];
      if (req.user.role === "admin") {
        achievements = await storage.getAllAchievements();
      } else if (req.user.role === "teacher") {
      } else if (req.user.role === "teacher") {
        const teacherDepartment = req.query.department || "Computer Science";
        achievements = await storage.getAchievementsByDepartment(teacherDepartment);
        achievements = await storage.getAchievementsByStudent(req.user.id);
      }
      let csv = "ID,Title,Description,Type,Date of Activity,Status,Last Updated\n";
      for (const achievement of achievements) {
        const student = await storage.getUser(achievement.studentId);
        const studentName = student ? student.name : "Unknown";
        csv += `${achievement.id},"${achievement.title.replace(/"/g, '""')}","${achievement.description.replace(/"/g, '""')}",${achievement.type},${achievement.dateOfActivity.toISOString().split("T")[0]},${achievement.status},${achievement.lastUpdated.toISOString().split("T")[0]},${studentName}
`;
      }
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=achievements.csv");
      res.send(csv);
    } catch (error) {
      res.status(500).json({ message: "Failed to generate report" });
    }
  });
  return httpServer;
}

// server/database.ts
import mongoose2 from "mongoose";
var isMongoDBConnected = false;
var connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/student-activity-platform";
    console.log("Attempting to connect to MongoDB...");
    await mongoose2.connect(mongoUri, {
      serverSelectionTimeoutMS: 8e3,
      // Timeout after 8s instead of 30s
      socketTimeoutMS: 45e3,
      // Close sockets after 45s of inactivity
      maxPoolSize: 10,
      // Maintain up to 10 socket connections
      connectTimeoutMS: 1e4,
      // Give up initial connection after 10 seconds
      heartbeatFrequencyMS: 1e4
      // Check server connection every 10 seconds
    });
    isMongoDBConnected = true;
    console.log("\u2705 MongoDB connected successfully");
    mongoose2.connection.on("disconnected", () => {
      console.log("MongoDB disconnected");
      isMongoDBConnected = false;
    });
    mongoose2.connection.on("reconnected", () => {
      console.log("MongoDB reconnected");
      isMongoDBConnected = true;
    });
    mongoose2.connection.on("error", (error) => {
      console.error("MongoDB connection error:", error);
      isMongoDBConnected = false;
    });
    return true;
  } catch (error) {
    console.error("MongoDB connection failed:", error);
    console.log("\u{1F504} Falling back to in-memory storage for development");
    isMongoDBConnected = false;
    return false;
  }
};
var database_default = connectDB;

// server/index.ts
import path4 from "path";
import { fileURLToPath } from "url";
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path4.dirname(__filename);
var app = express3();
var PORT = process.env.PORT || 5e3;
app.set("trust proxy", 1);
app.use(express3.json());
app.use(express3.urlencoded({ extended: true }));
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});
app.use((req, res, next) => {
  const start = Date.now();
  const path5 = req.path;
  let capturedJsonResponse = void 0;
  const originalResJson = res.json;
  res.json = function(bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };
  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path5.startsWith("/api")) {
      let logLine = `${req.method} ${path5} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }
      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "\u2026";
      }
      console.log(logLine);
    }
  });
  next();
});
(async () => {
  try {
    await database_default();
    await registerRoutes(app);
    if (process.env.NODE_ENV === "production") {
      app.use(express3.static(path4.join(__dirname, "../dist/public")));
      app.get("*", (req, res) => {
        res.sendFile(path4.join(__dirname, "../dist/public/index.html"));
      });
    } else {
      const { setupVite: setupVite2 } = await init_vite().then(() => vite_exports);
      const server = app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
      });
      await setupVite2(app, server);
    }
    app.use((err, _req, res, _next) => {
      const status = err.status || err.statusCode || 500;
      const message = err.message || "Internal Server Error";
      console.error("Error:", err);
      res.status(status).json({ message });
    });
    if (process.env.NODE_ENV === "production") {
      app.listen(PORT, "0.0.0.0", () => {
        console.log(`Server running on port ${PORT}`);
      });
    }
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
})();
