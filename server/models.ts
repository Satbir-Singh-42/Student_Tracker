import mongoose from 'mongoose';

// User Schema
const userSchema = new mongoose.Schema({
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
    enum: ['student', 'teacher', 'admin'],
    required: true
  },
  profileImage: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Student Profile Schema
const studentProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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

// Achievement Schema
const achievementSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
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
    enum: ['academic', 'sports', 'co-curricular', 'extra-curricular'],
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
    enum: ['Submitted', 'Pending', 'Verified', 'Rejected'],
    default: 'Submitted'
  },
  feedback: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

// Create models
export const UserModel = mongoose.model('User', userSchema);
export const StudentProfileModel = mongoose.model('StudentProfile', studentProfileSchema);
export const AchievementModel = mongoose.model('Achievement', achievementSchema);