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
  },
  specialization: {
    type: String,
    default: null
    // For teachers - their primary expertise branch
  },
  additionalBranches: [{
    type: String
    // For teachers - additional branches they can verify (admin granted)
  }]
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
  branch: {
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
  },
  assignedTeacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    default: null
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
var departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  code: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    uppercase: true
  },
  description: {
    type: String,
    trim: true,
    default: null
  }
}, {
  timestamps: true
});
var UserModel = mongoose.model("User", userSchema);
var StudentProfileModel = mongoose.model("StudentProfile", studentProfileSchema);
var AchievementModel = mongoose.model("Achievement", achievementSchema);
var DepartmentModel = mongoose.model("Department", departmentSchema);

// server/storage.ts
import bcrypt from "bcrypt";
var MongoStorage = class {
  async createOfficialAccounts() {
    try {
      const existingAdmin = await UserModel.findOne({ email: "admin@satvirnagra.com" });
      if (existingAdmin) {
        console.log("Official accounts already exist");
        return;
      }
      const adminPassword = await bcrypt.hash("Admin@2025!", 10);
      const teacherPassword = await bcrypt.hash("Teacher@2025!", 10);
      const adminUser = await UserModel.create({
        name: "System Administrator",
        email: "admin@satvirnagra.com",
        password: adminPassword,
        role: "admin"
      });
      const teachers = [
        {
          name: "Dr. Rajesh Kumar",
          email: "rajesh.kumar@satvirnagra.com",
          specialization: "Computer Science and Engineering"
        },
        {
          name: "Prof. Priya Sharma",
          email: "priya.sharma@satvirnagra.com",
          specialization: "Information Technology"
        }
      ];
      for (const teacherData of teachers) {
        await UserModel.create({
          ...teacherData,
          password: teacherPassword,
          role: "teacher"
        });
      }
      console.log("Official accounts created successfully");
      console.log("Admin: admin@satvirnagra.com / Admin@2025!");
      console.log("Teachers: rajesh.kumar@satvirnagra.com, priya.sharma@satvirnagra.com / Teacher@2025!");
    } catch (error) {
      console.error("Error creating official accounts:", error);
    }
  }
  async createDemoAccounts() {
    try {
      const existingDemoAdmin = await UserModel.findOne({ email: "demo.admin@example.com" });
      if (existingDemoAdmin) {
        console.log("Demo accounts already exist");
        await this.clearDemoData();
      }
      const demoPassword = await bcrypt.hash("demo123", 10);
      const demoAdminUser = await UserModel.create({
        name: "Demo Administrator",
        email: "demo.admin@example.com",
        password: demoPassword,
        role: "admin"
      });
      const demoTeacher = await UserModel.create({
        name: "Demo Teacher",
        email: "demo.teacher@example.com",
        password: demoPassword,
        role: "teacher",
        specialization: "Computer Science and Engineering"
      });
      const demoStudentUser = await UserModel.create({
        name: "Demo Student",
        email: "demo.student@example.com",
        password: demoPassword,
        role: "student"
      });
      const demoStudentProfile = await StudentProfileModel.create({
        userId: demoStudentUser._id,
        rollNumber: "DEMO001",
        department: "Engineering",
        branch: "Computer Science and Engineering",
        year: "third",
        course: "B.Tech"
      });
      await this.autoAssignTeacherByBranch(demoStudentProfile._id.toString());
      await this.forceDemoAchievementsCreation(demoStudentUser._id.toString());
      console.log("Demo accounts created successfully");
      console.log("Demo Admin: demo.admin@example.com / demo123");
      console.log("Demo Teacher: demo.teacher@example.com / demo123");
      console.log("Demo Student: demo.student@example.com / demo123");
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
  // Get users filtered by account type (demo vs official)
  async getUsersFilteredByType(adminEmail) {
    try {
      const allUsers = await this.getUsers();
      return this.filterUsersByType(allUsers, adminEmail);
    } catch (error) {
      console.error("Error getting filtered users:", error);
      return [];
    }
  }
  // Helper method to check if user is demo or official
  isDemoUser(email) {
    return email.includes("@example.com");
  }
  // Helper method to filter users based on admin type
  filterUsersByType(users, adminEmail) {
    const isAdminDemo = this.isDemoUser(adminEmail);
    return users.filter((user) => this.isDemoUser(user.email) === isAdminDemo);
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
  // Get users by role filtered by account type (demo vs official)
  async getUsersByRoleFilteredByType(role, adminEmail) {
    try {
      const allUsers = await this.getUsersByRole(role);
      return this.filterUsersByType(allUsers, adminEmail);
    } catch (error) {
      console.error("Error getting filtered users by role:", error);
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
  async getAllStudentProfiles() {
    try {
      const profiles = await StudentProfileModel.find().populate("userId", "name email").populate("assignedTeacher", "name email");
      return profiles.map((profile) => ({
        ...profile.toObject(),
        id: profile._id.toString(),
        assignedTeacher: profile.assignedTeacher ? profile.assignedTeacher._id.toString() : void 0
      }));
    } catch (error) {
      console.error("Error getting all student profiles:", error);
      return [];
    }
  }
  // Get student profiles filtered by account type (demo vs official)
  async getStudentProfilesFilteredByType(adminEmail) {
    try {
      const profiles = await this.getAllStudentProfiles();
      const isAdminDemo = this.isDemoUser(adminEmail);
      return profiles.filter((profile) => {
        const userEmail = profile.userId?.email || "";
        const isProfileDemo = this.isDemoUser(userEmail);
        return isAdminDemo === isProfileDemo;
      });
    } catch (error) {
      console.error("Error getting filtered student profiles:", error);
      return [];
    }
  }
  async getStudentsByTeacher(teacherId) {
    try {
      const profiles = await StudentProfileModel.find({ assignedTeacher: teacherId }).populate("userId", "name email");
      return profiles.map((profile) => ({
        ...profile.toObject(),
        id: profile._id.toString(),
        assignedTeacher: teacherId
      }));
    } catch (error) {
      console.error("Error getting students by teacher:", error);
      return [];
    }
  }
  async getUnassignedStudentProfiles() {
    try {
      const profiles = await StudentProfileModel.find({
        $or: [
          { assignedTeacher: { $exists: false } },
          { assignedTeacher: null }
        ]
      });
      return profiles.map((profile) => ({ ...profile.toObject(), id: profile._id.toString() }));
    } catch (error) {
      console.error("Error getting unassigned student profiles:", error);
      return [];
    }
  }
  async getTeachersBySpecialization(specialization) {
    try {
      const teachers = await UserModel.find({
        role: "teacher",
        specialization
      });
      return teachers.map((teacher) => ({ ...teacher.toObject(), id: teacher._id.toString() }));
    } catch (error) {
      console.error("Error getting teachers by specialization:", error);
      return [];
    }
  }
  async canTeacherVerifyAchievement(teacherId, achievementId) {
    try {
      const achievement = await AchievementModel.findById(achievementId);
      if (!achievement) return false;
      const studentProfile = await StudentProfileModel.findOne({ userId: achievement.studentId });
      if (!studentProfile) return false;
      const teacher = await UserModel.findById(teacherId);
      if (!teacher || teacher.role !== "teacher") return false;
      if (teacher.specialization === studentProfile.branch) {
        return true;
      }
      const additionalBranches = teacher.additionalBranches || [];
      return additionalBranches.includes(studentProfile.branch);
    } catch (error) {
      console.error("Error checking teacher verification permissions:", error);
      return false;
    }
  }
  async searchUsers(query) {
    try {
      const users = await UserModel.find({
        $or: [
          { name: { $regex: query, $options: "i" } },
          { email: { $regex: query, $options: "i" } },
          { specialization: { $regex: query, $options: "i" } }
        ]
      });
      return users.map((user) => ({ ...user.toObject(), id: user._id.toString() }));
    } catch (error) {
      console.error("Error searching users:", error);
      return [];
    }
  }
  async searchStudentProfiles(query) {
    try {
      const profiles = await StudentProfileModel.find({
        $or: [
          { rollNumber: { $regex: query, $options: "i" } },
          { department: { $regex: query, $options: "i" } },
          { branch: { $regex: query, $options: "i" } },
          { course: { $regex: query, $options: "i" } }
        ]
      }).populate("userId", "name email");
      return profiles.map((profile) => ({ ...profile.toObject(), id: profile._id.toString() }));
    } catch (error) {
      console.error("Error searching student profiles:", error);
      return [];
    }
  }
  async assignTeacherToStudent(studentProfileId, teacherId) {
    try {
      const profile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: teacherId },
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : void 0;
    } catch (error) {
      console.error("Error assigning teacher to student:", error);
      return void 0;
    }
  }
  async autoAssignTeacherByBranch(studentProfileId) {
    try {
      const studentProfile = await StudentProfileModel.findById(studentProfileId);
      if (!studentProfile) {
        return void 0;
      }
      const teachers = await UserModel.find({
        role: "teacher",
        specialization: studentProfile.branch
      });
      if (teachers.length === 0) {
        console.log(`No teachers found for branch: ${studentProfile.branch}`);
        const anyTeachers = await UserModel.find({ role: "teacher" });
        if (anyTeachers.length === 0) {
          console.log("No teachers available for assignment");
          return void 0;
        }
        const teacherWorkloads2 = await Promise.all(
          anyTeachers.map(async (teacher) => {
            const assignedStudents = await StudentProfileModel.countDocuments({
              assignedTeacher: teacher._id
            });
            return {
              teacher,
              workload: assignedStudents
            };
          })
        );
        teacherWorkloads2.sort((a, b) => a.workload - b.workload);
        const selectedTeacher2 = teacherWorkloads2[0].teacher;
        const updatedProfile2 = await StudentProfileModel.findByIdAndUpdate(
          studentProfileId,
          { assignedTeacher: selectedTeacher2._id },
          { new: true }
        );
        console.log(`Auto-assigned fallback teacher ${selectedTeacher2.name} to student ${studentProfile.rollNumber}`);
        return updatedProfile2 ? { ...updatedProfile2.toObject(), id: updatedProfile2._id.toString() } : void 0;
      }
      const teacherWorkloads = await Promise.all(
        teachers.map(async (teacher) => {
          const assignedStudents = await StudentProfileModel.countDocuments({
            assignedTeacher: teacher._id
          });
          return {
            teacher,
            workload: assignedStudents
          };
        })
      );
      teacherWorkloads.sort((a, b) => a.workload - b.workload);
      const selectedTeacher = teacherWorkloads[0].teacher;
      const updatedProfile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: selectedTeacher._id },
        { new: true }
      );
      console.log(`Auto-assigned teacher ${selectedTeacher.name} to student ${studentProfile.rollNumber} for branch ${studentProfile.branch}`);
      return updatedProfile ? { ...updatedProfile.toObject(), id: updatedProfile._id.toString() } : void 0;
    } catch (error) {
      console.error("Error auto-assigning teacher:", error);
      return void 0;
    }
  }
  async removeTeacherFromStudent(studentProfileId) {
    try {
      const profile = await StudentProfileModel.findByIdAndUpdate(
        studentProfileId,
        { assignedTeacher: null },
        { new: true }
      );
      return profile ? { ...profile.toObject(), id: profile._id.toString() } : void 0;
    } catch (error) {
      console.error("Error removing teacher from student:", error);
      return void 0;
    }
  }
  // Achievement operations
  async getAchievement(id) {
    try {
      const achievement = await AchievementModel.findById(id);
      return achievement ? {
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      } : void 0;
    } catch (error) {
      console.error("Error getting achievement:", error);
      return void 0;
    }
  }
  async getAchievementsByStudent(studentId) {
    try {
      const achievements = await AchievementModel.find({ studentId });
      return achievements.map((achievement) => ({
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
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
      return achievements.map((achievement) => ({
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting achievements by department:", error);
      return [];
    }
  }
  async getAchievementsByStatus(status) {
    try {
      const achievements = await AchievementModel.find({ status });
      return achievements.map((achievement) => ({
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting achievements by status:", error);
      return [];
    }
  }
  async createAchievement(achievementData) {
    try {
      const achievement = await AchievementModel.create(achievementData);
      return {
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      };
    } catch (error) {
      console.error("Error creating achievement:", error);
      throw error;
    }
  }
  async updateAchievement(id, achievementData) {
    try {
      const achievement = await AchievementModel.findByIdAndUpdate(id, achievementData, { new: true });
      return achievement ? {
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      } : void 0;
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
      return achievements.map((achievement) => ({
        ...achievement.toObject(),
        id: achievement._id.toString(),
        studentId: achievement.studentId.toString()
      }));
    } catch (error) {
      console.error("Error getting all achievements:", error);
      return [];
    }
  }
  // Get achievements filtered by account type (demo vs official)
  async getAchievementsFilteredByType(adminEmail) {
    try {
      const achievements = await this.getAllAchievements();
      const isAdminDemo = this.isDemoUser(adminEmail);
      const allUsers = await this.getUsers();
      const filteredUserIds = allUsers.filter((user) => this.isDemoUser(user.email) === isAdminDemo).map((user) => user.id);
      return achievements.filter(
        (achievement) => filteredUserIds.includes(achievement.studentId)
      );
    } catch (error) {
      console.error("Error getting filtered achievements:", error);
      return [];
    }
  }
  // Department operations
  async getDepartment(id) {
    try {
      const department = await DepartmentModel.findById(id);
      return department ? { ...department.toObject(), id: department._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting department:", error);
      return void 0;
    }
  }
  async getDepartmentByCode(code) {
    try {
      const department = await DepartmentModel.findOne({ code: code.toUpperCase() });
      return department ? { ...department.toObject(), id: department._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting department by code:", error);
      return void 0;
    }
  }
  async getDepartmentByName(name) {
    try {
      const department = await DepartmentModel.findOne({ name });
      return department ? { ...department.toObject(), id: department._id.toString() } : void 0;
    } catch (error) {
      console.error("Error getting department by name:", error);
      return void 0;
    }
  }
  async createDepartment(departmentData) {
    try {
      const department = await DepartmentModel.create({
        ...departmentData,
        code: departmentData.code.toUpperCase()
      });
      return { ...department.toObject(), id: department._id.toString() };
    } catch (error) {
      console.error("Error creating department:", error);
      throw error;
    }
  }
  async updateDepartment(id, departmentData) {
    try {
      const updateData = { ...departmentData };
      if (updateData.code) {
        updateData.code = updateData.code.toUpperCase();
      }
      const department = await DepartmentModel.findByIdAndUpdate(id, updateData, { new: true });
      return department ? { ...department.toObject(), id: department._id.toString() } : void 0;
    } catch (error) {
      console.error("Error updating department:", error);
      return void 0;
    }
  }
  async deleteDepartment(id) {
    try {
      const result = await DepartmentModel.findByIdAndDelete(id);
      return result !== null;
    } catch (error) {
      console.error("Error deleting department:", error);
      return false;
    }
  }
  async getAllDepartments() {
    try {
      const departments = await DepartmentModel.find().sort({ name: 1 });
      const departmentsWithCounts = await Promise.all(
        departments.map(async (dept) => {
          const studentsCount = await StudentProfileModel.countDocuments({ branch: dept.name });
          const teachersCount = await UserModel.countDocuments({
            role: "teacher",
            specialization: dept.name
          });
          return {
            ...dept.toObject(),
            id: dept._id.toString(),
            studentsCount,
            teachersCount
          };
        })
      );
      return departmentsWithCounts;
    } catch (error) {
      console.error("Error getting all departments:", error);
      return [];
    }
  }
  async createDemoAchievements(studentId) {
    try {
      const existingAchievements = await AchievementModel.countDocuments({ studentId });
      if (existingAchievements > 0) {
        console.log("Demo achievements already exist for student:", studentId);
        return;
      }
      console.log("Creating demo achievements for student:", studentId);
      const demoAchievements = [
        {
          studentId,
          title: "Bachelor of Science Degree",
          description: "Graduation certificate for Bachelor of Science degree from Maxwell International School. Awarded to Richard Sanchez on June 30, 2030.",
          type: "academic",
          dateOfActivity: /* @__PURE__ */ new Date("2030-06-30"),
          proofUrl: "/uploads/degree_demo_student.pdf",
          status: "Verified",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        },
        {
          studentId,
          title: "National Health Seminar Participation",
          description: "Certificate of participation in National Seminars on 'Health' hosted by the University Of Aldenaire. Awarded to Anna Katrina Marchesi on November 22, 2023.",
          type: "co-curricular",
          dateOfActivity: /* @__PURE__ */ new Date("2023-11-22"),
          proofUrl: "/uploads/participation_demo_student.pdf",
          status: "Verified",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      ];
      const createdAchievements = await AchievementModel.insertMany(demoAchievements);
      console.log("Demo achievements created successfully:", createdAchievements.length, "achievements");
    } catch (error) {
      console.error("Error creating demo achievements:", error);
    }
  }
  async forceDemoAchievementsCreation(studentId) {
    try {
      await AchievementModel.deleteMany({ studentId });
      console.log("Deleted existing demo achievements for student:", studentId);
      const demoAchievements = [
        {
          studentId,
          title: "Bachelor of Science Degree",
          description: "Graduation certificate for Bachelor of Science degree from Maxwell International School. Awarded to Richard Sanchez on June 30, 2030.",
          type: "academic",
          dateOfActivity: /* @__PURE__ */ new Date("2030-06-30"),
          proofUrl: "/uploads/degree_demo_student.pdf",
          status: "Verified",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        },
        {
          studentId,
          title: "National Health Seminar Participation",
          description: "Certificate of participation in National Seminars on 'Health' hosted by the University Of Aldenaire. Awarded to Anna Katrina Marchesi on November 22, 2023.",
          type: "co-curricular",
          dateOfActivity: /* @__PURE__ */ new Date("2023-11-22"),
          proofUrl: "/uploads/participation_demo_student.pdf",
          status: "Verified",
          createdAt: /* @__PURE__ */ new Date(),
          updatedAt: /* @__PURE__ */ new Date()
        }
      ];
      const createdAchievements = await AchievementModel.insertMany(demoAchievements);
      console.log("Demo achievements forcibly created successfully:", createdAchievements.length, "achievements");
    } catch (error) {
      console.error("Error forcibly creating demo achievements:", error);
    }
  }
  async clearAllData() {
    try {
      await AchievementModel.deleteMany({});
      await StudentProfileModel.deleteMany({});
      await UserModel.deleteMany({});
      console.log("All data cleared successfully");
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  }
  async clearDemoData() {
    try {
      const demoUsers = await UserModel.find({
        email: { $regex: "@example\\.com$" }
      });
      for (const user of demoUsers) {
        await StudentProfileModel.deleteMany({ userId: user._id });
        await AchievementModel.deleteMany({ studentId: user._id.toString() });
        await UserModel.deleteOne({ _id: user._id });
      }
      console.log("Demo data cleared successfully");
    } catch (error) {
      console.error("Error clearing demo data:", error);
    }
  }
  async ensureDemoAchievements() {
    try {
      const demoStudent = await UserModel.findOne({ email: "demo.student@example.com" });
      if (!demoStudent) {
        console.log("Demo student not found, skipping demo achievements creation");
        return;
      }
      await this.forceDemoAchievementsCreation(demoStudent._id.toString());
    } catch (error) {
      console.error("Error ensuring demo achievements:", error);
    }
  }
  async createDefaultDepartments() {
    try {
      const existingDepartments = await DepartmentModel.countDocuments();
      if (existingDepartments > 0) {
        console.log("Departments already exist");
        return;
      }
      const defaultDepartments = [
        {
          name: "Computer Science and Engineering",
          code: "CSE",
          description: "B.Tech and M.Tech programs in Computer Science and Engineering focusing on software development, algorithms, and computer systems."
        },
        {
          name: "Electrical Engineering",
          code: "EE",
          description: "B.Tech and M.Tech programs in Electrical Engineering specializing in electrical systems, power, and control engineering."
        },
        {
          name: "Information Technology",
          code: "IT",
          description: "B.Tech and M.Tech programs in Information Technology focusing on software systems, networking, and IT infrastructure."
        },
        {
          name: "Electronics and Communication Engineering",
          code: "ECE",
          description: "B.Tech and M.Tech programs in Electronics and Communication Engineering specializing in electronic systems and communication technologies."
        },
        {
          name: "Civil Engineering",
          code: "CE",
          description: "B.Tech and M.Tech programs in Civil Engineering focusing on infrastructure, construction, and urban planning."
        },
        {
          name: "Mechanical Engineering",
          code: "ME",
          description: "B.Tech and M.Tech programs in Mechanical Engineering covering design, manufacturing, and mechanical systems."
        }
      ];
      await DepartmentModel.insertMany(defaultDepartments);
      console.log("Default departments created successfully");
    } catch (error) {
      console.error("Error creating default departments:", error);
    }
  }
};
var createStorage = () => {
  const storage = new MongoStorage();
  setTimeout(() => {
    storage.clearAllData().then(() => {
      storage.createOfficialAccounts();
      storage.createDemoAccounts();
      storage.createDefaultDepartments();
      storage.ensureDemoAchievements();
    });
  }, 1e3);
  return storage;
};

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
var getMongoDBStatus = () => isMongoDBConnected;
var database_default = connectDB;

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
  id: z.string().min(1, "ID is required")
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
  profileImage: z2.string().optional(),
  specialization: z2.string().optional()
  // For teachers - their expertise branch
});
var insertStudentProfileSchema = z2.object({
  userId: z2.string().min(1, { message: "User ID is required" }),
  rollNumber: z2.string().min(1, { message: "Roll number is required" }),
  department: z2.string().min(1, { message: "Department is required" }),
  branch: z2.string().min(1, { message: "Branch is required" }),
  year: z2.string().min(1, { message: "Year is required" }),
  course: z2.string().min(1, { message: "Course is required" }),
  assignedTeacher: z2.string().optional()
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
var insertDepartmentSchema = z2.object({
  name: z2.string().min(1, { message: "Department name is required" }),
  code: z2.string().min(1, { message: "Department code is required" }),
  description: z2.string().optional()
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
  branch: z2.string().min(1, { message: "Branch is required" }),
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
    res.status(200).json({
      status: "ok",
      timestamp: (/* @__PURE__ */ new Date()).toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      database: getMongoDBStatus()
    });
  });
  app2.get("/api/ping", (req, res) => {
    res.status(200).send("pong");
  });
  app2.get("/api/status", (req, res) => {
    res.status(200).send("Student Activity Record Platform - Server is running");
  });
  app2.post("/api/auth/login", authLimiter, validateBody(loginSchema), asyncHandler(async (req, res) => {
    const validatedData = req.body;
    const user = await storage.getUserByEmail(validatedData.email);
    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const isPasswordValid = await bcrypt2.compare(validatedData.password, user.password);
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
      department: "Engineering",
      // Default to Engineering
      branch: validatedData.branch,
      year: validatedData.year,
      course: validatedData.course
    };
    const newProfile = await storage.createStudentProfile(profileData);
    if (newProfile) {
      await storage.autoAssignTeacherByBranch(newProfile.id);
    }
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
      const users = await storage.getUsersFilteredByType(req.user.email);
      res.json(users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        specialization: user.specialization
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });
  app2.post("/api/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const isDemoAdmin = req.user.email.includes("demo.") && req.user.email.includes("@example.com");
      if (isDemoAdmin) {
        return res.status(403).json({
          message: "Demo accounts cannot create new users. This is a demonstration environment with restricted permissions.",
          type: "demo_restriction"
        });
      }
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
        profileImage: null,
        specialization: validatedData.role === "teacher" ? validatedData.specialization : void 0,
        additionalBranches: []
      };
      const newUser = await storage.createUser(userData);
      if (validatedData.role === "student" && "rollNumber" in validatedData) {
        const studentData = validatedData;
        const profileData = {
          userId: newUser.id,
          rollNumber: studentData.rollNumber,
          department: "Engineering",
          // Default to Engineering
          branch: studentData.branch,
          year: studentData.year,
          course: studentData.course
        };
        const newProfile = await storage.createStudentProfile(profileData);
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
      if (error instanceof z3.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create user" });
    }
  });
  app2.put("/api/users/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const userId = req.params.id;
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const protectedEmails = [
        "admin@satvirnagra.com",
        "demo.admin@example.com",
        "demo.teacher@example.com",
        "demo.student@example.com"
      ];
      if (protectedEmails.includes(user.email)) {
        return res.status(403).json({ message: "Cannot edit protected account" });
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
      const userId = req.params.id;
      if (userId === req.user.id) {
        return res.status(400).json({ message: "You cannot delete your own account" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const protectedEmails = [
        "admin@satvirnagra.com",
        "demo.admin@example.com",
        "demo.teacher@example.com",
        "demo.student@example.com"
      ];
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
  app2.get("/api/achievements", authenticateToken, async (req, res) => {
    try {
      let achievements;
      if (req.user.role === "admin") {
        achievements = await storage.getAchievementsFilteredByType(req.user.email);
      } else if (req.user.role === "teacher") {
        achievements = await storage.getAchievementsFilteredByType(req.user.email);
        const teacherDepartment = req.query.department;
        if (teacherDepartment) {
          achievements = achievements.filter((a) => a.department === teacherDepartment);
        }
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
      const achievementId = req.params.id;
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
      const achievementId = req.params.id;
      const achievement = await storage.getAchievement(achievementId);
      if (!achievement) {
        return res.status(404).json({ message: "Achievement not found" });
      }
      if (req.user.role === "student" && achievement.studentId !== req.user.id) {
        return res.status(403).json({ message: "Access denied" });
      }
      if (req.user.role === "teacher" && (req.body.status || req.body.feedback)) {
        const canVerify = await storage.canTeacherVerifyAchievement(req.user.id, achievementId);
        if (!canVerify) {
          return res.status(403).json({
            message: "You can only verify achievements from students in your specialization branch"
          });
        }
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
      const achievementId = req.params.id;
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
        achievements = await storage.getAchievementsFilteredByType(req.user.email);
      } else if (req.user.role === "teacher") {
        achievements = await storage.getAchievementsFilteredByType(req.user.email);
        const teacherDepartment = req.query.department;
        if (teacherDepartment) {
          achievements = achievements.filter((a) => a.department === teacherDepartment);
        }
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
  app2.get("/api/reports/csv", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      let achievements = [];
      if (req.user.role === "admin" || req.user.role === "teacher") {
        achievements = await storage.getAchievementsFilteredByType(req.user.email);
        if (req.user.role === "teacher") {
          const teacherDepartment = req.query.department;
          if (teacherDepartment) {
            achievements = achievements.filter((a) => a.department === teacherDepartment);
          }
        }
      }
      let csv = "ID,Title,Description,Type,Date of Activity,Status,Student Name,Last Updated\n";
      for (const achievement of achievements) {
        const student = await storage.getUser(achievement.studentId);
        const studentName = student ? student.name : "Unknown";
        csv += `${achievement._id},"${achievement.title.replace(/"/g, '""')}","${achievement.description.replace(/"/g, '""')}",${achievement.type},${achievement.dateOfActivity.toISOString().split("T")[0]},${achievement.status},"${studentName}",${achievement.updatedAt.toISOString().split("T")[0]}
`;
      }
      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=achievements-report.csv");
      res.send(csv);
    } catch (error) {
      console.error("Error generating CSV report:", error);
      res.status(500).json({ message: "Failed to generate report" });
    }
  });
  app2.get("/api/departments", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      const departments = await storage.getAllDepartments();
      const isDemoAccount = req.user.email.includes("@example.com");
      const departmentStats = await Promise.all(
        departments.map(async (dept) => {
          let studentsCount = 0;
          let teachersCount = 0;
          let branches = [];
          if (isDemoAccount) {
            const filteredStudents = await storage.getUsersByRoleFilteredByType("student", req.user.email);
            const filteredTeachers = await storage.getUsersByRoleFilteredByType("teacher", req.user.email);
            for (const student of filteredStudents) {
              try {
                const profiles = await storage.getStudentProfilesFilteredByType(req.user.email);
                const profile = profiles.find((p) => p.userId._id.toString() === student.id);
                if (profile && profile.branch === dept.name) {
                  studentsCount++;
                  if (!branches.includes(profile.branch)) {
                    branches.push(profile.branch);
                  }
                }
              } catch (error) {
              }
            }
            for (const teacher of filteredTeachers) {
              if (teacher.specialization === dept.name) {
                teachersCount++;
              }
            }
          } else {
            const filteredStudents = await storage.getUsersByRoleFilteredByType("student", req.user.email);
            const filteredTeachers = await storage.getUsersByRoleFilteredByType("teacher", req.user.email);
            for (const student of filteredStudents) {
              try {
                const profiles = await storage.getStudentProfilesFilteredByType(req.user.email);
                const profile = profiles.find((p) => p.userId._id.toString() === student.id);
                if (profile && profile.branch === dept.name) {
                  studentsCount++;
                  if (!branches.includes(profile.branch)) {
                    branches.push(profile.branch);
                  }
                }
              } catch (error) {
              }
            }
            for (const teacher of filteredTeachers) {
              if (teacher.specialization === dept.name) {
                teachersCount++;
              }
            }
          }
          return {
            ...dept,
            studentsCount,
            teachersCount,
            branches
          };
        })
      );
      res.json(departmentStats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch departments" });
    }
  });
  app2.get("/api/departments/:id", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
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
  app2.post("/api/departments", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const validatedData = insertDepartmentSchema.parse(req.body);
      const existingDepartmentByCode = await storage.getDepartmentByCode(validatedData.code);
      if (existingDepartmentByCode) {
        return res.status(400).json({ message: "Department code already exists" });
      }
      const existingDepartmentByName = await storage.getDepartmentByName(validatedData.name);
      if (existingDepartmentByName) {
        return res.status(400).json({ message: "Department name already exists" });
      }
      const newDepartment = await storage.createDepartment(validatedData);
      res.status(201).json(newDepartment);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to create department" });
    }
  });
  app2.put("/api/departments/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const departmentId = req.params.id;
      const validatedData = insertDepartmentSchema.partial().parse(req.body);
      const department = await storage.getDepartment(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
      if (validatedData.code && validatedData.code !== department.code) {
        const existingDepartmentByCode = await storage.getDepartmentByCode(validatedData.code);
        if (existingDepartmentByCode) {
          return res.status(400).json({ message: "Department code already exists" });
        }
      }
      if (validatedData.name && validatedData.name !== department.name) {
        const existingDepartmentByName = await storage.getDepartmentByName(validatedData.name);
        if (existingDepartmentByName) {
          return res.status(400).json({ message: "Department name already exists" });
        }
      }
      const updatedDepartment = await storage.updateDepartment(departmentId, validatedData);
      res.json(updatedDepartment);
    } catch (error) {
      if (error instanceof z3.ZodError) {
        const validationErrors = fromZodError(error);
        return res.status(400).json({ message: validationErrors.message });
      }
      res.status(500).json({ message: "Failed to update department" });
    }
  });
  app2.delete("/api/departments/:id", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const departmentId = req.params.id;
      const department = await storage.getDepartment(departmentId);
      if (!department) {
        return res.status(404).json({ message: "Department not found" });
      }
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
  app2.get("/api/student-profiles", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const profiles = await storage.getStudentProfilesFilteredByType(req.user.email);
      res.json(profiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch student profiles" });
    }
  });
  app2.get("/api/teacher/:teacherId/students", authenticateToken, checkRole(["admin", "teacher"]), async (req, res) => {
    try {
      const { teacherId } = req.params;
      const students = await storage.getStudentsByTeacher(teacherId);
      res.json(students);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch students" });
    }
  });
  app2.post("/api/student-profiles/:studentId/assign-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { studentId } = req.params;
      const { teacherId } = req.body;
      if (!teacherId) {
        return res.status(400).json({ message: "Teacher ID is required" });
      }
      const teacher = await storage.getUser(teacherId);
      if (!teacher || teacher.role !== "teacher") {
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
  app2.delete("/api/student-profiles/:studentId/remove-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
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
  app2.post("/api/student-profiles/:studentId/auto-assign-teacher", authenticateToken, checkRole(["admin"]), async (req, res) => {
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
  app2.post("/api/auto-assign-all-teachers", authenticateToken, checkRole(["admin"]), async (req, res) => {
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
        successful: results.filter((r) => r.success).length,
        failed: results.filter((r) => !r.success).length
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to auto-assign teachers" });
    }
  });
  app2.get("/api/search/users", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const users = await storage.searchUsers(query);
      const isAdminDemo = req.user.email.includes("@example.com");
      const filteredUsers = users.filter((user) => {
        const isUserDemo = user.email.includes("@example.com");
        return isAdminDemo === isUserDemo;
      });
      res.json(filteredUsers.map((user) => ({
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
  app2.get("/api/search/student-profiles", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { q: query } = req.query;
      if (!query || typeof query !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const profiles = await storage.searchStudentProfiles(query);
      const isAdminDemo = req.user.email.includes("@example.com");
      const allUsers = await storage.getUsersFilteredByType(req.user.email);
      const filteredUserIds = allUsers.map((user) => user.id);
      const filteredProfiles = profiles.filter((profile) => filteredUserIds.includes(profile.userId));
      res.json(filteredProfiles);
    } catch (error) {
      res.status(500).json({ message: "Failed to search student profiles" });
    }
  });
  app2.get("/api/teachers/by-specialization/:specialization", authenticateToken, checkRole(["admin"]), async (req, res) => {
    try {
      const { specialization } = req.params;
      const teachers = await storage.getTeachersBySpecialization(specialization);
      const isAdminDemo = req.user.email.includes("@example.com");
      const filteredTeachers = teachers.filter((teacher) => {
        const isTeacherDemo = teacher.email.includes("@example.com");
        return isAdminDemo === isTeacherDemo;
      });
      res.json(filteredTeachers.map((teacher) => ({
        id: teacher.id,
        name: teacher.name,
        email: teacher.email,
        specialization: teacher.specialization
      })));
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch teachers by specialization" });
    }
  });
  return httpServer;
}

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
      const publicPath = path4.join(__dirname, "../public");
      app.use(express3.static(publicPath));
      app.get("*", (req, res) => {
        res.sendFile(path4.join(publicPath, "index.html"));
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
