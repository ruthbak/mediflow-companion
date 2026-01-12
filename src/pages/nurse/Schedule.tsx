import { useState } from 'react';
import { Clock, CheckCircle2, ChevronRight, AlertCircle } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { AppLayout } from '@/components/layout/AppLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { medicationOrders as initialOrders } from '@/lib/mockData';
import { cn } from '@/lib/utils';

export default function NurseSchedule() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [orders, setOrders] = useState(initialOrders);
  const [lastMarked, setLastMarked] = useState<string | null>(null);

  const now = new Date();

  const dueNowOrders = orders.filter(
    (o) =>
      o.status !== 'administered' &&
      o.dueTime &&
      o.dueTime.getTime() - now.getTime() <= 30 * 60 * 1000
  );

  const upcomingOrders = orders.filter(
    (o) =>
      o.status !== 'administered' &&
      o.dueTime &&
      o.dueTime.getTime() - now.getTime() > 30 * 60 * 1000 &&
      o.dueTime.getTime() - now.getTime() <= 2 * 60 * 60 * 1000
  );

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const handleMarkAsGiven = (orderId: string) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: 'administered' as const } : o))
    );
    setLastMarked(orderId);

    const order = orders.find((o) => o.id === orderId);
    toast({
      title: 'Medication Administered',
      description: `${order?.medication.name} marked as given for ${order?.patient.name}`,
    });

    setTimeout(() => setLastMarked(null), 5000);
  };

  const handleUndo = () => {
    if (lastMarked) {
      setOrders((prev) =>
        prev.map((o) => (o.id === lastMarked ? { ...o, status: 'dispensed' as const } : o))
      );
      setLastMarked(null);
      toast({
        title: 'Undone',
        description: 'Medication status reverted',
      });
    }
  };

  return (
    <AppLayout>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Medication Schedule</h1>
            <p className="text-muted-foreground">
              {user?.name} • {new Date().toLocaleDateString('en-US', { weekday: 'long' })} Shift
            </p>
          </div>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {formatTime(now)}
          </Badge>
        </div>

        {/* Due Now Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-destructive/10 rounded-full">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <span className="font-semibold text-destructive">DUE NOW</span>
              <Badge variant="destructive" className="rounded-full">
                {dueNowOrders.length}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">Requires immediate attention</span>
          </div>

          <div className="space-y-3">
            {dueNowOrders.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-8 text-center">
                  <CheckCircle2 className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">All medications administered</p>
                </CardContent>
              </Card>
            ) : (
              dueNowOrders.map((order) => (
                <Card
                  key={order.id}
                  className={cn(
                    'glass-card border-l-4 border-l-destructive transition-all',
                    'hover:shadow-md'
                  )}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-foreground truncate">
                            {order.patient.name}
                          </p>
                          <Badge variant="secondary" className="shrink-0">
                            Room {order.patient.room}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          <Clock className="inline h-3 w-3 mr-1" />
                          {order.dueTime && formatTime(order.dueTime)}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">
                            {order.medication.name} {order.dosage}
                          </Badge>
                          <Badge variant="outline">{order.route}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                          Ordered by {order.orderedBy}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleMarkAsGiven(order.id)}
                        className="shrink-0 bg-success hover:bg-success/90 text-success-foreground"
                      >
                        <CheckCircle2 className="h-4 w-4 mr-2" />
                        Mark as Given
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Upcoming Section */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full">
              <Clock className="h-4 w-4 text-primary" />
              <span className="font-semibold text-primary">UPCOMING</span>
              <Badge variant="secondary" className="rounded-full">
                {upcomingOrders.length}
              </Badge>
            </div>
            <span className="text-sm text-muted-foreground">Due in next 2 hours</span>
          </div>

          <div className="space-y-2">
            {upcomingOrders.map((order) => (
              <Card key={order.id} className="glass-card hover:shadow-md transition-all">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">{order.patient.name}</p>
                        <span className="text-muted-foreground">•</span>
                        <span className="text-sm text-muted-foreground">
                          Room {order.patient.room}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.medication.name} {order.dosage} • {order.route}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {order.dueTime && formatTime(order.dueTime)}
                      </Badge>
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Undo Toast */}
        {lastMarked && (
          <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50">
            <Button
              onClick={handleUndo}
              variant="outline"
              className="shadow-lg bg-card"
            >
              Undo last action
            </Button>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
