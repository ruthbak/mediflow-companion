import { useLocation, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  CalendarClock, 
  MessageSquare,
  Pill,
  ClipboardList,
  Package
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

export function BottomNav() {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  if (!user) return null;

  const getNavItems = (): NavItem[] => {
    switch (user.role) {
      case 'doctor':
        return [
          { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: Pill, label: 'Order', path: '/order' },
          { icon: MessageSquare, label: 'Messages', path: '/messages' },
        ];
      case 'nurse':
        return [
          { icon: CalendarClock, label: 'Schedule', path: '/schedule' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: ClipboardList, label: 'Tasks', path: '/tasks' },
          { icon: MessageSquare, label: 'Contact', path: '/messages' },
        ];
      case 'pharmacist':
        return [
          { icon: Package, label: 'Orders', path: '/pharmacy-orders' },
          { icon: ClipboardList, label: 'Queue', path: '/queue' },
          { icon: Users, label: 'Patients', path: '/patients' },
          { icon: MessageSquare, label: 'Contact', path: '/messages' },
        ];
      default:
        return [];
    }
  };

  const navItems = getNavItems();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t border-border px-4 py-2 z-50">
      <div className="flex items-center justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'flex flex-col items-center gap-1 py-2 px-3 rounded-lg transition-all',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              <item.icon className={cn('h-5 w-5', isActive && 'scale-110')} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
