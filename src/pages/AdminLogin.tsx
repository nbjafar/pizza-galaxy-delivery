
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

const AdminLogin = () => {
  const { isAuthenticated, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !password) {
      return;
    }
    
    setIsLoading(true);
    await login(username, password);
    setIsLoading(false);
  };
  
  if (isAuthenticated) {
    return <Navigate to="/admin/dashboard" replace />;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="text-center mb-6">
          <h1 className="text-3xl font-bold font-playfair text-pizza">Pizza Galaxy Admin</h1>
          <p className="text-gray-600 mt-2">Sign in to access the admin dashboard</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="username">Username</Label>
            <Input 
              id="username" 
              placeholder="Enter your username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="password">Password</Label>
            <Input 
              id="password" 
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-pizza hover:bg-pizza-light"
            disabled={isLoading}
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        
        <div className="mt-6 pt-6 border-t border-gray-200 text-center text-sm text-gray-600">
          <p>Demo credentials:</p>
          <p>Username: admin</p>
          <p>Password: admin123</p>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
