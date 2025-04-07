import { useQuery } from '@tanstack/react-query';
import { Statistics } from '@/lib/types';

export default function ActivityTypeChart() {
  const { data: stats, isLoading, error } = useQuery<Statistics>({
    queryKey: ['/api/statistics'],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Activity By Type</h2>
        </div>
        <div className="p-6 space-y-4">
          {Array(4).fill(0).map((_, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-1">
                <div className="h-4 w-20 bg-gray-200 animate-pulse rounded"></div>
                <div className="h-4 w-5 bg-gray-200 animate-pulse rounded"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className="bg-gray-300 h-2 rounded-full animate-pulse" style={{ width: "100%" }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="font-medium text-lg">Activity By Type</h2>
        </div>
        <div className="p-6 text-center text-gray-500">
          Failed to load statistics. Please try again later.
        </div>
      </div>
    );
  }

  const total = stats.totalCount || 1; // Avoid division by zero
  const types = [
    { name: 'Academic', count: stats.typeStats.academic, color: 'bg-primary' },
    { name: 'Sports', count: stats.typeStats.sports, color: 'bg-green-500' },
    { name: 'Co-curricular', count: stats.typeStats['co-curricular'], color: 'bg-yellow-500' },
    { name: 'Extra-curricular', count: stats.typeStats['extra-curricular'], color: 'bg-pink-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow mt-6 overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="font-medium text-lg">Activity By Type</h2>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {types.map((type, index) => (
            <div key={index}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium">{type.name}</span>
                <span className="text-sm font-medium">{type.count}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`${type.color} h-2 rounded-full`} 
                  style={{ width: `${(type.count / total) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
