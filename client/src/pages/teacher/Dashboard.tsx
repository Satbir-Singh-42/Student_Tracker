import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Statistics, Achievement } from '@/lib/types';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import AchievementVerification from '@/components/achievements/AchievementVerification';

export default function TeacherDashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const isLoading = statsLoading || achievementsLoading;

  // Get pending achievements for quick verification
  const pendingAchievements = achievements?.filter(achievement => 
    achievement.status === 'Pending'
  ).slice(0, 3) || [];

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Welcome back, {user?.name.split(' ')[0]}!</h1>
        <p className="text-gray-600 mt-1">Manage and verify student activity submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Activities"
          value={isLoading ? '...' : stats?.totalCount || 0}
          icon="bar_chart"
          iconColor="text-primary"
          subtext={isLoading ? 'Loading...' : `In your department`}
        />
        
        <StatCard
          title="Verified"
          value={isLoading ? '...' : stats?.verifiedCount || 0}
          icon="check_circle"
          iconColor="text-green-500"
          subtext={isLoading 
            ? 'Loading...' 
            : stats && stats.totalCount > 0 
              ? `${Math.round(stats.successRate)}% verification rate` 
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
          subtext="With feedback"
        />
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card className="h-full">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center justify-between">
                <span>Pending Verifications</span>
                <Link href="/teacher/verify">
                  <Button variant="link" className="text-sm">View All</Button>
                </Link>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : pendingAchievements.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <span className="material-icons text-4xl mb-2">check_circle</span>
                  <p>No pending verifications!</p>
                  <p className="mt-1 text-sm">All activities have been reviewed.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {pendingAchievements.map(achievement => (
                    <div key={achievement.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="h-10 w-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center mr-3">
                            <span className="material-icons">school</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 capitalize">{achievement.type}</p>
                            <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.dateOfActivity)}</p>
                          </div>
                        </div>
                        <div>
                          <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                        </div>
                      </div>
                      <div className="mt-3 text-sm text-gray-600 line-clamp-2 mb-3">
                        {achievement.description}
                      </div>
                      <div className="flex justify-end">
                        <AchievementVerification achievement={achievement} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="md:w-80 lg:w-96">
          <QuickActions />
          
          <Card className="mt-6">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Department Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Academic</span>
                    <span className="text-sm font-medium">
                      {isLoading ? '-' : stats?.typeStats.academic || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-primary h-2 rounded-full" 
                      style={{ 
                        width: isLoading || !stats?.totalCount 
                          ? '0%' 
                          : `${(stats.typeStats.academic / stats.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Sports</span>
                    <span className="text-sm font-medium">
                      {isLoading ? '-' : stats?.typeStats.sports || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ 
                        width: isLoading || !stats?.totalCount 
                          ? '0%' 
                          : `${(stats.typeStats.sports / stats.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Co-curricular</span>
                    <span className="text-sm font-medium">
                      {isLoading ? '-' : stats?.typeStats['co-curricular'] || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-yellow-500 h-2 rounded-full" 
                      style={{ 
                        width: isLoading || !stats?.totalCount 
                          ? '0%' 
                          : `${(stats.typeStats['co-curricular'] / stats.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium">Extra-curricular</span>
                    <span className="text-sm font-medium">
                      {isLoading ? '-' : stats?.typeStats['extra-curricular'] || 0}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-pink-500 h-2 rounded-full" 
                      style={{ 
                        width: isLoading || !stats?.totalCount
                          ? '0%' 
                          : `${(stats.typeStats['extra-curricular'] / stats.totalCount) * 100}%` 
                      }}
                    ></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
