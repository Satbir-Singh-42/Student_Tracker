import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';


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
    <div className="min-h-screen flex flex-col md:flex-row">
      {/* Hero section - Hidden on mobile */}
      <div className="hidden md:flex flex-1 bg-primary text-white p-8 flex-col justify-center items-center md:items-start">
        <div className="max-w-lg mx-auto md:mx-0">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">Student Activity Record Platform</h1>
          <p className="text-xl mb-8">Track, manage, and showcase your academic achievements in one place</p>
          <ul className="space-y-4 mb-8">
            <li className="flex items-start">
              <div className="mr-2 mt-1">✓</div>
              <div>Upload and manage your academic and extracurricular achievements</div>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1">✓</div>
              <div>Get your achievements verified by teachers</div>
            </li>
            <li className="flex items-start">
              <div className="mr-2 mt-1">✓</div>
              <div>Generate reports and certificates for your portfolio</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Login form - Full width on mobile */}
      <div className="w-full md:flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <LoginForm />
              
              <div className="mt-6 text-center">
                <p className="text-sm text-gray-500">
                  Don't have an account? <Link href="/register" className="text-primary hover:underline">Register here</Link>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
