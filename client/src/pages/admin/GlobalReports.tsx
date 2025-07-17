import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { Statistics, Achievement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
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
import { useToast } from '@/hooks/use-toast';

export default function GlobalReports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf'>('csv');
  const [reportType, setReportType] = useState('all');
  const [dateRange, setDateRange] = useState('month');
  
  // Fetch statistics and achievements
  const { data: stats, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  const isLoading = statsLoading || achievementsLoading;

  // Generate and download report
  const downloadReport = async () => {
    try {
      // In a real app, this would include query parameters for filtering
      const response = await fetch(`/api/reports/csv?type=${reportType}&range=${dateRange}`);
      
      if (!response.ok) {
        throw new Error('Failed to generate report');
      }
      
      // For CSV report
      if (reportFormat === 'csv') {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `global-achievements-report.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        // For PDF, usually opens in a new window
        window.open(response.url, '_blank');
      }
      
      toast({
        title: 'Global Report Generated',
        description: `Your ${reportFormat.toUpperCase()} report has been downloaded`,
        variant: 'success',
      });
    } catch (error) {
      toast({
        title: 'Failed to Generate Report',
        description: error instanceof Error ? error.message : 'An error occurred',
        variant: 'destructive',
      });
    }
  };

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

  // Sample data for department comparison
  const departmentData = [
    { department: 'Computer Science', academic: 45, sports: 25, cocurricular: 15, extracurricular: 20 },
    { department: 'Physics', academic: 35, sports: 15, cocurricular: 10, extracurricular: 12 },
    { department: 'Chemistry', academic: 30, sports: 18, cocurricular: 20, extracurricular: 15 },
    { department: 'Mathematics', academic: 40, sports: 10, cocurricular: 12, extracurricular: 8 },
    { department: 'Biology', academic: 25, sports: 30, cocurricular: 25, extracurricular: 18 },
  ];

  // Sample monthly trend data
  const monthlyTrendData = [
    { month: 'Jan', verified: 25, rejected: 5, pending: 10 },
    { month: 'Feb', verified: 35, rejected: 8, pending: 12 },
    { month: 'Mar', verified: 45, rejected: 10, pending: 15 },
    { month: 'Apr', verified: 40, rejected: 12, pending: 8 },
    { month: 'May', verified: 55, rejected: 7, pending: 10 },
    { month: 'Jun', verified: 60, rejected: 5, pending: 12 },
  ];

  // Pie chart colors
  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f50057'];
  
  // Status colors
  const STATUS_COLORS = ['#4caf50', '#ff9800', '#f44336'];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Global Reports</h1>
        <p className="text-gray-600 mt-1">Generate and analyze system-wide activity reports</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-2">
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Select options and download comprehensive reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Report Type</label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Activities</SelectItem>
                  <SelectItem value="academic">Academic Only</SelectItem>
                  <SelectItem value="sports">Sports Only</SelectItem>
                  <SelectItem value="co-curricular">Co-curricular Only</SelectItem>
                  <SelectItem value="extra-curricular">Extra-curricular Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
              <Select value={dateRange} onValueChange={setDateRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="month">Last Month</SelectItem>
                  <SelectItem value="quarter">Last Quarter</SelectItem>
                  <SelectItem value="semester">Last Semester</SelectItem>
                  <SelectItem value="year">Last Year</SelectItem>
                  <SelectItem value="all">All Time</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
              <div className="flex items-center space-x-2">
                <Button 
                  variant={reportFormat === 'csv' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setReportFormat('csv')}
                  className="flex-1"
                >
                  CSV
                </Button>
                <Button 
                  variant={reportFormat === 'pdf' ? 'default' : 'outline'} 
                  size="sm" 
                  onClick={() => setReportFormat('pdf')}
                  className="flex-1"
                  disabled={true} // PDF not implemented in backend yet
                >
                  PDF
                </Button>
              </div>
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full" 
                onClick={downloadReport}
                disabled={isLoading}
              >
                <span className="material-icons mr-2">download</span>
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Activities</CardTitle>
            <CardDescription>All submissions system-wide</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold">{isLoading ? '...' : stats?.totalCount || 0}</div>
            <div className="text-sm text-gray-500 mt-2">
              {isLoading ? 'Loading...' : `Last updated: ${new Date().toLocaleDateString()}`}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Verification Status</CardTitle>
            <CardDescription>Current status distribution</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-3xl font-bold text-green-600">
                {isLoading ? '...' : stats?.verifiedCount || 0}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Verified</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-green-600 h-2.5 rounded-full" 
                    style={{ width: `${isLoading ? 0 : stats?.verifiedCount ? (stats.verifiedCount / stats.totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4 mt-3">
              <div className="text-3xl font-bold text-yellow-500">
                {isLoading ? '...' : stats?.pendingCount || 0}
              </div>
              <div className="flex-1">
                <div className="text-sm text-gray-500 mb-1">Pending</div>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div 
                    className="bg-yellow-500 h-2.5 rounded-full" 
                    style={{ width: `${isLoading ? 0 : stats?.pendingCount ? (stats.pendingCount / stats.totalCount) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Success Rate</CardTitle>
            <CardDescription>Verification success percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-primary">
              {isLoading ? '...' : `${Math.round(stats?.successRate || 0)}%`}
            </div>
            <div className="mt-2">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>0%</span>
                <span>50%</span>
                <span>100%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div 
                  className="bg-primary h-2.5 rounded-full" 
                  style={{ width: `${isLoading ? 0 : stats?.successRate || 0}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="departments">Department Analysis</TabsTrigger>
          <TabsTrigger value="trends">Trends</TabsTrigger>
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
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    </div>
                  ) : (
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
                <div className="h-64">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-full">
                      <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                    </div>
                  ) : (
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
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Recent Activities</CardTitle>
              <CardDescription>Latest submissions system-wide</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-4">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : !achievements?.length ? (
                <div className="text-center py-4 text-gray-500">
                  <p>No activities found in the system.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-50 border-b">
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Title</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        <th className="p-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {achievements.slice(0, 5).map((achievement) => (
                        <tr key={achievement.id} className="hover:bg-gray-50">
                          <td className="p-3 text-sm">{achievement.title}</td>
                          <td className="p-3 text-sm">Student #{achievement.studentId}</td>
                          <td className="p-3 text-sm capitalize">{achievement.type}</td>
                          <td className="p-3 text-sm">
                            {new Date(achievement.dateOfActivity).toLocaleDateString()}
                          </td>
                          <td className="p-3 text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold
                              ${achievement.status === 'Verified' 
                                ? 'bg-green-100 text-green-800' 
                                : achievement.status === 'Pending' 
                                  ? 'bg-yellow-100 text-yellow-800' 
                                  : 'bg-red-100 text-red-800'}`}
                            >
                              {achievement.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="departments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Department Activity Comparison</CardTitle>
              <CardDescription>Activities by type across departments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={departmentData}
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
                    <Bar dataKey="academic" name="Academic" fill="#1976d2" />
                    <Bar dataKey="sports" name="Sports" fill="#4caf50" />
                    <Bar dataKey="cocurricular" name="Co-curricular" fill="#ff9800" />
                    <Bar dataKey="extracurricular" name="Extra-curricular" fill="#f50057" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Top Departments by Activity</CardTitle>
                <CardDescription>Departments with most submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={departmentData.map(d => ({
                        department: d.department,
                        total: d.academic + d.sports + d.cocurricular + d.extracurricular
                      })).sort((a, b) => b.total - a.total)}
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
                      <Bar dataKey="total" name="Total Activities" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Department Success Rates</CardTitle>
                <CardDescription>Verification success by department</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={[
                        { department: 'Computer Science', rate: 85 },
                        { department: 'Physics', rate: 75 },
                        { department: 'Chemistry', rate: 82 },
                        { department: 'Mathematics', rate: 90 },
                        { department: 'Biology', rate: 78 },
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
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="rate" name="Success Rate (%)" fill="#4caf50" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Activity Trends</CardTitle>
              <CardDescription>Activities by status over time</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={monthlyTrendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="verified" name="Verified" stackId="a" fill="#4caf50" />
                    <Bar dataKey="pending" name="Pending" stackId="a" fill="#ff9800" />
                    <Bar dataKey="rejected" name="Rejected" stackId="a" fill="#f44336" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Year-over-Year Comparison</CardTitle>
              <CardDescription>Activity growth compared to previous years</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { month: 'Jan', current: 45, previous: 30 },
                      { month: 'Feb', current: 55, previous: 40 },
                      { month: 'Mar', current: 70, previous: 55 },
                      { month: 'Apr', current: 60, previous: 45 },
                      { month: 'May', current: 75, previous: 60 },
                      { month: 'Jun', current: 85, previous: 70 },
                      { month: 'Jul', current: 75, previous: 65 },
                      { month: 'Aug', current: 65, previous: 50 },
                      { month: 'Sep', current: 90, previous: 75 },
                      { month: 'Oct', current: 95, previous: 80 },
                      { month: 'Nov', current: 85, previous: 70 },
                      { month: 'Dec', current: 100, previous: 85 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="current" 
                      name="Current Year" 
                      stroke="#1976d2" 
                      strokeWidth={2} 
                      activeDot={{ r: 8 }} 
                    />
                    <Line 
                      type="monotone" 
                      dataKey="previous" 
                      name="Previous Year" 
                      stroke="#9e9e9e" 
                      strokeWidth={2} 
                      strokeDasharray="5 5" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Growth by Activity Type</CardTitle>
              <CardDescription>Trend analysis by activity category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={[
                      { quarter: 'Q1 2022', academic: 30, sports: 20, cocurricular: 15, extracurricular: 10 },
                      { quarter: 'Q2 2022', academic: 35, sports: 25, cocurricular: 18, extracurricular: 15 },
                      { quarter: 'Q3 2022', academic: 40, sports: 30, cocurricular: 22, extracurricular: 18 },
                      { quarter: 'Q4 2022', academic: 45, sports: 35, cocurricular: 25, extracurricular: 20 },
                      { quarter: 'Q1 2023', academic: 50, sports: 40, cocurricular: 30, extracurricular: 25 },
                      { quarter: 'Q2 2023', academic: 60, sports: 45, cocurricular: 35, extracurricular: 30 },
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="quarter" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="academic" name="Academic" stroke="#1976d2" />
                    <Line type="monotone" dataKey="sports" name="Sports" stroke="#4caf50" />
                    <Line type="monotone" dataKey="cocurricular" name="Co-curricular" stroke="#ff9800" />
                    <Line type="monotone" dataKey="extracurricular" name="Extra-curricular" stroke="#f50057" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
