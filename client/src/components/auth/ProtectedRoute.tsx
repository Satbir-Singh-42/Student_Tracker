import { useEffect } from "react";
import type { ComponentType } from "react";
import { useAuth } from "@/lib/auth";
import { Route, useLocation } from "wouter";
import NotFound from "@/pages/not-found";
import AppLayout from "@/components/layout/AppLayout";

// Separate component to handle redirects to avoid hook issues
const RedirectComponent = ({ 
  redirect, 
  setLocation 
}: { 
  redirect: string, 
  setLocation: (to: string) => void 
}) => {
  useEffect(() => {
    setLocation(redirect);
  }, [redirect, setLocation]);
  return null;
};

type ProtectedRouteProps = {
  path: string;
  component: ComponentType;
  allowedRoles: Array<"student" | "teacher" | "admin">;
  redirect?: string;
};

export const ProtectedRoute = ({
  path,
  component: Component,
  allowedRoles,
  redirect = "/auth",
}: ProtectedRouteProps) => {
  const { user, isLoading } = useAuth();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <Route path={path}>
        <div className="h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </Route>
    );
  }

  // If not authenticated, redirect to login
  if (!user) {
    return (
      <Route path={path}>
        <RedirectComponent redirect={redirect} setLocation={setLocation} />
      </Route>
    );
  }

  // If user role is not allowed, show access denied
  if (!allowedRoles.includes(user.role)) {
    return (
      <Route path={path}>
        <AppLayout>
          <div className="flex flex-col items-center justify-center py-12">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h1 className="text-3xl font-bold mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">You don't have permission to access this page.</p>
            <button 
              onClick={() => {
                // Redirect based on role
                if (user.role === "student") setLocation("/student/dashboard");
                else if (user.role === "teacher") setLocation("/teacher/dashboard");
                else if (user.role === "admin") setLocation("/admin/dashboard");
              }}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
            >
              Go to Dashboard
            </button>
          </div>
        </AppLayout>
      </Route>
    );
  }

  // If authenticated and authorized, render the component
  return (
    <Route path={path}>
      <AppLayout>
        <Component />
      </AppLayout>
    </Route>
  );
};

export default ProtectedRoute;