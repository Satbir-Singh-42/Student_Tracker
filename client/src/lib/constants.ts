export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
  },
  USERS: '/api/users',
  ACHIEVEMENTS: '/api/achievements',
  STATISTICS: '/api/statistics',
  UPLOAD: '/api/upload',
  PROFILE: '/api/profile',
} as const;

export const QUERY_KEYS = {
  HEALTH: ['health'],
  USERS: ['users'],
  ACHIEVEMENTS: ['achievements'],
  STATISTICS: ['statistics'],
  PROFILE: ['profile'],
} as const;

export const ACHIEVEMENT_TYPES = {
  ACADEMIC: 'academic',
  SPORTS: 'sports',
  CO_CURRICULAR: 'co-curricular',
  EXTRA_CURRICULAR: 'extra-curricular',
} as const;

export const ACHIEVEMENT_STATUS = {
  SUBMITTED: 'Submitted',
  PENDING: 'Pending',
  VERIFIED: 'Verified',
  REJECTED: 'Rejected',
} as const;

export const USER_ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ADMIN: 'admin',
} as const;

export const FILE_UPLOAD = {
  MAX_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'application/pdf'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.pdf'],
} as const;

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  MAX_PAGE_SIZE: 100,
} as const;

export const CACHE_TIMES = {
  STALE_TIME: 5 * 60 * 1000, // 5 minutes
  CACHE_TIME: 10 * 60 * 1000, // 10 minutes
} as const;