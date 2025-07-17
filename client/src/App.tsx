import { Switch, Route, useLocation, Redirect } from "wouter";
import { useEffect } from "react";
import Login from "@/pages/auth/Login";
import Register from "@/pages/auth/Register";
import StudentDashboard from "@/pages/student/Dashboard";
import UploadAchievement from "@/pages/student/UploadAchievement";
import ActivityHistory from "@/pages/student/ActivityHistory";
import Reports from "@/pages/student/Reports";
import TeacherDashboard from "@/pages/teacher/Dashboard";
import VerifyActivities from "@/pages/teacher/VerifyActivities";
import DepartmentReports from "@/pages/teacher/DepartmentReports";
import AdminDashboard from "@/pages/admin/Dashboard";
import ManageUsers from "@/pages/admin/ManageUsers";
import Departments from "@/pages/admin/Departments";
import Statistics from "@/pages/admin/Statistics";
import GlobalReports from "@/pages/admin/GlobalReports";
import ProfilePage from "@/pages/profile";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/auth";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import { PageLoading } from "@/components/ui/loading-spinner";

function App() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to dashboard if authenticated and trying to access login/register
    if (!isLoading && user && (location === "/auth" || location === "/register")) {
      if (user.role === "student") setLocation("/student/dashboard");
      else if (user.role === "teacher") setLocation("/teacher/dashboard");
      else if (user.role === "admin") setLocation("/admin/dashboard");
    }
  }, [user, isLoading, location, setLocation]);

  return (
    <Switch>
      {/* Home Route - Redirect based on authentication status */}
      <Route path="/">
        {() => {
          if (isLoading) {
            return (
              <div className="h-screen flex items-center justify-center">
                <PageLoading />
              </div>
            );
          }
          
          if (!user) {
            return <Redirect to="/auth" />;
          }
          
          if (user.role === "student") {
            return <Redirect to="/student/dashboard" />;
          } else if (user.role === "teacher") {
            return <Redirect to="/teacher/dashboard" />;
          } else if (user.role === "admin") {
            return <Redirect to="/admin/dashboard" />;
          }
          
          return <Redirect to="/auth" />;
        }}
      </Route>

      {/* Public Routes */}
      <Route path="/auth" component={Login} />
      <Route path="/register" component={Register} />

      {/* Student Routes */}
      <ProtectedRoute 
        path="/student/dashboard" 
        component={StudentDashboard} 
        allowedRoles={["student"]} 
      />
      <ProtectedRoute 
        path="/student/upload" 
        component={UploadAchievement} 
        allowedRoles={["student"]} 
      />
      <ProtectedRoute 
        path="/student/history" 
        component={ActivityHistory} 
        allowedRoles={["student"]} 
      />
      <ProtectedRoute 
        path="/student/reports" 
        component={Reports} 
        allowedRoles={["student"]} 
      />

      {/* Teacher Routes */}
      <ProtectedRoute 
        path="/teacher/dashboard" 
        component={TeacherDashboard} 
        allowedRoles={["teacher"]} 
      />
      <ProtectedRoute 
        path="/teacher/verify" 
        component={VerifyActivities} 
        allowedRoles={["teacher"]} 
      />
      <ProtectedRoute 
        path="/teacher/reports" 
        component={DepartmentReports} 
        allowedRoles={["teacher"]} 
      />

      {/* Admin Routes */}
      <ProtectedRoute 
        path="/admin/dashboard" 
        component={AdminDashboard} 
        allowedRoles={["admin"]} 
      />
      <ProtectedRoute 
        path="/admin/users" 
        component={ManageUsers} 
        allowedRoles={["admin"]} 
      />
      <ProtectedRoute 
        path="/admin/departments" 
        component={Departments} 
        allowedRoles={["admin"]} 
      />
      <ProtectedRoute 
        path="/admin/statistics" 
        component={Statistics} 
        allowedRoles={["admin"]} 
      />
      <ProtectedRoute 
        path="/admin/reports" 
        component={GlobalReports} 
        allowedRoles={["admin"]} 
      />

      {/* Profile Route - Accessible by all authenticated users */}
      <ProtectedRoute 
        path="/profile" 
        component={ProfilePage} 
        allowedRoles={["student", "teacher", "admin"]} 
      />

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

export default App;
