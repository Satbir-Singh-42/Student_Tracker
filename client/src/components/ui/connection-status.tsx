import { useNetworkStatus } from '@/hooks/use-network-status';
import { useQuery } from '@tanstack/react-query';
import { Wifi, WifiOff, AlertCircle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

export function ConnectionStatus() {
  const isOnline = useNetworkStatus();
  
  const { data: healthCheck, isError, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error('Server unreachable');
      return response.json();
    },
    refetchInterval: 30000, // Check every 30 seconds
    retry: 3,
  });

  const getStatusInfo = () => {
    if (!isOnline) {
      return {
        icon: WifiOff,
        color: 'text-red-500',
        text: 'Offline',
        description: 'No internet connection'
      };
    }

    if (isError) {
      return {
        icon: AlertCircle,
        color: 'text-red-500',
        text: 'Disconnected',
        description: 'Cannot reach server'
      };
    }

    if (isFetching) {
      return {
        icon: Wifi,
        color: 'text-yellow-500',
        text: 'Connecting...',
        description: 'Checking connection'
      };
    }

    return {
      icon: CheckCircle,
      color: 'text-green-500',
      text: 'Connected',
      description: 'All systems operational'
    };
  };

  const { icon: Icon, color, text, description } = getStatusInfo();

  return (
    <div className="flex items-center gap-2 px-3 py-2 text-sm">
      <Icon className={cn("h-4 w-4", color)} />
      <div className="flex flex-col">
        <span className={cn("font-medium", color)}>{text}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  );
}

export function ConnectionStatusCompact() {
  const isOnline = useNetworkStatus();
  
  const { isError, isFetching } = useQuery({
    queryKey: ['health'],
    queryFn: async () => {
      const response = await fetch('/api/health');
      if (!response.ok) throw new Error('Server unreachable');
      return response.json();
    },
    refetchInterval: 30000,
    retry: 3,
  });

  const getStatusColor = () => {
    if (!isOnline || isError) return 'bg-red-500';
    if (isFetching) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="flex items-center gap-2">
      <div className={cn(
        "h-2 w-2 rounded-full",
        getStatusColor()
      )} />
      <span className="text-xs text-muted-foreground">
        {!isOnline ? 'Offline' : isError ? 'Disconnected' : 'Connected'}
      </span>
    </div>
  );
}