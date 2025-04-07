import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/lib/auth';
import { Achievement } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AchievementVerification from '@/components/achievements/AchievementVerification';

export default function VerifyActivities() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('Pending');

  const { data: achievements, isLoading, error, refetch } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-semibold">Verify Activities</h1>
          <p className="text-gray-600 mt-1">Review and verify student submissions</p>
        </div>
        <div className="flex justify-center p-12">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        </div>
      </div>
    );
  }

  if (error || !achievements) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-semibold">Verify Activities</h1>
          <p className="text-gray-600 mt-1">Review and verify student submissions</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6 text-gray-500">
              <p>Failed to load activities. Please try again later.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Filter achievements
  const filteredAchievements = achievements.filter(achievement => {
    const matchesSearch = searchQuery === '' || 
      achievement.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      achievement.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesType = typeFilter === 'all' || achievement.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || achievement.status === statusFilter;
    
    return matchesSearch && matchesType && matchesStatus;
  });

  // Get students associated with achievements
  const getStudentName = (studentId: number) => {
    // In a real app, we would fetch student names from the API
    // For now, we'll just return a placeholder
    return `Student #${studentId}`;
  };

  // Format date
  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      case 'Submitted': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Get type icon
  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'academic': return 'emoji_events';
      case 'sports': return 'sports_soccer';
      case 'co-curricular': return 'school';
      case 'extra-curricular': return 'music_note';
      default: return 'emoji_events';
    }
  };

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="font-poppins text-2xl font-semibold">Verify Activities</h1>
        <p className="text-gray-600 mt-1">Review and verify student achievements</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Activity Filters</CardTitle>
          <CardDescription>Filter activities by type, status, or search by keyword</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search activities..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-48">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="co-curricular">Co-curricular</SelectItem>
                  <SelectItem value="extra-curricular">Extra-curricular</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="w-full md:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Submitted">Submitted</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="Pending" className="mb-6" onValueChange={setStatusFilter}>
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="Pending">Pending</TabsTrigger>
          <TabsTrigger value="Verified">Verified</TabsTrigger>
          <TabsTrigger value="Rejected">Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {/* Content for All tab - handled by status filter */}
        </TabsContent>
        
        <TabsContent value="Pending" className="mt-6">
          {/* Content for Pending tab - handled by status filter */}
        </TabsContent>
        
        <TabsContent value="Verified" className="mt-6">
          {/* Content for Verified tab - handled by status filter */}
        </TabsContent>
        
        <TabsContent value="Rejected" className="mt-6">
          {/* Content for Rejected tab - handled by status filter */}
        </TabsContent>
      </Tabs>

      {filteredAchievements.length === 0 ? (
        <div className="text-center p-12 bg-white rounded-lg shadow">
          <span className="material-icons text-gray-400 text-6xl mb-4">search_off</span>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
          <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredAchievements.map(achievement => (
            <Card key={achievement.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center mr-3">
                      <span className="material-icons">{getTypeIcon(achievement.type)}</span>
                    </div>
                    <div>
                      <h3 className="font-medium">{achievement.title}</h3>
                      <p className="text-sm text-gray-600">{achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}</p>
                      <p className="text-sm text-gray-600">By: {getStudentName(achievement.studentId)}</p>
                      <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.dateOfActivity)}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(achievement.status)}>
                    {achievement.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 line-clamp-3 mb-4">{achievement.description}</p>
                
                {achievement.status === 'Pending' ? (
                  <div className="flex justify-end">
                    <AchievementVerification 
                      achievement={achievement}
                      onSuccess={() => refetch()}
                    />
                  </div>
                ) : (
                  <div className="flex justify-end">
                    <a 
                      href={achievement.proofUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="inline-flex items-center text-primary hover:underline"
                    >
                      <span className="material-icons text-sm mr-1">visibility</span>
                      View Proof
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
