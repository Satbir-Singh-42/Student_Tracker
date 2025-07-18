import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
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
import { insertDepartmentSchema } from '@shared/schema';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plus, Search, Edit, Trash2, Users, GraduationCap } from 'lucide-react';

export default function Departments() {
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: departments, isLoading: isDepartmentsLoading } = useQuery({
    queryKey: ['/api/departments'],
    staleTime: 30000,
  });

  // Get users data to show teachers and students by branch
  const { data: users } = useQuery({
    queryKey: ['/api/users'],
    staleTime: 30000,
  });

  // Get student profiles to match students with branches
  const { data: studentProfiles } = useQuery({
    queryKey: ['/api/student-profiles'],
    staleTime: 30000,
  });

  const createForm = useForm({
    resolver: zodResolver(insertDepartmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const editForm = useForm({
    resolver: zodResolver(insertDepartmentSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
    },
  });

  const createMutation = useMutation({
    mutationFn: async (departmentData: any) => {
      return apiRequest('/api/departments', {
        method: 'POST',
        body: JSON.stringify(departmentData),
      });
    },
    onSuccess: () => {
      setIsCreateOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      toast({
        title: "Success",
        description: "Department created successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create department",
        variant: "destructive",
      });
    },
  });

  const editMutation = useMutation({
    mutationFn: async (data: { id: string; departmentData: any }) => {
      return apiRequest(`/api/departments/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(data.departmentData),
      });
    },
    onSuccess: () => {
      setIsEditOpen(false);
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      toast({
        title: "Success",
        description: "Department updated successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update department",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest(`/api/departments/${id}`, {
        method: 'DELETE',
      });
    },
    onSuccess: () => {
      setIsDeleteOpen(false);
      setSelectedDepartment(null);
      queryClient.invalidateQueries({ queryKey: ['/api/departments'] });
      toast({
        title: "Success",
        description: "Department deleted successfully",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete department",
        variant: "destructive",
      });
    },
  });

  const handleCreateDepartment = (data: any) => {
    createMutation.mutate(data);
  };

  const handleEditDepartment = (data: any) => {
    if (selectedDepartment) {
      editMutation.mutate({ id: selectedDepartment.id, departmentData: data });
    }
  };

  const handleDeleteDepartment = () => {
    if (selectedDepartment) {
      deleteMutation.mutate(selectedDepartment.id);
    }
  };

  const openEditDialog = (department: any) => {
    setSelectedDepartment(department);
    editForm.reset({
      name: department.name,
      code: department.code,
      description: department.description || '',
    });
    setIsEditOpen(true);
  };

  const openDeleteDialog = (department: any) => {
    setSelectedDepartment(department);
    setIsDeleteOpen(true);
  };

  // Helper function to get teachers and students count by department/branch
  const getDepartmentStats = (departmentName: string) => {
    const teachers = users?.filter(user => 
      user.role === 'teacher' && user.specialization === departmentName
    ) || [];
    
    const students = studentProfiles?.filter(profile => 
      profile.branch === departmentName
    ) || [];
    
    return {
      teachersCount: teachers.length,
      studentsCount: students.length,
      teachers,
      students
    };
  };

  const filteredDepartments = departments?.filter((department: any) =>
    department.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    department.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (department.description && department.description.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="font-poppins text-2xl font-semibold">Department Management</h1>
          <p className="text-gray-600 mt-1">Add, edit, or manage academic departments</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Button
            onClick={() => setIsCreateOpen(true)}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add New Department
          </Button>
        </div>
      </div>

      {/* Search Card */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <CardTitle>Search Departments</CardTitle>
          <CardDescription>Find departments by name, code, or description</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              type="text"
              placeholder="Search departments..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardContent>
      </Card>

      {/* Departments Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isDepartmentsLoading ? (
          // Loading skeleton
          Array(6).fill(0).map((_, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow">
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
            <Search className="mx-auto text-gray-400 w-16 h-16 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No departments found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or add a new department.</p>
            <Button onClick={() => setIsCreateOpen(true)}>Add New Department</Button>
          </div>
        ) : (
          filteredDepartments.map((department: any) => (
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
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openDeleteDialog(department)}
                      className="text-gray-500 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <p className="text-sm text-gray-600 mb-6 line-clamp-2">
                  {department.description || 'No description available'}
                </p>
                
                <div className="flex justify-between text-sm mb-4">
                  <div className="flex items-center text-gray-600">
                    <GraduationCap className="w-4 h-4 mr-1" />
                    <span>{getDepartmentStats(department.name).studentsCount} Students</span>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{getDepartmentStats(department.name).teachersCount} Teachers</span>
                  </div>
                </div>
                
                {/* Show teacher and student names */}
                {getDepartmentStats(department.name).teachersCount > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-medium text-gray-700 mb-1">Teachers:</p>
                    <div className="flex flex-wrap gap-1">
                      {getDepartmentStats(department.name).teachers.slice(0, 3).map((teacher: any) => (
                        <span key={teacher.id} className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">
                          {teacher.name}
                        </span>
                      ))}
                      {getDepartmentStats(department.name).teachers.length > 3 && (
                        <span className="text-xs text-gray-500">+{getDepartmentStats(department.name).teachers.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
                
                {getDepartmentStats(department.name).studentsCount > 0 && (
                  <div>
                    <p className="text-xs font-medium text-gray-700 mb-1">Students:</p>
                    <div className="flex flex-wrap gap-1">
                      {getDepartmentStats(department.name).students.slice(0, 3).map((profile: any) => {
                        const student = users?.find(u => u.id === profile.userId);
                        return student ? (
                          <span key={student.id} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                            {student.name}
                          </span>
                        ) : null;
                      })}
                      {getDepartmentStats(department.name).studentsCount > 3 && (
                        <span className="text-xs text-gray-500">+{getDepartmentStats(department.name).studentsCount - 3} more</span>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create Department Dialog */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Department</DialogTitle>
            <DialogDescription>
              Create a new department for your institution.
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
                      <Input {...field} />
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
                      <Input {...field} />
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={createMutation.isPending}>
                  {createMutation.isPending ? 'Creating...' : 'Create Department'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Edit Department Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
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
                      <Textarea {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter className="mt-6">
                <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={editMutation.isPending}>
                  {editMutation.isPending ? 'Updating...' : 'Update Department'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Department Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Department</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this department? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          {selectedDepartment && (
            <div className="py-4">
              <p className="text-sm text-gray-500">You are about to delete the department:</p>
              <div className="mt-2 p-3 bg-gray-50 rounded-md">
                <p className="font-medium">{selectedDepartment.name}</p>
                <p className="text-sm text-gray-600">{selectedDepartment.code}</p>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteDepartment}
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Department'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}