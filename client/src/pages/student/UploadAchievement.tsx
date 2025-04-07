import { useLocation } from 'wouter';
import AchievementForm from '@/components/achievements/AchievementForm';

export default function UploadAchievement() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    // Redirect to history page after successful upload
    setLocation('/student/history');
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Upload New Achievement</h1>
        <p className="text-gray-600 mt-1">Add details about your academic or extracurricular achievements</p>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <AchievementForm onSuccess={handleSuccess} buttonText="Submit Achievement" />
      </div>
    </div>
  );
}
