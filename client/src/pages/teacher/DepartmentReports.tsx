import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { Statistics, Achievement } from '@/lib/types';
import { Button } from '@/components/ui/button';
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
  Cell
} from 'recharts';
import { useToast } from '@/hooks/use-toast';

export default function DepartmentReports() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [reportFormat, setReportFormat] = useState<'csv' | 'pdf'>('csv');
  const [department, setDepartment] = useState('computer-science'); // This would come from teacher profile
  
  // Fetch statistics and achievements
  const { data: stats, isLoading: statsLoading } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });
  
  const { data: achievements, isLoading: achievementsLoading } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  // Fetch user data to get student names
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
  });

  const isLoading = statsLoading || achievementsLoading;

  // Get student name by ID
  const getStudentName = (studentId: string) => {
    const student = users?.find((user: any) => user.id === studentId);
    return student ? student.name : `Student #${studentId}`;
  };

  // Generate and download report
  const downloadReport = async () => {
    try {
      const response = await fetch(`/api/reports/csv?department=${department}`);
      
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
        a.download = `department-achievements-report.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        a.remove();
      } else {
        // For PDF, usually opens in a new window
        window.open(response.url, '_blank');
      }
      
      toast({
        title: 'Department Report Generated',
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

  const prepareStudentData = () => {
    if (!achievements) return [];
    
    // Count achievements by student
    const studentCounts: Record<number, number> = {};
    achievements.forEach(achievement => {
      studentCounts[achievement.studentId] = (studentCounts[achievement.studentId] || 0) + 1;
    });
    
    // Convert to array for chart (top 10)
    return Object.entries(studentCounts)
      .map(([studentId, count]) => ({ studentId: `Student ${studentId}`, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  };

  // Pie chart colors
  const COLORS = ['#1976d2', '#4caf50', '#ff9800', '#f50057'];

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Department Reports</h1>
        <p className="text-gray-600 mt-1">Generate and analyze reports for your department</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle>Total Activities</CardTitle>
            <CardDescription>Overall departmental activities</CardDescription>
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
            <CardDescription>Current progress</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-4">
              <div className="text-4xl font-bold text-green-600">
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
              <div className="text-4xl font-bold text-yellow-500">
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
            <CardTitle>Download Report</CardTitle>
            <CardDescription>Department activity data</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2 mb-4">
              <Button 
                variant={reportFormat === 'csv' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setReportFormat('csv')}
              >
                CSV
              </Button>
              <Button 
                variant={reportFormat === 'pdf' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setReportFormat('pdf')}
                disabled={true} // PDF not implemented in backend yet
              >
                PDF
              </Button>
            </div>
            <Button 
              className="w-full" 
              disabled={isLoading || !achievements?.length}
              onClick={downloadReport}
            >
              <span className="material-icons mr-2">download</span>
              Download Department Report
            </Button>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Student Analysis</TabsTrigger>
          <TabsTrigger value="activities">Activity Details</TabsTrigger>
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
        </TabsContent>
        
        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Active Students</CardTitle>
              <CardDescription>Students with the most activity submissions</CardDescription>
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
                      data={prepareStudentData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="studentId" 
                        angle={-45} 
                        textAnchor="end" 
                        height={70} 
                        tick={{ fontSize: 12 }} 
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" name="Number of Activities" fill="#1976d2" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="activities">
          <Card>
            <CardHeader>
              <CardTitle>Activity Records</CardTitle>
              <CardDescription>Recent departmental activities</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex justify-center py-8">
                  <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
                </div>
              ) : !achievements?.length ? (
                <div className="text-center py-8 text-gray-500">
                  <p>No activities found for your department.</p>
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
                      {achievements.slice(0, 10).map((achievement) => (
                        <tr key={achievement.id} className="hover:bg-gray-50">
                          <td className="p-3 text-sm">{achievement.title}</td>
                          <td className="p-3 text-sm">{getStudentName(achievement.studentId)}</td>
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

                  {achievements.length > 10 && (
                    <div className="mt-4 text-center">
                      <span className="text-sm text-gray-500">
                        Showing 10 of {achievements.length} activities. Download the full report for more details.
                      </span>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
