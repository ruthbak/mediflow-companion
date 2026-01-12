import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { BottomNav } from './BottomNav';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <TopHeader />
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
