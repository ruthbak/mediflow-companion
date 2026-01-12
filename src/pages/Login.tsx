import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope, Heart, Pill } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { UserRole } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

const roles: { id: UserRole; label: string; icon: React.ElementType; color: string }[] = [
  { id: 'doctor', label: 'Doctor', icon: Stethoscope, color: 'bg-primary text-primary-foreground' },
  { id: 'nurse', label: 'Nurse', icon: Heart, color: 'bg-accent text-accent-foreground' },
  { id: 'pharmacist', label: 'Pharmacist', icon: Pill, color: 'bg-warning text-warning-foreground' },
];

export default function Login() {
  const [staffId, setStaffId] = useState('');
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (staffId && selectedRole) {
      login(staffId, selectedRole);
      const defaultRoutes: Record<UserRole, string> = {
        doctor: '/dashboard',
        nurse: '/schedule',
        pharmacist: '/pharmacy-orders',
      };
      navigate(defaultRoutes[selectedRole]);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-6">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl gradient-primary mb-4">
            <span className="text-3xl font-bold text-primary-foreground">M</span>
          </div>
          <h1 className="text-3xl font-bold text-foreground">MediFlow</h1>
          <p className="text-muted-foreground mt-2">Medication Ordering System</p>
        </div>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle>Welcome Back</CardTitle>
            <CardDescription>Sign in to access your dashboard</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  placeholder="Enter your staff ID"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  required
                />
              </div>

              <div className="space-y-3">
                <Label>Select Your Role</Label>
                <div className="grid grid-cols-3 gap-3">
                  {roles.map((role) => (
                    <button
                      key={role.id}
                      type="button"
                      onClick={() => setSelectedRole(role.id)}
                      className={cn(
                        'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all',
                        selectedRole === role.id
                          ? `${role.color} border-transparent shadow-lg scale-105`
                          : 'bg-secondary border-border hover:border-primary/50'
                      )}
                    >
                      <role.icon className="h-6 w-6" />
                      <span className="text-sm font-medium">{role.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full gradient-primary text-primary-foreground font-semibold h-12"
                disabled={!staffId || !selectedRole}
              >
                Sign In
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-muted-foreground">
          University Hospital • Secure Access
        </p>
      </div>
    </div>
  );
}
