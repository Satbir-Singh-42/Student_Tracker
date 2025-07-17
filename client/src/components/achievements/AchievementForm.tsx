import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Upload } from 'lucide-react';
import { achievementSchema } from '@/lib/types';

interface AchievementFormProps {
  onSuccess?: () => void;
  buttonText?: string;
  openInDialog?: boolean;
  triggerButton?: React.ReactNode;
}

export default function AchievementForm({ 
  onSuccess, 
  buttonText = "Upload Achievement",
  openInDialog = false,
  triggerButton = null
}: AchievementFormProps) {
  const [open, setOpen] = useState(false);
  const [filePreview, setFilePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<z.infer<typeof achievementSchema>>({
    resolver: zodResolver(achievementSchema),
    defaultValues: {
      title: '',
      description: '',
      type: undefined,
      dateOfActivity: new Date(),
      proof: undefined,
    },
  });

  const uploadMutation = useMutation({
    mutationFn: async (data: FormData) => {
      // Get the token from localStorage
      const authData = localStorage.getItem('auth');
      let token = null;
      
      if (authData) {
        try {
          const parsed = JSON.parse(authData);
          token = parsed.token;
        } catch (error) {
          console.error('Error parsing auth data:', error);
        }
      }
      
      const headers: Record<string, string> = {};
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
      
      const response = await fetch('/api/achievements', {
        method: 'POST',
        body: data,
        credentials: 'include',
        headers
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        try {
          const errorJson = JSON.parse(errorText);
          throw new Error(errorJson.message || response.statusText);
        } catch {
          throw new Error(errorText || response.statusText);
        }
      }
      
      return await response.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['/api/achievements'] });
      queryClient.invalidateQueries({ queryKey: ['/api/statistics'] });
      form.reset();
      setFilePreview(null);
      toast({
        title: "Achievement Uploaded",
        description: "Your achievement has been successfully submitted for verification.",
        variant: "success",
      });
      if (onSuccess) onSuccess();
      if (openInDialog) setOpen(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (values: z.infer<typeof achievementSchema>) => {
    const formData = new FormData();
    formData.append('title', values.title);
    formData.append('description', values.description);
    formData.append('type', values.type);
    formData.append('dateOfActivity', values.dateOfActivity.toISOString());
    formData.append('proof', values.proof);

    uploadMutation.mutate(formData);
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      form.setValue('proof', file);
      
      // Show file preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      form.setValue('proof', file);
      
      // Show file preview if it's an image
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          setFilePreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      } else {
        setFilePreview(null);
      }
    }
  };

  const formContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievement Title</FormLabel>
              <FormControl>
                <Input placeholder="Enter achievement title" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Achievement Type</FormLabel>
              <Select onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select achievement type" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="sports">Sports</SelectItem>
                  <SelectItem value="co-curricular">Co-curricular</SelectItem>
                  <SelectItem value="extra-curricular">Extra-curricular</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="dateOfActivity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date of Activity</FormLabel>
              <FormControl>
                <Input 
                  type="date" 
                  {...field} 
                  value={field.value instanceof Date ? field.value.toISOString().split('T')[0] : ''}
                  onChange={(e) => field.onChange(new Date(e.target.value))} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Describe your achievement" 
                  rows={4}
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="proof"
          render={({ field: { value, onChange, ...field } }) => (
            <FormItem>
              <FormLabel>Upload Proof</FormLabel>
              <div 
                className={`border-2 border-dashed ${isDragging ? 'border-primary' : 'border-gray-300'} rounded-md p-6 flex flex-col items-center justify-center`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                {filePreview ? (
                  <div className="mb-4">
                    <img src={filePreview} alt="Preview" className="max-h-32 max-w-full" />
                  </div>
                ) : (
                  <Upload size={48} className="text-gray-300 mb-2" />
                )}
                <p className="text-gray-600 text-sm mb-2">
                  {filePreview ? 'Change file:' : 'Drag and drop your file here, or'}
                </p>
                <Button 
                  type="button" 
                  onClick={() => document.getElementById('proof-input')?.click()}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700"
                >
                  Browse Files
                </Button>
                <input
                  id="proof-input"
                  type="file"
                  accept=".jpg,.jpeg,.png,.pdf,.csv"
                  className="hidden"
                  onChange={handleFileChange}
                  {...field}
                />
                <p className="text-xs text-gray-500 mt-4">Accepted file types: JPG, PNG, PDF, CSV (Max size: 5MB)</p>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-3 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              form.reset();
              if (openInDialog) setOpen(false);
            }}
          >
            Cancel
          </Button>
          <Button 
            type="submit" 
            disabled={uploadMutation.isPending}
          >
            {uploadMutation.isPending ? 'Uploading...' : buttonText}
          </Button>
        </div>
      </form>
    </Form>
  );

  if (openInDialog) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          {triggerButton || <Button>Upload New Achievement</Button>}
        </DialogTrigger>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>Upload New Achievement</DialogTitle>
          </DialogHeader>
          {formContent}
        </DialogContent>
      </Dialog>
    );
  }

  return formContent;
}
