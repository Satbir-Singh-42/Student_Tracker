import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Statistics } from '@/lib/types';
import StatCard from '@/components/dashboard/StatCard';
import ActivityList from '@/components/dashboard/ActivityList';
import QuickActions from '@/components/dashboard/QuickActions';
import ActivityTypeChart from '@/components/dashboard/ActivityTypeChart';

export default function StudentDashboard() {
  const { user } = useAuth();
  const { data: stats, isLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="mb-6 lg:mb-8">
        <h1 className="font-poppins text-xl sm:text-2xl lg:text-3xl font-semibold">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1 text-sm sm:text-base">Track and manage your academic and extracurricular achievements</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 mb-6 lg:mb-8">
        <StatCard
          title="Total Activities"
          value={isLoading ? '...' : stats?.totalCount || 0}
          icon="bar_chart"
          iconColor="text-primary"
          subtext={isLoading ? 'Loading...' : stats?.totalCount > 0 ? '+2 since last month' : 'No activities yet'}
          subtextColor="text-green-500"
        />
        
        <StatCard
          title="Verified"
          value={isLoading ? '...' : stats?.verifiedCount || 0}
          icon="check_circle"
          iconColor="text-green-500"
          subtext={isLoading 
            ? 'Loading...' 
            : stats && stats.totalCount > 0 
              ? `${Math.round(stats.successRate)}% success rate` 
              : 'No verified activities'}
          subtextColor="text-green-500"
        />
        
        <StatCard
          title="Pending"
          value={isLoading ? '...' : stats?.pendingCount || 0}
          icon="hourglass_empty"
          iconColor="text-yellow-500"
          subtext="Awaiting verification"
        />
        
        <StatCard
          title="Rejected"
          value={isLoading ? '...' : stats?.rejectedCount || 0}
          icon="cancel"
          iconColor="text-red-500"
          subtext="Require updates"
        />
      </div>

      <div className="flex flex-col xl:flex-row gap-6 lg:gap-8">
        <div className="flex-1 min-w-0">
          <ActivityList />
        </div>
        
        <div className="xl:w-80 2xl:w-96 flex-shrink-0">
          <div className="space-y-6">
            <QuickActions />
            <ActivityTypeChart />
          </div>
        </div>
      </div>
    </div>
  );
}
