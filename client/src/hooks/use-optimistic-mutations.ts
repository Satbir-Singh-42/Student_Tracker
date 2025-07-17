import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { QUERY_KEYS } from '@/lib/constants';

interface OptimisticMutationOptions<T> {
  endpoint: string;
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  queryKey: string[];
  optimisticUpdate?: (oldData: T[], newData: any) => T[];
  successMessage?: string;
  errorMessage?: string;
}

export function useOptimisticMutation<T>({
  endpoint,
  method,
  queryKey,
  optimisticUpdate,
  successMessage = 'Operation completed successfully',
  errorMessage = 'Operation failed',
}: OptimisticMutationOptions<T>) {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest(method, endpoint, data);
      return response.json();
    },
    onMutate: async (newData) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({ queryKey });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData<T[]>(queryKey);

      // Optimistically update to the new value
      if (optimisticUpdate && previousData) {
        queryClient.setQueryData<T[]>(queryKey, (old) =>
          optimisticUpdate(old || [], newData)
        );
      }

      // Return a context object with the snapshotted value
      return { previousData };
    },
    onError: (err, newData, context) => {
      // If the mutation fails, use the context returned from onMutate to roll back
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: successMessage,
      });
    },
    onSettled: () => {
      // Always refetch after error or success to ensure we have the latest data
      queryClient.invalidateQueries({ queryKey });
    },
  });
}

// Specific hooks for common operations
export function useCreateAchievement() {
  return useOptimisticMutation({
    endpoint: '/api/achievements',
    method: 'POST',
    queryKey: ['/api/achievements'],
    successMessage: 'Achievement created successfully',
    errorMessage: 'Failed to create achievement',
  });
}

export function useUpdateAchievement() {
  return useOptimisticMutation({
    endpoint: '/api/achievements',
    method: 'PUT',
    queryKey: ['/api/achievements'],
    successMessage: 'Achievement updated successfully',
    errorMessage: 'Failed to update achievement',
  });
}

export function useDeleteAchievement() {
  return useOptimisticMutation({
    endpoint: '/api/achievements',
    method: 'DELETE',
    queryKey: ['/api/achievements'],
    optimisticUpdate: (oldData, deletedId) =>
      oldData.filter((item: any) => item.id !== deletedId),
    successMessage: 'Achievement deleted successfully',
    errorMessage: 'Failed to delete achievement',
  });
}