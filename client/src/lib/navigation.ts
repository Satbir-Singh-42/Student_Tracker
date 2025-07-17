import { User } from './types';

export interface NavItem {
  path: string;
  label: string;
  icon: string;
  roles: Array<'student' | 'teacher' | 'admin'>;
}

export const navItems: NavItem[] = [
  // Student Routes
  {
    path: '/student/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ['student']
  },
  {
    path: '/student/upload',
    label: 'Upload Achievement',
    icon: 'upload_file',
    roles: ['student']
  },
  {
    path: '/student/history',
    label: 'Activity History',
    icon: 'history',
    roles: ['student']
  },
  {
    path: '/student/reports',
    label: 'Reports',
    icon: 'description',
    roles: ['student']
  },
  // Teacher Routes
  {
    path: '/teacher/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ['teacher']
  },
  {
    path: '/teacher/verify',
    label: 'Verify Activities',
    icon: 'fact_check',
    roles: ['teacher']
  },
  {
    path: '/teacher/reports',
    label: 'Department Reports',
    icon: 'description',
    roles: ['teacher']
  },
  // Admin Routes
  {
    path: '/admin/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    roles: ['admin']
  },
  {
    path: '/admin/users',
    label: 'Manage Users',
    icon: 'people',
    roles: ['admin']
  },
  {
    path: '/admin/departments',
    label: 'Departments',
    icon: 'school',
    roles: ['admin']
  },
  {
    path: '/admin/statistics',
    label: 'Statistics',
    icon: 'insights',
    roles: ['admin']
  },
  {
    path: '/admin/reports',
    label: 'Global Reports',
    icon: 'description',
    roles: ['admin']
  }
];

export function getNavItems(user: User): NavItem[] {
  return navItems.filter(item => item.roles.includes(user.role));
}

export function getDefaultRoute(user: User): string {
  switch (user.role) {
    case 'student':
      return '/student/dashboard';
    case 'teacher':
      return '/teacher/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/auth';
  }
}