import { useState } from 'react';
import { Link } from 'wouter';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { loginSchema } from '@/lib/types';
import { useLogin } from '@/lib/auth';

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

  return (
    <div className="p-6">
      <h2 className="font-poppins text-xl font-semibold mb-6">Sign In</h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Enter your email" 
                    type="email" 
                    className="w-full px-3 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                    {...field} 
                  />
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
                  <Input 
                    placeholder="Enter your password" 
                    type="password" 
                    className="w-full px-3 py-3 border border-neutral-300 rounded-md focus:ring-2 focus:ring-primary"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between my-4">
            <div className="flex items-center">
              <Checkbox 
                id="remember-me" 
                checked={rememberMe}
                onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                className="h-4 w-4 text-primary border-neutral-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-neutral-600">
                Remember me
              </label>
            </div>
            <Link href="#" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
          
          <Button 
            type="submit" 
            disabled={isPending} 
            className="w-full bg-primary text-white py-3 px-4 rounded-md hover:bg-primary-dark transition duration-300"
          >
            {isPending ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
      </Form>
      
      <p className="mt-4 text-center text-sm">
        Don't have an account? <Link href="/register" className="text-primary hover:underline">Register here</Link>
      </p>
    </div>
  );
}
