import { z } from 'zod';
import { ACHIEVEMENT_TYPES, ACHIEVEMENT_STATUS, USER_ROLES, FILE_UPLOAD } from './constants';

// File validation
export const fileValidation = z.object({
  file: z
    .instanceof(File)
    .refine((file) => file.size <= FILE_UPLOAD.MAX_SIZE, 'File size must be less than 5MB')
    .refine(
      (file) => FILE_UPLOAD.ALLOWED_TYPES.includes(file.type),
      'File must be JPG, PNG, or PDF'
    ),
});

// Enhanced validation schemas
export const enhancedLoginSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const enhancedRegisterSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  rollNumber: z.string().min(1, 'Roll number is required'),
  department: z.string().min(1, 'Department is required'),
  year: z.string().min(1, 'Year is required'),
  course: z.string().min(1, 'Course is required'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export const enhancedAchievementSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  type: z.enum([
    ACHIEVEMENT_TYPES.ACADEMIC,
    ACHIEVEMENT_TYPES.SPORTS,
    ACHIEVEMENT_TYPES.CO_CURRICULAR,
    ACHIEVEMENT_TYPES.EXTRA_CURRICULAR,
  ]),
  dateOfActivity: z.date({
    required_error: 'Date of activity is required',
  }).refine(
    (date) => date <= new Date(),
    'Date cannot be in the future'
  ),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  department: z.string().min(1, 'Department is required').optional(),
  year: z.string().min(1, 'Year is required').optional(),
  course: z.string().min(1, 'Course is required').optional(),
});

export const verificationSchema = z.object({
  status: z.enum([
    ACHIEVEMENT_STATUS.VERIFIED,
    ACHIEVEMENT_STATUS.REJECTED,
  ]),
  feedback: z.string().optional(),
});

// Form validation helpers
export const validateForm = <T>(schema: z.ZodSchema<T>, data: unknown): { success: boolean; data?: T; errors?: string[] } => {
  try {
    const result = schema.parse(data);
    return { success: true, data: result };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        success: false, 
        errors: error.errors.map(err => err.message) 
      };
    }
    return { success: false, errors: ['Validation failed'] };
  }
};

// Common validation patterns
export const patterns = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^\+?[\d\s-()]+$/,
  rollNumber: /^[A-Z0-9]+$/i,
};