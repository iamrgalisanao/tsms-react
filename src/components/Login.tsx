import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from '../services/auth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { toast } = useToast();
  const { login, error } = useAuth(); // Use the login function from useAuth
  const navigate = useNavigate(); // Initialize navigate

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);

    try {
      await login(email, password); // Call the login function
      toast({
        title: 'Login successful',
        description: 'Welcome to Tenant Sales Management System',
      });
      // if (email === 'admin@example.com') {
      //   navigate('/home'); // Redirect to AdminDashboard
      // } else if (email === 'finance@example.com') {
      //   navigate('/home');
      navigate('/home'); // Redirect to Home
      // navigate('/'); // Redirect to the home page after successful login
    } catch (err) {
      toast({
        title: 'Login failed',
        description: error || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[350px]">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-primary mb-1">Tenant Sales</h2>
          <p className="text-sm text-muted-foreground mb-6">
            Management System
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <Input
                type="email"
                placeholder="email@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Password</label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <Button type="submit" className="w-full" disabled={isLoggingIn}>
              {isLoggingIn ? 'Logging in...' : 'Login'}
            </Button>

            <div className="text-xs text-muted-foreground mt-4">
              <p>Demo accounts:</p>
              <p>admin@example.com / tsms1234</p>
              <p>finance@example.com / tsms1234</p>
              <p>it@example.com / tsms1234</p>
              <p>commercial@example.com / tsms1234</p>
            </div>
          </form>
        </div>
      </Card>
    </div>
  );
};

export default Login;
