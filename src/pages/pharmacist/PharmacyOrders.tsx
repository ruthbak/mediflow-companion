import { Package, Clock, CheckCircle, MessageSquare, AlertTriangle } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { useMedicationOrders } from '@/contexts/MedicationOrdersContext';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

export default function PharmacyOrders() {
  const { toast } = useToast();
  const { orders, updateOrderStatus } = useMedicationOrders();

  const pendingOrders = orders.filter((o) => o.status === 'pending');
  const verifiedOrders = orders.filter((o) => o.status === 'verified');
  const dispensedOrders = orders.filter((o) => o.status === 'dispensed');

  const handleProcess = (orderId: string, newStatus: 'verified' | 'dispensed') => {
    updateOrderStatus(orderId, newStatus);
    
    const order = orders.find((o) => o.id === orderId);
    toast({
      title: newStatus === 'verified' ? 'Order Verified' : 'Order Dispensed',
      description: `${order?.medication.name} for ${order?.patient.name}`,
    });
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const OrderCard = ({ order, showActions = true }: { order: typeof orders[0]; showActions?: boolean }) => (
    <Card className={cn(
      'glass-card transition-all hover:shadow-md',
      order.status === 'pending' && 'border-l-4 border-l-warning'
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-foreground">
                {order.medication.name} {order.dosage}
              </h3>
              <Badge variant="secondary" className="text-xs">
                {order.medication.category}
              </Badge>
            </div>
            
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Patient:</span>{' '}
                {order.patient.name} (Room {order.patient.room})
              </p>
              <p className="text-muted-foreground">
                <span className="font-medium text-foreground">Route:</span> {order.route} •{' '}
                <span className="font-medium text-foreground">Frequency:</span> {order.frequency}
              </p>
              <p className="text-muted-foreground">
                <Clock className="inline h-3 w-3 mr-1" />
                Ordered {formatTime(order.orderedAt)} by {order.orderedBy}
              </p>
            </div>

            {order.patient.allergies.length > 0 && (
              <div className="flex items-center gap-2 mt-3 p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-4 w-4 text-destructive" />
                <span className="text-xs text-destructive font-medium">
                  Allergies: {order.patient.allergies.join(', ')}
                </span>
              </div>
            )}

            {order.patient.allergies.length === 0 && (
              <div className="flex items-center gap-2 mt-3">
                <CheckCircle className="h-4 w-4 text-success" />
                <span className="text-xs text-success font-medium">No allergy conflicts</span>
              </div>
            )}
          </div>

          {showActions && (
            <div className="flex flex-col gap-2">
              {order.status === 'pending' && (
                <Button
                  size="sm"
                  onClick={() => handleProcess(order.id, 'verified')}
                  className="bg-success hover:bg-success/90 text-success-foreground"
                >
                  Verify
                </Button>
              )}
              {order.status === 'verified' && (
                <Button
                  size="sm"
                  onClick={() => handleProcess(order.id, 'dispensed')}
                  className="gradient-primary text-primary-foreground"
                >
                  Dispense
                </Button>
              )}
              <Button size="sm" variant="outline">
                <MessageSquare className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <AppLayout>
      <div className="p-4 space-y-6 max-w-4xl mx-auto">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-foreground">Medication Orders</h1>
          <p className="text-muted-foreground">Queue Management System</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-warning">{pendingOrders.length}</div>
              <p className="text-xs text-muted-foreground">Pending</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-primary">{verifiedOrders.length}</div>
              <p className="text-xs text-muted-foreground">Verified</p>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-success">{dispensedOrders.length}</div>
              <p className="text-xs text-muted-foreground">Dispensed</p>
            </CardContent>
          </Card>
        </div>

        {/* Urgent Alert */}
        {pendingOrders.length > 0 && (
          <div className="flex items-center gap-3 p-4 bg-warning/10 border border-warning/30 rounded-xl">
            <Package className="h-6 w-6 text-warning" />
            <div>
              <p className="font-semibold text-foreground">
                {pendingOrders.length} orders require verification
              </p>
              <p className="text-sm text-muted-foreground">
                Complete within 30 minutes
              </p>
            </div>
          </div>
        )}

        {/* Orders Tabs */}
        <Tabs defaultValue="pending" className="w-full">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="pending" className="relative">
              Pending
              {pendingOrders.length > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-warning text-warning-foreground text-xs rounded-full flex items-center justify-center">
                  {pendingOrders.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="verified">Verified</TabsTrigger>
            <TabsTrigger value="dispensed">Dispensed</TabsTrigger>
          </TabsList>

          <TabsContent value="pending" className="mt-4 space-y-3">
            {pendingOrders.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-8 text-center">
                  <CheckCircle className="h-12 w-12 text-success mx-auto mb-3" />
                  <p className="text-muted-foreground">All orders verified</p>
                </CardContent>
              </Card>
            ) : (
              pendingOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="verified" className="mt-4 space-y-3">
            {verifiedOrders.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No verified orders ready for dispensing</p>
                </CardContent>
              </Card>
            ) : (
              verifiedOrders.map((order) => (
                <OrderCard key={order.id} order={order} />
              ))
            )}
          </TabsContent>

          <TabsContent value="dispensed" className="mt-4 space-y-3">
            {dispensedOrders.length === 0 ? (
              <Card className="glass-card">
                <CardContent className="py-8 text-center">
                  <p className="text-muted-foreground">No dispensed orders today</p>
                </CardContent>
              </Card>
            ) : (
              dispensedOrders.map((order) => (
                <OrderCard key={order.id} order={order} showActions={false} />
              ))
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
