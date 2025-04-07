import { useEffect } from 'react';
import { useLocation, Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import LoginForm from '@/components/auth/LoginForm';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

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
      {/* Hero section */}
      <div className="flex-1 bg-primary text-white p-8 flex flex-col justify-center items-center md:items-start">
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

      {/* Login form */}
      <div className="flex-1 bg-gray-50 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Card>
            <CardContent className="pt-6">
              <Tabs defaultValue="login" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="login">Login</TabsTrigger>
                  <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
                </TabsList>
                
                <TabsContent value="login">
                  <LoginForm />
                </TabsContent>
                
                <TabsContent value="demo">
                  <div className="space-y-6 py-2">
                    <h3 className="text-lg font-medium">Demo Accounts</h3>
                    <p className="text-sm text-gray-500 mb-4">
                      Use these accounts to explore different roles in the platform
                    </p>
                    
                    <div className="space-y-4">
                      <Card className="border-dashed">
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-1 flex items-center">
                            <span className="bg-blue-100 text-blue-800 text-xs px-2.5 py-0.5 rounded mr-2">Student</span>
                            Student Account
                          </h4>
                          <p className="text-sm text-gray-500">Email: student@example.com</p>
                          <p className="text-sm text-gray-500">Password: password123</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed">
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-1 flex items-center">
                            <span className="bg-green-100 text-green-800 text-xs px-2.5 py-0.5 rounded mr-2">Teacher</span>
                            Teacher Account
                          </h4>
                          <p className="text-sm text-gray-500">Email: teacher@example.com</p>
                          <p className="text-sm text-gray-500">Password: password123</p>
                        </CardContent>
                      </Card>
                      
                      <Card className="border-dashed">
                        <CardContent className="pt-4">
                          <h4 className="font-medium mb-1 flex items-center">
                            <span className="bg-purple-100 text-purple-800 text-xs px-2.5 py-0.5 rounded mr-2">Admin</span>
                            Admin Account
                          </h4>
                          <p className="text-sm text-gray-500">Email: admin@example.com</p>
                          <p className="text-sm text-gray-500">Password: password123</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
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
