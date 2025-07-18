import { useQuery } from '@tanstack/react-query';
import { Link } from 'wouter';
import { useAuth } from '@/lib/auth';
import { Statistics, Achievement, User } from '@/lib/types';
import StatCard from '@/components/dashboard/StatCard';
import QuickActions from '@/components/dashboard/QuickActions';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

export default function AdminDashboard() {
  const { user } = useAuth();
  
  const { data: stats, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const { data: users, isLoading: usersLoading } = useQuery<User[]>({
    queryKey: ['/api/users'],
  });

  const isLoading = statsLoading || achievementsLoading || usersLoading;

  // Get recent activities
  const recentAchievements = achievements?.slice(0, 5) || [];

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Count users by role
  const getUsersByRole = () => {
    if (!users) return { students: 0, teachers: 0, admins: 0 };
    
    const usersByRole = {
      students: users.filter(u => u.role === 'student').length,
      teachers: users.filter(u => u.role === 'teacher').length,
      admins: users.filter(u => u.role === 'admin').length
    };
    
    return usersByRole;
  };

  // Prepare data for pie chart
  const prepareTypeData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Academic', value: stats.typeStats.academic },
      { name: 'Sports', value: stats.typeStats.sports },
      { name: 'Co-curricular', value: stats.typeStats['co-curricular'] },
      { name: 'Extra-curricular', value: stats.typeStats['extra-curricular'] }
    ];
  };

  // Chart colors
  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f50057'];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-gray-600 mt-1">System overview and management</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          title="Total Activities"
          value={isLoading ? '...' : stats?.totalCount || 0}
          icon="bar_chart"
          iconColor="text-primary"
          subtext={isLoading ? 'Loading...' : `System-wide`}
        />
        
        <StatCard
          title="Total Users"
          value={isLoading ? '...' : users?.length || 0}
          icon="people"
          iconColor="text-purple-500"
          subtext={isLoading 
            ? 'Loading...' 
            : users?.length 
              ? `Active accounts` 
              : 'No users yet'}
        />
        
        <StatCard
          title="Verification Rate"
          value={isLoading ? '...' : `${Math.round(stats?.successRate || 0)}%`}
          icon="check_circle"
          iconColor="text-green-500"
          subtext="Of all submissions"
        />
        
        <StatCard
          title="Pending Activities"
          value={isLoading ? '...' : stats?.pendingCount || 0}
          icon="hourglass_empty"
          iconColor="text-yellow-500"
          subtext="Awaiting verification"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader>
              <CardTitle>Activity Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={prepareTypeData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Number of Activities" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="h-full">
            <CardHeader>
              <CardTitle>User Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                {isLoading ? (
                  <div className="flex justify-center items-center h-full">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Students', value: getUsersByRole().students },
                          { name: 'Teachers', value: getUsersByRole().teachers },
                          { name: 'Admins', value: getUsersByRole().admins }
                        ]}
                        cx="50%"
                        cy="40%"
                        labelLine={false}
                        outerRadius={60}
                        fill="#8884d8"
                        dataKey="value"
                        label={false}
                      >
                        <Cell fill="#1976d2" />
                        <Cell fill="#ff9800" />
                        <Cell fill="#f50057" />
                      </Pie>
                      <Tooltip formatter={(value, name) => [`${value} users`, name]} />
                      <Legend 
                        verticalAlign="bottom" 
                        height={36}
                        formatter={(value, entry) => `${value}: ${entry.payload.value}`}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg">Recent Activities</CardTitle>
              <Link href="/admin/reports">
                <Button variant="link" size="sm" className="text-sm">View All</Button>
              </Link>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="py-8 flex justify-center">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : recentAchievements.length === 0 ? (
                <div className="py-8 text-center text-gray-500">
                  <p>No activities found in the system.</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {recentAchievements.map(achievement => (
                    <div key={achievement.id} className="py-4 first:pt-0 last:pb-0">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start">
                          <div className="h-10 w-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center mr-3">
                            <span className="material-icons">assignment</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{achievement.title}</h3>
                            <p className="text-sm text-gray-600 capitalize">{achievement.type}</p>
                            <p className="text-xs text-gray-500 mt-1">Student #{achievement.studentId} • {formatDate(achievement.dateOfActivity)}</p>
                          </div>
                        </div>
                        <div>
                          <Badge className={
                            achievement.status === 'Verified' 
                              ? 'bg-green-100 text-green-800' 
                              : achievement.status === 'Pending' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : 'bg-red-100 text-red-800'
                          }>
                            {achievement.status}
                          </Badge>
                        </div>
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
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <span className="material-icons text-primary text-lg mr-2">school</span>
                    Students
                  </span>
                  <span className="font-semibold">{isLoading ? '-' : getUsersByRole().students}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <span className="material-icons text-yellow-500 text-lg mr-2">assignment_ind</span>
                    Teachers
                  </span>
                  <span className="font-semibold">{isLoading ? '-' : getUsersByRole().teachers}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <span className="material-icons text-green-500 text-lg mr-2">verified</span>
                    Verified Activities
                  </span>
                  <span className="font-semibold">{isLoading ? '-' : stats?.verifiedCount || 0}</span>
                </li>
                <li className="flex items-center justify-between">
                  <span className="text-sm font-medium flex items-center">
                    <span className="material-icons text-red-500 text-lg mr-2">cancel</span>
                    Rejected Activities
                  </span>
                  <span className="font-semibold">{isLoading ? '-' : stats?.rejectedCount || 0}</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
