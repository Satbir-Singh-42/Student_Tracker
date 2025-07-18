import { useState } from 'react';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema } from '@/lib/types';
import { useLogin } from '@/lib/auth';
import { AtSign, LockKeyhole, Loader2 } from 'lucide-react';

export default function LoginForm() {
  const { mutate: login, isPending } = useLogin();
  const [rememberMe, setRememberMe] = useState(false);

  const form = useForm<z.infer<typeof loginSchema>>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  function onSubmit(values: z.infer<typeof loginSchema>) {
    login(values);
  }

  function setDemoAccount(email: string, password: string) {
    form.setValue('email', email);
    form.setValue('password', password);
  }



  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Welcome Back</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <div className="relative">
                    <AtSign className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Enter your email" 
                      type="email" 
                      className="w-full pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <LockKeyhole className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                    <Input 
                      placeholder="Enter your password" 
                      type="password" 
                      className="w-full pl-10"
                      {...field} 
                    />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between mt-2">
            <div className="flex items-center">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600">
                Remember me
              </label>
            </div>
          </div>
          
          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing in...
              </>
            ) : 'Sign In'}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-gray-300"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-gray-500">Quick Demo Login</span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <Button
              type="button"
              variant="outline"
              className="text-xs"
              onClick={() => setDemoAccount('demo.student@example.com', 'demo123')}
            >
              Student
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-xs"
              onClick={() => setDemoAccount('demo.teacher@example.com', 'demo123')}
            >
              Teacher
            </Button>
            <Button
              type="button"
              variant="outline"
              className="text-xs"
              onClick={() => setDemoAccount('demo.admin@example.com', 'demo123')}
            >
              Admin
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
