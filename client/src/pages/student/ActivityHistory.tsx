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
import { Link } from 'wouter';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export default function ActivityHistory() {
  const { user } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedAchievement, setSelectedAchievement] = useState<Achievement | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const { data: achievements, isLoading, error } = useQuery<Achievement[]>({
    queryKey: ['/api/achievements'],
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="mb-6">
          <h1 className="font-poppins text-2xl font-semibold">My Activities</h1>
          <p className="text-gray-600 mt-1">Track and manage your achievement submissions</p>
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
          <h1 className="font-poppins text-2xl font-semibold">My Activities</h1>
          <p className="text-gray-600 mt-1">Track and manage your achievement submissions</p>
        </div>
        <Card>
          <CardContent className="pt-6">
            <div className="text-center p-6 text-gray-500">
              <p>Failed to load your activities. Please try again later.</p>
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

  // Function to view achievement details
  const viewDetails = (achievement: Achievement) => {
    setSelectedAchievement(achievement);
    setIsDetailsOpen(true);
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
        <h1 className="font-poppins text-2xl font-semibold">My Activities</h1>
        <p className="text-gray-600 mt-1">Track and manage your achievement submissions</p>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Activity Filters</CardTitle>
          <CardDescription>Filter your activities by type, status, or search by keyword</CardDescription>
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

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all" onClick={() => setStatusFilter('all')}>All</TabsTrigger>
          <TabsTrigger value="Verified" onClick={() => setStatusFilter('Verified')}>Verified</TabsTrigger>
          <TabsTrigger value="Pending" onClick={() => setStatusFilter('Pending')}>Pending</TabsTrigger>
          <TabsTrigger value="Rejected" onClick={() => setStatusFilter('Rejected')}>Rejected</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="mt-6">
          {filteredAchievements.length === 0 ? (
            <div className="text-center p-12 bg-white rounded-lg shadow">
              <span className="material-icons text-gray-400 text-6xl mb-4">search_off</span>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No activities found</h3>
              <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria.</p>
              <Link href="/student/upload">
                <Button>Upload New Achievement</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredAchievements.map(achievement => (
                <Card key={achievement.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start mb-4">
                      <div className="h-10 w-10 bg-blue-100 text-primary rounded-lg flex items-center justify-center mr-3">
                        <span className="material-icons">{getTypeIcon(achievement.type)}</span>
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium line-clamp-1">{achievement.title}</h3>
                        <p className="text-sm text-gray-600">{achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(achievement.dateOfActivity)}</p>
                      </div>
                      <Badge className={getStatusColor(achievement.status)}>
                        {achievement.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-3 mb-4">{achievement.description}</p>
                    <div className="flex justify-end">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={() => viewDetails(achievement)}
                      >
                        View Details
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="Verified" className="mt-6">
          {/* Content for Verified tab - handled by filter */}
        </TabsContent>
        
        <TabsContent value="Pending" className="mt-6">
          {/* Content for Pending tab - handled by filter */}
        </TabsContent>
        
        <TabsContent value="Rejected" className="mt-6">
          {/* Content for Rejected tab - handled by filter */}
        </TabsContent>
      </Tabs>

      {/* Achievement Details Dialog */}
      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{selectedAchievement?.title}</DialogTitle>
          </DialogHeader>
          
          {selectedAchievement && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusColor(selectedAchievement.status)}`}>
                    {selectedAchievement.status}
                  </div>
                  <span className="mx-2 text-gray-300">•</span>
                  <span className="text-sm text-gray-600">{selectedAchievement.type.charAt(0).toUpperCase() + selectedAchievement.type.slice(1)}</span>
                </div>
                <span className="text-sm text-gray-500">{formatDate(selectedAchievement.dateOfActivity)}</span>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Description</h4>
                <p className="text-sm text-gray-600 p-3 bg-gray-50 rounded-md">
                  {selectedAchievement.description}
                </p>
              </div>
              
              {selectedAchievement.feedback && selectedAchievement.status === 'Rejected' && (
                <div className="mb-4">
                  <h4 className="text-sm font-medium mb-2">Feedback</h4>
                  <p className="text-sm text-red-600 p-3 bg-red-50 rounded-md">
                    {selectedAchievement.feedback}
                  </p>
                </div>
              )}
              
              <div className="mb-4">
                <h4 className="text-sm font-medium mb-2">Attached Proof</h4>
                <div className="border border-gray-200 rounded-md p-3 flex items-center">
                  <span className="material-icons text-gray-600 mr-2">description</span>
                  <span className="text-sm">{selectedAchievement.proofUrl.split('/').pop() || 'Proof file'}</span>
                  <a 
                    href={selectedAchievement.proofUrl} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="ml-auto text-primary text-sm hover:underline"
                  >
                    View
                  </a>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end gap-3">
                {selectedAchievement.status === 'Rejected' && (
                  <Link href="/student/upload">
                    <Button variant="outline" className="text-primary">
                      Resubmit
                    </Button>
                  </Link>
                )}
                <Button onClick={() => setIsDetailsOpen(false)}>Close</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
