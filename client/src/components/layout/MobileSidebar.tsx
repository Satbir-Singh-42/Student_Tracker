import { Link, useLocation } from 'wouter';
import { User } from '@/lib/types';
import { 
  X, 
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

interface MobileSidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onLogout: () => void;
}

export default function MobileSidebar({ user, isOpen, onClose, onLogout }: MobileSidebarProps) {
  const [location] = useLocation();

  const isActiveLink = (path: string) => {
    return location === path;
  };

  const handleLinkClick = () => {
    onClose();
  };

  return (
    <div className={`fixed inset-0 z-20 transform ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out lg:hidden`}>
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="absolute inset-y-0 left-0 w-64 max-w-sm bg-white shadow-lg transform translate-x-0 transition-transform duration-300 ease-in-out">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h1 className="font-poppins font-semibold text-lg text-primary">StudentRecord</h1>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100">
            <X size={20} />
          </button>
        </div>
        
        {/* Student Navigation */}
        {user.role === 'student' && (
          <div className="py-4 flex-1">
            <Link 
              href="/student/dashboard" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/student/dashboard') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home size={20} className="mr-3" />
              <span>Overview</span>
            </Link>
            <Link 
              href="/student/upload" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/student/upload') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Upload size={20} className="mr-3" />
              <span>Upload Achievement</span>
            </Link>
            <Link 
              href="/student/history" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/student/history') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <History size={20} className="mr-3" />
              <span>My Activities</span>
            </Link>
            <Link 
              href="/student/reports" 
              onClick={handleLinkClick}
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
            <Link 
              href="/teacher/dashboard" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/dashboard') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home size={20} className="mr-3" />
              <span>Overview</span>
            </Link>
            <Link 
              href="/teacher/verify" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/verify') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <CheckCircle size={20} className="mr-3" />
              <span>Verify Activities</span>
            </Link>
            <Link 
              href="/teacher/reports" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/teacher/reports') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FileText size={20} className="mr-3" />
              <span>Department Reports</span>
            </Link>
          </div>
        )}

        {/* Admin Navigation */}
        {user.role === 'admin' && (
          <div className="py-4 flex-1">
            <Link 
              href="/admin/dashboard" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/admin/dashboard') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Home size={20} className="mr-3" />
              <span>Overview</span>
            </Link>
            <Link 
              href="/admin/users" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/admin/users') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <Users size={20} className="mr-3" />
              <span>Manage Users</span>
            </Link>
            <Link 
              href="/admin/departments" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/admin/departments') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <School size={20} className="mr-3" />
              <span>Departments</span>
            </Link>
            <Link 
              href="/admin/statistics" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/admin/statistics') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <BarChart3 size={20} className="mr-3" />
              <span>Statistics</span>
            </Link>
            <Link 
              href="/admin/reports" 
              onClick={handleLinkClick}
              className={`flex items-center px-4 py-3 ${isActiveLink('/admin/reports') 
                ? 'text-primary bg-blue-100' 
                : 'text-gray-700 hover:bg-gray-100'}`}
            >
              <FileText size={20} className="mr-3" />
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
            <LogOut size={16} className="mr-2" />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
