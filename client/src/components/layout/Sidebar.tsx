import { Link, useLocation } from 'wouter';
import { User } from '@/lib/types';
import { ConnectionStatusCompact } from '@/components/ui/connection-status';
import { 
  Home, 
  Upload, 
  History, 
  FileText, 
  CheckCircle, 
  Users, 
  School, 
  BarChart3, 
  LogOut 
} from 'lucide-react';

interface SidebarProps {
  user: User;
  onLogout: () => void;
}

export default function Sidebar({ user, onLogout }: SidebarProps) {
  const [location] = useLocation();

  const isActiveLink = (path: string) => {
    return location === path;
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-gray-200">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <h1 className="font-poppins font-semibold text-lg text-primary">StudentRecord</h1>
      </div>
      
      {/* Student Navigation */}
      {user.role === 'student' && (
        <div className="py-4 flex-1">
          <div className="px-4 mb-2 text-xs font-medium text-gray-600 uppercase">Dashboard</div>
          <Link 
            href="/student/dashboard" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/student/dashboard') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Home size={20} className="mr-3" />
            <span>Overview</span>
          </Link>
          <Link 
            href="/student/upload" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/student/upload') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <Upload size={20} className="mr-3" />
            <span>Upload Achievement</span>
          </Link>
          <Link 
            href="/student/history" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/student/history') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <History size={20} className="mr-3" />
            <span>My Activities</span>
          </Link>
          <Link 
            href="/student/reports" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/student/reports') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <FileText size={20} className="mr-3" />
            <span>Reports</span>
          </Link>
        </div>
      )}

      {/* Teacher Navigation */}
      {user.role === 'teacher' && (
        <div className="py-4 flex-1">
          <div className="px-4 mb-2 text-xs font-medium text-gray-600 uppercase">Dashboard</div>
          <Link 
            href="/teacher/dashboard" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/dashboard') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">dashboard</span>
            <span>Overview</span>
          </Link>
          <Link 
            href="/teacher/verify" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/verify') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">fact_check</span>
            <span>Verify Activities</span>
          </Link>
          <Link 
            href="/teacher/reports" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/reports') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">description</span>
            <span>Department Reports</span>
          </Link>
        </div>
      )}

      {/* Admin Navigation */}
      {user.role === 'admin' && (
        <div className="py-4 flex-1">
          <div className="px-4 mb-2 text-xs font-medium text-gray-600 uppercase">Administration</div>
          <Link 
            href="/admin/dashboard" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/admin/dashboard') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">dashboard</span>
            <span>Overview</span>
          </Link>
          <Link 
            href="/admin/users" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/admin/users') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">people</span>
            <span>Manage Users</span>
          </Link>
          <Link 
            href="/admin/departments" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/admin/departments') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">school</span>
            <span>Departments</span>
          </Link>
          <Link 
            href="/admin/statistics" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/admin/statistics') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">insights</span>
            <span>Statistics</span>
          </Link>
          <Link 
            href="/admin/reports" 
            className={`flex items-center px-4 py-3 ${isActiveLink('/admin/reports') 
              ? 'text-primary bg-blue-100' 
              : 'text-gray-700 hover:bg-gray-100'}`}
          >
            <span className="material-icons mr-3">description</span>
            <span>Global Reports</span>
          </Link>
        </div>
      )}
      
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-primary text-white flex items-center justify-center">
            <span>{user.name[0]}</span>
          </div>
          <div className="ml-3">
            <div className="font-medium text-sm">{user.name}</div>
            <div className="text-xs text-gray-600 capitalize">{user.role}</div>
          </div>
        </div>
        <button 
          onClick={onLogout}
          className="mt-4 w-full flex items-center justify-center px-4 py-2 text-sm text-gray-700 border border-gray-300 rounded-md hover:bg-gray-100"
        >
          <span className="material-icons text-sm mr-2">logout</span>
          Sign Out
        </button>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <ConnectionStatusCompact />
        </div>
      </div>
    </aside>
  );
}
