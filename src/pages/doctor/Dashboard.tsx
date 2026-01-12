import { useNavigate } from 'react-router-dom';
import { Users, Pill, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { patients, medicationOrders } from '@/lib/mockData';

export default function DoctorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const pendingOrders = medicationOrders.filter((o) => o.status === 'pending').length;
  const activePatients = patients.length;

  const recentOrders = medicationOrders.slice(0, 3);

  return (
    <AppLayout>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Good Morning, {user?.name?.split(' ')[0]}
          </h1>
          <p className="text-muted-foreground">Here's your patient overview for today</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4">
          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Users className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{activePatients}</p>
                  <p className="text-sm text-muted-foreground">Active Patients</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="glass-card">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-warning/10">
                  <Clock className="h-6 w-6 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground">{pendingOrders}</p>
                  <p className="text-sm text-muted-foreground">Pending Orders</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => navigate('/patients')}
            className="flex-1 h-12 gradient-primary text-primary-foreground"
          >
            <Users className="h-5 w-5 mr-2" />
            View Patients
          </Button>
          <Button
            onClick={() => navigate('/order')}
            variant="outline"
            className="flex-1 h-12"
          >
            <Pill className="h-5 w-5 mr-2" />
            New Order
          </Button>
        </div>

        {/* Allergy Alerts */}
        <Card className="border-destructive/30 bg-destructive/5">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-destructive text-lg">
              <AlertTriangle className="h-5 w-5" />
              Allergy Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {patients
              .filter((p) => p.allergies.length > 0)
              .slice(0, 3)
              .map((patient) => (
                <div
                  key={patient.id}
                  className="flex items-center justify-between p-3 bg-card rounded-lg"
                >
                  <div>
                    <p className="font-medium text-foreground">{patient.name}</p>
                    <p className="text-sm text-muted-foreground">Room {patient.room}</p>
                  </div>
                  <div className="flex gap-1">
                    {patient.allergies.map((allergy) => (
                      <Badge key={allergy} variant="destructive" className="text-xs">
                        {allergy}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="text-lg">Recent Orders</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg"
              >
                <div>
                  <p className="font-medium text-foreground">
                    {order.medication.name} {order.dosage}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.patient.name} • Room {order.patient.room}
                  </p>
                </div>
                <Badge
                  variant={order.status === 'administered' ? 'default' : 'secondary'}
                  className="capitalize"
                >
                  {order.status === 'administered' && (
                    <CheckCircle className="h-3 w-3 mr-1" />
                  )}
                  {order.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
