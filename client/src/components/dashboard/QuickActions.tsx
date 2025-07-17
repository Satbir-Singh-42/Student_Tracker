import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Plus, FileText, History, CheckCircle, Users, BarChart3, UserPlus } from 'lucide-react';

interface QuickActionsProps {
  onUploadClick?: () => void;
}

export default function QuickActions({ onUploadClick }: QuickActionsProps) {
  const { user } = useAuth();
  
  if (!user) return null;

  // Student Quick Actions
  if (user.role === 'student') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Quick Actions</h2>
        </div>
        <div className="p-6 space-y-4">
          <Link href="/student/upload">
            <button 
              onClick={onUploadClick}
              className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[48px]"
            >
              <Plus size={18} className="mr-3" />
              Upload New Achievement
            </button>
          </Link>
          
          <Link href="/student/reports">
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[48px]">
              <FileText size={18} className="mr-3" />
              Generate Report
            </button>
          </Link>
          
          <Link href="/student/history">
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[48px]">
              <History size={18} className="mr-3" />
              View Activity History
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Teacher Quick Actions
  if (user.role === 'teacher') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Quick Actions</h2>
        </div>
        <div className="p-6 space-y-4">
          <Link href="/teacher/verify">
            <button className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[48px]">
              <CheckCircle size={18} className="mr-3" />
              Verify Pending Activities
            </button>
          </Link>
          
          <Link href="/teacher/reports">
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[48px]">
              <FileText size={18} className="mr-3" />
              Generate Department Report
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // Admin Quick Actions
  if (user.role === 'admin') {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Quick Actions</h2>
        </div>
        <div className="p-6 space-y-4">
          <Link href="/admin/users">
            <button className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[48px]">
              <UserPlus size={18} className="mr-3" />
              Manage Users
            </button>
          </Link>
          
          <Link href="/admin/statistics">
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[48px]">
              <BarChart3 size={18} className="mr-3" />
              View Statistics
            </button>
          </Link>
          
          <Link href="/admin/reports">
            <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[48px]">
              <FileText size={18} className="mr-3" />
              Generate Global Reports
            </button>
          </Link>
        </div>
      </div>
    );
  }

  return null;
}
