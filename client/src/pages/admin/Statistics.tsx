import { useQuery } from '@tanstack/react-query';
import { Statistics as StatsType } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
  Cell,
  LineChart,
  Line
} from 'recharts';

export default function Statistics() {
  const { data: stats, isLoading } = useQuery<StatsType>({
    queryKey: ['/api/statistics'],
  });

  // Prepare chart data
  const prepareTypeData = () => {
    if (!stats) return [];
    
    const data = [
      { name: 'Academic', value: stats.typeStats.academic || 0 },
      { name: 'Sports', value: stats.typeStats.sports || 0 },
      { name: 'Co-curricular', value: stats.typeStats['co-curricular'] || 0 },
      { name: 'Extra-curricular', value: stats.typeStats['extra-curricular'] || 0 }
    ];
    
    // If all values are 0, return sample data to show chart structure
    const hasData = data.some(item => item.value > 0);
    if (!hasData) {
      return [
        { name: 'Academic', value: 0 },
        { name: 'Sports', value: 0 },
        { name: 'Co-curricular', value: 0 },
        { name: 'Extra-curricular', value: 0 }
      ];
    }
    
    return data;
  };

  const prepareStatusData = () => {
    if (!stats) return [];
    
    const data = [
      { name: 'Verified', value: stats.verifiedCount || 0 },
      { name: 'Pending', value: stats.pendingCount || 0 },
      { name: 'Rejected', value: stats.rejectedCount || 0 }
    ];
    
    // If all values are 0, return sample data to show chart structure
    const hasData = data.some(item => item.value > 0);
    if (!hasData) {
      return [
        { name: 'Verified', value: 0 },
        { name: 'Pending', value: 0 },
        { name: 'Rejected', value: 0 }
      ];
    }
    
    return data;
  };

  // Real data will be calculated from actual database records
  const prepareMonthlyTrendData = () => {
    if (!stats) return [];
    
    // This would be calculated from real database data
    // For now, show current month data only
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    return [
      { 
        month: currentMonth, 
        academic: stats.typeStats.academic, 
        sports: stats.typeStats.sports, 
        cocurricular: stats.typeStats['co-curricular'], 
        extracurricular: stats.typeStats['extra-curricular'] 
      }
    ];
  };

  const prepareSuccessRateTrend = () => {
    if (!stats) return [];
    
    // This would be calculated from real database data
    // For now, show current success rate
    const currentMonth = new Date().toLocaleString('default', { month: 'short' });
    return [
      { month: currentMonth, rate: stats.successRate }
    ];
  };

  // Pie chart colors
  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f50057'];
  
  // Status colors
  const STATUS_COLORS = ['#4caf50', '#ff9800', '#f44336'];

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-semibold">System Statistics</h1>
          <p className="text-gray-600 mt-1">Detailed insights and analytics</p>
        </div>
        <div className="flex justify-center p-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">System Statistics</h1>
        <p className="text-gray-600 mt-1">Detailed insights and analytics</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Activities</CardTitle>
            <CardDescription>System-wide submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{stats?.totalCount || 0}</div>
            <div className="text-sm text-gray-500 mt-2">
              Last updated: {new Date().toLocaleDateString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Verification Rate</CardTitle>
            <CardDescription>Percentage of verified activities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-600">{Math.round(stats?.successRate || 0)}%</div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
              <div 
                className="bg-green-600 h-2.5 rounded-full" 
                style={{ width: `${stats?.successRate || 0}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Average Response Time</CardTitle>
            <CardDescription>Time to verify submissions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">2.3 days</div>
            <div className="text-sm text-gray-500 mt-2">
              <span className="text-green-500">↓ 0.5 days</span> from last month
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Active Users</CardTitle>
            <CardDescription>Users with recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">78%</div>
            <div className="text-sm text-gray-500 mt-2">
              <span className="text-green-500">↑ 12%</span> from last month
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="verification">Verification Stats</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activities by Type</CardTitle>
                <CardDescription>Distribution across different categories</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {prepareTypeData().every(item => item.value === 0) ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p className="text-lg font-medium">No Activity Data</p>
                        <p className="text-sm mt-1">Charts will appear when activities are submitted</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareTypeData()}
                          cx="50%"
                          cy="40%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={false}
                        >
                          {prepareTypeData().map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} activities`, name]} />
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

            <Card>
              <CardHeader>
                <CardTitle>Activities by Status</CardTitle>
                <CardDescription>Current verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  {prepareStatusData().every(item => item.value === 0) ? (
                    <div className="flex items-center justify-center h-full text-gray-500">
                      <div className="text-center">
                        <p className="text-lg font-medium">No Status Data</p>
                        <p className="text-sm mt-1">Charts will appear when activities are submitted</p>
                      </div>
                    </div>
                  ) : (
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareStatusData()}
                          cx="50%"
                          cy="40%"
                          labelLine={false}
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={false}
                        >
                          <Cell fill="#4caf50" />
                          <Cell fill="#ff9800" />
                          <Cell fill="#f44336" />
                        </Pie>
                        <Tooltip formatter={(value, name) => [`${value} activities`, name]} />
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

          <Card>
            <CardHeader>
              <CardTitle>System Statistics</CardTitle>
              <CardDescription>Current system activity summary</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { 
                        status: 'Current System', 
                        activities: stats?.totalCount || 0, 
                        verified: stats?.verifiedCount || 0, 
                        pending: stats?.pendingCount || 0, 
                        rejected: stats?.rejectedCount || 0 
                      }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="status" 
                      angle={-45} 
                      textAnchor="end" 
                      height={70} 
                      tick={{ fontSize: 12 }} 
                    />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="activities" name="Total Activities" fill="#1976d2" />
                    <Bar dataKey="verified" name="Verified" fill="#4caf50" />
                    <Bar dataKey="pending" name="Pending" fill="#ff9800" />
                    <Bar dataKey="rejected" name="Rejected" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Trends</CardTitle>
              <CardDescription>Activities by type over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareMonthlyTrendData()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="academic" name="Academic" stroke="#1976d2" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="sports" name="Sports" stroke="#4caf50" />
                    <Line type="monotone" dataKey="cocurricular" name="Co-curricular" stroke="#ff9800" />
                    <Line type="monotone" dataKey="extracurricular" name="Extra-curricular" stroke="#f50057" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Verification Success Rate Trend</CardTitle>
              <CardDescription>Percentage of verified activities over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={prepareSuccessRateTrend()}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[0, 100]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="rate" 
                      name="Success Rate (%)" 
                      stroke="#4caf50" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="verification" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Verification Statistics</CardTitle>
              <CardDescription>Real-time verification metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="p-8 text-center">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Teacher Verification Analytics</h3>
                <p className="text-gray-600 mb-6">
                  Detailed verification statistics will be available once teachers begin reviewing student submissions.
                </p>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    This section will show real-time data including:
                  </p>
                  <ul className="text-sm text-blue-700 mt-2 space-y-1">
                    <li>• Teacher verification performance</li>
                    <li>• Average verification time</li>
                    <li>• Rejection reasons analysis</li>
                    <li>• Department-wise statistics</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Current System Status</CardTitle>
              <CardDescription>Real-time system overview</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{stats?.totalCount || 0}</div>
                    <div className="text-sm text-blue-800">Total Activities</div>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{stats?.verifiedCount || 0}</div>
                    <div className="text-sm text-green-800">Verified</div>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <div className="text-2xl font-bold text-yellow-600">{stats?.pendingCount || 0}</div>
                    <div className="text-sm text-yellow-800">Pending</div>
                  </div>
                  <div className="text-center p-4 bg-red-50 rounded-lg">
                    <div className="text-2xl font-bold text-red-600">{stats?.rejectedCount || 0}</div>
                    <div className="text-sm text-red-800">Rejected</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
