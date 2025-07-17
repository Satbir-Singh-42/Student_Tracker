import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

// Department schema
const departmentSchema = z.object({
  name: z.string().min(1, "Department name is required"),
  code: z.string().min(1, "Department code is required"),
  description: z.string().optional(),
});

type Department = {
  id: number;
  name: string;
  code: string;
  description?: string;
  studentsCount?: number;
  teachersCount?: number;
};

// Mock data as actual department API endpoints aren't implemented yet
const mockDepartments: Department[] = [
  { id: 1, name: 'Computer Science', code: 'CS', description: 'Computer Science and Engineering', studentsCount: 120, teachersCount: 15 },
  { id: 2, name: 'Physics', code: 'PHY', description: 'Physics Department', studentsCount: 85, teachersCount: 10 },
  { id: 3, name: 'Chemistry', code: 'CHEM', description: 'Chemistry Department', studentsCount: 90, teachersCount: 12 },
  { id: 4, name: 'Mathematics', code: 'MATH', description: 'Mathematics Department', studentsCount: 75, teachersCount: 8 },
  { id: 5, name: 'Biology', code: 'BIO', description: 'Biology Department', studentsCount: 100, teachersCount: 14 },
];

export default function Departments() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // In a real application, this would be an API call
  // For now we'll use the mock data
  const { data: departments, isLoading } = useQuery<Department[]>({
    queryKey: ['/api/departments'],
    queryFn: async () => {
      // In a real app, this would be a fetch call to the API
      return Promise.resolve(mockDepartments);
    },
  });

  const createForm = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const editForm = useForm<z.infer<typeof departmentSchema>>({
    resolver: zodResolver(departmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const createDepartmentMutation = useMutation({
    mutationFn: async (data: z.infer<typeof departmentSchema>) => {
      // This would be a real API call in a production app
      // For now, let's just simulate success
      return Promise.resolve({ ...data, id: Math.random() });
    },
    onSuccess: () => {
      // In a real app, invalidate the departments query
      // queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      setIsCreateDialogOpen(false);
      createForm.reset();
      toast({
        title: 'Success',
        description: 'Department created successfully',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create department',
        variant: 'destructive',
      });
    },
  });

  const updateDepartmentMutation = useMutation({
    mutationFn: async (data: { id: number; departmentData: z.infer<typeof departmentSchema> }) => {
      // This would be a real API call in a production app
      return Promise.resolve({ ...data.departmentData, id: data.id });
    },
    onSuccess: () => {
      // In a real app, invalidate the departments query
      // queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      setIsEditDialogOpen(false);
      toast({
        title: 'Success',
        description: 'Department updated successfully',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update department',
        variant: 'destructive',
      });
    },
  });

  const deleteDepartmentMutation = useMutation({
    mutationFn: async (id: number) => {
      // This would be a real API call in a production app
      return Promise.resolve(true);
    },
    onSuccess: () => {
      // In a real app, invalidate the departments query
      // queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      setIsDeleteDialogOpen(false);
      setSelectedDepartment(null);
      toast({
        title: 'Success',
        description: 'Department deleted successfully',
        variant: 'success',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete department',
        variant: 'destructive',
      });
    },
  });

  const handleCreateDepartment = (values: z.infer<typeof departmentSchema>) => {
    createDepartmentMutation.mutate(values);
  };

  const handleEditDepartment = (values: z.infer<typeof departmentSchema>) => {
    if (selectedDepartment) {
      updateDepartmentMutation.mutate({ id: selectedDepartment.id, departmentData: values });
    }
  };

  const handleDeleteDepartment = () => {
    if (selectedDepartment) {
      deleteDepartmentMutation.mutate(selectedDepartment.id);
    }
  };

  const openEditDialog = (department: Department) => {
    setSelectedDepartment(department);
    editForm.reset({
      name: department.name,
      code: department.code,
      description: department.description || '',
    });
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (department: Department) => {
    setSelectedDepartment(department);
    setIsDeleteDialogOpen(true);
  };

  // Filter departments by search query
  const filteredDepartments = departments?.filter(department => {
    return department.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
           department.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
           (department.description && department.description.toLowerCase().includes(searchQuery.toLowerCase()));
  }) || [];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-semibold">Department Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, or manage academic departments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button 
            onClick={() => setIsCreateDialogOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <span className="material-icons mr-2">add</span>
            Add New Department
          </Button>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Departments</CardTitle>
          <CardDescription>Find departments by name, code, or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="material-icons text-gray-400">search</span>
            </span>
            <Input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          Array(6).fill(0).map((_, i) => (
            <Card key={i} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-6"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredDepartments.length === 0 ? (
          <div className="col-span-full text-center p-12 bg-white rounded-lg shadow">
            <span className="material-icons text-gray-400 text-6xl mb-4">search_off</span>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or add a new department.</p>
            <Button onClick={() => setIsCreateDialogOpen(true)}>Add New Department</Button>
          </div>
        ) : (
          filteredDepartments.map(department => (
            <Card key={department.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-medium text-lg">{department.name}</h3>
                    <p className="text-sm text-gray-600">{department.code}</p>
                  </div>
                  <div className="flex items-center">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openEditDialog(department)} 
                      className="text-gray-500 hover:text-primary"
                    >
                      <span className="material-icons">edit</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => openDeleteDialog(department)} 
                      className="text-gray-500 hover:text-red-500"
                    >
                      <span className="material-icons">delete</span>
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                  {department.description || 'No description available'}
                </p>
                
                <div className="flex justify-between text-sm">
                  <div className="flex items-center text-gray-600">
                    <span className="material-icons text-base mr-1">school</span>
                    <span>{department.studentsCount || 0} Students</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="material-icons text-base mr-1">person</span>
                    <span>{department.teachersCount || 0} Teachers</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Department Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new academic department in the system.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...createForm}>
            <form onSubmit={createForm.handleSubmit(handleCreateDepartment)} className="space-y-4">
              <FormField
                control={createForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. Computer Science" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g. CS" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={createForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input placeholder="Brief description of the department" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsCreateDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createDepartmentMutation.isPending}
                >
                  {createDepartmentMutation.isPending ? 'Creating...' : 'Create Department'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Department</DialogTitle>
            <DialogDescription>
              Update department details.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleEditDepartment)} className="space-y-4">
              <FormField
                control={editForm.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department Code</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={editForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description (Optional)</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <DialogFooter className="mt-6">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setIsEditDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateDepartmentMutation.isPending}
                >
                  {updateDepartmentMutation.isPending ? 'Updating...' : 'Update Department'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Department Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          
          {selectedDepartment && (
            <div className="py-4">
              <p className="text-sm text-gray-500">
                You are about to delete the department:
              </p>
              <div className="mt-2 p-4 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedDepartment.name}</p>
                <p className="text-sm text-gray-600">{selectedDepartment.code}</p>
                <p className="text-sm text-gray-600">{selectedDepartment.description || 'No description'}</p>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDeleteDepartment}
              disabled={deleteDepartmentMutation.isPending}
            >
              {deleteDepartmentMutation.isPending ? 'Deleting...' : 'Delete Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
