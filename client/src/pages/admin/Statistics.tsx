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
    
    return [
      { name: 'Academic', value: stats.typeStats.academic },
      { name: 'Sports', value: stats.typeStats.sports },
      { name: 'Co-curricular', value: stats.typeStats['co-curricular'] },
      { name: 'Extra-curricular', value: stats.typeStats['extra-curricular'] }
    ];
  };

  const prepareStatusData = () => {
    if (!stats) return [];
    
    return [
      { name: 'Verified', value: stats.verifiedCount },
      { name: 'Pending', value: stats.pendingCount },
      { name: 'Rejected', value: stats.rejectedCount }
    ];
  };

  // Sample monthly trend data
  // In a real app, this would come from the API
  const monthlyTrendData = [
    { month: 'Jan', academic: 8, sports: 5, cocurricular: 3, extracurricular: 4 },
    { month: 'Feb', academic: 10, sports: 6, cocurricular: 5, extracurricular: 3 },
    { month: 'Mar', academic: 15, sports: 8, cocurricular: 7, extracurricular: 5 },
    { month: 'Apr', academic: 12, sports: 10, cocurricular: 6, extracurricular: 7 },
    { month: 'May', academic: 18, sports: 12, cocurricular: 8, extracurricular: 6 },
    { month: 'Jun', academic: 20, sports: 15, cocurricular: 10, extracurricular: 8 },
  ];

  // Success rate trends (sample data)
  const successRateTrend = [
    { month: 'Jan', rate: 65 },
    { month: 'Feb', rate: 68 },
    { month: 'Mar', rate: 75 },
    { month: 'Apr', rate: 72 },
    { month: 'May', rate: 80 },
    { month: 'Jun', rate: 85 },
  ];

  const verificationStats = [
    { teacher: 'Sarah Wilson', verified: 38, rejected: 7, pending: 5 },
    { teacher: 'John Miller', verified: 32, rejected: 4, pending: 3 },
    { teacher: 'Emma Davis', verified: 28, rejected: 6, pending: 8 },
    { teacher: 'Michael Brown', verified: 42, rejected: 9, pending: 3 },
    { teacher: 'Jessica Taylor', verified: 35, rejected: 5, pending: 7 },
  ];

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
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareTypeData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {prepareTypeData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activities by Status</CardTitle>
                <CardDescription>Current verification status</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareStatusData()}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#4caf50" />
                        <Cell fill="#ff9800" />
                        <Cell fill="#f44336" />
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Department Comparison</CardTitle>
              <CardDescription>Activities by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { department: 'Computer Science', activities: 120, verified: 85, rejected: 10, pending: 25 },
                      { department: 'Physics', activities: 85, verified: 60, rejected: 15, pending: 10 },
                      { department: 'Chemistry', activities: 95, verified: 70, rejected: 10, pending: 15 },
                      { department: 'Mathematics', activities: 75, verified: 50, rejected: 5, pending: 20 },
                      { department: 'Biology', activities: 110, verified: 75, rejected: 20, pending: 15 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis 
                      dataKey="department" 
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
                    data={monthlyTrendData}
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
                    data={successRateTrend}
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
              <CardTitle>Teacher Verification Statistics</CardTitle>
              <CardDescription>Performance metrics by teacher</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={verificationStats}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    layout="vertical"
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis 
                      dataKey="teacher" 
                      type="category" 
                      width={120}
                      tick={{ fontSize: 12 }} 
                    />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" name="Verified" fill="#4caf50" />
                    <Bar dataKey="pending" name="Pending" fill="#ff9800" />
                    <Bar dataKey="rejected" name="Rejected" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Average Verification Time</CardTitle>
                <CardDescription>Time taken by department (days)</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { department: 'Computer Science', time: 1.8 },
                        { department: 'Physics', time: 2.5 },
                        { department: 'Chemistry', time: 2.2 },
                        { department: 'Mathematics', time: 1.5 },
                        { department: 'Biology', time: 2.8 },
                      ]}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="department" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="time" name="Average Days" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Rejection Reasons</CardTitle>
                <CardDescription>Common reasons for rejection</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={[
                          { name: 'Insufficient evidence', value: 45 },
                          { name: 'Duplicate submission', value: 20 },
                          { name: 'Incorrect details', value: 25 },
                          { name: 'Outside timeframe', value: 10 },
                        ]}
                        cx="50%"
                        cy="50%"
                        labelLine={true}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {COLORS.map((color, index) => (
                          <Cell key={`cell-${index}`} fill={color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
