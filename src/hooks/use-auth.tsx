
import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/sonner';

type User = {
  id: number;
  username: string;
  role: 'admin';
};

type AuthContextType = {
  user: User | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
};

// For demo purposes only - in a real app this would be handled securely by a backend
const DEMO_ADMIN = {
  id: 1,
  username: 'admin',
  password: 'admin123',
  role: 'admin' as const,
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check for existing session on load
  useEffect(() => {
    const savedUser = localStorage.getItem('pizzaUser');
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('pizzaUser');
      }
    }
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // DEMO ONLY: In a real application, this would be a secure authentication call to your backend
    if (username === DEMO_ADMIN.username && password === DEMO_ADMIN.password) {
      const userData = {
        id: DEMO_ADMIN.id,
        username: DEMO_ADMIN.username,
        role: DEMO_ADMIN.role,
      };
      
      setUser(userData);
      setIsAuthenticated(true);
      localStorage.setItem('pizzaUser', JSON.stringify(userData));
      toast.success('Login successful');
      return true;
    } else {
      toast.error('Invalid username or password');
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('pizzaUser');
    toast.success('Logged out successfully');
  };

  const value = {
    user,
    isAuthenticated,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
