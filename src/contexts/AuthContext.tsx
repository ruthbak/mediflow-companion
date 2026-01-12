import React, { createContext, useContext, useState, ReactNode } from 'react';
import { User, UserRole } from '@/lib/types';

interface AuthContextType {
  user: User | null;
  login: (staffId: string, role: UserRole) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const login = (staffId: string, role: UserRole) => {
    const roleNames: Record<UserRole, string> = {
      doctor: 'Dr. Sarah Mitchell',
      nurse: 'Nurse Martina Rodriguez',
      pharmacist: 'Pharm. James Lee',
    };

    setUser({
      id: Math.random().toString(36).substring(7),
      name: roleNames[role],
      role,
      staffId,
      hospital: 'University Hospital',
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
