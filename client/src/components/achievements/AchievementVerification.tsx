import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Textarea } from '@/components/ui/textarea';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { Achievement, verificationSchema } from '@/lib/types';

interface AchievementVerificationProps {
  achievement: Achievement;
  onSuccess?: () => void;
}

export default function AchievementVerification({ achievement, onSuccess }: AchievementVerificationProps) {
  const [open, setOpen] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof verificationSchema>>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      status: undefined,
      feedback: '',
    },
  });

  const verifyMutation = useMutation({
    mutationFn: async (data: z.infer<typeof verificationSchema>) => {
      return await apiRequest('PUT', `/api/achievements/${achievement.id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      form.reset();
      setOpen(false);
      setShowFeedback(false);
      toast({
        title: "Success",
        description: "Achievement status updated successfully.",
        variant: "success",
      });
      if (onSuccess) onSuccess();
    },
    onError: (error: Error) => {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof verificationSchema>) => {
    verifyMutation.mutate(values);
  };

  const handleVerify = () => {
    form.setValue('status', 'Verified');
    form.handleSubmit(onSubmit)();
  };

  const handleSetRejected = () => {
    form.setValue('status', 'Rejected');
    setShowFeedback(true);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button 
        variant="outline" 
        onClick={() => setOpen(true)}
        className="text-primary hover:bg-primary-100"
      >
        View Details
      </Button>
      
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Verify Achievement</DialogTitle>
          <DialogDescription>
            Review the achievement details before verifying or rejecting.
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4">
          <h3 className="font-medium text-lg">{achievement.title}</h3>
          <p className="text-sm text-gray-600">Date: {formatDate(achievement.dateOfActivity)}</p>
          <p className="text-sm text-gray-600">Type: {achievement.type.charAt(0).toUpperCase() + achievement.type.slice(1)}</p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-medium mb-2">Description</h4>
          <p className="text-sm text-gray-600 p-3 bg-gray-100 rounded-md">
            {achievement.description}
          </p>
        </div>
        
        <div className="mb-6">
          <h4 className="font-medium mb-2">Attached Proof</h4>
          <div className="border border-gray-300 rounded-md p-3 flex items-center">
            <span className="material-icons text-gray-600 mr-2">description</span>
            <span className="text-sm">
              {achievement.proofUrl.split('/').pop() || 'Proof file'}
            </span>
            <a 
              href={achievement.proofUrl} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="ml-auto text-primary text-sm hover:underline"
            >
              View
            </a>
          </div>
        </div>

        {showFeedback ? (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <FormField
                control={form.control}
                name="feedback"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rejection Feedback</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Provide detailed feedback about why this achievement is being rejected" 
                        rows={3}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-4">
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowFeedback(false)}
                >
                  Back
                </Button>
                <Button 
                  type="submit" 
                  disabled={verifyMutation.isPending}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {verifyMutation.isPending ? 'Submitting...' : 'Submit Rejection'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        ) : (
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              onClick={handleSetRejected}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-50"
            >
              Reject
            </Button>
            <Button 
              type="button" 
              onClick={handleVerify}
              disabled={verifyMutation.isPending}
              className="bg-green-600 hover:bg-green-700"
            >
              {verifyMutation.isPending ? 'Verifying...' : 'Verify'}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}
