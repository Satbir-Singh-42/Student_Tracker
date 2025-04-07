import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { Achievement } from '@/lib/types';

interface ActivityListProps {
  limit?: number;
  showLoadMore?: boolean;
}

export default function ActivityList({ limit = 3, showLoadMore = true }: ActivityListProps) {
  const { data: achievements, isLoading, error } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="font-medium text-lg">Recent Activities</h2>
          <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
        </div>
        <div className="divide-y divide-gray-200">
          {Array(3).fill(0).map((_, i) => (
            <div key={i} className="px-6 py-4">
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded mb-2"></div>
                  <div className="h-3 w-1/2 bg-gray-200 animate-pulse rounded mb-1"></div>
                  <div className="h-3 w-1/4 bg-gray-200 animate-pulse rounded"></div>
                </div>
                <div className="h-5 w-16 bg-gray-200 animate-pulse rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !achievements) {
    return (
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Recent Activities</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          Failed to load activities. Please try again later.
        </div>
      </div>
    );
  }

  const limitedAchievements = achievements.slice(0, limit);
  
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return 'emoji_events';
      case 'sports': return 'sports_soccer';
      case 'co-curricular': return 'school';
      case 'extra-curricular': return 'music_note';
      default: return 'emoji_events';
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
        <h2 className="font-medium text-lg">Recent Activities</h2>
        <Link href="/student/history" className="text-primary text-sm hover:underline">View all</Link>
      </div>
      <div className="divide-y divide-gray-200">
        {limitedAchievements.length > 0 ? (
          limitedAchievements.map((achievement) => (
            <div key={achievement.id} className="px-6 py-4 flex items-center justify-between">
              <div className="flex items-start">
                <div className="h-10 w-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center mr-3">
                  <span className="material-icons">{getTypeIcon(achievement.type)}</span>
                </div>
                <div>
                  <h3 className="font-medium">{achievement.title}</h3>
                  <p className="text-sm text-gray-600">{achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}</p>
                  <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.dateOfActivity)}</p>
                </div>
              </div>
              <div>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusClass(achievement.status)}`}>
                  {achievement.status}
                </span>
              </div>
            </div>
          ))
        ) : (
          <div className="px-6 py-10 text-center text-gray-500">
            No activities found. Start by uploading a new achievement!
          </div>
        )}
      </div>
      {showLoadMore && achievements.length > limit && (
        <div className="px-6 py-3 bg-gray-50 flex justify-center">
          <Link href="/student/history" className="text-primary text-sm hover:underline flex items-center">
            <span>Load more</span>
            <span className="material-icons text-sm ml-1">expand_more</span>
          </Link>
        </div>
      )}
    </div>
  );
}
