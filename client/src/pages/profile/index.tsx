import { useAuth } from "@/lib/auth";
import ProfileForm from "@/components/profile/ProfileForm";
import { Loader2 } from "lucide-react";

export default function ProfilePage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Authentication Required</h1>
        <p className="text-gray-600">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Profile Settings</h1>
      <ProfileForm user={user} />
    </div>
  );
}