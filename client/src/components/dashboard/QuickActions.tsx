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
        <div className="p-6">
          <div className="mb-4">
            <Link href="/student/upload">
              <button 
                onClick={onUploadClick}
                className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[44px] text-sm"
              >
                <Plus size={18} className="mr-2" />
                Upload New Achievement
              </button>
            </Link>
          </div>
          
          <div className="mb-4">
            <Link href="/student/reports">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[44px] text-sm">
                <FileText size={18} className="mr-2" />
                Generate Report
              </button>
            </Link>
          </div>
          
          <div>
            <Link href="/student/history">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[44px] text-sm">
                <History size={18} className="mr-2" />
                View Activity History
              </button>
            </Link>
          </div>
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
        <div className="p-6">
          <div className="mb-4">
            <Link href="/teacher/verify">
              <button className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[44px] text-sm">
                <CheckCircle size={18} className="mr-2" />
                Verify Pending Activities
              </button>
            </Link>
          </div>
          
          <div>
            <Link href="/teacher/reports">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[44px] text-sm">
                <FileText size={18} className="mr-2" />
                Generate Department Report
              </button>
            </Link>
          </div>
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
        <div className="p-6">
          <div className="mb-4">
            <Link href="/admin/users">
              <button className="w-full bg-primary text-white py-3 px-4 rounded-md flex items-center justify-center hover:bg-blue-700 transition-colors min-h-[44px] text-sm">
                <UserPlus size={18} className="mr-2" />
                Manage Users
              </button>
            </Link>
          </div>
          
          <div className="mb-4">
            <Link href="/admin/statistics">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[44px] text-sm">
                <BarChart3 size={18} className="mr-2" />
                View Statistics
              </button>
            </Link>
          </div>
          
          <div>
            <Link href="/admin/reports">
              <button className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors min-h-[44px] text-sm">
                <FileText size={18} className="mr-2" />
                Generate Global Reports
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
