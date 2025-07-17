import { useState, useEffect } from 'react';
import { useAuth, useLogout } from '@/lib/auth';
import { Menu, X } from 'lucide-react';
import Sidebar from './Sidebar';
import MobileSidebar from './MobileSidebar';

interface AppLayoutProps {
  children: React.ReactNode;
}

export default function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();
  const { mutate: logoutMutation } = useLogout();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when window is resized to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle logout
  const handleLogout = () => {
    logoutMutation();
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 bg-white shadow-sm z-10 px-4 py-2 flex items-center justify-between">
        <div className="flex items-center">
          <button 
            onClick={() => setIsMobileMenuOpen(true)} 
            className="p-2 rounded-full hover:bg-neutral-200"
          >
            <Menu size={24} />
          </button>
          <h1 className="font-poppins font-semibold text-lg ml-2">Student Activity Record</h1>
        </div>
        <div className="flex items-center">
          <div className="relative">
            <button className="flex items-center focus:outline-none">
              <div className="h-8 w-8 rounded-full bg-primary text-white flex items-center justify-center">
                <span>{user.name[0]}</span>
              </div>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Desktop */}
      <Sidebar user={user} onLogout={handleLogout} />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        user={user} 
        isOpen={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
        onLogout={handleLogout}
      />

      {/* Main Content */}
      <main className="flex-1 overflow-auto bg-gray-50 pt-14 lg:pt-0">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
