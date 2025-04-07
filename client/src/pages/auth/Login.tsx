import { useEffect } from 'react';
import { useLocation } from 'wouter';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';

export default function Login() {
  const [, setLocation] = useLocation();
  const { user } = useAuth();

  useEffect(() => {
    // Redirect to appropriate dashboard if already logged in
    if (user) {
      if (user.role === 'student') setLocation('/student/dashboard');
      else if (user.role === 'teacher') setLocation('/teacher/dashboard');
      else if (user.role === 'admin') setLocation('/admin/dashboard');
    }
  }, [user, setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-primary p-6 text-white">
          <h1 className="font-poppins text-2xl font-semibold">Student Activity Record</h1>
          <p className="mt-2 text-blue-100">Track and showcase your academic journey</p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  );
}
