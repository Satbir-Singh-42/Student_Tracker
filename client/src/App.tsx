import { Switch, Route, useLocation } from "wouter";
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
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/auth";
import AppLayout from "@/components/layout/AppLayout";

function RouterContent() {
  const { user, isLoading } = useAuth();
  const [location, setLocation] = useLocation();

  useEffect(() => {
    // Redirect to login if not authenticated, except for the register page
    if (!isLoading && !user && location !== "/register" && !location.startsWith("/login")) {
      setLocation("/login");
    }

    // Redirect to dashboard if authenticated and trying to access login/register
    if (!isLoading && user && (location === "/login" || location === "/register")) {
      if (user.role === "student") setLocation("/student/dashboard");
      else if (user.role === "teacher") setLocation("/teacher/dashboard");
      else if (user.role === "admin") setLocation("/admin/dashboard");
    }
  }, [user, isLoading, location, setLocation]);

  // Show loading state
  if (isLoading) {
    return <div className="h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <Switch>
      {/* Public Routes */}
      <Route path="/login" component={Login} />
      <Route path="/register" component={Register} />

      {/* Protected Routes - Only render if user is authenticated */}
      {user && (
        <Route path="/:path*">
          {(params) => {
            const path = params.path || "";

            // Student Routes
            if (user.role === "student") {
              return (
                <AppLayout>
                  <Switch>
                    <Route path="/student/dashboard" component={StudentDashboard} />
                    <Route path="/student/upload" component={UploadAchievement} />
                    <Route path="/student/history" component={ActivityHistory} />
                    <Route path="/student/reports" component={Reports} />
                    <Route component={NotFound} />
                  </Switch>
                </AppLayout>
              );
            }

            // Teacher Routes
            if (user.role === "teacher") {
              return (
                <AppLayout>
                  <Switch>
                    <Route path="/teacher/dashboard" component={TeacherDashboard} />
                    <Route path="/teacher/verify" component={VerifyActivities} />
                    <Route path="/teacher/reports" component={DepartmentReports} />
                    <Route component={NotFound} />
                  </Switch>
                </AppLayout>
              );
            }

            // Admin Routes
            if (user.role === "admin") {
              return (
                <AppLayout>
                  <Switch>
                    <Route path="/admin/dashboard" component={AdminDashboard} />
                    <Route path="/admin/users" component={ManageUsers} />
                    <Route path="/admin/departments" component={Departments} />
                    <Route path="/admin/statistics" component={Statistics} />
                    <Route path="/admin/reports" component={GlobalReports} />
                    <Route component={NotFound} />
                  </Switch>
                </AppLayout>
              );
            }

            return <NotFound />;
          }}
        </Route>
      )}

      {/* Fallback to 404 */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return <RouterContent />;
}

export default App;
